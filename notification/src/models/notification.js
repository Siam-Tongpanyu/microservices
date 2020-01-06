const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
 senderId: String,
 subject: String,
 message: String, 
 type: String,
 targetEmail: String,
 targetMobile: String,
 messageId: String 
}, {timestamps: true});

const notificationModel = mongoose.model('notification', NotificationSchema);

module.exports = notificationModel