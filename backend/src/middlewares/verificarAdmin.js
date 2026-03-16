const verificarAdmin = (req, res, next) => {
    if (req.usuario?.role !== 'ADMIN') {
        return res.status(403).json({ erro: 'Acesso negado. Somente administrador.', codigo: 'NAO_ADMIN' });
    }
    next();
};

module.exports = verificarAdmin;
