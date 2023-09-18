const sequelize = require('./db_application');
const async = require('async');
const build_unit = require('./modles/build_unit');
const project_info = require('./modles/project_info');
const unit = require('./modles/unit');
require('./modles/subcontracting_unit');
require('./modles/subcontracting_project_middle');
require("./modles/winning_unit");
require("./modles/winning_unit");
(
    async () => {
        await sequelize.sync({
            // force:true,
        });
    }
)();
