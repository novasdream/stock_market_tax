const marketCalc = require('../market-calc');

const cases = require('jest-in-case');

function PrettyOperation(operations) {
  return operations.map(d => (
    {
      name         : `${d.operation === 'buy' ? 'comprou' : 'vendeu'} ${d.quantity} a R$ ${d['unit-cost']} paga o imposto R$ ${d.tax}`,
      "operation"  : d.operation,
      "quantity"   : d.quantity,
      'unit-cost'  : d['unit-cost'],
      "tax"        : d.tax
    }
  ))
}

describe('Caso #1 ', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Lucros abaixo de R$ 20000 mensais', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation([
      { "operation": 'buy',  "quantity": 100, 'unit-cost': 10.00, "tax": 0 },
      { "operation": 'sell', "quantity": 50,  'unit-cost': 15.00, "tax": 0 },
      { "operation": 'sell', "quantity": 50,  'unit-cost': 15.00, "tax": 0 },
    ]));
});


describe('Caso #2 ', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Operações contendo Lucro e Prejuizo', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation([
      { "operation": 'buy',  "quantity": 10000, 'unit-cost': 10.00, "tax": 0 },
      { "operation": 'sell', "quantity": 5000,  'unit-cost': 20.00, "tax": 10000.00 },
      { "operation": 'sell', "quantity": 5000,  'unit-cost': 5.00,  "tax": 0 },
    ]));
})

describe('Caso #3 ', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Operações contendo Prejuizo a Compensar', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation([
      { "operation": 'buy', "quantity": 10000, 'unit-cost': 10.00, "tax": 0 },
      { "operation": 'sell', "quantity": 5000, 'unit-cost': 5.00, "tax": 0 },
      { "operation": 'sell', "quantity": 3000, 'unit-cost': 20.00, "tax": 1000.00 }
    ]));
})


describe('Caso #4 ', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Operações empatada sem lucros ou prejuizos', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation([
      { "operation": "buy",  "quantity": 10000, "unit-cost": 10.00, "tax": 0 },
      { "operation": "buy",  "quantity": 5000,  "unit-cost": 25.00, "tax": 0 },
      { "operation": "sell", "quantity": 10000, "unit-cost": 15.00, "tax": 0 }
    ])
  );
})


describe('Caso #5 ', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Operações com lucros e preço ponderado', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation([
      { "operation": "buy",  "quantity": 10000, "unit-cost": 10.00, "tax": 0     },
      { "operation": "buy",  "quantity": 5000,  "unit-cost": 25.00, "tax": 0     },
      { "operation": "sell", "quantity": 10000, "unit-cost": 15.00, "tax": 0     },
      { "operation": "sell", "quantity": 5000,  "unit-cost": 25.00, "tax": 10000 }
    ])
  );
})

describe('Caso #6', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Operações com lucro', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation(
      [
        { "operation": "buy",  "quantity": 10000, "unit-cost": 10.00, "tax": 0 },
        { "operation": "sell", "quantity": 5000,  "unit-cost": 2.00,  "tax": 0 },
        { "operation": "sell", "quantity": 2000,  "unit-cost": 20.00, "tax": 0 },
        { "operation": "sell", "quantity": 2000,  "unit-cost": 20.00, "tax": 0 },
        { "operation": "sell", "quantity": 1000,  "unit-cost": 25.00, "tax": 3000 }
      ]
    )
  );
})


describe('Caso #7', () => {
  const smf = marketCalc.stockMarketFee();
  cases('Operações com zeragem de posição', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation(
      [
        {"operation": "buy",  "quantity": 10000,  "unit-cost": 10.00, tax: 0},
        {"operation": "sell", "quantity": 5000,   "unit-cost": 2.00 , tax: 0},
        {"operation": "sell", "quantity": 2000,   "unit-cost": 20.00, tax: 0},
        {"operation": "sell", "quantity": 2000,   "unit-cost": 20.00, tax: 0},
        {"operation": "sell", "quantity": 1000,   "unit-cost": 25.00, tax: 3000},
        {"operation": "buy",  "quantity": 10000,  "unit-cost": 20.00, tax: 0},
        {"operation": "sell", "quantity": 5000,   "unit-cost": 15.00, tax: 0},
        {"operation": "sell", "quantity": 4350,   "unit-cost": 30.00, tax: 3700},
        {"operation": "sell", "quantity": 650,    "unit-cost": 30.00, tax: 0}
      ]
    )
  );
})

describe('Caso #8', () => {
  const smf = marketCalc.stockMarketFee();
cases('Operaçao com alteracoes no custo ponderado', opts => {
    expect(smf.operacao(opts.operation, opts.quantity, opts['unit-cost'])).toStrictEqual({ "tax": opts.tax });
  },
    PrettyOperation(
      [
        {"operation": "buy",  "quantity": 10000,  "unit-cost": 10.00,   tax: 0},
        {"operation": "sell", "quantity": 10000,   "unit-cost": 50.00 , tax: 80000},
        {"operation": "buy",  "quantity": 10000,   "unit-cost": 20.00,  tax: 0},
        {"operation": "sell", "quantity": 10000,   "unit-cost": 50.00,  tax: 60000}
      ]
    )
  );
})