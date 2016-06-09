module.exports = {
    Object:{
        CREATE_ERROR:{errno:-1,code:'CREATE_ERROR',message:'create function should be called by a new object'},
        SAVE_ERROR:{errno:-2,code:'SAVE_ERROR',message:'save function should be called behind get or create'},
        REMOVE_ERROR:{errno:-3,code:'REMOVE_ERROR',message:'remove function should be called behind get or create'},
        OBJECT_ID_NOT_FIND:{errno:-4,code:'OBJECT_ID_NOT_FIND',message:'Object does not find by id or more rows'},
        UPDATE_ERROR:{errno:-5,code:'UPDATE_ERROR',message:'Nothing changed!'},
    },
    User:{
        NOT_EXISTS:{errno:-11,code:'NOT_EXISTS',message:"login_name does't exists!"},
        PASSWORD_ERROR:{errno:-12,code:'PASSWORD_ERROR',message:"password error!"},
        ZAN_OUT_LIMIT:{errno:-13,code:'ZAN_OUT_LIMIT',message:"ZAN OUT LIMIT"},
    },
    System:{
        //uncaught
        AUTH_ERROR:{errno:-920,code:'AUTH_ERROR',message:'auth error! plz check your appkey ~ '},
        ROOT_ERROR:{errno:-921,code:'ROOT_ERROR',message:'auth error! plz check roots of your app  ~ '},
        UNCAUGHT_ERROR:{errno:-998,code:'UNCAUGHT_ERROR',message:"uncaughtException!"},
        NOT_LATEST:{errno:-907,code:'NOT_LATEST',message:"Not the latest version"},
        SQL_INJECTION:{errno:-906,code:'SQL_INJECTION',message:"you have sql keyword! ex:['drop ','delete ','truncate ',';','insert ','update ','set ','use ']"},
        NO_POST_DATA:{errno:-901,code:'NO_POST_DATA',message:"post data is empty!"},
        PARAM_IS_NOT_JSON:{errno:-905,code:"PARAM_IS_NOT_JSON",message:"Param is not json!"},
        LOST_PARAM:function(col){ return {errno:-900,code:'LOST_PARAM',message:"param: " + col + " required!"}},
        TIMEZONE_OVER:{errno:-902,code:'TIMEZONE_OVER',message:"your time zone not sync the server!"},
        SIGN_ERROR:{errno:-903,code:'SIGN_ERROR',message:"param sign error!"},
        NOT_METHOD:{errno:-908,code:'NOT_METHOD',message:"Cant find the method!"},
        TABLE_REQUIRED:{errno:-910,code:'TABLE_REQUIRED',message:"table required!"},
        FILE_TOO_LARGE:{errno:-911,code:'FILE_TOO_LARGE',message:'file too large,plz < 100MB'},
        FILE_TYPE_REJECT:{errno:-912,code:'FILE_TYPE_REJECT',message:'file only accept json,zip'},
        QINIU_SYNC_ERROR:{errno:-913,code:'QINIU_SYNC_ERROR',message:'sync file to qiniu error!'},
        VERSION_UNDEFINED:{errno:-914,code:'VERSION_UNDEFINED',message:'version not defined!'}

    },
    Job:{
        EVENT_NOT_EXIST:{errno:-180,code:'EVENT_NOT_EXIST',message:'event dont find in webevent list'},
        JOB_ID_EMPTY:{errno:-181,code:'JOB_ID_EMPTY',message:'job id required !'},
        JOB_PENDING:{errno:-182,code:'JOB_PENDING',message:'job is pending! call it later~'}
    }


}