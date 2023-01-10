var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const { route } = require('./user');
var router = express.Router();
/* GET users listing. */

const verifyAdmin =(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

router.get('/', verifyAdmin,function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products',{admin:true,products})
  })
});
router.get('/add-product',function(req,res){
  res.render("admin/add-product")
})
router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body,(_id)=>{
    let image=req.files.image
    image.mv('./public/product-images/'+_id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }
    })
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})
router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  _id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    // console.log(req.files.image);
    // if (req.files.image) {
      let image=req.files.image
      image.mv('./public/product-images/'+_id+'.jpg')
    
  })
})

router.get('/users', function(req, res, next) {
  userHelpers.getAllUsers().then((users)=>{
  res.render('admin/view-users',{admin:true,users})
  })
})

router.get('/delete-user/:id',(req,res)=>{
  let proId=req.params.id
  userHelpers.deleteUser(proId).then((response)=>{
    res.redirect('/admin/users')
  })
})

router.get('/users-get',(req,res)=>{
  console.log(req.query);
  userHelpers.getUsers(req.query.search).then((users)=>{
    res.render('admin/view-users',{admin:true,users})
  })
})
router.get('/products-get',(req,res)=>{
  console.log(req.query);
  userHelpers.getProducts(req.query.searchP).then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })
})
var msg;
router.get('/login',(req,res,next)=>{
  res.render('admin/login',{msg})
  msg=false
})

router.post('/login',(req,res,next)=>{
  if(req.body.email === "admin@gmail.com" && req.body.password === "123" ){
    req.session.admin = true
    res.redirect('/admin')
  }else{
    msg=true
    res.redirect('/admin/login')
  }
})

router.get('/logout',(req,res,next)=>{
  req.session.admin = false
  res.redirect('/admin/login')
})
module.exports = router;
