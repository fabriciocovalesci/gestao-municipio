import { NextApiRequest, NextApiResponse } from 'next';
import CitizenServiceSchedule from '@/models/CitizenServiceSchedule';
import { connectDB } from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const schedules = req.body;

      if (!Array.isArray(schedules) || schedules.length === 0) {
        return res.status(400).json({ error: 'O corpo da requisição deve ser um array não vazio' });
      }

      const createdSchedules = await CitizenServiceSchedule.insertMany(schedules); 
      return res.status(201).json(createdSchedules);
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
