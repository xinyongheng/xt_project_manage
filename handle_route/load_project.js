const { QueryTypes } = require("sequelize");
const sequelize = require("../db_manage/db_application");
const ProjectInfo = require("../db_manage/modles/project_info");
const WinningUnit = require("../db_manage/modles/winning_unit");
const { exceptionSync } = require('../utils/service_requst_util');
const BuildUnit = require("../db_manage/modles/build_unit");
const handleBody = async (req, res) => {
    var projectName = checkBodyParameter(req, 'projectName');
    var project = await ProjectInfo.findOne({ where: { projectName, state: 1 } });
    if (isEmpty(project)) return res.cc('该项目不存在-' + projectName);
    res.ss({ ...project, ...fillProject(project.id) });
}
function fillProject(projectId) {
    // 中标单位
    var winningUnits = sequelize.query(
        `select winning_unit.*,unit.name as unitName from winning_unit 
inner join unit on winning_unit.unit_id=unit.id and winning_unit.project_id=${projectId}`,
        { type: QueryTypes.SELECT, mapToModel: true, model: WinningUnit });
    // 投标单位
    var buildUnits = sequelize.query(
        `select build_unit.*,unit.name as unitName from build_unit 
inner join unit on build_unit.unit_id=unit.id and build_unit.project_id=${projectId}`,
        { type: QueryTypes.SELECT, mapToModel: true, model: BuildUnit });
    // 分包单位
    var subcontractingUnits = sequelize.query(
        `select subcontracting_unit.*,unit.name as unitName 
inner join subcontracting_project_mapping on subcontracting_project_mapping.subcontracting_unit_id=subcontracting_unit.id and subcontracting_project_mapping.project_id=${projectId} 
inner join unit on subcontracting_unit.unit_id=unit.id`,
        { type: QueryTypes.SELECT, mapToModel: true, model: BuildUnit });
    return { winningUnits, buildUnits, subcontractingUnits }
}
module.exports = (req, res, next) => exceptionSync(req, res, next, handleBody)