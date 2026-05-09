document.addEventListener('DOMContentLoaded', () => {
    let questaoAtual = 6; 
    const totalQuestoes = 10;

    const elementoTexto = document.getElementById('texto-progresso');
    const elementoBarra = document.getElementById('progresso-dinamico');
    const botaoConfirmar = document.querySelector('.confirmar');

    function atualizarInterface() {
        // Atualiza o texto
        elementoTexto.innerText = `QUESTÃO ${questaoAtual} DE ${totalQuestoes}`;
        
        // Cálculo matemático: como a questão é de 1 a 10, a largura deve ser exatamente 10%
        const porcentagem = (questaoAtual / totalQuestoes) * 100;
        elementoBarra.style.width = `${porcentagem}%`;
    }

    // Inicializa a barra corretamente ao abrir a página
    atualizarInterface();

    if (botaoConfirmar) {
        botaoConfirmar.addEventListener('click', () => {
            if (questaoAtual < totalQuestoes) {
                questaoAtual++;
                atualizarInterface();
            } else {
                console.log("Fim do questionário!");
            }
        });
    }
});
