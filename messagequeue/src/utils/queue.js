const aws = require('../config/awsconfig');
const jwttoken = require('jsonwebtoken');
const { jwtSecret } = require('../config/vars');
const sqs = new aws.SQS();

async function sendMessageQueue(messageque, queUrl){
 return new Promise((resolve, reject) => {
    let params = {
               MessageBody: messageque,    // required
               QueueUrl: queUrl,           // required  
              };
       sqs.sendMessage(params, function(err, data){
          if(data){      
           resolve(data);          
          }
          else{       
           reject(err);           
          }
         }); 
 });
  
}

async function generateMessageQue(reqObject){
  return new Promise((resolve, reject) =>{
   jwttoken.sign(reqObject, jwtSecret, (error, newMessage) =>{
    if(newMessage){
     resolve(newMessage);
    }
    else{
     reject(error);
    }    
   });
  });
}

async function manageMessageQue(args, queUrl){
 return new Promise(async (resolve, reject) => {
  messageQue = await generateMessageQue(args);
  sendStat = await sendMessageQueue(messageQue, queUrl);
  if(typeof sendStat.MessageId != "undefined"){
   resolve({message: "Send Success!!"})
  }
  else{
   reject('Can not send message!!');
  } 
 });
}            


module.exports = {
  sendMessageQueue: sendMessageQueue,
  generateMessageQue: generateMessageQue,
  manageMessageQue: manageMessageQue
 }
