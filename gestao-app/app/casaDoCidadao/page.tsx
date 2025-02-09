"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, set } from 'date-fns';
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModalMensagem, useModalMensagem } from "@/components/apps/ModalMensagem";
 
import React from "react";
import { useRouter } from 'next/navigation';


const ajustarDataComHorario = (dataISO: string, horario: string): Date => {
    const dataParte = dataISO.split('T')[0];
    const dataComHorario = new Date(`${dataParte}T${horario}:00`);
    if (isNaN(dataComHorario.getTime())) {
      throw new Error('Data ou horário inválido');
    }
  
    return dataComHorario;
  };
const formSchema = z.object({
  totalVagas: z.number().min(1, "Deve haver pelo menos 1 vaga"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  horarioInicio: z.string().min(1, "Horário de início é obrigatório"),
  horarioTermino: z.string().min(1, "Horário de término é obrigatório"),
});

export default function AgendamentoPage() {
  const router = useRouter();
  const { showModal, isOpen, options, closeModal } = useModalMensagem();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const dataInicio = watch("dataInicio");
  const dataTermino = watch("dataTermino");

  const onSubmit = async (data) => {
    try {
      console.log("Dados do formulário recebidos:", data);

      const inicio = ajustarDataComHorario(data.dataInicio, data.horarioInicio);
      const termino = ajustarDataComHorario(data.dataInicio, data.horarioTermino);
  

      if (termino <= inicio) {
        showModal('A data/horário de término deve ser posterior ao início');
        return;
      }
  
      const intervalos = [];
      let current = inicio;
      
      while (current < termino) {
        const proximo = new Date(current.getTime() + 30 * 60000);
      
        if (proximo > termino) {
          intervalos.push({
            inicio: format(current, "HH:mm"),
            termino: format(termino, "HH:mm"),
            vagasDisponiveis: data.totalVagas
          });
          break;
        }
      
        intervalos.push({
          inicio: format(current, "HH:mm"),
          termino: format(proximo, "HH:mm"),
        });
      
        current = proximo;
      }

    const payload = {
      data: format(inicio, "yyyy-MM-dd"), 
      horarios: intervalos, 
      vagasDisponiveis: data.totalVagas
    };

    console.log("payload" , payload)

    const existsingSchedules = await fetch(`/api/citizens-service-schedule?data=${payload.data}`, {
      method: 'GET',
    });

    console.log(existsingSchedules);

    if (existsingSchedules.status === 200) {
      const dataObj = new Date(dataInicio);
      const dia = String(dataObj.getUTCDate()).padStart(2, "0");
      const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
    
      showModal(
        `Horários para dia ${dia}/${mes} cadastrados com sucesso, deseja atualizar?`,
        true,
        async () => {
          try {
            console.log("Atualizando dados...");
    
            const saveResponse = await fetch('/api/citizens-service-schedule', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload), 
            });
    
            if (saveResponse.ok) {
              showModal('Horários atualizados com sucesso!');
              reset();
              router.push('/');
            } else {
              throw new Error('Erro ao salvar horários');
            }
          } catch (error) {
            console.error(error);
            showModal('Erro ao atualizar os horários.');
          }
        }
      );
    }
    
  

      if (existsingSchedules.status === 404) {
        const saveResponse = await fetch('/api/citizens-service-schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), 
        });
    
          if (saveResponse.ok) {
            showModal('Horários cadastrados com sucesso!');
            reset();
            router.push('/');
          } else {
            throw new Error('Erro ao salvar horários');
          }
      }

    } catch (error) {
      console.error("Erro:", error);
      showModal("Ocorreu um erro ao processar o agendamento");
    }
  };

  const horarios = Array.from({ length: 48 }, (_, i) => {
    const horas = String(Math.floor(i / 2)).padStart(2, "0");
    const minutos = i % 2 === 0 ? "00" : "30";
    return `${horas}:${minutos}`;
  });

  const handleLimpar = () => {
    reset();
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Horários</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="totalVagas">Total de Vagas Disponíveis</Label>
          <Input
            type="number"
            id="totalVagas"
            {...register("totalVagas", { valueAsNumber: true })}
          />
          {errors.totalVagas && (
            <p className="text-red-500 text-sm">{errors.totalVagas.message}</p>
          )}
        </div>

        <div>
          <Label>Data do agendamento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dataInicio && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataInicio ? format(new Date(dataInicio), "PPP", { locale: ptBR }) : <span>Selecione a data de início</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataInicio ? new Date(dataInicio) : undefined}
                onSelect={(date) => setValue("dataInicio", date?.toISOString())}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          {errors.dataInicio && (
            <p className="text-red-500 text-sm">{errors.dataInicio.message}</p>
          )}
        </div>


        <div>
          <Label htmlFor="horarioInicio">Horário de Início</Label>
          <Select onValueChange={(value) => setValue("horarioInicio", value)}>
            <SelectTrigger id="horarioInicio">
              {watch("horarioInicio") || "Selecione um horário"}
            </SelectTrigger>
            <SelectContent>
              {horarios.map((hora) => (
                <SelectItem key={hora} value={hora}>{hora}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.horarioInicio && <p className="text-red-500 text-sm">{errors.horarioInicio.message}</p>}
        </div>

        <div>
          <Label htmlFor="horarioTermino">Horário de Término</Label>
          <Select onValueChange={(value) => setValue("horarioTermino", value)}>
            <SelectTrigger id="horarioTermino">
              {watch("horarioTermino") || "Selecione um horário"}
            </SelectTrigger>
            <SelectContent>
              {horarios.map((hora) => (
                <SelectItem key={hora} value={hora}>{hora}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.horarioTermino && <p className="text-red-500 text-sm">{errors.horarioTermino.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-center align-vertical gap-4">
      <Button type="submit" className="flex items-center gap-2"> 
        Cadastrar
      </Button>
      <Button type="button" variant="outline" onClick={handleLimpar} className="flex items-center gap-2">
        Limpar
      </Button>
      <Button type="button" variant="secondary" href="/" className="flex items-center gap-2">
      <a href="/">
        Voltar
      </a>
      </Button>
    </div>

      </form>
      <div className="max-w-md mx-auto p-4">
        <ModalMensagem options={options} onClose={closeModal} />
      </div>
    </div>
  );
}