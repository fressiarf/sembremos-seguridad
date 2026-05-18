const authHelper = require('../../common/helpers/authHelper');
const validationHelper = require('../../common/helpers/validationHelper');
const tokenService = require('../../common/services/tokenService');
const UsuarioFP = require('../../models/msp/UsuarioFP');
const UsuarioLocal = require('../../models/muni/UsuarioLocal');
const RolFP = require('../../models/msp/RolFP');
const RolLocal = require('../../models/muni/RolLocal');

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
      let finalNivel = nivelUpper;
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;
      const RoleModel = nivelUpper === 'MSP' ? RolFP : RolLocal;
      
      // 3. Buscar usuario incluyendo su rol
      let user = await UserModel.findOne({ 
        where: { email, activo: true },
        include: [{ model: RoleModel, as: 'rol' }]
      });
      
      // 4. Verificación de seguridad (Usuario existe)
      if (!user) {
        const fallbackNivel = nivelUpper === 'MSP' ? 'MUNI' : 'MSP';
        const FallbackUserModel = fallbackNivel === 'MSP' ? UsuarioFP : UsuarioLocal;
        const FallbackRoleModel = fallbackNivel === 'MSP' ? RolFP : RolLocal;

        user = await FallbackUserModel.findOne({
          where: { email, activo: true },
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
            nivel: finalNivel,
            institucion: user.institucion?.nombre || null,
            institucion_id: user.institucion_id
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

      // 1.1 Validación de formato de Cédula (Costa Rica - 9 dígitos)
      if (!validationHelper.isValidCedula(cedula)) {
        return res.status(400).json({
          status: 'fail',
          message: 'El formato de la cédula es inválido. Debe contener 9 dígitos numéricos (ej: 102340567).'
        });
      }

      const nivelUpper = nivel.toUpperCase();
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;

      // 4. Verificar duplicados por Email
      const existingEmail = await UserModel.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'El correo electrónico ya se encuentra vinculado a una cuenta' 
        });
      }

      // 5. Verificar duplicados por Cédula (Buena práctica de Senior)
      const existingCedula = await UserModel.findOne({ where: { cedula } });
      if (existingCedula) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'La cédula ya se encuentra registrada en el sistema' 
        });
      }

      // 6. La contraseña se enviará al campo VIRTUAL del modelo.
      //    El hook beforeCreate del modelo se encargará de hashearla automáticamente.

      // 7. Mapeo de Roles a IDs (Basado en la estructura del sistema)
      // Nota: En una implementación ideal esto se consultaría en la tabla de roles,
      // pero para el registro inicial usamos el mapeo directo.
      let rol_id = 1; // Default Admin
      if (roleUpper === 'OFICIAL_MSP' || roleUpper === 'GESTOR_MUNI') {
        rol_id = 2; // Operativo
      }

      // 8. Creación del registro (password va al campo VIRTUAL, el hook genera password_hash)
      const newUser = await UserModel.create({
        nombre,
        apellido,
        cedula,
        email,
        password,
        rol_id,
        institucion_id: institucion_id || null,
        activo: true
      }, nivelUpper);

      // 9. Respuesta exitosa
      return res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: newUser.id,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            email: newUser.email,
            cedula: newUser.cedula,
            nivel: nivelUpper,
            role: roleUpper
          }
        }
      });

    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const { id, nivel } = req.user;

      // 2. Seleccionar modelo y rol según el nivel
      const nivelUpper = nivel.toUpperCase();

      // 3. Consultar base de datos para asegurar que el usuario aún existe y está activo
      const user = await UserModel.findOne({
        where: { id, activo: true },
        include: [{ model: RoleModel, as: 'rol' }],
        attributes: ['id', 'nombre', 'apellido', 'email'] // No traer el hash
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
            nivel: nivelUpper,
            institucion: user.institucion?.nombre || null,
            institucion_id: user.institucion_id
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
