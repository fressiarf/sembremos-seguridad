const UsuarioLocal = require('../../models/muni/UsuarioLocal');
const UsuarioFP = require('../../models/msp/UsuarioFP');

class UserController {
  async getAllUsers(req, res) {
    try {
      const muniUsers = await UsuarioLocal.findAll();
      const mspUsers = await UsuarioFP.findAll();

      const formattedMuni = muniUsers.map(u => ({
        id: u.id,
        usuario: u.email,
        password: u.password_hash,
        nombre: u.nombre,
        rol: 'municipalidad',
        institucion: 'Municipalidad',
        tipo: 'MUNI'
      }));

      const formattedMSP = mspUsers.map(u => ({
        id: u.id,
        usuario: u.email,
        password: u.password_hash,
        nombre: u.nombre,
        rol: 'admin',
        institucion: 'Ministerio de Seguridad Pública',
        tipo: 'MSP'
      }));

      return res.status(200).json([...formattedMuni, ...formattedMSP]);
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
