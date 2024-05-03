const config = require('../src/config');
const { Socket, Server } = require('socket.io');
const { usuariosConectados } = require('../clases/usuarios-lista');
const { generarMensajes } = require('../utils/generar-mensajes');
const { sendNotification } = require('../src/lib');
const axios = require('axios');
const { Usuario } = require('../clases/usuario');

const enviaMensajeChatEmpresa = async (cliente, io) => {
  cliente.on('envia-mensaje-chat-empresa', async (payload) => {
    try {
      console.log('[Mensaje chat empresa] Recibiendo información para crear mensaje de chat.');
      console.log('[Mensaje chat empresa] La información del payload es la siguiente:');
      console.log(`[Mensaje chat empresa] User: ${payload.user} | uuid: ${payload.uuid} | message: ${payload.message}`);

      // Enviar a través de la REST API un mensaje a la base de datos
      const { data: mensajeCreado } = await axios.post(
        `${config.api}/api/messages/message`,
        payload
      );
      const { users } = mensajeCreado.results;
      const { user } = payload;
      let destinatario;
      if (user === users.buyer) {
        destinatario = users.seller;
      } else {
        destinatario = users.buyer;
      }
      // Obtener detalles del usuario de la petición
      const usuario = usuariosConectados.getUsuario(cliente.id);
      if (usuario == null) return;
      console.log('[Mensaje chat empresa] Se emitirá un evento a todos los usuarios del destino ' + destinatario + ' y al usuario que creó el mensaje');

      let usuariosBuyer = usuariosConectados.getUsuarioByDbId(users.buyer) || [];
      let usuariosSeller = usuariosConectados.getUsuarioByDbId(users.seller) || [];
      const usuariosNotificacion = [...usuariosBuyer, ...usuariosSeller];

      console.log('[Mensaje chat empresa] Se emitirá un evento a los siguientes usuarios:');
      console.log(usuariosNotificacion);

      for (let i = 0; i < usuariosNotificacion.length; i++) {
        const userID = usuariosNotificacion[i].id;
        console.log('[Mensaje chat empresa] Emitiendo evento para usuario ' + userID);
        io.to(userID).emit('recibe-mensaje-chat-empresa', {
          error: false,
          mensaje: 'Se creo un nuevo mensaje en el chat de empresa',
          data: mensajeCreado
        });
      }
      // Obtener tokens de usuario
      const { data: tokensDeUsuarioRaw } = await axios.get(
        `${config.api}/api/tokens/user/${destinatario}`
      );
      const tokensDeUsuario = tokensDeUsuarioRaw.results.tokens;
      for (let i = 0; i < tokensDeUsuario.length; i++) {
        // Data se queda en 0 porque se necesita un number...
        const notificacion = {
          origen: usuario.idDb,
          destino: destinatario,
          tipo: 12,
          data: 0
        };
        const mensaje = generarMensajes(notificacion);
        const tipo = tokensDeUsuario[i].tipo;
        const token = tokensDeUsuario[i].token;

        await sendNotification(tipo, token, mensaje).catch((error) => {
          console.error(error);
        });
      }
    } catch (error) {
      console.log('[Mensaje chat empresa] Error:');
      console.log(error);
      io.to(cliente.id).emit('envia-mensaje-chat-empresa-error', {
        error: true,
        message: 'Error al enviar tu mensaje a traves de Axios'
      });
    }
  });
};

module.exports = { enviaMensajeChatEmpresa };
