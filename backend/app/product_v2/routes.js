const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Product = require("./model");

// Get All Product or Search by Name
router.get("/product", async (req, res) => {
  const search = req.query.search;
  let query = {};

  if (search) {
    query.name = new RegExp(search, "i");
  }

  try {
    const result = await Product.find(query)
    res.send(result)
  } catch (error) {
    res.status(500).send(error)
  }
  // Product.find(query)
  //   .then((result) => res.send(result))
  //   .catch((error) => res.send(error));
});

// Get All Product By ID
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.findById(id)
    if(result) {
      res.send(result)
    } else {
      res.status(404).send({message: "Product not found"})
    }
  } catch (error) {
    res.status(500).send(error)
  }
  // Product.findById(id)
  //   .then((result) => res.send(result))
  //   .catch((error) => res.send(error));
});

// Add new product
router.post("/product", upload.single("image"), async (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  try {
    let base64Image;
    if (image) {
      const imgBuffer = await fs.readFile(image.path);
      base64Image = imgBuffer.toString('base64');
    }

    const newProduct = await Product.create({
      name,
      price,
      stock,
      status,
      image: base64Image
    });

    res.send(newProduct);
  } catch (error) {
    res.status(500).send(error);
  }
  
  // if (image) {
  //   const imgBuffer = await fs.readFileSync(image.path);
  //   const base64Image = imgBuffer.toString('base64');
  //   Product.create({
  //     name,
  //     price,
  //     stock,
  //     status,
  //     image: base64Image
  //   })
  //     .then((result) => res.send(result))
  //     .catch((error) => res.send(error));
  // } else {
  //   Product.create({ name, price, stock, status })
  //     .then((result) => res.send(result))
  //     .catch((error) => res.send(error));
  // }
});

// Update by ID
router.put("/product/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;
  const updateData = { name, price, stock, status };

  try {
    if (image) {
      const imgBuffer = await fs.readFile(image.path);
      const base64Image = imgBuffer.toString('base64');
      updateData.image = base64Image;
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

  // if (image) {
  //   const imgBuffer = fs.readFileSync(image.path);
  //   const base64Image = imgBuffer.toString('base64');
  //   updateData.image = base64Image;
  // }

  // Product.findByIdAndUpdate(id, updateData, { new: true })
  //   .then((result) => res.send(result))
  //   .catch((error) => res.send(error));
});

// Delete by ID
router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      res.send({ message: "Product deleted successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
  // Product.findByIdAndDelete(id)
  //   .then((result) => res.send(result))
  //   .catch((error) => res.send(error));
});

module.exports = router;
