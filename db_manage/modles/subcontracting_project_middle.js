const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db_application.js");
class SubcontractingUnit extends Model { }
SubcontractingUnit.init(
    {
        id: {
            field: 'id',
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: '主键',
            validate: {
                isInt: true,
                min: 1,
            }
        },
        state: {
            field: 'state',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '状态 是否有效 0否1是 默认1',
            validate: {
                isInt: true,
                min: 0,
                max: 2
            }
        },
        unitId: {
            field: 'unit_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '单位id'
        },
        projectId: {
            field: 'project_id',
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '项目id'
        },
        remark: {
            field: 'remark',
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '备注',
        },
    },
    {
        sequelize,
        comment: '分包单位',
        tableName: 'subcontracting_unit'
    }
);
module.exports = SubcontractingUnit;