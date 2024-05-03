const { Notificacion } = require('./notificaciones');

class Mensaje extends Notificacion {
  constructor() {
    super();
    this.mensaje = '';
    this.origen = null;
    this.destino = 0;
    this.tipo = 0;
    this.data = 0;
  }
}

module.exports = Mensaje;
