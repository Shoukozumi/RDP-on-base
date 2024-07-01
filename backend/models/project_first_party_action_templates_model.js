const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_first_party_action_templates_schema = new Schema({
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
    app_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project_App_Connections',
        required: true
    },
    app_type: {
        type: String,
        required: true,
        trim: true
    },
    action_template_name: {
        type: String,
        required: true,
        trim: true,
    },
    action_template_type: {
        type: String,
        required: true,
        trim: true
    },
    action_template_metadata: {
        type: Schema.Types.Mixed,  // JSON
        required: true,
    },
    action_template_description: {
        type: String,
    },
    action_template_thumbnail: {
        type: String,
    },
    action_template_inputs: {
        type: Schema.Types.Mixed,  // JSON
    },
});

const Project = mongoose.model('Project_First_Party_Actions_Templates', project_first_party_action_templates_schema);

module.exports = Project;