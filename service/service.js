const express = require("express");
require("../db_manage/modle_init.js");

const ipUtil = require("../utils/ip_util.js");

// const bodyParse = require('body-parser');

const app = express();
// 接口跨域
app.use(require("cors")());
// 静态文件
app.use(express.static('web-vue3'));
// 解析json数据
app.use(express.json());
// 解析表单数据
app.use(express.urlencoded({ extended: false }));
// 任务处理拦截
app.use(require('../middle/intercept.js'));
// 路由
app.use('/dataunit', require('../route/file_route.js'));
app.use('/api/dataunit', require('../route/file_unsession_route.js'));
// 错误拦截
app.use(require('../middle/error.js'));

const IP = ipUtil.getIpAddress();
const PORT = 8249;
console.log('IP', IP);
// 启动服务
app.listen(PORT, IP, () => {
    // app.listen("81", "192.168.5.117", () => {
    console.log("服务启动：http://" + IP + ":" + PORT + "/");
});