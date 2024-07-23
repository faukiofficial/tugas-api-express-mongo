const Product = require("./model");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res) => {
    try {
      const searchQuery = req.query.search || "";
      let products;
      if (searchQuery) {
        products = await Product.findAll({
          where: {
            name: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        });
      } else {
        products = await Product.findAll();
      }
      res.send(products);
    } catch (error) {
      res.send(error);
    }
  };

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.send(error);
  }
};

exports.createProduct = async (req, res) => {
    const { users_id, name, price, stock, status } = req.body;
    const image = req.file;
    if (image) {
      const target = path.join(__dirname, "../../uploads", image.originalname);
      fs.renameSync(image.path, target);
      try {
        await Product.sync();
        const result = await Product.create({
          users_id,
          name,
          price,
          stock,
          status,
          image_url: `http://localhost:3000/public/${image.originalname}`
        });
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    }
  };

exports.updateProduct = async (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;
  let updateData = { users_id, name, price, stock, status };
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    updateData.image_url = `http://localhost:3000/public/${image.originalname}`;
  }
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(updateData);
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.send(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.send({ message: "Product deleted successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.send(error);
  }
};
