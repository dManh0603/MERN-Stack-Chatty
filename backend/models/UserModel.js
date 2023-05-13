const mongoose = require('mongoose')
const UserSchema = mongoose.Schema(
    {
        name: { type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        avt: {
            type: String,
            required: true,
            default: "https://t4.ftcdn.net/jpg/04/08/24/43/360_F_408244382_Ex6k7k8XYzTbiXLNJgIL8gssebpLLBZQ.jpg"
        },
    },
    {
        timestamps: true,
    }
);

const user = mongoose.model('User', UserSchema);
module.exports = user;