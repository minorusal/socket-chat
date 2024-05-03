const admin = require('firebase-admin');
const { handleError } = require('../../utils/error');
const { deleteToken } = require('../../utils/deleteToken');
const config = require('../config');

const { google } = config;

/**
 * Envía notificaciones a dispositivos Android a través de Firebase Cloud Messaging (FCM).
 * @param {string} token Token del dispositivo.
 * @param {Mensaje} payload Datos de la notificación.
 * @returns {Promise<{ message: string, payload: any }>} Promesa que se resuelve con el resultado del envío de la notificación.
 */
const sendGoogleNotifications = async (token, payload) => {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(google.file),
        databaseURL: google.database
      });
    }

    const notification = {
      notification: {
        title: payload.mensaje,
        body: JSON.stringify(payload)
      }
    };
    const notificationSent = await admin.messaging().sendToDevice(token, notification);
    const { results } = notificationSent;
    const [result] = results;
    const { error } = result;
    if (error != null) {
      const { code } = error;
      if (code === 'messaging/invalid-registration-token') {
        await deleteToken(token, 'Android');
      }
    }

    return {
      message: `Se pudo enviar la notificación ${new Date()}`,
      payload: {
        notificationSent
      }
    };
  } catch (error) {
    handleError(error);
  }
};

module.exports = { sendGoogleNotifications };
