const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Product = require("./model");

// Get All Product or Search by Name
router.get("/product", (req, res) => {
  const search = req.query.search;
  let query = {};

  if (search) {
    query.name = new RegExp(search, "i");
  }

  Product.find(query)
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});

// Get All Product By ID
router.get("/product/:id", (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});

// Add new product
router.post("/product", upload.single("image"), (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;
  
  if (image) {
    const imgBuffer = fs.readFileSync(image.path);
    const base64Image = imgBuffer.toString('base64');
    Product.create({
      name,
      price,
      stock,
      status,
      image: base64Image
    })
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  } else {
    Product.create({ name, price, stock, status })
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  }
});

// Update by ID
router.put("/product/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;
  const updateData = { name, price, stock, status };

  if (image) {
    const imgBuffer = fs.readFileSync(image.path);
    const base64Image = imgBuffer.toString('base64');
    updateData.image = base64Image;
  }

  Product.findByIdAndUpdate(id, updateData, { new: true })
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});

// Delete by ID
router.delete("/product/:id", (req, res) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
});

module.exports = router;
