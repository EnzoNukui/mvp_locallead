async function buscarClima(lat, lon) {
    try {
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain,weather_code&hourly=precipitation_probability,precipitation,rain&forecast_days=1&timezone=America%2FSao_Paulo`;

        const resposta = await axios.get(url);

        const dados = resposta.data;

        const temperatura = dados.current.temperature_2m;
        const chuvaAgora = dados.current.rain || 0;
        const codigoClima = dados.current.weather_code;
        const climaInterpretado = interpretarClima(codigoClima);

        const probabilidades =
            dados.hourly.precipitation_probability.slice(0, 6);

        const maiorProbabilidade =
            Math.max(...probabilidades);

        let riscoAtraso = "baixo";
        let mensagem = "Clima normal, sem previsões para atrasos";

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
            icone: climaInterpretado.icone,
            descricao: climaInterpretado.descricao,
            codigoClima
        };

    } catch (erro) {
        console.error("Erro ao consultar API de clima:", erro.message);

        return {
            temperatura: "--",
            chuvaAgora: 0,
            maiorProbabilidade: 0,
            riscoAtraso: "indisponível",
            mensagem: "Não foi possível consultar o clima no momento.",
            icone: "🌤️",
            descricao: "Clima indisponível",
            codigoClima: null
        };
    }
}