const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_first_party_action_configs_schema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    action_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project_Actions',
        required: true
    },
    action_template_type: {
        type: String,
        required: true,
        trim: true
    },
    action_params: {
        type: Schema.Types.Mixed,
        required: true
    },
    app_type: {
        type: String,
        required: true,
        trim: true
    },
    app_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project_App_Connections',
        required: true
    },
    rft_id: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const Project_First_Party_Action_Configs = mongoose.model('Project_First_Party_Action_Configs', project_first_party_action_configs_schema);

module.exports = Project_First_Party_Action_Configs;