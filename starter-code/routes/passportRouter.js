const express = require('express');
const passportRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const passport = require('passport');
const bcryptSalt = 5;
const User = require('../models/User');


function checkRoles(role) {
  return function(req, res, next) {
    console.log(req.isAuthenticated(),'Al pasar por la función checkrole')
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function encodeRoles(){

}

//PRIVATE
passportRouter.get('/signup', checkRoles(0), (req, res, next) => {
  console.log();
  res.render('passport/signup', {display: 'on'})
});

passportRouter.get('/login', (req, res, next) =>
  res.render('passport/login'));

passportRouter.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  
  console.log(req.user.role, 'El ROL DEL USUARIO');

  //Como añadir un atributo diferente dependiendo del roll
  let user = {
    username: req.user.username,
    number: req.user.role 
  }
  let role= req.user.role;
  res.render('passport/private', {user}); 
});

passportRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//SIGNUP
passportRouter.post('/signup', (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;
  const { role } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  if (username === '' || password === '' || role === '') {
    res.render('signup', {
      message: 'Indicate username and password',
    });
    reject();
  }
  User.findOne({
    username,
  })
    .then((user) => {
      if (user !== null) throw new Error('The username already exists');
      const newUser = new User({
        username,
        password: hashPass,
        role
      });
      newUser.save();
    })
    .then(() => res.redirect('/'))
    .catch(err => next(err));
});


passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private',
  failureRedirect: '/login',
  failureFlash: false,
  passReqToCallback: false,
}));

module.exports = passportRouter;
