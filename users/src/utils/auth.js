const jwttoken = require('jsonwebtoken');
const { port, env, apiversion, jwtSecret } = require('../config/vars');
const bcrypt = require('bcrypt');
const Sal_Round = 10;

function generateToken(reqObject){
  return new Promise((resolve, reject) =>{
   jwttoken.sign(reqObject, jwtSecret, (error, newToken) =>{
    if(error){
     reject(error);
    }
    else{
     resolve(newToken);
    }    
   });
  });
}

function verifyToken(token){
 if(token){
  // Authorization: Bearer <token>
  const accessToken = token.split(' ')[1];
  
  return new Promise((resolve, reject) => {
   jwttoken.verify(accessToken, jwtSecret, (error, decode) => {
    if(error){
     reject('Your authorization is incorrect!!');
    }
    else{
     resolve(decode);
    }
   });
  });
 }
}

function encrypt(reqString){
 return new Promise((resolve, reject) =>{
   return bcrypt.hash(reqString, Sal_Round, (error, hash) => {
    if(error){
     return reject(error);
    }
    else{ 
     return resolve(hash);
    } 
   });
 });
}

async function authenticate(midEnter, args){
 return new Promise((resolve, reject) => {  
   if(midEnter != args.mid){
     reject('Mid is incorrect');
   }   
   else{
    generateToken({_id: args._id, mid: args.mid, name: args.name, avatar: args.avatar})
    .then(token => resolve(token))
    .catch(error => reject(error));
   }
 });
}

module.exports = {
 verifyToken: verifyToken,
 encrypt: encrypt,
 authenticate: authenticate
} 