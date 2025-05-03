const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Pedido = require('../models/Pedido');
const fs = require('fs');

// Crear pedido
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, mensaje } = req.body;
    const carrito = JSON.parse(req.body.carrito);

    if (!req.files || !req.files.comprobante) {
      return res.status(400).json({ error: 'Comprobante requerido' });
    }

    const comprobante = req.files.comprobante;
    const ext = path.extname(comprobante.name);
    const imageName = uuidv4() + ext;
    const uploadPath = path.join(__dirname, '..', 'uploads', imageName);
    await comprobante.mv(uploadPath);

    const pedido = new Pedido({
      nombre,
      telefono,
      mensaje,
      carrito,
      comprobanteUrl: `/uploads/${imageName}`
    });

    await pedido.save();
    res.status(201).json({ message: 'Pedido guardado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar pedido' });
  }
});

// Obtener pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

module.exports = router;
