function obterHoraAtual() {
    return new Date().getHours();
}

function buscarLotacaoPorHorario(linha) {
    const hora = obterHoraAtual();

    let nivel = "baixa";
    let mensagem = "Fluxo tranquilo neste horário.";

    if (hora >= 5 && hora < 6) {
        nivel = "moderada";
        mensagem = "Fluxo começando a aumentar.";
    }

    if (hora >= 6 && hora < 9) {
        nivel = "alta";
        mensagem = "Horário de pico. Expectativa de maior lotação.";
    }

    if (hora >= 9 && hora < 16) {
        nivel = "moderada";
        mensagem = "Fluxo intermediário durante o dia.";
    }

    if (hora >= 16 && hora < 20) {
        nivel = "alta";
        mensagem = "Horário de pico no retorno para casa.";
    }

    if (hora >= 20 || hora < 5) {
        nivel = "baixa";
        mensagem = "Fluxo reduzido neste horário.";
    }

    return {
        linha,
        nivel,
        mensagem
    };
}

module.exports = {
    buscarLotacaoPorHorario
};