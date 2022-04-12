'use strict';

const fs = require('fs');
const marketCalc = require('./market-calc');
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let conteudo = [];
process.stdin.on('data', function(stdin) {
    inputString += stdin;
});

process.stdin.on('end', function() {
    conteudo = inputString.split('\n');
    // The last line is empty
    conteudo.pop();
    main();
});

function main() {
    conteudo = conteudo.map(d => JSON.parse(d))
    conteudo.forEach(operacoes => {
        const resultado = operacoes.map(operacao => {
            const smf = marketCalc.stockMarketFee();
            return smf.operacao(operacao.operation, operacao.quantity, operacao['unit-cost']);
        })
        console.log(resultado)
    })
}
