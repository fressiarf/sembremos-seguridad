const authHelper = require('../../common/helpers/authHelper');
const tokenService = require('../../common/services/tokenService');
const { UsuarioFP, UsuarioLocal, RolFP, RolLocal } = require('../../models');
const { Op } = require('sequelize');

class AuthController {
  /**
   * Procesa el inicio de sesión para MSP o MUNI.
   */
  async login(req, res) {
    try {
      const { identificador, email, password, nivel, metodo } = req.body;
      const username = (identificador || email || '').trim();

      if (!username || !password || !nivel) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Identificador, contraseña y nivel son obligatorios' 
        });
      }

      const nivelUpper = nivel.toUpperCase();
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;
      const RoleModel = nivelUpper === 'MSP' ? RolFP : RolLocal;
      
      const isEmail = username.includes('@');
      const whereCondition = isEmail
        ? { email: username, activo: true }
        : { cedula: username, activo: true };

      let user = await UserModel.findOne({ 
        where: whereCondition,
        include: [{ model: RoleModel, as: 'rol' }]
      });

      let finalNivel = nivelUpper;

      if (!user) {
        const fallbackNivel = nivelUpper === 'MSP' ? 'MUNI' : 'MSP';
        const FallbackUserModel = fallbackNivel === 'MSP' ? UsuarioFP : UsuarioLocal;
        const FallbackRoleModel = fallbackNivel === 'MSP' ? RolFP : RolLocal;

        user = await FallbackUserModel.findOne({
          where: whereCondition,
          include: [{ model: FallbackRoleModel, as: 'rol' }]
        });

        if (user) finalNivel = fallbackNivel;
      }
      
      if (!user) {
        return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
      }

      const isMatch = await authHelper.comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
      }

      const rolFrontend = mapRole(user.rol?.nombre, finalNivel);

      const userPayload = {
        id: user.id,
        email: user.email,
        rol: rolFrontend,
        nivel: finalNivel
      };
      
      const token = tokenService.generateToken(userPayload, finalNivel);
      const expiresConfig = process.env.JWT_EXPIRES_IN || '2h';
      const maxAge = parseInt(expiresConfig) * 60 * 60 * 1000;

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict',
        maxAge: maxAge
      });

      return res.status(200).json({
        status: 'success',
        message: 'Sesión iniciada correctamente',
        data: {
          user: {
            id: user.id,
            nombre: `${user.nombre} ${user.apellido}`,
            cedula: user.cedula,
            email: user.email,
            rol: rolFrontend,
            nivel: finalNivel
          }
        }
      });
    } catch (error) {
      console.error('Error crítico en Login:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async testHash(req, res) {
    try {
      const { password } = req.body;
      const hash = await authHelper.hashPassword(password);
      return res.status(200).json({ status: 'success', data: { hashed: hash } });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async testCompare(req, res) {
    try {
      const { password, hash } = req.body;
      const match = await authHelper.comparePassword(password, hash);
      return res.status(200).json({ status: 'success', data: { match } });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      return res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Error al cerrar sesión' });
    }
  }

  async register(req, res) {
    try {
      const { nombre, apellido, cedula, email, password, nivel, role, institucion_id } = req.body;
      if (!nombre || !apellido || !cedula || !email || !password || !nivel || !role) {
        return res.status(400).json({ status: 'fail', message: 'Campos incompletos' });
      }

      const nivelUpper = nivel.toUpperCase();
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;
      
      let rol_id = 4;
      if (nivelUpper === 'MSP') {
        if (role === 'admin') rol_id = 1;
        else if (role === 'adminInstitucion') rol_id = 2;
      } else {
        if (role === 'municipalidad') rol_id = 1;
        else if (role === 'institucion') rol_id = 2;
      }

      const newUser = await UserModel.create({
        nombre, apellido, cedula, email, password, rol_id,
        institucion_id: institucion_id || null,
        activo: true
      });

      return res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const { id, nivel } = req.user;
      const nivelUpper = nivel.toUpperCase();
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;
      const RoleModel = nivelUpper === 'MSP' ? RolFP : RolLocal;

      const user = await UserModel.findOne({
        where: { id, activo: true },
        include: [{ model: RoleModel, as: 'rol' }],
        attributes: ['id', 'nombre', 'apellido', 'email', 'cedula']
      });

      if (!user) {
        return res.status(401).json({ status: 'fail', message: 'Usuario no encontrado' });
      }

      const rolFrontend = mapRole(user.rol?.nombre, nivelUpper);

      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            nombre: `${user.nombre} ${user.apellido}`,
            cedula: user.cedula,
            email: user.email,
            rol: rolFrontend,
            nivel: nivelUpper
          }
        }
      });
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

/**
 * Mapea el nombre del rol en la base de datos al rol esperado por el frontend (RBAC).
 */
function mapRole(dbRolNombre, nivel) {
  let rolFrontend = 'institucion'; // Default seguro
  const nombre = (dbRolNombre || '').trim();

  if (nivel === 'MSP') {
    if (nombre === 'SuperAdmin') rolFrontend = 'admin';
    else if (nombre === 'Admin Institucional') rolFrontend = 'adminInstitucion';
    else if (nombre === 'Analista') rolFrontend = 'lector';
    else if (nombre === 'Operativo') rolFrontend = 'institucion';
  } else {
    if (nombre === 'Admin Municipal') rolFrontend = 'municipalidad';
    else if (nombre === 'Gestor Actividades') rolFrontend = 'institucion';
    else if (nombre === 'Visualizador') rolFrontend = 'lector';
  }
  return rolFrontend;
}

module.exports = new AuthController();
