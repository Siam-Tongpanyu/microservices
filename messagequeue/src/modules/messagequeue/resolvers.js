const { awsNotiQueUrl } = require('../../config/vars');
const { sendMessageQueue, generateMessageQue, manageMessageQue } = require('../../utils/queue');


const resolvers = {
  Query: {
   
  },
  Mutation: {
    queSendEmail: async (root, args, context) => {
      args.senderId = "system";
      args.targetfunc = "queSendMailNoti";
      return await manageMessageQue(args, awsNotiQueUrl);
    },
    queSendSms: async (root, args, context) => {
      args.senderId = "system";
      args.targetfunc = "queSendSmsNoti";
      return await manageMessageQue(args, awsNotiQueUrl);
    },
    queSendTemplateEmail: async (root, args, context) => {
      args.senderId = "system";
      args.targetfunc = "queSendTemplateMailNoti";
      return await manageMessageQue(args, awsNotiQueUrl);
    }
  }
}

module.exports = resolvers;