const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema ,model} = mongoose;


const reserveSchema = new Schema({
  name: { 
    type: String, 
    required: true },
  telephone: { 
    type: String, 
    required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true },
  participantes:{
    type:Number,
    required:true},
  date:{
    type:Date,
    required:true},
  hora:{
    type:String,
    required:true},
    idReserva:{
        type:String,
        required:true
    }
});



const Reserve=model('Reserve',reserveSchema);
module.exports=Reserve;