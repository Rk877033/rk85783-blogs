const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    agree_term: {
        type: String,
        enum: ['off', 'on'],
        default: 'off'
    },
    profile_image: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ['user', 'author', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['inactive', 'active', 'block'],
        default: 'inactive'
    }
}, {
    timestamps: true
})
const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel
