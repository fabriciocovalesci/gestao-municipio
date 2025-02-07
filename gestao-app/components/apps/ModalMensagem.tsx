"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ModalOptions = {
  mensagem: string;
  onConfirm?: () => void; // Função chamada ao clicar em "Atualizar"
  showConfirmButton?: boolean; // Define se o botão de confirmação será mostrado
};

export function useModalMensagem() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions>({
    mensagem: "",
    showConfirmButton: false,
  });

  const showModal = (msg: string, showConfirmButton = false, onConfirm?: () => void) => {
    setOptions({ mensagem: msg, showConfirmButton, onConfirm });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOptions({ mensagem: "", showConfirmButton: false });
  };

  return { isOpen, options, showModal, closeModal };
}

export function ModalMensagem({
  options,
  onClose,
}: {
  options: ModalOptions;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!options.mensagem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atenção</DialogTitle>
        </DialogHeader>
        <DialogDescription>{options.mensagem}</DialogDescription>
        <div className="flex justify-end gap-2 mt-4">
          {options.showConfirmButton && (
            <Button onClick={() => {
              options.onConfirm?.();
              onClose();
            }}>
              Atualizar
            </Button>
          )}
          <Button onClick={onClose} variant="outline">Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
