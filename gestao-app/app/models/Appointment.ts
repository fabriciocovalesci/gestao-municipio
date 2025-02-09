import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  service: "Emissão de RG" | "Emissão de Reservista" | "Segunda Via de RG";
  userId: mongoose.Types.ObjectId;
  userName: string;
  cpf: string;
  inicio: string;
  termino: string;
  diaAgendamento: string;
  naoCompareceu: boolean;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    service: {
      type: String,
      enum: ["Emissão de RG", "Emissão de Reservista", "Segunda Via de RG"],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    cpf: { type: String, required: true },
    inicio: { type: String, required: true },
    termino: { type: String, required: true },
    diaAgendamento: { type: String, required: true },
    naoCompareceu: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema, "appointments");
