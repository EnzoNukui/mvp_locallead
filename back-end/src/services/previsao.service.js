const {
    gtfs,
    buscarTripPorLinhaEDestino
} = require("./gtfs.service");

const intervalosFimSemana =
    require("../../data/tabelas/intervalos-fim-semana");

function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":");
    return Number(h) * 60 + Number(m);
}

function minutosParaHorario(minutos) {
    const h = Math.floor(minutos / 60).toString().padStart(2, "0");
    const m = Math.floor(minutos % 60).toString().padStart(2, "0");

    return `${h}:${m}`;
}

function obterTipoDia() {

    const hoje = new Date().getDay();

    if (hoje === 0) {
        return "domingo";
    }

    if (hoje === 6) {
        return "sabado";
    }

    return "util";
}

function buscarFaixaFimSemana(
    linha,
    minutosAgora
) {

    const tipoDia = obterTipoDia();

    if (tipoDia === "util") {
        return null;
    }

    const tabelaLinha =
        intervalosFimSemana[linha];

    if (!tabelaLinha) {
        return null;
    }

    const faixas =
        tabelaLinha[tipoDia];

    if (!faixas) {
        return null;
    }

    return faixas.find(faixa => {

        const inicio =
            horarioParaMinutos(faixa.inicio);

        const fim =
            horarioParaMinutos(faixa.fim);

        return (
            minutosAgora >= inicio &&
            minutosAgora <= fim
        );
    });
}

function buscarProximosTrens(linha, estacao, destino) {
    const trip = buscarTripPorLinhaEDestino(linha, destino);

    if (!trip) {
        throw new Error("Viagem não encontrada");
    }

    const tripId = trip[2];

    const agora = new Date();

    const minutosAgora =
        agora.getHours() * 60 +
        agora.getMinutes();

    const frequenciaAtual = gtfs.frequencias.find(freq => {
        const freqTripId = freq[0];
        const inicio = horarioParaMinutos(freq[1]);
        const fim = horarioParaMinutos(freq[2]);

        return (
            freqTripId === tripId &&
            minutosAgora >= inicio &&
            minutosAgora <= fim
        );
    });

    if (!frequenciaAtual) {
        return {
            linha,
            estacao,
            destino,
            operandoAgora: false,
            mensagem: "Não há frequência programada para este horário.",
            proximos: []
        };
    }

    const intervaloMinutos =
        Number(frequenciaAtual[3]) / 60;

    const inicioFaixa = horarioParaMinutos(frequenciaAtual[1]);
    const fimFaixa = horarioParaMinutos(frequenciaAtual[2]);

    const proximos = [];

    for (
        let horario = inicioFaixa;
        horario <= fimFaixa;
        horario += intervaloMinutos
    ) {
        if (horario >= minutosAgora) {
            proximos.push({
                chegaEm: Math.round(horario - minutosAgora),
                horarioEstimado: minutosParaHorario(horario)
            });
        }

        if (proximos.length === 3) {
            break;
        }
    }

    return {
        linha,
        estacao,
        destino,
        operandoAgora: true,
        intervaloMinutos,
        proximos
    };
}

module.exports = {
    buscarProximosTrens
};