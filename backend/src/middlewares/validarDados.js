const validarDados = (schema) => {
    return (req, res, next) => {
        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {
            const errosFlatten = resultado.error.flatten();

            return res.status(400).json({
                mensagem: "Erro ao validar dados",
                erros: errosFlatten
            });
        }

        next();
    }
}

module.exports = validarDados;