"use client";

// Crie um formulario de cadastro de usuario com os seguintes campos:
// Nome, Email, Senha, Confirmar Senha
// Use o tailwind css para estilizar o formulario
// Use o react-hook-form para criar o formulario
// Use o yup para criar as regras de validacao
// Use o zod para criar as regras de validacao
// deve utilizar o zod para criar as regras de validacao
// deve utilizar o react-hook-form para criar o formulario
// deve utilizar a bilioteca shadcn para criar o formulario
// deve ser mobile friendly
// deve ser responsivo
// deve ter um botão de cadastrar
// deve ter um botão de limpar
// deve ter um botão de voltar
// deve ter um botão de sair


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema de validação com Zod
const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type FormValues = z.infer<typeof formSchema>;

export default function CadastroUnico() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Cadastro de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register("nome")}
                className="w-full"
              />
              {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                {...register("senha")}
                className="w-full"
              />
              {errors.senha && <p className="text-red-500 text-sm">{errors.senha.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                {...register("confirmarSenha")}
                className="w-full"
              />
              {errors.confirmarSenha && <p className="text-red-500 text-sm">{errors.confirmarSenha.message}</p>}
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Cadastrar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                className="w-full"
              >
                Limpar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
