const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const project_refractor_schema = new Schema({
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
});

const Project_Refractor = mongoose.model('Project_Refractor', project_refractor_schema);

module.exports = Project_Refractor;