export const verificarSesion = (req, res, next) => {
  if (req.session && req.session.usuarioId) {
    return next();
  }
  return res.status(401).json({ error: 'No autorizado. Sesión expirada o no iniciada.' });
};