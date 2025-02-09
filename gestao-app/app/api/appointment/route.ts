import Appointment from '@/app/models/Appointment';
import CitizenServiceSchedule from '@/app/models/CitizenServiceSchedule';
import User from '@/app/models/User';
import { connectDB } from '@/lib/dbConnect';
import { NextResponse } from "next/server";



export async function POST(req: Request) {

    const servicoParaCampo = {
        "Emissão de RG": "primeiraViaRG",
        "Segunda Via de RG": "segundaViaRG",
        "Emissão de Reservista": "reservista",
      };

  await connectDB();

  try {
    const body = await req.json();
    const { service, userId, horario, diaAgendamento } = body;

    if (!service || !userId || !horario || !diaAgendamento) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }


    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const schedule = await CitizenServiceSchedule.findOne({
      data: diaAgendamento,
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Não há agendamentos disponíveis para essa data" },
        { status: 400 }
      );
    }


    const horarioDisponivel = schedule.horarios.find((h) => h.inicio === horario);

    if (!horarioDisponivel) {
      return NextResponse.json(
        { error: "Horário não disponível" },
        { status: 400 }
      );
    }


    const horarioIndisponivel = horarioDisponivel.primeiraViaRG || 
    horarioDisponivel.segundaViaRG || 
    horarioDisponivel.reservista;

        if (horarioIndisponivel) {
        return NextResponse.json({ error: "Esse horário já está ocupado." }, { status: 400 });
        }


    if (schedule.vagasDisponiveis <= 0) {
      return NextResponse.json(
        { error: "Não há mais vagas disponíveis para essa data" },
        { status: 400 }
      );
    }


    const newAppointment = new Appointment({
      service,
      userId,
      userName: user.name,
      cpf: user.cpf,
      horario,
      inicio: horario,
      termino: schedule.horarios.find(h => h.inicio === horario)?.termino,
      diaAgendamento,
      naoCompareceu: false,
    });

    await newAppointment.save();


    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          historicoAgendamentos: {
            service,
            horario,
            diaAgendamento,
            concluido: false,
            naoCompareceu: false,
          },
        },
      },
      { new: true }
    );

    const campoServico = servicoParaCampo[service];
    const agendamento = await CitizenServiceSchedule.findOneAndUpdate(
        { 
          data: diaAgendamento, 
          "horarios.inicio": horario 
        },
        { 
          $inc: { vagasDisponiveis: -1 }, 
          $set: { [`horarios.$.${campoServico}`]: true } 
        },
        { new: true }
      );
      

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  await connectDB();
  
  try {
    const hoje = "2025-02-06" // new Date().toISOString().split('T')[0];
    

    const agendamentos = await Appointment.find({ 
      diaAgendamento: hoje 
    }).populate('userId', 'name cpf');
    
    const horarios = await CitizenServiceSchedule.findOne({
      data: hoje
    });
    
    if (!agendamentos.length) {
      return NextResponse.json(
        { message: 'Nenhum agendamento encontrado para hoje' },
        { status: 404 }
      );
    }
    
    const response = agendamentos.map(agendamento => ({
      _id: agendamento._id,
      data: agendamento.diaAgendamento,
      tipoServico: agendamento.service,
      horarios: horarios?.horarios || [],
      vagasDisponiveis: horarios?.vagasDisponiveis || 0,
      cliente: {
        nome: agendamento.userId.name,
        cpf: agendamento.userId.cpf,
        id: agendamento.userId._id,
      },
      compareceu: !agendamento.naoCompareceu
    }));
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}