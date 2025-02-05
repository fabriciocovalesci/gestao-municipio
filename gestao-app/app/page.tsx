"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">CajuSoft</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="/cadastroUnico" className="hover:text-indigo-600">Cadastro Único</a>
            <a href="#about" className="hover:text-indigo-600">CRAS</a>
          </nav>
          {/* <Button className="hidden md:block">Sign Up</Button>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button> */}
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4">
            <a href="#features" className="block">Cadastro Único</a>
            <a href="#about" className="block">CRAS</a>
            {/* <a href="#contact" className="block">Contact</a>
            <Button className="w-full">Sign Up</Button> */}
          </div>
        )}
      </header>


      <section className="flex-1 flex items-center justify-center text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-24 px-4">
        <div>
          <h2 className="text-4xl font-bold">Bem vindo Gestão Municipios</h2>
          <p className="mt-4 text-lg">Cadastro de agendamentos rápido e simples</p>
          {/* <Button className="mt-6">Get Started</Button> */}
        </div>
      </section>


      <section id="features" className="py-16 px-4 container mx-auto text-center">
        <h3 className="text-2xl font-bold">Nossos recursos</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {["Rápido", "Seguro", "Fácil de usar"].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{feature}</CardTitle>
              </CardHeader>
              <CardContent>Experimente o serviço {feature.toLowerCase()} como nunca antes.</CardContent>
            </Card>
          ))}
        </div>
      </section>



      <footer className="py-6 text-center text-gray-600">
        &copy; {new Date().getFullYear()} CajuSoft. Todos direitos reservados.
      </footer>
    </div>
  );
}
