var app = require('./bin/app.js')();

app.setBizModules({'0.0.2':require('./V0.0.2')});

app.start();


