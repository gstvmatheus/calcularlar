interface ParametrosFinanciamento {
  valorImovel: number;
  entrada: number;
  taxaJurosAnual: number;
  prazoMeses: number;
}

interface Parcela {
  numero: number;
  valorParcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
}

export function calcularTabelaPrice(dados: ParametrosFinanciamento): Parcela[] {
  const valorFinanciado = dados.valorImovel - dados.entrada;
  const taxaJurosMensal = (dados.taxaJurosAnual / 100) / 12;

  // Fórmula do cálculo de parcela fixa da Tabela PRICE
  const fator = Math.pow(1 + taxaJurosMensal, dados.prazoMeses);
  const valorParcelaFixa = valorFinanciado * ((taxaJurosMensal * fator) / (fator - 1));

  let saldoDevedor = valorFinanciado;
  const parcelas: Parcela[] = [];

  for (let i = 1; i <= dados.prazoMeses; i++) {
    const jurosDoMes = saldoDevedor * taxaJurosMensal;
    const amortizacaoDoMes = valorParcelaFixa - jurosDoMes;

    saldoDevedor -= amortizacaoDoMes;

    parcelas.push({
      numero: i,
      valorParcela: Number(valorParcelaFixa.toFixed(2)),
      amortizacao: Number(amortizacaoDoMes.toFixed(2)),
      juros: Number(jurosDoMes.toFixed(2)),
      saldoDevedor: Number(Math.abs(saldoDevedor).toFixed(2))
    });
  }

  return parcelas;
}