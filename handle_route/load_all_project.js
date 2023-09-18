const ProjectInfo = require("../db_manage/modles/project_info");
const { exceptionSync } = require('../utils/service_requst_util');
const handleBody = async (req, res, next) => {
    var list = ProjectInfo.findAll({ where: { state: 1 } });
    if (isEmpty(list)) return res.cc('暂无项目');
    res.ss(project);
}

module.exports = (req, res, next) => exceptionSync(req, res, next, handleBody)