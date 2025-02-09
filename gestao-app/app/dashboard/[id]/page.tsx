"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { notFound, useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface Cliente {
  name: string;
  cpf: string;
  tipoServico: string;
}

export default function ClientePage() {
  const params = useParams(); // ✅ Agora usamos o hook correto
  const id = params.id as string; // Certificando que é uma string
  const router = useRouter();

  const [user, setUser] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) {
          throw new Error("ID inválido");
        }

        const res = await fetch(`/api/users?id=${id}`);

        if (!res.ok) {
          throw new Error(`Erro ao buscar usuário: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (!id) return notFound();

  if (loading) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }


  console.log('user ', user)

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Ocorreu um erro: {error}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
        Detalhes do Usuário
      </h1>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" value={user?.name || ""} readOnly className="bg-gray-100" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" value={user?.cpf || ""} readOnly className="bg-gray-100" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="servico">Tipo de Serviço</Label>
          <Input id="servico" value={user?.tipoServico || ""} readOnly className="bg-gray-100" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            placeholder="Adicione observações relevantes sobre o atendimento..."
            className="min-h-[150px]"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button className="bg-gray-800 hover:bg-gray-900 flex items-center gap-2">
            <Save size={20} /> Salvar
          </Button>

          <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft size={20} /> Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
