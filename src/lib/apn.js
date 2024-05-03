const apn = require('apn');
const { generateTime } = require('../../utils/time');
const { handleError } = require('../../utils/error');
const { deleteToken } = require('../../utils/deleteToken');
const { apple } = require('../config');

/**
 * Envía notificaciones a dispositivos Apple (iOS).
 * @param {string} token Token del dispositivo.
 * @param {Mensaje} payload Datos de la notificación.
 * @returns {Promise<{ message: string, payload: any } | Error>} Promesa que resuelve cuando se envía la notificación o devuelve un error.
 */
const sendAppleNotifications = async (token, payload) => {
  try {
    const options = {
      token: {
        key: apple.file,
        keyId: apple.key,
        teamId: apple.team
      },
      production: apple.isProduction
    };

    const apnProvider = new apn.Provider(options);

    const notification = new apn.Notification();
    notification.expiry = generateTime(7);
    notification.badge = 1;
    notification.sound = 'ping.aiff';
    notification.alert = payload.mensaje;
    notification.payload = payload;
    notification.topic = apple.bundle;

    const { sent: notificationSent, failed: notificationFailed } = await apnProvider.send(notification, token);
    const [sent] = notificationSent;
    const [failed] = notificationFailed;

    if (failed) {
      const { response } = failed;
      if (response != null && response.reason === 'BadDeviceToken') {
        await deleteToken(token, 'iOS');
      }
      apnProvider.shutdown();
      return new Error('No evio');
    }

    apnProvider.shutdown();
    return {
      message: `Se pudo enviar la notificacion ${new Date()}`,
      payload: {
        sent
      }
    };
  } catch (error) {
    handleError(error);
  }
};

module.exports = { sendAppleNotifications };
