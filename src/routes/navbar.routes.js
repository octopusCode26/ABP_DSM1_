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
        const resultado = await desbloquearBarraNavegacao(req.usuario.id_usuario);
        
        res.json({
            sucesso: true,
            dados: resultado,
            alerta: {
                mensagem: 'Barra de navegação inferior desbloqueada com sucesso! Olhe Abaixo para acessar as novas funcionalidades.',
                tipo: 'sucesso' // 'sucesso', 'erro', 'info', 'aviso'
            }
        });
    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            erro: erro.message,
            alerta: {
                mensagem: 'Erro ao desbloquear barra de navegação inferior',
                tipo: 'erro'
            }
        });
    }
});

module.exports = router;