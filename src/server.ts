import express, { Request, Response } from 'express';
import { calcularTabelaSAC } from './sac';
import { calcularTabelaPrice } from './price';
import { simulacaoSchema } from './schemas';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

const validarDados = (body: unknown) => {
  const result = simulacaoSchema.safeParse(body);
  if (!result.success) {
    const erros = result.error.issues.map((issue) => ({
      campo: issue.path.join('.'),
      mensagem: issue.message
    }));
    return { valido: false, erros };
  }
  return { valido: true, dados: result.data };
};

app.post('/simular/sac', (req: Request, res: Response) => {
  const validacao = validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ erros: validacao.erros });
  }

  const { valorImovel, entrada, taxaJurosAnual, prazoMeses } = validacao.dados!;
  const resultado = calcularTabelaSAC({ valorImovel, entrada, taxaJurosAnual, prazoMeses });

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

app.post('/simular/price', (req: Request, res: Response) => {
  const validacao = validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ erros: validacao.erros });
  }

  const { valorImovel, entrada, taxaJurosAnual, prazoMeses } = validacao.dados!;
  const resultado = calcularTabelaPrice({ valorImovel, entrada, taxaJurosAnual, prazoMeses });

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

app.post('/simular/comparar', (req: Request, res: Response) => {
  const validacao = validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ erros: validacao.erros });
  }

  const dados = validacao.dados!;
  const parcelasSAC = calcularTabelaSAC(dados);
  const parcelasPrice = calcularTabelaPrice(dados);

  const totalJurosSAC = parcelasSAC.reduce((acc, p) => acc + p.juros, 0);
  const totalJurosPrice = parcelasPrice.reduce((acc, p) => acc + p.juros, 0);

  const valorFinanciado = dados.valorImovel - dados.entrada;
  const totalPagoSAC = valorFinanciado + totalJurosSAC;
  const totalPagoPrice = valorFinanciado + totalJurosPrice;

  const diferencaJuros = Math.abs(totalJurosSAC - totalJurosPrice);
  const maisVantajoso = totalJurosSAC < totalJurosPrice ? 'SAC' : 'PRICE';

  return res.status(200).json({
    dadosEntrada: dados,
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