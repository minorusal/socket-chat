const { usuariosConectados } = require('../clases/usuarios-lista');
const { Usuario } = require('../clases/usuario');
const { Socket } = require('socket.io');

const conectarCliente = (cliente) => {
  const usuario = new Usuario(cliente.id);
  usuariosConectados.agregar(usuario);
};

const desconectar = (cliente, io) => {
  cliente.on('disconnect', () => {
    console.log(`'[Cliente desconectado]')} ${cliente.id}`);
    usuariosConectados.borrarUsuario(cliente.id);
    io.emit('usuarios-activos', usuariosConectados.getLista());
  });
};

module.exports = { conectarCliente, desconectar };
