import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// Certifique-se de que este import está correto, como corrigimos antes
import logoSrc from "../assets/logo.png"; // <-- Verifique o nome do seu arquivo aqui

export const Header = () => {
  return (
    <header className="bg-event-darker border-b border-event-darker sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* MUDANÇAS AQUI:
          - 'flex-wrap': Permite que os itens quebrem para a linha de baixo.
          - 'py-3': Dá uma altura flexível no mobile.
          - 'md:flex-nowrap': Impede a quebra de linha no desktop.
          - 'md:h-16': Restaura a altura fixa de 16 no desktop.
        */}
        <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-4 md:h-16 py-3">
         
          {/* Logo container (sem mudança) */}
          <div className="flex items-center gap-2">
            <img 
            src={logoSrc} 
            alt="Logo da Empresa"
            className="h-10 w-auto"
          />
          </div>

          {/* MUDANÇAS AQUI:
            - 'order-3': Joga a busca para o final (linha de baixo) no mobile.
            - 'w-full': Faz a busca ocupar 100% da largura no mobile.
            - 'md:order-2': Restaura a ordem (meio) no desktop.
            - 'md:w-auto', 'md:flex-1', 'md:max-w-2xl': Restauram os estilos de desktop.
          */}
          <div className="w-full md:w-auto order-3 md:order-2 md:flex-1 md:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* MUDANÇAS AQUI:
            - 'order-2': Coloca o idioma ao lado da logo (no topo) no mobile.
            - 'md:order-3': Restaura a ordem (final) no desktop.
          */}
          <div className="flex items-center gap-4 order-2 md:order-3">
            <button className="text-sm text-white hover:text-primary transition-colors">
              Todos os idiomas
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};