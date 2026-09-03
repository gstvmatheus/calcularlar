import { z } from 'zod';

export const simulacaoSchema = z.object({
  valorImovel: z
    .number({ message: 'O valor do imóvel deve ser um número.' })
    .positive('O valor do imóvel deve ser maior que zero.'),
  
  entrada: z
    .number({ message: 'O valor de entrada deve ser um número.' })
    .nonnegative('A entrada não pode ser negativa.'),
  
  taxaJurosAnual: z
    .number({ message: 'A taxa de juros deve ser um número.' })
    .positive('A taxa de juros deve ser maior que zero.'),
  
  prazoMeses: z
    .number({ message: 'O prazo em meses deve ser um número.' })
    .int('O prazo deve ser um número inteiro de meses.')
    .positive('O prazo deve ser maior que zero.')
}).refine((data) => data.entrada < data.valorImovel, {
  message: 'A entrada deve ser menor que o valor total do imóvel.',
  path: ['entrada']
});