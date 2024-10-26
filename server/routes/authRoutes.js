const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut,
  } = require("../controllers/userController");
  
  const userRouter = require("express").Router();
  
  userRouter.post("/login", login);
  userRouter.post("/register", register);
  userRouter.get("/allusers/:id", getAllUsers);
  userRouter.post("/setavatar/:id", setAvatar);
  userRouter.get("/logout/:id", logOut);
  
  module.exports = userRouter;