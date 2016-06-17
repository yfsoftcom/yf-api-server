var k = require('./key.js');

var getDbConfig = function(option){
    var originConfig = {
        host: 'localhost',
        port:3306,
        username:'root',
        password:'',
        debug:false,
        pool:{
            connectionLimit:10,
            queueLimit:0,
            waitForConnections:true
        }
    };
    for(var key in k.db){
        originConfig[key] = k.db[key];
    }
    for(var key in option){
        originConfig[key] = option[key];
    }
    return originConfig;
};
module.exports = {
    db:(function(database){
        var _dbs = {};
        for(var d in database){
            _dbs[d] = getDbConfig({database:database[d]});
        }
        return _dbs;
    })(k.database),
    server:{
        port: k.dev == 'PRODUCT'?9001:8080
    },
    defaultVersion:'0.0.1',
    dev: k.dev,
    log4js: {
        appenders: [
            { type: 'console' },{
                type: 'file',
                filename: 'logs/access.log',
                maxLogSize: 1024 * 1024 * 100, //100Mb一个文件
                backups:10,
                category: 'normal'
            }
        ],
        replaceConsole: true
    },
    qiniu:{
        bucket:'yfdocument',
        ACCESS_KEY:'65nep44MNB8Ft1v_L1f7jaSnP8P07buuMMN4kI81',
        SECRET_KEY:'kZxy-i93_B98yg4lNn7XmSujeZh_JWRxQOJX3E_m'
    }
};