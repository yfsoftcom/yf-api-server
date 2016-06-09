var dev = (function(){
    console.log('DEV模式');
    return 'DEV';
})();
var DEV_HOST = '192.168.1.218';
var API_DBNAME = 'gr_api';                  //通用接口数据库

var getDbConfig = function(option){
    var originConfig = {
        host:(function(mode){
            switch(mode){
                case 'DEV':
                    return DEV_HOST;
            }
        })(dev),
        port:3306,
        //database:'gr_erp',
        username:'dbadmin',
        password:'87252798',
        debug:false,
        pool:{
            connectionLimit:10,
            queueLimit:0,
            waitForConnections:true
        }
    };
    for(var k in option){
        originConfig[k] = option[k];
    }
    return originConfig;
};
module.exports = {
    db:{
        api:getDbConfig({database:API_DBNAME})
    },
    server:{
        port:dev == 'PRODUCT'?9001:8080
    },
    defaultVersion:'0.0.2',
    dev:dev,
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