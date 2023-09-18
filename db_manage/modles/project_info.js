const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db_application.js");
class ProjectInfo extends Model { }
ProjectInfo.init(
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
        projectName: {
            field: 'project_name',
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            comment: '项目名称',
        },
        year: {
            field: 'year',
            type: DataTypes.STRING,
            allowNull: true,
            comment: '年份',
        },
        content: {
            field: 'content',
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '项目内容'
        },
        contractAmount: {
            field: 'contract_amount',
            type: DataTypes.STRING,
            allowNull: true,
            comment: '合同金额'
        },
        approvedAmount: {
            field: 'approved_amount',
            type: DataTypes.STRING,
            allowNull: true,
            comment: '审定金额'
        },
        repaidAmount: {
            field: 'repaid_amount',
            type: DataTypes.STRING,
            allowNull: true,
            comment: '已回款金额'
        },
        remark: {
            field: 'remark',
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '备注信息'
        },
    },
    {
        sequelize,
        comment: '项目内容',
        tableName: 'project_info'
    }
);
module.exports = ProjectInfo;