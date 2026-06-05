const express = require("express");

const {
    buscarClima
} = require("../services/clima.service");

const router = express.Router();

router.get("/clima", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                erro: "Informe lat e lon"
            });
        }

        const clima = await buscarClima(lat, lon);

        res.json(clima);

    } catch (erro) {
        console.error("Erro completo na rota /clima:", erro);

        res.json({
            temperatura: "--",
            chuvaAgora: 0,
            maiorProbabilidade: 0,
            riscoAtraso: "indisponível",
            mensagem: "Não foi possível consultar o clima no momento.",
            icone: "🌤️",
            descricao: "Clima indisponível",
            codigoClima: null
        });
    }
});

module.exports = router;