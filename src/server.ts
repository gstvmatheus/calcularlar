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

  return res.status(200).json({
    sistema: 'SAC',
    resumo: {
      valorImovel,
      entrada,
      valorFinanciado: valorImovel - entrada,
      totalParcelas: prazoMeses
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

  return res.status(200).json({
    sistema: 'PRICE',
    resumo: {
      valorImovel,
      entrada,
      valorFinanciado: valorImovel - entrada,
      totalParcelas: prazoMeses
    },
    parcelas: resultado
  });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 CalcularLar API rodando na porta ${PORT}`);
});