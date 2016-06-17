module.exports = {
    server:{
        port: 8080
    },
    defaultVersion:'0.0.1',
    dev: 'DEV',
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