const config = require('../src/config');
const { Socket, Server } = require('socket.io');
const { usuariosConectados } = require('../clases/usuarios-lista');
const axios = require('axios');

const configurarUsuario = (cliente, io) => {
  cliente.on('configurar-usuario', (payload, callback) => {
    console.log(
      `[Configurar Usuario] Se configura el usuario ${payload.usuarioId} para las cotizaciones ${chalk.yellow(`[${payload.cotizacionesId.join(',')}]`)}`
    );

    // Actualizar usuario con sus múltiples cotizaciones
    usuariosConectados.actualizarUsuario(cliente.id, payload.usuarioId, payload.cotizacionesId);

    // Unirse a cada cotización
    const { cotizacionesId: cotizaciones } = payload;
    cotizaciones.forEach((c) =>
      console.log(
        `[Configurar Usuario] Uniendose a cotización '${c}'`
      )
    );
    cotizaciones.forEach((c) => cliente.join(`'${c}'`));

    io.emit('usuarios-activos', { usuarios: usuariosConectados.getLista() });

    callback({
      ok: true,
      mensaje: `Usuario ${payload.usuarioId}, configurado`
    });
  });
};

const obtenerUsuarios = (cliente, io) => {
  cliente.on('obtener-usuarios', () => {
    io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
  });
};

module.exports = { configurarUsuario, obtenerUsuarios };
