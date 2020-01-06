const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
 name: {type: String, default: 'Guest'},
 provider: String,
 uid: String,
 mid: String,
 avatar: String,
 email: String,
 mobile: String, 
 datas: {type: Schema.Types.Mixed},
 role: {type: String, default: 'user'} 
}, {timestamps: true});

const usersModel = mongoose.model('users', UsersSchema);

module.exports = usersModel