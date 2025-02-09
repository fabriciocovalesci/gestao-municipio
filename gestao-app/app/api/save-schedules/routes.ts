
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Recebe os dados do corpo da requisição
    const intervalos = await request.json();

    // Valida se os dados foram recebidos
    if (!intervalos || !Array.isArray(intervalos)) {
      return NextResponse.json(
        { error: 'Dados de intervalos inválidos' },
        { status: 400 }
      );
    }

    // Salva cada intervalo no banco de dados
    const savedSchedules = await prisma.schedule.createMany({
      data: intervalos.map(intervalo => ({
        startTime: intervalo.inicio,
        endTime: intervalo.termino,
        availableSlots: intervalo.vagasDisponiveis
      }))
    });

    // Retorna sucesso
    return NextResponse.json(
      { message: 'Horários salvos com sucesso', data: savedSchedules },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao salvar horários:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a requisição' },
      { status: 500 }
    );
  }
}
