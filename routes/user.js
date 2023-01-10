const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')


/* GET home page. */
router.get('/', function (req, res) {
  let user = req.session.user
  if (req.session.loggedIn) {
    productHelpers.getAllProducts().then((products) => {
      res.render('user/view-products', { products, user })
    })
  } else {
    res.redirect('/login')
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { log: req.session.loginErr })
    req.session.loginErr = false
  }
})


router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
    console.log('ok');
  } else
    res.render('user/signup')
  console.log('no');
})


router.post('/signup', (req, res) => {
  err = 'this email id already have an accouont..!'
  userHelpers.doSignup(req.body).then((response) => {
    if (response) {
      res.redirect('/login')
    } else {
      res.render('user/signup', { err })
    }
  })
})


router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loggedIn = false;
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
})


router.get('/logout', (req, res) => {
  // req.session.destroy()
  req.session.loggedIn = false;
  res.redirect('/')
})

module.exports = router;
