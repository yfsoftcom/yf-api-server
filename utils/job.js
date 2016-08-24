/**
 * 定时执行任务
 * 随机启动
 **/
var Q = require('q');
var async = require('async');
var E = require('../error');
var _ = require('underscore');
var request = require('request');

var EVENT_STATUS = {
    PENDING:99,
    EXECUTABLE:1
};
var job = function(M,reflecter) {
    return function (eventId, param) {
        var q = Q.defer();
        if (_.isUndefined(eventId)) {
            q.reject(E.Job.JOB_ID_EMPTY);
            return q.promise;
        }

        //查询事件，返回一个事务ID
        //通过这个事务ID 查看更新状态
        async.waterfall([
            function (cb) {
                //获取事件信息
                M.get({table: 'api_webevent', id: eventId})
                    .then(function (data) {
                        cb(null, data);
                    })
                    .catch(function (err) {
                        cb(E.Job.EVENT_NOT_EXIST);
                    })
            },
            function (event, cb) {
                if (event.status == EVENT_STATUS.PENDING) {
                    //该事件正在执行中,不能执行响应
                    cb(E.Job.JOB_PENDING);
                    return;
                }
                //创建一个新的任务
                var now = _.now();
                var data = {
                    mode: 'JOB',
                    "`key`": '' + event.id,
                    status: 0,
                    createAt: now,
                    updateAt: now,
                    type: event.type
                };
                M.create({table: 'tk_task', row: data})
                    .then(function (data) {
                        data.event = event;
                        cb(null, data);
                    })
                    .catch(function (err) {
                        cb(err);
                    });
            },
            function (task, cb) {
                //锁定任务状态
                var data = {
                    task: task.id,
                    count: task.event.count + 1,
                    last_execute_time: _.now(),
                    status: EVENT_STATUS.PENDING
                };
                M.update({table: 'api_webevent', condition: 'id = ' + eventId, row: data})
                    .then(function (event) {

                        //通过闭包 异步执行任务
                        (function (_t) {
                            var notifyEvent = function (err, result) {
                                if (err) {
                                    if (_.isObject(err)) {
                                        err = JSON.stringify(err);
                                    }
                                    err = (err.length > 100) ? err.substr(0, 99) : err;
                                    //更新事件的错误个数
                                    M.update({
                                        table: 'api_webevent',
                                        condition: 'id = ' + eventId,
                                        row: {
                                            status: EVENT_STATUS.EXECUTABLE,
                                            task: 0,
                                            fail_count: _t.event.fail_count + 1
                                        }
                                    });
                                    M.update({
                                        table: 'tk_task',
                                        condition: 'id = ' + _t.id,
                                        row: {status: -100, finishAt: _.now(), err: err}
                                    });
                                    return;
                                }
                                if (_.isObject(result)) {
                                    result = JSON.stringify(result);
                                }
                                var body = result;
                                if (body.length > 100) {
                                    body = body.substr(0, 100);
                                }
                                M.update({
                                    table: 'api_webevent',
                                    condition: 'id = ' + eventId,
                                    row: {status: EVENT_STATUS.EXECUTABLE, task: 0}
                                });
                                M.update({
                                    table: 'tk_task',
                                    condition: 'id = ' + _t.id,
                                    row: {status: 100, finishAt: _.now(), err: body}
                                });

                            };
                            var _e = _t.event;
                            //查找到event
                            var type = _e.type;
                            if ('web' == type) {
                                //url请求
                                var url = _e.job;
                                //结果必须返回 success
                                request(url, function (err, response, body) {
                                    //执行结果更新到数据中
                                    notifyEvent(null, body);
                                });
                            } else if ('local' == type) {
                                //本地代码  EX: common.foo@0.0.1
                                var method = _e.job;
                                //定位到该接口函数，进行执行
                                var p = method.indexOf('@');
                                var v = method.substr(p + 1);
                                method = method.substr(0,p);
                                reflecter.invoke(method,param,v)
                                    .then(function (data) {
                                        notifyEvent(null, data);
                                    })
                                    .catch(function (err) {
                                        notifyEvent(err);
                                    });
                            }
                        })(task);

                        cb(null, task.id);
                    })
                    .catch(function (err) {
                        cb(err);
                    })
            }

        ], function (err, taskId) {
            if (err) {
                q.reject(err);
            } else {
                q.resolve({taskId: taskId});
            }
        });
        return q.promise;
    };
}

module.exports = job;