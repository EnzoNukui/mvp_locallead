function obterIconePorDescricao(descricao) {
    const texto = descricao.toLowerCase();

    if (texto.includes("thunder") || texto.includes("storm")) {
        return "⛈️";
    }

    if (texto.includes("rain") || texto.includes("drizzle") || texto.includes("shower")) {
        return "🌧️";
    }

    if (texto.includes("fog") || texto.includes("mist")) {
        return "🌫️";
    }

    if (texto.includes("cloud") || texto.includes("overcast")) {
        return "☁️";
    }

    if (texto.includes("sun") || texto.includes("clear")) {
        return "☀️";
    }

    return "🌤️";
}

async function buscarClima(lat, lon) {
    const url = `https://wttr.in/${lat},${lon}?format=j1`;

    const resposta = await fetch(url, {
        headers: {
            "User-Agent": "LocalLead-MVP"
        }
    });

    if (!resposta.ok) {
        throw new Error(`Erro wttr.in: ${resposta.status}`);
    }

    const dados = await resposta.json();

    const climaAtual = dados.current_condition[0];

    const temperatura = Number(climaAtual.temp_C);
    const chuvaAgora = Number(climaAtual.precipMM || 0);
    const descricao = climaAtual.weatherDesc[0].value;

    const horasHoje = dados.weather[0].hourly.slice(0, 6);

    const maiorProbabilidade = Math.max(
        ...horasHoje.map(hora => Number(hora.chanceofrain || 0))
    );

    let riscoAtraso = "baixo";
    let mensagem = "Clima normal, sem previsões para atrasos.";

    if (maiorProbabilidade >= 70 || chuvaAgora > 5) {
        riscoAtraso = "alto";
        mensagem = "Chuva forte prevista. Possível impacto na operação.";
    } else if (maiorProbabilidade >= 40 || chuvaAgora > 0) {
        riscoAtraso = "moderado";
        mensagem = "Chance de chuva. Acompanhe possíveis alterações.";
    }

    return {
        temperatura,
        chuvaAgora,
        maiorProbabilidade,
        riscoAtraso,
        mensagem,
        icone: obterIconePorDescricao(descricao),
        descricao,
        codigoClima: climaAtual.weatherCode,
        fonte: "wttr.in"
    };
}