const BuildUnit = require("../db_manage/modles/build_unit");
const ProjectInfo = require("../db_manage/modles/project_info");
const SubcontractingProjectMapping = require("../db_manage/modles/subcontracting_project_mapping");
const SubcontractingUnit = require("../db_manage/modles/subcontracting_unit");
const Unit = require("../db_manage/modles/unit");
const WinningUnit = require("../db_manage/modles/winning_unit");
const { exceptionSync, checkBodyParameter, transactionDb } = require("../utils/service_requst_util");
const { isEmpty } = require("../utils/str_util");

module.exports = (req, res, next) => exceptionSync(req, res, next, async (req, res, next) => {
    var projectName = checkBodyParameter(req, 'projectName');
    var project = await ProjectInfo.findOne({ where: { projectName } });
    if (!isEmpty(project)) return res.cc('当前项目已经存在-' + projectName);
    var body = req.body;
    var project = body;
    await transactionDb(res, async (transaction) => {
        // 项目存储
        var projectBean = await ProjectInfo.create(project, { transaction });
        var projectId = projectBean.id;
        // 投标单位
        var buildUnits = body.buildUnits;
        if (!isEmpty(buildUnits)) {
            if (!Array.isArray(buildUnits)) {
                throw new Error('参数类型错误-buildUnits')
            }
            buildUnits.forEach(element => {
                element.projectId = projectId;
                var unit = element.unit;
                if (!unit) {
                    throw new Error('参数缺失-投标单位名称');
                }
                element.unitId = makeUnitId(element.unit, transaction);
            });
            await BuildUnit.bulkCreate(buildUnits, { transaction });
        }
        // 分包单位
        var subcontractingUnits = body.subcontractingUnits;
        if (!isEmpty(subcontractingUnits) && Array.isArray(subcontractingUnits)) {
            subcontractingUnits.forEach(element => {
                var unit = element.unit;
                if (!unit) {
                    throw new Error('参数缺失-分包单位名称');
                }
                element.unitId = makeUnitId(element.unit, transaction);
            });
            var subcontractingUnitArray = await SubcontractingUnit.bulkCreate(subcontractingUnits, { transaction });
            var mapping = [];
            subcontractingUnitArray.forEach(element => {
                var subcontractingUnitId = element.id;
                var unitId = element.unitId;
                mapping.push({ unitId, subcontractingUnitId, projectId })
            });
            await SubcontractingProjectMapping.bulkCreate(mapping, { transaction });
        }
        // 中标单位
        var winningUnits = body.winningUnits;
        if (!isEmpty(winningUnits) && Array.isArray(winningUnits)) {
            winningUnits.forEach(element => {
                var unit = element.unit;
                if (!unit) {
                    throw new Error('参数缺失-中标单位名称');
                }
                element.unitId = makeUnitId(element.unit, transaction);
                element.projectId = projectId;
            });
            await WinningUnit.bulkCreate(winningUnits, { transaction });
        }
    });
    project = await ProjectInfo.create(project);
    res.ss(project);
});

/**
 * 保存单位
 * @param {string} name 
 * @param {*} transaction 
 * @returns 单位id
 */
function makeUnitId(name, transaction) {
    var bean = Unit.findOrCreate({ where: { name }, transaction });
    if (bean) {
        return bean.id;
    }
    throw new Error('该单位存储失败-' + name);
}