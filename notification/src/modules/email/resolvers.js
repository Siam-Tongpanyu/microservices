// Mongo DB
const mongoose = require('mongoose');
const emailNotiModel = mongoose.model('notification');
const { sendEmailNotification, validateArrayEmails, createMultiInsertArrayEmail, sendEmailsNotification, createNewEmailTemplate, getFileData, sendEmailsTemplateNotification } = require('../../utils/ses');
const { systemEmail } = require('../../config/vars');
var fs = require('fs');
var validator = require('validator');

const resolvers = {
  Query: {
    getMailLog: async (root, args, context) => {
     if((typeof context.user == "undefined") || (!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
     }
     else if((typeof args.email != "undefined") && (Array.isArray(args.email)) && (args.email.length > 0)){
       var mailSearch = validateArrayEmails(args.email);       
       return emailNotiModel.find({ 'targetEmail': { $in: mailSearch },  'senderId': context.user._id}).sort({ createdAt: 'desc' })
            .then(emailData => emailData)
            .catch(() => Promise.reject("404"))
     }
     else{
       return emailNotiModel.find({ 'senderId': context.user._id }).sort({ createdAt: 'desc' })
            .then(emailData => emailData)
            .catch(() => Promise.reject("404"))
     }      
    }
  },
  Mutation: {
    sendMailNoti: async (root, args, context) => {
     if((typeof context.user == "undefined") || (!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
     }
     else if(((typeof args.textMessage == "undefined") || (!args.textMessage)) || ((typeof args.subject == "undefined") || (!args.subject))){
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
        return new emailNotiModel({ senderId: context.user._id, subject: args.subject, message: args.textMessage, type: 'E-mail', targetEmail: args.mailto, messageId: sendStat.MessageId }).save()
                   .then(newEmailNoti => newEmailNoti)
                   .catch((err) => Promise.reject(err))
       }
       else{
        throw new Error('Send mail not success');
       }                  
     }
    },
    sendMailsNoti: async (root, args, context) => {
     if((typeof context.user == "undefined") || (!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
     }
     else if(((typeof args.textMessage == "undefined") || (!args.textMessage)) || ((typeof args.subject == "undefined") || (!args.subject))){
      throw new Error('No message');
     }
     else if((typeof args.mailto != "undefined") && ((Array.isArray(args.mailto)) && (args.mailto.length > 0)) && (validateArrayEmails(args.mailto).length > 0)){
      mailtos = validateArrayEmails(args.mailto);
      if((typeof args.sendermail == "undefined") || !(validator.isEmail(args.sendermail))){
        args.sendermail = systemEmail;
       }
      const sendStat = await sendEmailsNotification(mailtos, args.textMessage, args.subject, args.sendermail);
      if(typeof sendStat.MessageId != "undefined"){
        const mailsInsert = await createMultiInsertArrayEmail(mailtos, args.textMessage, args.subject, context.user._id, sendStat.MessageId);
        return emailNotiModel.create(mailsInsert)
               .then(newEmailsNoti => newEmailsNoti)
               .catch((err) => Promise.reject(err)) 
       }
       else{
        throw new Error('Send mail not success');
       }
     }
     else{      
      throw new Error('E-mail not correct.');
     }
    },
    createMailTemplate: async (root, args, context) => {
     if((typeof args.textfile != "undefined") && (args.textfile.trim().length > 0)){
       var text = await getFileData(__dirname + "/template/text/"+args.textfile); 
     }
     if((typeof args.name != "string") || (args.name.trim().length == 0)){
      throw new Error('No template name');
     }
     else if((typeof args.htmlfile == "undefined") || (args.htmlfile.trim().length == 0)){
      throw new Error('Not found html file template data');
     }
     else if(typeof args.subject == "undefined"){
      args.subject = '';
     }
     else if((typeof args.textfile == "undefined") || (args.textfile.trim().length == 0)){
      var text = '';
     }     
     else{
      var html = await getFileData(__dirname + "/template/html/"+args.htmlfile);      
      return await createNewEmailTemplate(args.name, args.subject, html, text);  
     }     
    },
    sendMailTemplateNoti: async (root, args, context) => {
     if((typeof context.user == "undefined") || (!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
     }
     else if(((typeof args.templateName == "undefined") || (!args.templateName)) || ((typeof args.templateData == "undefined") || (!args.templateData))){
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
        return new emailNotiModel({ senderId: context.user._id, subject: args.templateName, type: 'E-mail', targetEmail: args.mailto, messageId: sendStat.MessageId }).save()
                   .then(newEmailNoti => newEmailNoti)
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