const axios = require('axios');
const { generarMensajes } = require('../utils/generar-mensajes');
const { sendNotification } = require('../src/lib/index');
const config = require('../src/config');
const { usuariosConectados } = require('../clases/usuarios-lista');


// Crea mensaje de chat de cotización
const mensaje = async (cliente, io) => {
  cliente.on('mensaje', async (payload) => {
    console.log(`'[Mensaje recibido]')}:`, payload);

    let requestToApi = {};
    let responseApi = null;
    let usuarioEvento;
    let informacionOut;
    let payloadCotizacion;
    let userNotNull;
    let destinatarioOut;
    let tokensDeUsuarioOut;
    let mensajeOut;

    try {
      const a = {
        cotizacion: payload.cotizacion,
        usuario: Number(payload.de),
        comentario: payload.cuerpo,
        origen: Number(payload.origen)
      };

      requestToApi = a;

      console.log('Este es un request: ', JSON.stringify(payload));

      const { data } = await axios.post(
        `${config.api}/api/cotizacion/comentarios`,
        a
      );

      responseApi = data;
      console.log(responseApi)

      const { fecha_creacion, comentario_id } = data.results;

      // ¿Quién hizo el evento?
      const usuario = usuariosConectados.getUsuario(cliente.id);
      usuarioEvento = usuario;

      const informacion = {
        ...payload,
        fecha_creacion,
        comentario_id
      };

      informacionOut = informacion;
      console.log(
        `'[Mensaje]')} Se emitirá el evento a ${payload.cotizacion}`
      );

      payloadCotizacion = payload.cotizacion;
      io.to(`'${payload.cotizacion}'`).emit('mensaje-nuevo', informacion);

      if (usuario != null) {
        const { data: usuariosRaw } = await axios.get(
          `${config.api}/api/cotizacion/getUsuarios/${payload.cotizacion}`
        );
        userNotNull = usuariosRaw;
        const { usuarios } = usuariosRaw.results;

        let destinatario;
        if (usuario.idDb == usuarios.usuario_comprador) {
          destinatario = usuarios.usuario_vendedor;
        } else {
          destinatario = usuarios.usuario_comprador;
        }
        destinatarioOut = destinatario;
        // Obtener tokens de usuario
        const { data: tokensDeUsuarioRaw } = await axios.get(
          `${config.api}/api/tokens/user/${destinatario}`
        );

        tokensDeUsuarioOut = tokensDeUsuarioRaw;
        const tokensDeUsuario = tokensDeUsuarioRaw.results.tokens;
        for (let i = 0; i < tokensDeUsuario.length; i++) {
          const notificacion = {
            origen: usuario.idDb,
            destino: destinatario,
            tipo: 10,
            data: payload.cotizacion
          };
          const mensaje = generarMensajes(notificacion);

          mensajeOut = mensaje;
          const tipo = tokensDeUsuario[i].tipo;
          const token = tokensDeUsuario[i].token;
          await sendNotification(tipo, token, mensaje).catch((error) =>
            console.log(error)
          );
        }
      }
    } catch (error) {
      console.log(`'[Mensaje]' No se pudo enviar el mensaje. ${error}`);
      io.to(cliente.id).emit('mensaje-nuevo', {
        de: 'bot',
        requestToApi,
        responseApi,
        usuarioEvento,
        informacionOut,
        payloadCotizacion,
        userNotNull,
        destinatarioOut,
        tokensDeUsuarioOut,
        mensajeOut,
        cuerpo: `algo salio mal, error: ${JSON.stringify(error.message)}`
      });
    }
  });
};

// Eliminar mensaje de chat de cotización
const eliminar = async (cliente, io) => {
  cliente.on(
    'eliminar',
    async (payload) => {
      console.log(
        `'[Eliminar mensajes]')} ${payload.comentarios}`
      );
      console.log(payload);

      try {
        const { data } = await axios.delete(
          `${config.api}/api/cotizacion/comentarios`,
          {
            data: payload
          }
        );
        const { eliminados } = data;
        console.log(
          `'[Eliminar mensajes]')} Se eliminó el mensaje. Enviando evento a ${payload.cotizacion}`
        );
        io.to(`'${payload.cotizacion}'`).emit('mensaje-eliminado', {
          data: `Se eliminaron los mensajes ${eliminados}`,
          eliminados
        });
      } catch (error) {
        console.log(
          `${chalk.red('[Eliminar mensajes]')} No se pudo elimiminar el mensaje`
        );
        io.to(`'${payload.cotizacion}'`).emit('mensaje-eliminado', {
          data: `Error: No se eliminaron los mensajes ${payload.comentarios},`,
          eliminados: []
        });
      }
    }
  );
};

module.exports = { mensaje, eliminar };
