const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_actions_schema = new Schema({
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    action_name: {
        type: String,
        required: true,
        trim: true
    },
    action_type: {
        type: String,
        enum: ['Project_First_Party_Action_Configs', 'Third_Party_Actions'],
        required: true
    },
    action_metadata: [{
        type: Schema.Types.ObjectId,
        refPath: 'action_type'
    }]
});

const Project_Actions = mongoose.model('Project_Actions', project_actions_schema);

module.exports = Project_Actions;