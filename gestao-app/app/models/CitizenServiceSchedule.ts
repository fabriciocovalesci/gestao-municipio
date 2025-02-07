import mongoose, { Schema, Document } from 'mongoose';

interface IHorario {
  inicio: string;
  termino: string;
  primeiraViaRG?: boolean;
  segundaViaRG?: boolean;
  reservista?: boolean;
}

export interface ICitizenServiceSchedule extends Document {
  data: string;
  tipoServico: string;
  horarios: IHorario[];
  vagasDisponiveis: number;
}

const HorarioSchema = new Schema<IHorario>(
  {
    inicio: { type: String, required: true },
    termino: { type: String, required: true },
    primeiraViaRG: { type: Boolean, default: false },
    segundaViaRG: { type: Boolean, default: false },
    reservista: { type: Boolean, default: false },
  },
  { _id: false }
);

const CitizenServiceScheduleSchema = new Schema<ICitizenServiceSchedule>(
  {
    data: { type: String, required: true, unique: true },
    tipoServico: { type: String, default: 'Casa do Cidadão' },
    horarios: { type: [HorarioSchema], required: true },
    vagasDisponiveis: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.CitizenServiceSchedule ||
  mongoose.model<ICitizenServiceSchedule>('CitizenServiceSchedule', CitizenServiceScheduleSchema);
