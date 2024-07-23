require('./config/mongoose')
const express = require("express");
const path = require("path");
const cors = require('cors');
const app = express();
// const productRouter = require('./app/product/routes')
// const productRouterV2 = require('./app/product_v2/routes')
const productRouterV3 = require('./app/product_v3/routes')
const productRouterV4 = require('./app/product_v4/routes')
const logger = require('morgan')

app.use(logger('dev'))
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({extended: true})) // untuk form
app.use(express.json()) // untuk JSON
app.use('/public', express.static(path.join(__dirname, 'uploads')))
// app.use('/api/v1', productRouter)
// app.use('/api/v2', productRouterV2)
app.use('/api/v3', productRouterV3)
app.use('/api/v4', productRouterV4)
app.use((req, res, next) => {
    res.status(404)
    res.send(`Halaman ${req.originalUrl} tidak tersedia`)
})

app.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000");
});
