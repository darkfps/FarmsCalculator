const express = require('express');
const app = express();
const port = 3000;

// Middleware para analisar dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rota para calcular os resultados
app.post('/calcular', (req, res) => {
    const { total_pasta, total_venda, percent_pagamento, options } = req.body;

    const QBase = 30;
    const DSVenda = 600;
    const PercentLavagem = 0.25;
    const Coca = 15;

    const percentages = {
        "25": 0.25,
        "30": 0.30,
        "35": 0.35,
        "40": 0.40
    };

    let total_payment_member = 0;
    let total_payment_fac = 0;

    let resultHtml = '';

    if (options.includes('farm')) {
        let base_calc_farm = (total_pasta / QBase) * Coca * DSVenda;
        let lavagem_calc_farm = base_calc_farm * PercentLavagem;
        base_calc_farm -= lavagem_calc_farm;
        let percent_payment = percentages[percent_pagamento];
        let payment_member_farm = base_calc_farm * percent_payment;
        let payment_fac_farm = base_calc_farm - payment_member_farm;

        resultHtml += `
            <h3>Cálculo para Farm:</h3>
            <p>(${total_pasta} / ${QBase}) * R$ ${Coca.toFixed(2).replace('.', ',')} * R$ ${DSVenda.toFixed(2).replace('.', ',')} = R$ ${(base_calc_farm + lavagem_calc_farm).toFixed(2).replace('.', ',')}</p>
            <p>Diminuindo custo de Lavagem (${(PercentLavagem * 100)}%): -R$ ${lavagem_calc_farm.toFixed(2).replace('.', ',')}</p>
            <p>Pagamento ao Membro (${(percent_payment * 100)}%): R$ ${payment_member_farm.toFixed(2).replace('.', ',')}</p>
            <p>Pagamento FAC: R$ ${payment_fac_farm.toFixed(2).replace('.', ',')}</p>
        `;

        total_payment_member += payment_member_farm;
        total_payment_fac += payment_fac_farm;
    }

    if (options.includes('vendaGringo') && total_venda > 0) {
        let base_calc_gringo = total_venda * DSVenda;
        let lavagem_calc_gringo = base_calc_gringo * PercentLavagem;
        base_calc_gringo -= lavagem_calc_gringo;
        let percent_payment = percentages[percent_pagamento];
        let payment_member_gringo = base_calc_gringo * percent_payment;
        let payment_fac_gringo = base_calc_gringo - payment_member_gringo;

        resultHtml += `
            <h3>Cálculo para VendaGringo:</h3>
            <p>R$ ${total_venda.toFixed(2).replace('.', ',')} * R$ ${DSVenda.toFixed(2).replace('.', ',')} = R$ ${(base_calc_gringo + lavagem_calc_gringo).toFixed(2).replace('.', ',')}</p>
            <p>Diminuindo custo de Lavagem (${(PercentLavagem * 100)}%): -R$ ${lavagem_calc_gringo.toFixed(2).replace('.', ',')}</p>
            <p>Pagamento ao Membro (${(percent_payment * 100)}%): R$ ${payment_member_gringo.toFixed(2).replace('.', ',')}</p>
            <p>Pagamento FAC: R$ ${payment_fac_gringo.toFixed(2).replace('.', ',')}</p>
        `;

        total_payment_member += payment_member_gringo;
        total_payment_fac += payment_fac_gringo;
    }

    resultHtml += `
        <div class='result'>
            <h3>Resultado Total:</h3>
            <p>Pagamento ao Membro Total: R$ ${total_payment_member.toFixed(2).replace('.', ',')}</p>
            <p>Pagamento FAC Total: R$ ${total_payment_fac.toFixed(2).replace('.', ',')}</p>
        </div>
    `;

    res.send(`
        <html>
        <head>
            <title>Resultado do Pagamento</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
            <style>
                .result {
                    font-size: 1.2em;
                    margin-top: 20px;
                }
                .container {
                    max-width: 800px;
                }
            </style>
        </head>
        <body>
            <div class="container my-5">
                <h1 class="text-center">Resultado do Pagamento</h1>
                ${resultHtml}
                <a href="/" class="btn btn-primary">Voltar</a>
            </div>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
