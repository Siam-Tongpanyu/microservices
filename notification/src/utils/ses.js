const mongoose = require('mongoose');
const emailNotiModel = mongoose.model('notification');
const aws = require('../config/awsconfig');
var validator = require('validator');
const { systemEmail } = require('../config/vars');
var ses = new aws.SES();
var fs = require('fs');

async function sendEmailNotification(mailto, textMessage, subject, sendermail){
 return new Promise((resolve, reject) => {
   let params = {
            Destination: {
             ToAddresses: [mailto] // required array
            }, 
            Message: {
             Body: {                  
              Html: {
               Charset: "UTF-8",
               Data: textMessage
              },
              Text: {
               Charset: "UTF-8", 
               Data: textMessage     // required
              }
             }, 
             Subject: {                 // required
              Charset: "UTF-8", 
              Data: subject
             }
            },                
            Source: sendermail   // required               
          };
     ses.sendEmail(params, function(err, data){
          if(data){      
           resolve(data);          
          }
          else{       
           reject(err);           
          }
         });     
 });
}

async function sendEmailsNotification(mailto, textMessage, subject, sendermail){
 return new Promise((resolve, reject) => {
   let params = {
            Destination: {
             ToAddresses: mailto // required array
            }, 
            Message: {
             Body: {                  
              Html: {
               Charset: "UTF-8",
               Data: textMessage
              },
              Text: {
               Charset: "UTF-8", 
               Data: textMessage     // required
              }
             }, 
             Subject: {                 // required
              Charset: "UTF-8", 
              Data: subject
             }
            },                
            Source: sendermail   // required               
          };
     ses.sendEmail(params, function(err, data){
          if(data){      
           resolve(data);          
          }
          else{       
           reject(err);           
          }
         });     
 });
}

 function createMultiInsertArrayEmail(mails, textMessage, subject, sendId, msId){  
   var mailsResult = [];
   for(let mail of mails){
    mailsResult.push({ senderId: sendId, subject: subject, message: textMessage, type: 'E-mail', targetEmail: mail, messageId: msId }); 
   }
   return mailsResult;
}


 function validateArrayEmails(mailsArray){
   var mailResult = [];
   for(let mail of mailsArray){
    mailResult = returnValidMail(mail, mailResult);  
   }
   return mailResult; 
}

 function returnValidMail(mail, mailsArray){
  if(validator.isEmail(mail)){
  mailsArray.push(mail);
  }
  return mailsArray; 
}

async function createNewEmailTemplate(template_name, subject, html, text){
 return new Promise((resolve, reject) => {
   if(typeof subject == "undefined"){
    subject = "";
   }
   if(typeof text == "undefined"){
    text = "";
   }
   let params = {
                  Template:{
                   TemplateName: template_name,
                   HtmlPart: html,
                   SubjectPart: subject,
                   TextPart: text
                  }  
                };
     ses.createTemplate(params, function(err, data){
          if(data){      
           data.message = "Create Email Success!";
           resolve(data);          
          }
          else{       
           reject(err);           
          }
         });     
 });
}

async function sendEmailsTemplateNotification(mailto, templateName, templateData, sendermail){
  return new Promise((resolve, reject) => {
   let params = {
            Destination: {
             ToAddresses: [mailto] // required array
            },
            Template: templateName,          // required
            TemplateData: templateData,                
            Source: sendermail   // required               
          };
     ses.sendTemplatedEmail(params, function(err, data){
          if(data){      
           resolve(data);          
          }
          else{       
           reject(err);           
          }
         });     
 });
}

async function getFileData(filepath){
 return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf8", async (err, data) => {
     if(data){      
      resolve(data);          
     }
     else{       
      reject(err);           
     }
    });
 });
}

async function queSendMailNoti(args){
  if(((typeof args.textMessage == "undefined") || (!args.textMessage)) || ((typeof args.subject == "undefined") || (!args.subject))){
   throw new Error('No message');
  }
  else if((typeof args.mailto == "undefined") || !(validator.isEmail(args.mailto))){
   throw new Error('E-mail not correct.');
  }
  else{      
   if((typeof args.sendermail == "undefined") || !(validator.isEmail(args.sendermail))){
    args.sendermail = systemEmail;
   }
   const sendStat = await sendEmailNotification(args.mailto, args.textMessage, args.subject, args.sendermail);
   if(typeof sendStat.MessageId != "undefined"){
    return new emailNotiModel({ senderId: args.senderId, subject: args.subject, message: args.textMessage, type: 'E-mail', targetEmail: args.mailto, messageId: sendStat.MessageId }).save()
               .then(newEmailNoti => newEmailNoti)
               .catch((err) => Promise.reject(err))
   }
   else{
    throw new Error('Send mail not success');
   }                  
 }
}

async function queSendTemplateMailNoti(args){  
  if(((typeof args.templateName == "undefined") || (!args.templateName)) || ((typeof args.templateData == "undefined") || (!args.templateData))){
   throw new Error('No message');
  }
  else if((typeof args.mailto == "undefined") || !(validator.isEmail(args.mailto))){
   throw new Error('E-mail not correct.');
  }
  else{      
   if((typeof args.sendermail == "undefined") || !(validator.isEmail(args.sendermail))){
    args.sendermail = systemEmail;
   }
   const sendStat = await sendEmailsTemplateNotification(args.mailto, args.templateName, args.templateData, args.sendermail);
   if(typeof sendStat.MessageId != "undefined"){
    return new emailNotiModel({ senderId: args.senderId, subject: args.templateName, type: 'E-mail', targetEmail: args.mailto, messageId: sendStat.MessageId }).save()
               .then(newEmailNoti => newEmailNoti)
               .catch((err) => Promise.reject(err))
   }
   else{
    throw new Error('Send mail not success');
   }                  
 }
}

module.exports = {
  sendEmailNotification: sendEmailNotification,
  validateArrayEmails: validateArrayEmails,
  createMultiInsertArrayEmail: createMultiInsertArrayEmail,
  sendEmailsNotification: sendEmailsNotification,
  queSendMailNoti: queSendMailNoti,
  createNewEmailTemplate: createNewEmailTemplate,
  getFileData: getFileData,
  sendEmailsTemplateNotification: sendEmailsTemplateNotification,
  queSendTemplateMailNoti: queSendTemplateMailNoti
 }
