const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Crear pedido
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, mensaje } = req.body;
    const carrito = JSON.parse(req.body.carrito);

    if (!req.files || !req.files.comprobante) {
      return res.status(400).json({ error: 'Comprobante requerido' });
    }

    const archivo = req.files.comprobante;
    const ext = path.extname(archivo.name);
    const nombreArchivo = uuidv4() + ext;
    const uploadPath = path.join(__dirname, '..', 'uploads', nombreArchivo);

    if (!fs.existsSync(path.join(__dirname, '..', 'uploads'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'uploads'));
    }

    await archivo.mv(uploadPath);

    const pedido = new Pedido({
      nombre,
      telefono,
      mensaje,
      carrito,
      comprobanteUrl: `/uploads/${nombreArchivo}`,
      estado: 'Pendiente'
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

// Actualizar estado
router.put('/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    await Pedido.findByIdAndUpdate(req.params.id, { estado });
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Eliminar pedido
router.delete('/:id', async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pedido eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

module.exports = router;
