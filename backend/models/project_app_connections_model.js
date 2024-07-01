const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_app_connections_schema = new Schema({
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
    app_name: {
        type: String,
        required: true
    },
    app_type: {
        type: String,
        required: true,
        trim: true
    },
    app_credentials: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const Project_App_Connections = mongoose.model('Project_App_Connections', project_app_connections_schema);

module.exports = Project_App_Connections;