// Mongo DB
const mongoose = require('mongoose');
const Users = mongoose.model('users');
const { authenticate } = require('../../utils/auth');

const resolvers = {
  Query: {
    user: async (root, args, context) => {
      if((!context.user) || (!context.user._id)){        
       throw new Error('Unauthorized');
      }
      userData = await Users.findById({_id: context.user._id});
      if((userData._id != context.user._id) && (userData.role != 'admin')){       
       throw new Error('No permission to see this user data.');
      }      
      return userData;     
    },
    users: async (root, args, context) => {
     if((!context.user) || (!context.user._id)){
      throw new Error('Unauthorized');
     }
     userData = await Users.findById(context.user._id);
     if(userData.role != 'admin'){
       throw new Error('No permission to see users data.');
     }
     if(args._id.length > 0){
      return Users.find({ '_id': { $in: args._id }})
      .then(usersData => usersData)
      .catch(() => Promise.reject("404"))      
     }
     else{
      return Users.find({});
     } 
    },
    getUser: async (root, { _id }) => {
     return Users.findById({_id: _id});
    },
    getUsers: async (root, args) => {
     if((typeof args._id != "undefined") && (args._id.length > 0)){
      return Users.find({ '_id': { $in: args._id }})
      .then(usersData => usersData)
      .catch(() => Promise.reject("404"))      
     }
     else{
      return Users.find({});
     } 
    }
  },
  Mutation: {
    facebookAuth: async (root, args) => {
      userData = await Users.findOne({uid: args.uid});
      if(!userData || (Object.values(userData).length == 0)){
       const newUser = new Users({ email: args.email, uid: args.uid, mid: args.mid, name: args.name, avatar: args.avatar,  datas: args.datas});
       newUser.save();      
       newUser.token = await authenticate(args.mid, newUser);
       return newUser;
      }
      else{
       if((userData.email != args.email) || (userData.mid != args.mid) || (userData.name != args.name)){
        const nUser = await Users.findByIdAndUpdate({_id: userData._id}, {$set: {email: args.email, mid: args.mid, name: args.name, avatar: args.avatar, datas: args.datas}}, { new: true,  upsert: true})
        nUser.token = await authenticate(args.mid, nUser);
        return nUser;      
       }       
       else{
        userData.token = await authenticate(args.mid, userData);
        return userData;
       }       
      }
    },
    guestAuth: async (root, args) => {
     userData = await Users.findOne({mid: args.mid});
     if(!userData || (Object.values(userData).length == 0)){
      const newUser = new Users({ mid: args.mid, name: args.mid });      
      newUser.save();      
      newUser.token = await authenticate(args.mid, newUser);
      return newUser;      
     }
     else{
      userData.token = await authenticate(args.mid, userData);
      return userData;
     }
    }
  }
}

module.exports = resolvers;