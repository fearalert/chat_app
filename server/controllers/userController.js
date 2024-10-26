const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendEmail = require("../utils/sendEmail");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    
    delete user.password;
    
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();
    
    return res.json({ status: true, user, refreshToken });
  } catch (ex) {
    next(ex);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const OTP_expires = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      OTP_VerificationToken: { OTP, expires: OTP_expires },
    });

    delete user.password;

    await SendEmail(email, "Your OTP Code", `Your OTP code is ${OTP}. It is valid for 5 minutes.`);

    return res.json({ msg: "User registered successfully. Please verify your email.", status: true, user });
  } catch (ex) {
    next(ex);
  }
};


const verifyOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({ message: 'User not found', status: false });
    }

    if (user.OTP_VerificationToken.OTP === OTP && user.OTP_VerificationToken.expires > Date.now()) {
      user.isVerified = true;
      user.OTP_VerificationToken = {};
      await user.save();

      return res.json({ message: 'User verified successfully', status: true });
    } else {
      return res.json({ message: 'Invalid or expired OTP', status: false });
    }
  } catch (ex) {
    res.status(500).json({ message: 'Internal server error', status: false });
  }
};


const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  
  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403);
  
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    
    return res.json({ accessToken });
  });
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

const logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};


module.exports = { register, login, logOut, verifyOTP, getAllUsers, setAvatar, refresh };