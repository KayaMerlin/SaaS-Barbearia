class UploadController {
    async uploadImagem(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ erro: 'Nenhuma imagem foi enviada.' });
            }

            const urlImagem = `http://localhost:4000/files/${req.file.filename}`;

            return res.json({
                mensagem: 'Upload realizado com sucesso!',
                url: urlImagem,
                nomeArquivo: req.file.filename
            });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro interno no upload.' });
        }
    }
}

module.exports = new UploadController();
