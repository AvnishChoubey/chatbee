const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name:{
        type: "string",
        required: [true,"Can't be blank"]
    },
    email:{
        type: "string",
        lowercase: true,
        unique: true,
        index: true,
        required: [true, "Can't be blank"],
        validate: [isEmail, "Invalid email address"]
    },
    password:{
        type: "string",
        required: [true, "Can't be blank"]
    },
    picture:{
        type: "string",
    },
    newMessages:{
        type: Object,
        default: {}
    },
    status:{
        type: String,
        default: "online"
    }
},{minimize:false});

// only hash password if password has been modified
UserSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) return next();
  
    bcrypt.genSalt(10, function(err, salt){
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);
  
        user.password = hash
        next();
      })
    })
  });
  
  // function to create UserResponse DTO
  UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  };
  
  // static method to find document in users collection by email and password
  UserSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if(!user) throw new Error('invalid email or password');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('invalid email or password')
    return user
  };

const User = mongoose.model('User',UserSchema);
module.exports = User;

