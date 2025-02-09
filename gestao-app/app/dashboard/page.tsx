"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Agendamento {
  _id: string;
  data: string;
  tipoServico: string;
  horarios: {
    inicio: string;
    termino: string;
    primeiraViaRG: boolean;
    segundaViaRG: boolean;
    reservista: boolean;
  }[];
  vagasDisponiveis: number;
  cliente?: {
    nome: string;
    cpf: string;
    id: string
  };
  compareceu: boolean;
  documentosEntregues: {
    cpf: boolean;
    comprovanteResidencia: boolean;
    certidaoNascimento: boolean;
    foto3x4: boolean;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparecimentos, setComparecimentos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await fetch("/api/appointment")
        const apointments = await response.json()

        console.log(apointments)

        // Mock de dados
        const mockData = [
          {
            _id: '1',
            data: new Date().toISOString().split('T')[0],
            tipoServico: 'Emissão de RG',
            horarios: [
              {
                inicio: '08:00',
                termino: '09:00',
                primeiraViaRG: true,
                segundaViaRG: false,
                reservista: false
              }
            ],
            vagasDisponiveis: 1,
            cliente: {
              nome: 'Maria Oliveira',
              cpf: '987.654.321-00'
            },
            compareceu: false,
            documentosEntregues: {
              cpf: false,
              comprovanteResidencia: false,
              certidaoNascimento: false,
              foto3x4: false
            }
          },
          {
            _id: '2',
            data: new Date().toISOString().split('T')[0],
            tipoServico: 'Emissão de Reservista',
            horarios: [
              {
                inicio: '10:00',
                termino: '11:00',
                primeiraViaRG: false,
                segundaViaRG: false,
                reservista: true
              }
            ],
            vagasDisponiveis: 1,
            cliente: {
              nome: 'Carlos Souza',
              cpf: '456.789.123-00'
            },
            compareceu: true,
            documentosEntregues: {
              cpf: false,
              comprovanteResidencia: false,
              certidaoNascimento: false,
              foto3x4: false
            }
          },
          {
            _id: '3',
            data: new Date().toISOString().split('T')[0],
            tipoServico: 'Segunda Via de RG',
            horarios: [
              {
                inicio: '14:00',
                termino: '15:00',
                primeiraViaRG: false,
                segundaViaRG: true,
                reservista: false
              }
            ],
            vagasDisponiveis: 2,
            cliente: null,
            compareceu: true,
            documentosEntregues: {
              cpf: false,
              comprovanteResidencia: false,
              certidaoNascimento: false,
              foto3x4: false
            }
          }
        ];


        setAgendamentos(apointments);

        const comparecimentosIniciais = mockData.reduce((acc, agendamento) => {
          acc[agendamento._id] = agendamento.compareceu;
          return acc;
        }, {} as Record<string, boolean>);

        setComparecimentos(comparecimentosIniciais);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, []);

  const handleComparecimento = (id: string, checked: boolean) => {
    setComparecimentos(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleRowClick = (id: string) => {
    console.log("+++++++++++++ ", id)
    router.push(`/dashboard/${id}`);
  };

  const hoje = "2025-02-06"; // new Date().toISOString().split('T')[0];

  const agendamentosHoje = useMemo(() => {
    const unicos = new Set();
  
    return agendamentos
      .filter((agendamento) => agendamento.data === hoje)

    //   .filter((agendamento) => {
    //     const chave = agendamento.cliente.nome;
    //     if (unicos.has(chave)) {
    //       return false; // Já existe, então remove do array final
    //     }
    //     unicos.add(chave);
    //     return true; // Não existe ainda, então mantém
    //   });
  }, [agendamentos]);
  
      

    console.log("agendamentosHoje ", agendamentosHoje)

  if (loading) {
    return <div>Carregando agendamentos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">Agendamentos para Hoje</h1>
      
      <Table className="rounded-lg shadow-md overflow-hidden">
        <TableCaption className="text-gray-600 mb-4">Lista de agendamentos para o dia atual</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="font-medium">Horário</TableHead>
            <TableHead className="font-medium">Serviço</TableHead>
            <TableHead className="font-medium">Nome</TableHead>
            <TableHead className="font-medium">Comparecimento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendamentosHoje.map((agendamento) =>
            agendamento.horarios.map((horario, index) => {
              const id = agendamento.cliente.id;

              return (
                <TableRow 
                key={`${id}-${index}`}
                onClick={() => handleRowClick(id)}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    comparecimentos[id] ? 'bg-gray-100' : ''
                }`}
                >

                  <TableCell>{`${horario.inicio} - ${horario.termino}`}</TableCell>
                  <TableCell>{agendamento.tipoServico}</TableCell>
                  <TableCell>
                    {agendamento.cliente?.nome || <span className="text-gray-400">Vago</span>}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      id={`comparecimento-${id}`}
                      checked={comparecimentos[id] || false} 
                      onCheckedChange={(checked) => handleComparecimento(id, checked === true)}
                      className="data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
