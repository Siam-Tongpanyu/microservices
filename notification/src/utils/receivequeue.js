const mongoose = require('mongoose');
const emailNotiModel = mongoose.model('notification');
const aws = require('../config/awsconfig');
const jwttoken = require('jsonwebtoken');
const { jwtSecret, awsNotiQueUrl } = require('../config/vars');
const sesfunc = { queSendMailNoti, queSendTemplateMailNoti } = require('./ses');
const snsfunc = { queSendSmsNoti } = require('./sns');
const { sendSmsNotification } = require('./sns');
var validator = require('validator');
const sqs = new aws.SQS();

async function manageMessageQue(messageNow){
  if(messageNow){
   let mdata = await verifyMessage(messageNow);
   if((mdata) && (typeof mdata.targetfunc != "undefined")){
    if((mdata.targetfunc == "queSendMailNoti") || (mdata.targetfunc == "queSendTemplateMailNoti")){     
     return await sesfunc[mdata.targetfunc](mdata);
    }
    else if(mdata.targetfunc == "queSendSmsNoti"){
     return await snsfunc[mdata.targetfunc](mdata);
    }    
   }
  }  
}

function verifyMessage(messageNow){
  return new Promise((resolve, reject) => {
   jwttoken.verify(messageNow, jwtSecret, (error, decode) => {
    if(error){
     reject('Your message is incorrect!!');
    }
    else{
     resolve(decode);
    }
   });
  }); 
}

module.exports = {
  manageMessageQue: manageMessageQue  
 }
