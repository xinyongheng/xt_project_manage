const sequelize = require("../db_manage/db_application");
const ProjectInfo = require("../db_manage/modles/project_info");
// 分包单位
const SubcontractingUnit = require("../db_manage/modles/subcontracting_unit");
// 分包单位 项目 中间健
const SubcontractingProjectMiddle = require("../db_manage/modles/subcontracting_project_mapping");
// 单位
const Unit = require("../db_manage/modles/unit");
const { exceptionSync, checkBodyParameter } = require('../utils/service_requst_util');
const { isEmpty } = require("../utils/str_util");
const { Op } = require("sequelize");
const SubcontractingProjectMapping = require("../db_manage/modles/subcontracting_project_mapping");
const BuildUnit = require("../db_manage/modles/build_unit");
const WinningUnit = require("../db_manage/modles/winning_unit");
const handleBody = async (req, res) => {
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
        var projectId = project.id;
        const transaction = await sequelize.transaction();
        if (projectChangeTag) {
            project.save({ transaction });
        }
        await checkSubcontracting(body.subcontractingUnit, projectId, transaction);
        await checkBuildUnit(body.subcontractingUnit, projectId, transaction);
        await checkWinningUnit(body.subcontractingUnit, projectId, transaction);
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
async function checkSubcontracting(subcontracting, projectId, transaction) {
    if (!subcontracting) {
        return;
    }
    var deleteArr = subcontracting.delete;
    if (!isEmpty(deleteArr)) {
        // 删除分包单位关联表
        SubcontractingProjectMiddle.destroy({ where: { subcontractingUnitId: { [Op.in]: deleteArr } }, transaction });
        // 删除分包单位
        SubcontractingUnit.destroy({ where: { id: { [Op.in]: deleteArr } }, transaction })
    }
    var changeArr = subcontracting.change;
    if (!isEmpty(changeArr)) {
        for (let index = 0; index < changeArr.length; index++) {
            const element = changeArr[index];
            var unitName = element.unitName;
            // 查询是否存在分包单位
            var subcontractingUnitId = element.id;
            if (subcontractingUnitId) {
                // 存在修改；
                // 查询该分包单位信息
                var subcontractingUnit = await SubcontractingUnit.findByPk(subcontractingUnitId, { transaction });
                if (!subcontractingUnit) {
                    throw new Error('没有该分包单位id-' + subcontractingUnitId);
                }
                var mapping = await SubcontractingProjectMapping.findOne({ where: { subcontractingUnitId, projectId }, transaction });
                var unitIdChangeTag = false;
                if (unitName) {
                    var unitBean = await Unit.findOne({ where: { name: unitName }, transaction });
                    if (!unitBean) {
                        // 单位不存在，创建新的
                        unitBean = await Unit.create({ name: unitName }, { transaction });
                    }
                    // 单位不一致                        
                    if (unitBean.id != mapping.unitId) {
                        // 修改关联表
                        mapping.unitId = unitBean.id;
                        await mapping.save({ transaction });
                        subcontractingUnit.unitId = unitBean.id;
                        unitIdChangeTag = true;
                    }
                }
                // 分包单位内容比较修改
                if (changeValue(element, subcontractingUnit) || unitIdChangeTag) {
                    await subcontractingUnit.save({ transaction });
                }
            } else {
                // 新建
                var unitBean = await Unit.findOrCreate({ where: { name: unitName }, transaction });
                element.unitId = unitBean.id;
                // 分包单位存储
                var subcontractingUnit = await SubcontractingUnit.create({ element }, { transaction });
                // 关联表
                await SubcontractingProjectMapping.create({ projectId, unitId: unitBean.id, subcontractingUnitId: subcontractingUnit.id }, { transaction });
            }
        }
    }

}
// 检测投标单位
async function checkBuildUnit(buildUnit, projectId, transaction) {
    if (!buildUnit) { return; }
    if (!isEmpty(buildUnit.delete)) {
        await BuildUnit.destroy({ where: { id: { [Op.in]: buildUnit.delete } }, transaction });
    }
    if (!isEmpty(buildUnit.change)) {
        for (var key in buildUnit.change) {
            var element = buildUnit.change[key];
            var unitName = element.unitName;
            if (unitName) {
                var buildUnitId = element.id
                // 单位查询
                var unitBean = await Unit.findOrCreate({ where: { name: unitName }, transaction });
                if (buildUnitId) {
                    var buildUnitBean = await BuildUnit.findByPk(buildUnitId);
                    if (buildUnitBean.unitId != unitBean.id) {
                        buildUnitBean.unitId = unitBean.id;
                        await buildUnitBean.save({ transaction });
                    }
                } else {
                    await BuildUnit.create({ projectId, unitId: unitBean.id }, { transaction });
                }
            }
        }
    }
}
// 检测中标单位
async function checkWinningUnit(winningUnit, projectId, transaction) {
    if (!winningUnit) { return; }
    if (!isEmpty(winningUnit.delete)) {
        await WinningUnit.destroy({ where: { id: { [Op.in]: winningUnit.delete } }, transaction });
    }
    if (!isEmpty(winningUnit.change)) {
        for (var key in winningUnit.change) {
            var element = winningUnit.change[key];
            var unitName = element.unitName;
            if (unitName) {
                var winningUnitId = element.id
                // 单位查询
                var unitBean = await Unit.findOrCreate({ where: { name: unitName }, transaction });
                if (winningUnitId) {
                    var winningUnitBean = await BuildUnit.findByPk(winningUnitId);
                    if (winningUnitBean.unitId != unitBean.id) {
                        winningUnitBean.unitId = unitBean.id;
                        await winningUnitBean.save({ transaction });
                    }
                } else {
                    await WinningUnit.create({ projectId, unitId: unitBean.id }, { transaction });
                }
            }
        }
    }
}
function changeValue(dataArr, target) {
    var tag = false;
    for (key in dataArr) {
        if (target[key] && dataArr[key] != target[key]) {
            target[key] = dataArr[key];
            tag = true;
        }
    }
    return tag;
}


function deleteSubcontracting(id, transaction) {
    SubcontractingProjectMiddle.destroy()
}
module.exports = (req, res, next) => exceptionSync(req, res, next, handleBody)