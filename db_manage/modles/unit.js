const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db_application.js");
class Unit extends Model { }
Unit.init(
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
        name: {
            field: 'name',
            type: DataTypes.TEXT,
            allowNull: false,
            unique:true,
            comment: '单位名称'
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
        comment: '单位',
        tableName: 'unit'
    }
);
module.exports = Unit;