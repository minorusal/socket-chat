const dotenv = require('dotenv');
const path = require('path');

// Cargar las variables de entorno desde el archivo .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Exportar la configuración
module.exports = {
  puerto: Number(process.env.PORT),
  api: process.env.API,
  apple: {
    key: process.env.KEY,
    team: process.env.TEAM,
    file: process.env.FILE,
    bundle: process.env.BUNDLE_ID,
    isProduction: process.env.NODE_ENV === 'production'
  },
  google: {
    file: process.env.GOOGLE_FILE,
    database: process.env.GOOGLE_DATABASE_URL
  },
  stripe: {
    key: process.env.STRIPE_PRIVATE_KEY,
    email: process.env.STRIPE_EXAMPLE_EMAIL
  },
  certificacion: {
    precio: process.env.CERTIFICACION_PRECIO
  }
};
