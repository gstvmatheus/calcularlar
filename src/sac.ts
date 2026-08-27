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

export function calcularTabelaSAC(dados: ParametrosFinanciamento): Parcela[] {
  const valorFinanciado = dados.valorImovel - dados.entrada;
  const taxaJurosMensal = (dados.taxaJurosAnual / 100) / 12;
  const amortizacaoFixa = valorFinanciado / dados.prazoMeses;
  
  let saldoDevedor = valorFinanciado;
  const parcelas: Parcela[] = [];

  for (let i = 1; i <= dados.prazoMeses; i++) {
    const jurosDoMes = saldoDevedor * taxaJurosMensal;
    const valorParcela = amortizacaoFixa + jurosDoMes;
    
    saldoDevedor -= amortizacaoFixa;

    parcelas.push({
      numero: i,
      valorParcela: Number(valorParcela.toFixed(2)),
      amortizacao: Number(amortizacaoFixa.toFixed(2)),
      juros: Number(jurosDoMes.toFixed(2)),
      saldoDevedor: Number(Math.abs(saldoDevedor).toFixed(2))
    });
  }

  return parcelas;
}