const config = require('../src/config');
const { Socket, Server } = require('socket.io');
const { usuariosConectados } = require('../clases/usuarios-lista');
const { generarMensajes } = require('../utils/generar-mensajes');
const { sendNotification } = require('../src/lib');
const axios = require('axios');

const creaNotificacion = async (cliente, io) => {
  cliente.on('crea-notificacion', async (payload) => {
    console.log('[Crea Notificación] Se creará una notificación para el usuario ' + payload.destino + ':');
    console.log(payload);

    try {
      // Crear la notificación
      const { data } = await axios.post(
        `${config.api}/api/notifications`,
        payload
      );
      console.log('[Crea Notificación] Notificación recién creada.:');

      // ¿Se puede enviar a través de APNs?
      const { tokens } = data.results;
      if (tokens.length > 0) {
        for (let i = 0; i < tokens.length; i++) {
          const tipo = tokens[i].tipo;
          const token = tokens[i].token;
          const mensaje = generarMensajes(payload);
          await sendNotification(tipo, token, mensaje).catch((error) =>
            console.error(error)
          );
        }
      }

      let usuariosFiltrados;
      const solicitaCertificacion = 5;
      if (payload.tipo === solicitaCertificacion) {
        const { destino } = data.results;
        usuariosFiltrados = usuariosConectados.getUsuarioByDbId(destino);
        if (usuariosFiltrados == null) usuariosFiltrados = [];
      } else {
        usuariosFiltrados = usuariosConectados.getUsuarioByDbId(payload.destino);
        if (usuariosFiltrados == null) usuariosFiltrados = [];
      }
      if (usuariosFiltrados != null) {
        for (let i = 0; i < usuariosFiltrados.length; i++) {
          const userID = usuariosFiltrados[i].id;
          console.log('[Crea Notificación] Enviando evento a ' + userID);
          io.to(userID).emit('notificacion-creada', {
            error: false,
            mensaje: 'Se creo una nueva notificacion',
            data: payload
          });
        }
      }
    } catch (error) {
      console.log('[Crea Notificación] No fue posible crear una notificación:');
      io.to(cliente.id).emit('notificacion-creada', {
        error: true,
        mensaje: 'No se pudo crear una nueva notificacion',
        data: null
      });
    }
  });
};

module.exports = { creaNotificacion };
