const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  mensaje: String,
  carrito: Array,
  comprobanteUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Pedido', PedidoSchema);
