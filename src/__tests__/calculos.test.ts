import { calcularTabelaSAC } from '../sac';
import { calcularTabelaPrice } from '../price';

describe('Testes das Funções de Cálculo', () => {
  const entradaExemplo = {
    valorImovel: 300000,
    entrada: 60000,
    taxaJurosAnual: 10,
    prazoMeses: 120
  };

  test('SAC: A amortização deve ser constante e amortizar todo o saldo', () => {
    const parcelas = calcularTabelaSAC(entradaExemplo);
    expect(parcelas).toHaveLength(120);

    const primeiraAmortizacao = parcelas[0].amortizacao;
    const ultimaAmortizacao = parcelas[119].amortizacao;
    expect(primeiraAmortizacao).toBeCloseTo(ultimaAmortizacao, 2);
  });

  test('PRICE: Os valores das parcelas devem ser constantes', () => {
    const parcelas = calcularTabelaPrice(entradaExemplo);
    expect(parcelas).toHaveLength(120);

    const primeiraParcela = parcelas[0].valorParcela;
    const decimaParcela = parcelas[9].valorParcela;
    expect(primeiraParcela).toBe(decimaParcela);
  });
});