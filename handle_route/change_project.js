const sequelize = require("../db_manage/db_application");
const ProjectInfo = require("../db_manage/modles/project_info");
// 分包单位
const SubcontractingUnit = require("../db_manage/modles/subcontracting_unit");
// 分包单位 项目 中间健
const SubcontractingProjectMiddle = require("../db_manage/modles/subcontracting_project_middle");
// 单位
const Unit = require("../db_manage/modles/unit");
const { exceptionSync, checkBodyParameter } = require('../utils/service_requst_util');
const handleBody = async (req, res, next) => {
    var projectName = checkBodyParameter(req, 'projectName');
    var project = await ProjectInfo.findOne({ where: { projectName } });
    if (isEmpty(project)) return res.cc('该项目不存在-' + projectName);
    var body = req.body;
    var projectChangeTag =
        bodyParameter(body, project, 'year') ||
        bodyParameter(body, project, 'content') ||
        bodyParameter(body, project, 'contractAmount') ||
        bodyParameter(body, project, 'approvedAmount') ||
        bodyParameter(body, project, 'repaidAmount') ||
        bodyParameter(body, project, 'remark');
    try {
        const transaction = await sequelize.transaction();
        if (projectChangeTag) {
            project.save({ transaction });
        }
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        return res.cc(err);
    }
    res.ss(project);
}
function bodyParameter(body, project, key) {
    var bodyValue = body[key];
    var projectValue = project[key];
    if (bodyValue != projectValue) {
        project[key] = bodyValue;
        return true;
    }
    return false;
}
/**
 * 检测分包单位
 */
function checkSubcontracting(subcontracting,projectId,) {
    if(!subcontracting){
        return;
    }
    var unitName = subcontracting.unit;
    //TODO 添加删除标识 和 新增 和 修改 
    if(unitName){
        
    }

}
module.exports = (req, res, next) => exceptionSync(req, res, next, handleBody)