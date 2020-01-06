// Mongo DB
const mongoose = require('mongoose');
const smsNotiModel = mongoose.model('notification');
const { sendSmsNotification } = require('../../utils/sns');
var validator = require('validator');

const resolvers = {
  Query: {
    getSmsLog: async (root, args, context) => {
     if((typeof context.user == "undefined") || (!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
     }
     else if((typeof args.phoneNum != "undefined") && (Array.isArray(args.phoneNum)) && (args.phoneNum > 0)){             
       return smsNotiModel.find({ 'targetMobile': { $in: args.phoneNum },  'senderId': context.user._id}).sort({ createdAt: 'desc' })
            .then(smsData => smsData)
            .catch(() => Promise.reject("404"))
     }
     else{
       return smsNotiModel.find({ 'senderId': context.user._id }).sort({ createdAt: 'desc' })
            .then(smsData => smsData)
            .catch(() => Promise.reject("404"))
     }      
    }
  },
  Mutation: {
    sendSmsNoti: async (root, args, context) => {
     if((typeof context.user == "undefined") || (!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
     }
     else if(((typeof args.message == "undefined") || (!args.message)) || ((typeof args.subject == "undefined") || (!args.subject))){
      throw new Error('No message');
     }
     else if((typeof args.phoneNum == "undefined") || (!(validator.isMobilePhone(args.phoneNum, 'any', true)))){
 //     console.log("fffr", args.phoneNum, validator.isMobilePhone(args.phoneNum, 'any', true), "nnb")
      throw new Error('Mobile number not correct.');
     }
     else{
      let sendStat = await sendSmsNotification(args.message, args.subject, args.phoneNum);
       if(typeof sendStat.MessageId != "undefined"){
         return new smsNotiModel({ senderId: context.user._id, subject: args.subject, message: args.message, type: 'SMS', targetMobile: args.phoneNum, messageId: sendStat.MessageId }).save()
                   .then(newSmsNoti => newSmsNoti)
                   .catch((err) => Promise.reject(err))        
       }
       else{
        throw new Error('Send mail not success');
       }
     }
    } 
  }
}

module.exports = resolvers;