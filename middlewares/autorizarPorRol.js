// middlewares/autorizarPorRol.js
module.exports = function autorizarPorRol(...rolesPermitidos) {
return (req, res, next) => {
  const usuario = req.usuario;
  
  if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. No tienes los permisos necesarios.'
    });
  }

  next();
};
};
