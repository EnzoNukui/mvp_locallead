async function buscarClima(lat, lon) {
    const parametros = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current_weather: "true",
        timezone: "America/Sao_Paulo"
    });

    const url = `https://api.open-meteo.com/v1/forecast?${parametros.toString()}`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro Open-Meteo: ${resposta.status}`);
    }

    const dados = await resposta.json();

    const temperatura = dados.current_weather.temperature;
    const codigoClima = dados.current_weather.weathercode;
    const climaInterpretado = interpretarClima(codigoClima);

    return {
        temperatura,
        chuvaAgora: 0,
        maiorProbabilidade: 0,
        riscoAtraso: "baixo",
        mensagem: "Clima atual consultado com sucesso.",
        icone: climaInterpretado.icone,
        descricao: climaInterpretado.descricao,
        codigoClima,
        fonte: "open-meteo-simples"
    };
}