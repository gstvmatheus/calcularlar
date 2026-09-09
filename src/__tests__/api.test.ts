import request from 'supertest';
import { app } from '../server';

describe('Testes das Rotas da API', () => {
  test('GET /health deve retornar status 200 e ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /simular/sac deve rejeitar dados inválidos', async () => {
    const response = await request(app)
      .post('/simular/sac')
      .send({ valorImovel: -100 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erros');
  });

  test('POST /simular/comparar deve calcular comparativo corretamente', async () => {
    const response = await request(app)
      .post('/simular/comparar')
      .send({
        valorImovel: 200000,
        entrada: 40000,
        taxaJurosAnual: 8.5,
        prazoMeses: 60
      });

    expect(response.status).toBe(200);
    expect(response.body.comparativo).toHaveProperty('maisVantajosoEmJuros');
  });
});