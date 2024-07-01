const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const third_party_actions_schema = new Schema({
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
    action_description: {
        type: String,
        required: true,
        trim: true
    },
    app_type: {
        type: String,
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
    rft_id: {
        type: Schema.Types.Mixed,
        required: true
    },
    creator_address: {
        type: String,
        trim: true
    },
    action_price: {
        type: Number
    }

});

const Third_Party_Actions = mongoose.model('Third_Party_Actions', third_party_actions_schema);

module.exports = Third_Party_Actions;