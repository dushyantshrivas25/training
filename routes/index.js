var express = require('express');
var router = express.Router();
const UserModel = require("../models/userModel")
const passport = require("passport")
const LocalStrategy = require("passport-local")
passport.use(new LocalStrategy(UserModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'signin',user: req.user });
});

router.post("/signin",
  passport.authenticate("local", { failureRedirect: "/signin",
   successRedirect: "/home",
  }),
  function (req, res, next) {}
);

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'signup',user: req.user });
});

router.post("/signup", async function (req, res, next) {
  try {
      const { username, email,password } = req.body;

      const newuser = new UserModel({ username, email });

      const user = await UserModel.register(newuser, password);

      // await newuser.save();
      res.redirect("/signin");
  } catch (error) {
      res.send(error.message);
  }
});

router.get('/home',isLoggedIn, async function(req, res, next) {
  try {
    console.log(req.user);
    const users = await UserModel.find();
    res.render('home', { title: 'Homepage', users, user:req.user });
  } catch (error) {
    res.send(error)
  }
  });
  

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/signin");
}


module.exports = router;
