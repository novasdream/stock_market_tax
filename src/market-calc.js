function stockMarketFee() {
    let saldoTotal = 0.00;
    let quantidadeDeAcoesTotal = 0;
    let mediaPonderada = 0.00;

    const atualizaQuantidadeAcoes = (quantidadeDeAcoes) => {
        quantidadeDeAcoesTotal += quantidadeDeAcoes;
    }

    const atualizaPosicao = (quantidadeDeAcoes, valorUnitario) => {
        mediaPonderada = (mediaPonderada * quantidadeDeAcoesTotal + valorUnitario * quantidadeDeAcoes) / (quantidadeDeAcoesTotal + quantidadeDeAcoes);
        atualizaQuantidadeAcoes(quantidadeDeAcoes);
    }
    
    const calculaImposto = (valor) => {
        return Math.round(valor * 0.2);
    }

    const calculaDeltaOperacional = (quantidade, valorUnitario, mediaPonderada) => {
        return (valorUnitario - mediaPonderada) * quantidade
    }

    const calculaValorOperacional = (quantidade, valorUnitario)  => {
        return quantidade * valorUnitario
    }

    const methods = {
        buy : (quantidade, valorUnitario) => {
            atualizaPosicao(quantidade, valorUnitario);
            return { tax : 0 }
        },
        sell : (quantidade, valorUnitario) => {
            let tax = 0;
            const valorOperacao = calculaValorOperacional(quantidade, valorUnitario);
            const diferenca     = calculaDeltaOperacional(quantidade, valorUnitario, mediaPonderada);
            saldoTotal += diferenca;
            if (diferenca > 0 && valorOperacao > 20000) {
                if (saldoTotal >= 20000) {
                    tax = calculaImposto(saldoTotal);
                    saldoTotal = 0;
                } else if (saldoTotal > 0) {
                    tax = calculaImposto(saldoTotal);
                    saldoTotal = 0;
                }
            }
            atualizaQuantidadeAcoes(-quantidade);
            return { tax }
        }
    }

    return {
        operacao: (operationName, quantidade, valorUnitario) => {
            return methods[operationName](quantidade, valorUnitario)
        },
    }
}

module.exports = { stockMarketFee };
