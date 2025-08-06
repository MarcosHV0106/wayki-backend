const { Usuario } = require('../models');

// GET: Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// POST: Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { nombre, email, rol, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ nombre, email, rol, password: hashedPassword });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};


// PUT: Actualizar un usuario por ID
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

// DELETE: Eliminar un usuario por ID
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar usuario' });
  }
};

// POST: Registro de usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, email, rol, password } = req.body;

  try {
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({ nombre, email, rol, password: hashedPassword });

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token (puedes usar esto desde ya)
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET || 'secreto', // asegura que JWT_SECRET esté definido
      { expiresIn: '1d' }
    );

    res.json({ mensaje: 'Login exitoso', token, usuario });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};




