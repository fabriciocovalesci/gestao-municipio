import CitizenServiceSchedule from '@/app/models/CitizenServiceSchedule';
import { connectDB } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';




export async function GET(req: Request) {
    await connectDB();

    try {

        const { searchParams } = new URL(req.url);
        const data = searchParams.get("data"); 

        if (!data) {
            return NextResponse.json({ error: "A data é obrigatória" }, { status: 400 });
        }

        const schedules = await CitizenServiceSchedule.findOne({ data });
        if (!schedules) {
            return NextResponse.json({  ok: false, message: "Não foi possível encontrar o agendamento" }, { status: 404 });
        }
        return NextResponse.json(schedules, { status: 200 });

      } catch (error) {
        console.error('Erro ao buscar horários:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
      }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    if (!body.data || !Array.isArray(body.horarios) || body.horarios.length === 0) {
        return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
      }

      const schedule = {
        data: body.data,
        tipoServico: 'Casa do Cidadão',
        horarios: body.horarios,
        vagasDisponiveis: body.vagasDisponiveis
      };

    const createdSchedules = await CitizenServiceSchedule.insertMany(schedule);
    return NextResponse.json(createdSchedules, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar horários:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
    await connectDB();
  
    try {
      const body = await req.json();
  
      if (!body.data || !Array.isArray(body.horarios) || body.horarios.length === 0) {
        return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
      }
  
      const updatedSchedule = await CitizenServiceSchedule.findOneAndUpdate(
        { data: body.data }, 
        {
          $set: {
            tipoServico: 'Casa do Cidadão',
            horarios: body.horarios,
            vagasDisponiveis: body.vagasDisponiveis,
          },
        },
        { new: true, upsert: true }
      );
  
      return NextResponse.json(updatedSchedule, { status: 200 });
    } catch (error) {
      console.error('Erro ao atualizar horários:', error);
      return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
  }
  