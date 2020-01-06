const mongoose = require('mongoose');
const smsNotiModel = mongoose.model('notification');
const aws = require('../config/awsconfig');

var validator = require('validator');
const sns = new aws.SNS();

 async function sendSmsNotification(message, subject, phoneNum){  
  return new Promise((resolve, reject) => {
    if(!(validator.isMobilePhone(phoneNum, 'any', true))){
     reject('Mobile number not correct');
    }
    let params = {
                Message: message,              /* required must be UTF-8 encoded strings and at most 256 KB in size */               
                PhoneNumber: phoneNum,         /* required Use E.164 format */
                Subject: subject                
              };
     sns.publish(params, function(err, data){
          if(data){      
           resolve(data);          
          }
          else{       
           reject(err);           
          }
         });         
  });             
 }
 
 async function queSendSmsNoti(args){
  if(((typeof args.message == "undefined") || (!args.message)) || ((typeof args.subject == "undefined") || (!args.subject))){
      throw new Error('No message');
     }
     else if((typeof args.phoneNum == "undefined") || (!(validator.isMobilePhone(args.phoneNum, 'any', true)))){ 
      throw new Error('Mobile number not correct.');
     }
     else{
      let sendStat = await sendSmsNotification(args.message, args.subject, args.phoneNum);
       if(typeof sendStat.MessageId != "undefined"){
         return new smsNotiModel({ senderId: args.senderId, subject: args.subject, message: args.message, type: 'SMS', targetMobile: args.phoneNum, messageId: sendStat.MessageId }).save()
                   .then(newSmsNoti => newSmsNoti)
                   .catch((err) => Promise.reject(err))        
       }
       else{
        throw new Error('Send mail not success');
       }
     }
 }
 
 module.exports = {
  sendSmsNotification: sendSmsNotification,
  queSendSmsNoti: queSendSmsNoti
 }  

