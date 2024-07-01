const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_workflows_schema = new Schema({
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
    workflow_name: {
        type: String,
        required: true,
        trim: true
    },
    trigger_type: {
        type: String,
        enum: [
            "time",
            "event",
            "manual",
            "webhook"
        ]
    },
    trigger_value: {
        type: String,
        trim: true
    },
    actions: {
        type: Schema.Types.Mixed,
        required: true
    },
    destination_address: {
        type: String,
        trim: true
    }
});

const Project_Workflows = mongoose.model('Project_Workflows', project_workflows_schema);

module.exports = Project_Workflows;