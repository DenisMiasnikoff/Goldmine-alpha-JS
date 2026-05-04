const mongoose=require('mongoose');

const dungeonSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,'A subreddit must have a name'],
    unique:true,
    trim:true,
    minlength:[3,'Name must be at least 3 characters'],
    maxlength:[21,'Name must be less than 24 characters']
  },
  description:{
   type:String,
   trim:true,
   maxlength:[500,"Description cannot exceed 500 characters."]
  },
  //relationship
  moderators: [
    {
     type:mongoose.Schema.ObjectId,
     ref:'User'
    }
  ],
  createdAt: {
    type:Date,
    default:Date.now
  },
  dungPicture: {
    type:String,
    default:'none'
  },
  dungBanner: {
    type:String,
    default:'none'
  }
},
  {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
  }
);

const Dungeon=mongoose.model('Dungeon',dungeonSchema);

module.exports=Dungeon;