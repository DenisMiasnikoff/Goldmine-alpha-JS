const mongoose = require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto = require('crypto');

const userSchema=new mongoose.Schema({
    username:{
     type:String,
     required:[true,"Username field required!"]
    },
    email:{
     type:String,
     required:[true,"Please provide valid email address!"],
     unique:true,
     lowercase:true,
     validate:[validator.isEmail,'Provide a valid email address.']
    },
    photo:{
     type:String
    },
    role: {
     type:String,
     enum:['user','moderator','admin'],
     default:'user'
    },
    password: {
     type:String,
     required:[true,'Please provide password, minimum-length: 8'],
     minlength:8,
     select:false
    },
    confirmpassword: {
     type:String,
     required:[true,'Please confirm your password, type exact same one.'],
     validate:{
        //Thus function works only within Saving and Creating User
        validator:function(el) {
         return el===this.password;
        },
        message:'Passwords are not the same.'
     }
    },
    passwordchangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
     type:Boolean,
     default:true,
     select:false
    },
    gems:{
     type:Number,
     default:100, //sign-up bonus
     min:[0,'User cannot have negative currency']
    },
    userProfile: {
        wallpaper: {
         type:String,
         default:'none'
        },
        avatarFrame: {
         type:String,
         default:'none'
        },
        unlockedWallpapers: {
         type:[String],
         default:['none']
        },
        unlockedFrames: {
         type:[String],
         default:['none']
        }
    },
    inventory: {
    type: [{ 
      type: mongoose.Schema.ObjectId, 
      ref: 'Item' 
    }],
    default: [] // <--- ADD THIS!
  }
    
});

userSchema.pre('save',async function() {
 if (!this.isModified('password')) return;

 this.password=await bcrypt.hash(this.password,12);

 this.confirmpassword=undefined;


});

userSchema.pre(/^find/,function() {
  this.find({active:{$ne:false}});
  
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // this.password is not available here because of select: false, so we pass it in
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypt the token before saving to DB (security best practice)
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken); // Helpful for debugging!

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Send the un-encrypted version to the user via email
};




// Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordchangedAt) { // We use YOUR variable name here
    const changedTimestamp = parseInt(this.passwordchangedAt.getTime() / 1000, 10);
    
    // True means changed AFTER token created (Error!)
    return JWTTimestamp < changedTimestamp; 
  }

  // False means NOT changed
  return false;
};

module.exports = mongoose.model('User', userSchema);