const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, description, paymentLink } = req.body;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    const image = req.files.image;
    const ext = path.extname(image.name);
    const imageName = uuidv4() + ext;
    const uploadPath = path.join(__dirname, '..', 'uploads', imageName);

    await image.mv(uploadPath);

    const newProduct = new Product({
      name,
      price,
      description,
      paymentLink,
      imageUrl: '/uploads/' + imageName
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado' });
  } catch {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

module.exports = router;