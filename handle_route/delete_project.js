const ProjectInfo = require("../db_manage/modles/project_info");
const { exceptionSync } = require('../utils/service_requst_util');
const handleBody = async (req, res, next) => {
    var projectName = checkBodyParameter(req, 'projectName');
    var project = await ProjectInfo.findOne({ where: { projectName } });
    if (isEmpty(project)) return res.cc('该项目不存在-' + projectName);
    project.state = 0;
    project.projectName = project.projectName + '-delete';
    await project.save();
    res.ss();
}

module.exports = (req, res, next) => exceptionSync(req, res, next, handleBody)