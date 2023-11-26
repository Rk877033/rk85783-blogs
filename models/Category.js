const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['inactive', 'active'],
        default: 'active'
    }
}, {
    timestamps: true
})
const UserModel = mongoose.model('categories', CategorySchema)
module.exports = UserModel
