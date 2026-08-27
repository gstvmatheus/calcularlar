import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 CalcularLar API rodando na porta ${PORT}`);
});