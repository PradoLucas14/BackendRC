const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;


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

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Reserve=model('Reserve',reserveSchema);
module.exports=Reserve;