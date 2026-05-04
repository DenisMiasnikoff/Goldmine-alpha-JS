const Dungeon=require('./../models/dungeonModel');

exports.getAllDungeons = async (req, res, next) => {
  try {
    const dungeons = await Dungeon.find();
    res.status(200).json({
      status: 'success',
      results: dungeons.length,
      data: { dungeons }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.createDungeon=async(req,res,next)=>{
  try {
  const newDungeon=await Dungeon.create({
    name:req.body.name,
    description:req.body.description,
    dungPicture:req.body.dungPicture,
    dungBanner:req.body.dungBanner,
    moderators:[req.user.id]
  });

  res.status(201).json({
    status:'success',
    data: {dungeon: newDungeon }
  });


  }
  catch(err) {
  res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getDungeon = async (req, res, next) => {
  try {
    const dungeon = await Dungeon.findById(req.params.id).populate('moderators');
    if (!dungeon) return res.status(404).json({ message: 'No dungeon found' });

    res.status(200).json({
      status: 'success',
      data: { dungeon }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};