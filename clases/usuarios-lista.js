class UsuariosLista {
  constructor() {
    this.lista = [];
  }

  static getInstance() {
    return this.instance || (this.instance = new this());
  }

  agregar(usuario) {
    console.log(`'[Usuarios Lista]')} Agregando usuario:`, usuario);
    this.lista.push(usuario);
    return usuario;
  }

  actualizarUsuario(id, usuarioID, cotizaciones) {
    console.log(`'[Usuarios Lista]')} Actualizando usuario ${usuarioID} con múltiples cotizaciones.`);
    for (const usuario of this.lista) {
      if (usuario.id === id) {
        usuario.idDb = usuarioID;
        usuario.cotizaciones = [...cotizaciones];
        console.log(`'[Usuarios Lista]')} Usuario actualizado:`, usuario);
        break;
      }
    }
  }

  getLista() {
    return this.lista.filter((u) => u.idDb !== null);
  }

  getUsuario(id) {
    console.log(`'[Usuarios Lista]')} Obteniendo usuario con client ID: ${id}`);
    return this.lista.find((u) => u.id === id);
  }

  borrarUsuario(id) {
    const tempUser = this.getUsuario(id);
    this.lista = this.lista.filter((u) => u.id !== id);
    return tempUser;
  }

  getUsuarioByDbId(id) {
    console.log(`'[Usuarios Lista]')} Obteniendo usuarios con ID: ${id}`);
    return this.lista.filter((u) => u.idDb == id);
  }
}

module.exports = { usuariosConectados: UsuariosLista.getInstance() };
