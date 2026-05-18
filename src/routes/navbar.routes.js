const express = require('express');
const router = express.Router();

const {
    verificarBarraDesbloqueada,
    desbloquearBarraNavegacao
} = require('../repositories/usuarios.repositories');

const authMiddleware = require('../middlewares/auth.middleware');

/**
 * GET /api/navbar/status
 */
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const barraDesbloqueada = await verificarBarraDesbloqueada(req.usuario.id_usuario);

        res.json({
            sucesso: true,
            barra_desbloqueada: barraDesbloqueada
        });
    } catch (erro) {
        console.error('Erro ao verificar status da navbar:', erro);
        res.status(500).json({
            sucesso: false,
            error: 'Erro interno ao verificar status da navbar'
        });
    }
});

/**
 * POST /api/navbar/desbloquear
 */
router.post('/desbloquear', authMiddleware, async (req, res) => {
    try {
        await desbloquearBarraNavegacao(req.usuario.id_usuario);

        res.json({
            sucesso: true,
            mensagem: 'Navbar desbloqueada com sucesso'
        });
    } catch (erro) {
        console.error('Erro ao desbloquear navbar:', erro);
        res.status(500).json({
            sucesso: false,
            error: 'Erro interno ao desbloquear navbar'
        });
    }
});

module.exports = router;