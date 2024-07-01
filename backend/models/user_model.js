const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,  // Will implement indexes later
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    wallet: {
        type: String,
        trim: true,
        match: [/^0x[a-fA-F0-9]{40}$/g, ' Invalid wallet format']
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

// Pre-save middleware to update the `updatedAt` field
// UserSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

const User = mongoose.model('Users', UserSchema);

module.exports = User;