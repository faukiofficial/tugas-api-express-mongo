require('./config/mongoose')
const express = require("express");
const path = require("path");
const cors = require('cors');
const app = express();
const productRouterV1 = require('./app/product_v1/routes')
const productRouterV2 = require('./app/product_v2/routes')
const logger = require('morgan')

app.use(logger('dev'))
app.use(cors({ origin: 'https://tugas-api-express-mongo.onrender.com' }));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
// app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/v1', productRouterV1)
app.use('/api/v2', productRouterV2)
app.use((req, res, next) => {
    res.status(404)
    res.send(`Halaman ${req.originalUrl} tidak tersedia`)
})

app.listen( process.env.PORT || 3000, () => {
  console.log("Server running at http://127.0.0.1:3000");
});
