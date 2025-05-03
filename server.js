const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const productRoutes = require('./routes/products');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// Puerto dinámico para Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
