const ProjectInfo = require("../db_manage/modles/project_info");
const { exceptionSync, checkBodyParameter } = require("../utils/service_requst_util");
const { isEmpty } = require("../utils/str_util");

module.exports = (req, res, next) => exceptionSync(req, res, next, async (req, res, next) => {
    var projectName = checkBodyParameter(req, 'projectName');
    var project = await ProjectInfo.findOne({ where: { projectName } });
    if (!isEmpty(project)) return res.cc('当前项目已经存在-' + projectName);
    project = req.body;
    project = await ProjectInfo.create(project);
    res.ss(project);
});