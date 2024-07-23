const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const db = require('../../config/mongodb');
const { ObjectId } = require('mongodb');
const path = require('path')
const fs = require('fs')

router.get('/product', (req, res) => {
    db.collection('products').find().toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error))
})

router.post('/product', upload.single('image'), (req, res) => {
    const {name, price, stock, status} = req.body;
    const image = req.file;
    if(image){
        const target = path.join(__dirname, '../../uploads', image.originalname)
        fs.renameSync(image.path, target);
        db.collection('products').insertOne({name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`})
            .then(result => res.send(result))
            .catch(error => res.send(error))
    }
})

router.get('/user', (req, res) => {
    db.collection('users').find().toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error))
})

router.get('/product/:id', (req, res) => {
    const {id} = req.params;
    db.collection('products').findOne({_id: new ObjectId(id)})
        .then(result => res.send(result))
        .catch(error => res.send(error))
})

module.exports = router;