# yf-api-server

#### 1.OVERVIEW
 
> 一款灵活的api服务端

#### 2.INSTALL

* dowload the code

```
npm install yf-api-server --save
```

* config the db

确保数据库中包含如下几个表

- api_app
- api_record

* generate the config.js

[Click here,See the DEMO code](https://github.com/yfsoftcom/yf-api-server/blob/master/config.js)


#### 3.TEST

`
npm test
`
#### 4.RUN

建议运行环境：
*nix,nodejs/io,mysql

- 在应用入口代码中添加

```
var config = require('./config.js');

var yfserver = require('yf-api-server');

var app = yfserver(config);

app.setBizModules({'0.0.2':require('./V0.0.2')});//添加对应业务版本的代码

app.start();                                        //启动服务
```


```
npm start
```

**建议使用 postman 进行接口的 测试**

#### 5.DOCS：




