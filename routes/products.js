const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    const image = req.files.image;
    const ext = path.extname(image.name);
    const imageName = uuidv4() + ext;
    const uploadPath = path.join(__dirname, '..', 'uploads', imageName);

    if (!fs.existsSync(path.join(__dirname, '..', 'uploads'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'uploads'));
    }

    await image.mv(uploadPath);

    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl: `/uploads/${imageName}`
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
