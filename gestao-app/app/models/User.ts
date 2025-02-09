import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  cpf: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  imageUrl?: string;
  historicoAgendamentos: IAgendamento[];
}


interface IAgendamento {
  servico: string;
  horarioAgendamento: string;
  diaAgendamento: Date;
  concluido: boolean;
  naoComparacido: boolean;
}


const agendamentoSchema = new Schema<IAgendamento>({
  servico: { 
    type: String, 
    enum: ['Emissão de RG', 'Emissão de Reservista', 'Segunda Via de RG'],
    required: false 
  },
  horarioAgendamento: { type: String, required: false },
  diaAgendamento: { type: Date, required: true },
  concluido: { type: Boolean, default: false },
  naoComparacido: { type: Boolean, default: false },
});


const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    imageUrl: { type: String, required: false },
    historicoAgendamentos: { type: [agendamentoSchema], default: [] },
  },
  { timestamps: true }
);


export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'users');
