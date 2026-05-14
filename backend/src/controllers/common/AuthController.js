const authHelper = require('../../common/helpers/authHelper');
const tokenService = require('../../common/services/tokenService');
const UsuarioFP = require('../../models/msp/UsuarioFP');
const UsuarioLocal = require('../../models/muni/UsuarioLocal');
const RolFP = require('../../models/msp/RolFP');
const RolLocal = require('../../models/muni/RolLocal');

class AuthController {
  /**
   * Procesa el inicio de sesión para MSP o MUNI
   */
  async login(req, res) {
    try {
      const { email, password, nivel } = req.body;

      // 1. Validaciones básicas
      if (!email || !password || !nivel) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Email, password y nivel (MSP/MUNI) son obligatorios' 
        });
      }

      const nivelUpper = nivel.toUpperCase();

      // 2. Seleccionar modelo y asociación de rol según el nivel
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;
      const RoleModel = nivelUpper === 'MSP' ? RolFP : RolLocal;
      
      // 3. Buscar usuario incluyendo su rol
      const user = await UserModel.findOne({ 
        where: { email, activo: true },
        include: [{ model: RoleModel, as: 'rol' }]
      });
      
      // 4. Verificación de seguridad (Usuario existe)
      if (!user) {
        return res.status(401).json({ 
          status: 'fail', 
          message: 'Credenciales inválidas o acceso denegado' 
        });
      }

      // 5. Comparación de contraseña (Bcrypt)
      const isMatch = await authHelper.comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ 
          status: 'fail', 
          message: 'Credenciales inválidas o acceso denegado' 
        });
      }

      // 6. Generar JWT (Premium)
      // Se pasa el nombre del rol para que el token contenga el string (ej: 'ADMIN_MSP')
      const userPayload = {
        id: user.id,
        email: user.email,
        rol: user.rol ? user.rol.nombre : (nivelUpper === 'MSP' ? 'admin' : 'municipalidad'), // Nombres compatibles
        nivel: nivelUpper
      };
      
      const token = tokenService.generateToken(userPayload, nivelUpper);

      // 7. Configuración de Cookie HTTP-Only (Seguridad Máxima)
      // Calculamos maxAge basado en JWT_EXPIRES_IN (asumiendo formato simple como '1h', '2h', etc.)
      const expiresConfig = process.env.JWT_EXPIRES_IN || '2h';
      const hours = parseInt(expiresConfig);
      const maxAge = hours * 60 * 60 * 1000;

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', // Prevención estricta de CSRF
        maxAge: maxAge
      };

      res.cookie('token', token, cookieOptions);

      // 8. Respuesta Final JSON (Sin token en el cuerpo)
      return res.status(200).json({
        status: 'success',
        message: 'Sesión iniciada correctamente',
        data: {
          user: {
            nombre: `${user.nombre} ${user.apellido}`,
            rol: user.rol ? user.rol.nombre : 'N/A',
            nivel: nivelUpper
          }
        }
      });

    } catch (error) {
      console.error('Error crítico en Login:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error interno del servidor al procesar la autenticación' 
      });
    }
  }

  /**
   * Cierra la sesión eliminando la cookie del navegador
   */
  async logout(req, res) {
    try {
      // Limpiar la cookie con las mismas opciones base (excepto maxAge/expires)
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      return res.status(200).json({ 
        status: 'success', 
        message: 'Sesión cerrada correctamente' 
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Error al cerrar sesión' });
    }
  }

  /**
   * Endpoint de prueba para hashear una contraseña.
   */
  async testHash(req, res) {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ status: 'fail', message: 'Debe proporcionar una password' });
      }

      const hash = await authHelper.hashPassword(password);
      return res.status(200).json({
        status: 'success',
        data: {
          original: password,
          hashed: hash
        }
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /**
   * Endpoint de prueba para comparar una contraseña con un hash.
   */
  async testCompare(req, res) {
    try {
      const { password, hash } = req.body;
      if (!password || !hash) {
        return res.status(400).json({ status: 'fail', message: 'Debe proporcionar password y hash' });
      }

      const match = await authHelper.comparePassword(password, hash);
      return res.status(200).json({
        status: 'success',
        data: {
          match: match
        }
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
  /**
   * Registra un nuevo usuario en el sistema (MSP o MUNI)
   */
  async register(req, res) {
    try {
      const { 
        nombre, 
        apellido, 
        cedula, 
        email, 
        password, 
        nivel, 
        role, 
        institucion_id 
      } = req.body;

      // 1. Validaciones de presencia
      if (!nombre || !apellido || !cedula || !email || !password || !nivel || !role) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Todos los campos (nombre, apellido, cedula, email, password, nivel, role) son obligatorios' 
        });
      }

      const nivelUpper = nivel.toUpperCase();
      const roleUpper = role.toUpperCase();

      // 2. Validación de coherencia Rol-Nivel
      const rolesValidosMSP = ['ADMIN_MSP', 'OFICIAL_MSP'];
      const rolesValidosMUNI = ['ADMIN_MUNI', 'GESTOR_MUNI'];

      if (nivelUpper === 'MSP' && !rolesValidosMSP.includes(roleUpper)) {
        return res.status(400).json({ 
          status: 'fail', 
          message: `El rol '${role}' no es válido para el nivel MSP` 
        });
      }

      if (nivelUpper === 'MUNI' && !rolesValidosMUNI.includes(roleUpper)) {
        return res.status(400).json({ 
          status: 'fail', 
          message: `El rol '${role}' no es válido para el nivel MUNI` 
        });
      }

      // 3. Seleccionar modelo según el nivel
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

      // 6. Hashing de contraseña
      const password_hash = await authHelper.hashPassword(password);

      // 7. Mapeo de Roles a IDs (Basado en la estructura del sistema)
      // Nota: En una implementación ideal esto se consultaría en la tabla de roles,
      // pero para el registro inicial usamos el mapeo directo.
      let rol_id = 1; // Default Admin
      if (roleUpper === 'OFICIAL_MSP' || roleUpper === 'GESTOR_MUNI') {
        rol_id = 2; // Operativo
      }

      // 8. Creación del registro
      const newUser = await UserModel.create({
        nombre,
        apellido,
        cedula,
        email,
        password_hash,
        rol_id,
        institucion_id: institucion_id || null,
        activo: true
      });

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
      console.error('Error en Register:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error interno del servidor al procesar el registro' 
      });
    }
  }
  /**
   * Obtiene el perfil del usuario actual basado en el token JWT.
   * Utilizado para persistencia de sesión en el frontend.
   */
  async getCurrentUser(req, res) {
    try {
      // 1. El ID y Nivel vienen del middleware de autenticación
      const { id, nivel } = req.user;

      // 2. Seleccionar modelo y rol según el nivel
      const nivelUpper = nivel.toUpperCase();
      const UserModel = nivelUpper === 'MSP' ? UsuarioFP : UsuarioLocal;
      const RoleModel = nivelUpper === 'MSP' ? RolFP : RolLocal;

      // 3. Consultar base de datos para asegurar que el usuario aún existe y está activo
      const user = await UserModel.findOne({
        where: { id, activo: true },
        include: [{ model: RoleModel, as: 'rol' }],
        attributes: ['id', 'nombre', 'apellido', 'email'] // No traer el hash
      });

      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'El usuario ya no existe o ha sido desactivado'
        });
      }

      // 4. Respuesta exitosa con el perfil verificado
      return res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            nombre: `${user.nombre} ${user.apellido}`,
            email: user.email,
            rol: user.rol ? user.rol.nombre : 'N/A',
            nivel: nivelUpper
          }
        }
      });

    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error al recuperar el perfil del usuario'
      });
    }
  }
}

module.exports = new AuthController();
