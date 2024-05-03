const { Socket, Server } = require('socket.io');

const mediaConvert = (cliente, io) => {
  cliente.on('mediaConvert-completed', async (data) => {
    console.log('Media convert ########:', data);
  });
};

module.exports = { mediaConvert };
