const axios = require("axios");

function interpretarClima(codigo) {
    if (codigo === 0) {
        return {
            icone: "☀️",
            descricao: "Céu limpo"
        };
    }

    if (codigo === 1) {
        return {
            icone: "🌤️",
            descricao: "Poucas nuvens"
        };
    }

    if (codigo === 2) {
        return {
            icone: "⛅",
            descricao: "Parcialmente nublado"
        };
    }

    if (codigo === 3) {
        return {
            icone: "☁️",
            descricao: "Nublado"
        };
    }

    if (
        codigo === 45 ||
        codigo === 48
    ) {
        return {
            icone: "🌫️",
            descricao: "Neblina"
        };
    }

    if (
        codigo >= 51 &&
        codigo <= 57
    ) {
        return {
            icone: "🌦️",
            descricao: "Garoa"
        };
    }

    if (
        codigo >= 61 &&
        codigo <= 67
    ) {
        return {
            icone: "🌧️",
            descricao: "Chuva"
        };
    }

    if (
        codigo >= 71 &&
        codigo <= 77
    ) {
        return {
            icone: "🌨️",
            descricao: "Neve"
        };
    }

    if (
        codigo >= 80 &&
        codigo <= 82
    ) {
        return {
            icone: "🌧️",
            descricao: "Pancadas de chuva"
        };
    }

    if (
        codigo >= 95
    ) {
        return {
            icone: "⛈️",
            descricao: "Tempestade"
        };
    }

    return {
        icone: "🌤️",
        descricao: "Condição variável"
    };
}

async function buscarClima(lat, lon) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain,weather_code&hourly=precipitation_probability,precipitation,rain&forecast_days=1&timezone=America%2FSao_Paulo`;

    const resposta = await axios.get(url);

    const dados = resposta.data;

    const temperatura = dados.current.temperature_2m;
    const chuvaAgora = dados.current.rain;
    const codigoClima = dados.current.weather_code;
    const climaInterpretado = interpretarClima(codigoClima);

    const probabilidades =
        dados.hourly.precipitation_probability.slice(0, 6);

    const maiorProbabilidade =
        Math.max(...probabilidades);

    let riscoAtraso = "baixo";
    let mensagem =
        "Clima normal, sem previsões para atrasos";

    if (maiorProbabilidade >= 70 || chuvaAgora > 5) {

        riscoAtraso = "alto";

        mensagem =
            "Chuva forte prevista. Possível impacto na operação.";

    } else if (
        maiorProbabilidade >= 40 ||
        chuvaAgora > 0
    ) {

        riscoAtraso = "moderado";

        mensagem =
            "Chance de chuva. Acompanhe possíveis alterações.";
    }

    return {
    temperatura,
    chuvaAgora,
    maiorProbabilidade,
    riscoAtraso,
    mensagem,
    icone: climaInterpretado.icone,
    descricao: climaInterpretado.descricao,
    codigoClima
    };
}

module.exports = {
    buscarClima
};