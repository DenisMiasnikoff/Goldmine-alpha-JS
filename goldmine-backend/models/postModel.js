const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
  title: {
    type:String,
    required:[true,'A post must have a title.'],
    trim:true,
    maxlength:[100,'Title is too long!']
  },
  content:{
    type:String,
    required:[true,'A post must have a content'],
    
  },
  
  photo:{
    type:String,
    default:'none'
  },

  user: {
   type:mongoose.Schema.ObjectId,
   ref:'User',
   required:[true,'A post must belong to someone.']
  },

  dungeon:{
   type:mongoose.Schema.ObjectId,
   ref:'Dungeon',
   required:[true,'A post must belong to its specific Dungeon!']
  },
  upvotes:{
   type:Number,
   default:0
  },
  downvotes:{
    type:Number,
    default:0
  },
  createdAt: {
    type:Date,
    default:Date.now
  }

});


postSchema.pre(/^find/,function() {
 this.populate({
    path:'user',
    select:'username'
 }).populate({
    path:'dungeon',
    select:'name'
 })
});

const Post=mongoose.model('Post',postSchema);

module.exports=Post;