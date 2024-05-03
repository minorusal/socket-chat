const { sendAppleNotifications } = require('./apn');
const { sendGoogleNotifications } = require('./fcm');

/**
 * Envía una notificación según el tipo de dispositivo.
 * @param {'Android' | 'iOS'} type Tipo de dispositivo ('Android' o 'iOS').
 * @param {string} token Token del dispositivo.
 * @param {Mensaje} notification Objeto de notificación.
 * @returns {Promise<any>} Promesa que resuelve cuando se envía la notificación.
 */
const sendNotification = async (type, token, notification) => {
  try {
    if (type === 'Android') {
      return await sendGoogleNotifications(token, notification);
    } else {
      return await sendAppleNotifications(token, notification);
    }
  } catch (error) {
    return error;
  }
};

module.exports = { sendNotification };
