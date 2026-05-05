// MANTER NESTE CÓDIGO SOMENTE FUNÇÕES E VARIÁVEIS QUE SÃO USADAS EM MAIS DE UMA PÁGINA,
// CASO CONTRÁRIO, COLOQUE O CÓDIGO NA RESPECTIVA PÁGINA HTML

(function () {
    const menuToggle = document.getElementById('menuToggle');
    const menuPrincipal = document.getElementById('menuPrincipal');

    if (!menuToggle || !menuPrincipal) {
        return;
    }

    menuToggle.addEventListener('click', function () {
        const aberto = menuPrincipal.classList.toggle('ativo');
        menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    menuPrincipal.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menuPrincipal.classList.remove('ativo');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menuPrincipal.classList.remove('ativo');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
})();
