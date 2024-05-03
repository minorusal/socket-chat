const { conectarCliente, desconectar } = require('../sockets/conections');
const chatQuote = require('../sockets/chatQuote');
const users = require('../sockets/users');
const quotes = require('../sockets/quotes');
const notification = require('../sockets/notification');
const chatCompany = require('../sockets/chatCompany');
const mediaConvert = require('../sockets/mediaConvert');


const escucharSockets = (io) => {
    io.on('connection', (cliente) => {
      console.log('¡Un cliente se ha conectado!');
      conectarCliente(cliente)

      chatQuote.mensaje(cliente, io)

      chatQuote.eliminar(cliente, io)
      
      users.configurarUsuario(cliente, io)
      
      quotes.cambiaEstatus(cliente, io)

      quotes.creaCotizacion(cliente, io)

      quotes.creaCotizacionHija(cliente, io)

      notification.creaNotificacion(cliente, io)

      chatCompany.enviaMensajeChatEmpresa(cliente, io)

      users.obtenerUsuarios(cliente, io)

      mediaConvert.mediaConvert(cliente, io)
    
      desconectar(cliente, io)
      // Manejar la desconexión del cliente
      // cliente.on('disconnect', () => {
      //   console.log('¡Un cliente se ha desconectado!');
      // });
    });
  };
  
  module.exports = { escucharSockets };
  