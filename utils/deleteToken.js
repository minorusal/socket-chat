const config = require('../src/config');
const { handleError } = require('./error');
const axios = require('axios');

const { api } = config;

/**
 * Elimina un token de dispositivo de la base de datos.
 * @param {string} token Token del dispositivo.
 * @param {'Android' | 'iOS'} type Tipo de dispositivo.
 * @returns {Promise<void>} Promesa que se resuelve cuando se elimina el token.
 */
const deleteToken = async (token, type) => {
  try {
    console.log(`'[DELETE TOKEN]' ${type}: ${token}`);
    await axios.delete(`${api}/api/tokens/token/${token}/${type}`);
  } catch (error) {
    handleError(error);
  }
};

module.exports = { deleteToken };
