const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_schema = new Schema({
    project_name: {
        type: String,
        required: true,
        trim: true
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    project_actions: [{
        type: Schema.Types.ObjectId,
        ref: 'Project_Actions'
    }],
    project_workflows: [{
        type: Schema.Types.ObjectId,
        ref: 'Project_Workflows'
    }]
});

const Projects = mongoose.model('Projects', project_schema);

module.exports = Projects;