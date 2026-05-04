const User=require('./../models/userModel');
const jwt=require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto'); // Built-in Node module
const sendEmail = require('./../utils/email');
const signToken=(id)=>{
 return jwt.sign({id:id},process.env.JWT_SECRET, {
    expiresIn:process.env.JWT_EXPIRES_IN
 });
};

exports.signup=async(req,res,next)=>{
  try {
    const newUser=await User.create({
     username:req.body.username,
     email:req.body.email,
     password:req.body.password,
     confirmpassword:req.body.confirmpassword
    });

    const token=signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      status:'success',
      token,
      data:{
        user:newUser
      }
    })
  }
  catch(err) {
    res.status(400).json({
     status:'fail',
     message:err.message
    })
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!'
      });
    }

    // 2. Check if user exists && password is correct
    // We explicitly select the password because we set 'select: false' in the model
    const user = await User.findOne({ email }).select('+password');

    // We use a helper method to compare the plain text password with the hash
    // (We will create this method in the Model in a second)
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // 3. If everything is ok, send token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.protect=async(req,res,next)=>{
  try {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'You are not logged in! Please log in to get access.' 
      });
    }

    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
  catch(err) {
  res.status(401).json({
      status: 'fail',
      message: 'Invalid token or authorization failed.'
    });
  }
};


// Middleware to restrict access to specific roles (e.g. 'admin')
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array like ['admin', 'lead-guide']
    // req.user comes from the 'protect' middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1. Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with that email address.'
      });
    }

    // 2. Generate the random reset token
    const resetToken = user.createPasswordResetToken();

    // 3. Save it to DB (validateBeforeSave: false allows us to save without other required fields)
    await user.save({ validateBeforeSave: false });

    // 4. Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and confirmpassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      // If email sending fails, clean up the user data
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later!'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1. Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Set new password if token is valid and not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // 3. Update changedPasswordAt property for the user
    await user.save();

    // 4. Log the user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(err);
  }
};