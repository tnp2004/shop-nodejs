const express = require('express');
const Product = require('../models/products');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const Users = require('../models/users');
const usersData = require('../models/users');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/pictures/products')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: storage
})

router.get('/', (req, res) => {
    Product.find().exec((err, doc) => {
        res.render('index', {products: doc, login: req.session.login, username: req.session.username})
    })
})

router.get('/manage', (req, res) => {
   if(req.session.login) {
        Product.find().exec((err, doc) => {
            res.render('manage', {products: doc, login: req.session.login, username: req.session.username})
        })
   }else {
       res.redirect('/login')
   }
})

router.get('/addproduct', (req, res) => {
    if(req.session.login) {
        res.render('addproduct',{login: req.session.login, username: req.session.username})
    }else {
        res.redirect('/login')
    }
})


router.post('/additem', upload.single('picture'), (req, res) => {
    const data = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        picture: req.file.filename
    })
    Product.saveClothes(data, err => {
        if(err) console.log(err)
        res.redirect('/')
    })
})

router.post('/modify/save', (req, res) => {
    const productIdUpdate = req.body.id
    const data = {
       name: req.body.name,
       price: req.body.price,
       description: req.body.description
   }
   Product.findByIdAndUpdate(productIdUpdate, data, {useFindAndModify: false}).exec((err, doc) => {
       res.redirect('/manage')
    })
})

router.post('/register/save', (req, res) => {
    const userData = new Users({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        status: 'user'
    })
    Users.registerUser(userData, err => {
        if(err) console.log(err)
        res.redirect('/')
    })
})

router.get('/modify/:id', (req, res) => {
    Product.findOne({_id: req.params.id}).exec((err, doc) => {
        res.render('modify', {product: doc, login: req.session.login, username: req.session.username})
    })
})

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, {useFindAndModify: false}).exec((err, doc) => {
        if(err) console.log(err)
        if(doc.picture) {
            const filePathDel = `./public/pictures/products/${doc.picture}`
            fs.unlinkSync(filePathDel) // delete picture file
        }
        res.redirect('/manage')
    })
})

router.get('/register', (req, res) => {
    res.render('registerform', {login: req.session.login, username: req.session.username})
})

router.get('/login', (req, res) => {
    res.render('loginform', {login: req.session.login, username: req.session.username})
})

router.post('/login/check', (req, res) => {
    usersData.findOne({username: req.body.username}).exec((err, doc) => {
        if(doc) {
            if(doc.password == req.body.password) {
                req.session.username = req.body.username
                req.session.password = req.body.password
                req.session.login = true
                res.redirect('/')
            }else {
                res.redirect('/login')
            }
        }else {
            res.redirect('/login')
        }
        
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) console.log(err)
        res.redirect('/')
    })
})

router.get('/productInfo', (req, res) => {
    res.render('productData', {login: req.session.login, username: req.session.username})
})

router.get('/productInfo/:id', (req, res) => {
    Product.findOne({_id: req.params.id}).exec((err, doc) => {
        res.render('productData', {login: req.session.login, username: req.session.username, product: doc})
    })
})

module.exports = router;