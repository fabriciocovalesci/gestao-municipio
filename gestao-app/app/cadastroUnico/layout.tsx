'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
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
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4">
            <a href="/cadastroUnico" className="block">Cadastro Único</a>
            <a href="#about" className="block">CRAS</a>
          </div>
        )}
      </header>
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}