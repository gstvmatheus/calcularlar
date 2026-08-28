import express, { Request, Response } from 'express';
import { calcularTabelaSAC } from './sac';
import { calcularTabelaPrice } from './price';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Rota para simulação pela Tabela SAC
app.post('/simular/sac', (req: Request, res: Response) => {
  const { valorImovel, entrada, taxaJurosAnual, prazoMeses } = req.body;

  if (!valorImovel || entrada === undefined || !taxaJurosAnual || !prazoMeses) {
    return res.status(400).json({ 
      erro: 'Preencha todos os campos: valorImovel, entrada, taxaJurosAnual e prazoMeses.' 
    });
  }

  const resultado = calcularTabelaSAC({
    valorImovel,
    entrada,
    taxaJurosAnual,
    prazoMeses
  });

  const totalJuros = resultado.reduce((acc, p) => acc + p.juros, 0);
  const totalPago = (valorImovel - entrada) + totalJuros;

  return res.status(200).json({
    sistema: 'SAC',
    resumo: {
      valorImovel,
      entrada,
      valorFinanciado: valorImovel - entrada,
      totalParcelas: prazoMeses,
      totalJuros: Number(totalJuros.toFixed(2)),
      totalPago: Number(totalPago.toFixed(2)),
      primeiraParcela: resultado[0].valorParcela,
      ultimaParcela: resultado[resultado.length - 1].valorParcela
    },
    parcelas: resultado
  });
});

// Rota para simulação pela Tabela PRICE
app.post('/simular/price', (req: Request, res: Response) => {
  const { valorImovel, entrada, taxaJurosAnual, prazoMeses } = req.body;

  if (!valorImovel || entrada === undefined || !taxaJurosAnual || !prazoMeses) {
    return res.status(400).json({ 
      erro: 'Preencha todos os campos: valorImovel, entrada, taxaJurosAnual e prazoMeses.' 
    });
  }

  const resultado = calcularTabelaPrice({
    valorImovel,
    entrada,
    taxaJurosAnual,
    prazoMeses
  });

  const totalJuros = resultado.reduce((acc, p) => acc + p.juros, 0);
  const totalPago = (valorImovel - entrada) + totalJuros;

  return res.status(200).json({
    sistema: 'PRICE',
    resumo: {
      valorImovel,
      entrada,
      valorFinanciado: valorImovel - entrada,
      totalParcelas: prazoMeses,
      totalJuros: Number(totalJuros.toFixed(2)),
      totalPago: Number(totalPago.toFixed(2)),
      parcelaFixa: resultado[0].valorParcela
    },
    parcelas: resultado
  });
});

// Rota de Comparação Completa: SAC vs PRICE
app.post('/simular/comparar', (req: Request, res: Response) => {
  const { valorImovel, entrada, taxaJurosAnual, prazoMeses } = req.body;

  if (!valorImovel || entrada === undefined || !taxaJurosAnual || !prazoMeses) {
    return res.status(400).json({ 
      erro: 'Preencha todos os campos: valorImovel, entrada, taxaJurosAnual e prazoMeses.' 
    });
  }

  const dados = { valorImovel, entrada, taxaJurosAnual, prazoMeses };

  const parcelasSAC = calcularTabelaSAC(dados);
  const parcelasPrice = calcularTabelaPrice(dados);

  const totalJurosSAC = parcelasSAC.reduce((acc, p) => acc + p.juros, 0);
  const totalJurosPrice = parcelasPrice.reduce((acc, p) => acc + p.juros, 0);

  const valorFinanciado = valorImovel - entrada;
  const totalPagoSAC = valorFinanciado + totalJurosSAC;
  const totalPagoPrice = valorFinanciado + totalJurosPrice;

  const diferencaJuros = Math.abs(totalJurosSAC - totalJurosPrice);
  const maisVantajoso = totalJurosSAC < totalJurosPrice ? 'SAC' : 'PRICE';

  return res.status(200).json({
    dadosEntrada: {
      valorImovel,
      entrada,
      valorFinanciado,
      taxaJurosAnual,
      prazoMeses
    },
    comparativo: {
      maisVantajosoEmJuros: maisVantajoso,
      economiaTotalJuros: Number(diferencaJuros.toFixed(2)),
      sac: {
        totalJuros: Number(totalJurosSAC.toFixed(2)),
        totalPago: Number(totalPagoSAC.toFixed(2)),
        primeiraParcela: parcelasSAC[0].valorParcela,
        ultimaParcela: parcelasSAC[parcelasSAC.length - 1].valorParcela
      },
      price: {
        totalJuros: Number(totalJurosPrice.toFixed(2)),
        totalPago: Number(totalPagoPrice.toFixed(2)),
        parcelaFixa: parcelasPrice[0].valorParcela
      }
    },
    detalhes: {
      sac: parcelasSAC,
      price: parcelasPrice
    }
  });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 CalcularLar API rodando na porta ${PORT}`);
});