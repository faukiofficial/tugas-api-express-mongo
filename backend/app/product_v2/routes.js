const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const controller = require("./controller");

// Read All Products with Search
router.get("/product/", controller.getAllProducts);

// Read Product by ID
router.get("/product/:id", controller.getProductById);

// Create Product
router.post("/product/", upload.single("image"), controller.createProduct);

// Update Product
router.put("/product/:id", upload.single("image"), controller.updateProduct);

// Delete Product
router.delete("/product/:id", controller.deleteProduct);

module.exports = router;