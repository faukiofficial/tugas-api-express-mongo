const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Product = require("./model");

// Konfigurasi multer untuk menyimpan file gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get All Product or Search by Name
router.get("/product", async (req, res) => {
  const search = req.query.search;
  let query = {};

  if (search) {
    query.name = new RegExp(search, "i");
  }

  try {
    const result = await Product.find(query);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get All Product By ID
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.findById(id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add new product
router.post("/product", upload.single("image"), async (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (!image) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
  const imagePath = `/uploads/${image.filename}`;
  const product = new Product({
    name,
      price,
      stock,
      status,
      image: imagePath
  })
  try {
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Update by ID
router.put("/product/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;
  const updateData = { name, price, stock, status };

  try {
    if (image) {
      updateData.image = `/uploads/${image.filename}`;
    }

    const result = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete by ID
router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      // Hapus gambar dari file system jika ada
      if (result.image) {
        const imagePath = path.join(__dirname, "..", result.image);
        await fs.unlink(imagePath);
      }

      res.send({ message: "Product deleted successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
