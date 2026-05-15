const { UsuarioFP, UsuarioLocal, RolFP, RolLocal, InstitucionMaestra } = require('../../models');

/**
 * Repository para la Entidad Usuario (UsuarioFP / UsuarioLocal)
 * Maneja la abstracción de consultas para ambos niveles del sistema.
 */
class UserRepository {
  /**
   * Busca un usuario por su Email en el nivel especificado
   */
  async findByEmail(email, nivel = 'MSP') {
    const UserModel = nivel.toUpperCase() === 'MSP' ? UsuarioFP : UsuarioLocal;
    const RoleModel = nivel.toUpperCase() === 'MSP' ? RolFP : RolLocal;

    return await UserModel.findOne({
      where: { email, activo: true },
      include: [{ model: RoleModel, as: 'rol' }],
      raw: true,
      nest: true
    });
  }

  /**
   * Busca un usuario por su Cédula en el nivel especificado
   */
  async findByCedula(cedula, nivel = 'MSP') {
    const UserModel = nivel.toUpperCase() === 'MSP' ? UsuarioFP : UsuarioLocal;
    const RoleModel = nivel.toUpperCase() === 'MSP' ? RolFP : RolLocal;

    return await UserModel.findOne({
      where: { cedula, activo: true },
      include: [{ model: RoleModel, as: 'rol' }],
      raw: true,
      nest: true
    });
  }

  /**
   * Busca un usuario por ID
   */
  async findById(id, nivel = 'MSP') {
    const UserModel = nivel.toUpperCase() === 'MSP' ? UsuarioFP : UsuarioLocal;
    const RoleModel = nivel.toUpperCase() === 'MSP' ? RolFP : RolLocal;

    return await UserModel.findByPk(id, {
      include: [
        { model: RoleModel, as: 'rol' },
        ...(nivel.toUpperCase() === 'MSP' ? [{ model: InstitucionMaestra, as: 'institucion' }] : [])
      ],
      raw: true,
      nest: true
    });
  }

  /**
   * Crea un nuevo usuario
   */
  async create(data, nivel = 'MSP') {
    const UserModel = nivel.toUpperCase() === 'MSP' ? UsuarioFP : UsuarioLocal;
    const user = await UserModel.create(data);
    return user.get({ plain: true });
  }

  /**
   * Verifica si una cédula ya existe en el nivel especificado
   */
  async existsByCedula(cedula, nivel = 'MSP') {
    const UserModel = nivel.toUpperCase() === 'MSP' ? UsuarioFP : UsuarioLocal;
    const count = await UserModel.count({ where: { cedula } });
    return count > 0;
  }
}

module.exports = new UserRepository();
