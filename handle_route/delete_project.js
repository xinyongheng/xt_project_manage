const sequelize = require("../db_manage/db_application");
const { Op } = require('sequelize');
const ProjectInfo = require("../db_manage/modles/project_info");
const SubcontractingProjectMapping = require("../db_manage/modles/subcontracting_project_mapping");
const SubcontractingUnit = require("../db_manage/modles/subcontracting_unit");
const { exceptionSync, transactionDb } = require('../utils/service_requst_util');
const { isEmpty } = require("../utils/str_util");
const handleBody = async (req, res) => {
    var projectName = checkBodyParameter(req, 'projectName');
    var project = await ProjectInfo.findOne({ where: { projectName } });
    if (isEmpty(project)) return res.cc('该项目不存在-' + projectName);
    project.state = 0;
    project.projectName = project.projectName + '-delete';
    // 项目id
    var projectId = project.id;
    await transactionDb(res, async (transaction) => {
        var mappingList = await SubcontractingProjectMapping.findAll({ where: { projectId }, transaction });
        if (!isEmpty(mappingList)) {
            var ids = idArr(mappingList);
            await SubcontractingUnit.destroy({ where: { [Op.in]: ids }, transaction });
        }
        await SubcontractingProjectMapping.destroy({ where: { projectId }, transaction });
        await project.save({ transaction });
    });
    res.ss();
}
function idArr(mapping) {
    var arr = [];
    mapping.forEach(element => {
        arr.push(element.id);
    });
    return arr;
}
module.exports = (req, res, next) => exceptionSync(req, res, next, handleBody)