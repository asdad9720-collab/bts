import { Button } from "@/components/ui/button";

export const OrganizerInfo = () => {
  return (
    <section className="bg-[#12263F] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 relative">
            {/* Vertical divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
            
            {/* Producer */}
            <div className="pr-8 md:pr-16">
              <p className="text-xs text-white/60 mb-4">Produzido por:</p>
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="2" width="3" height="20" />
                    <rect x="11" y="6" width="3" height="16" />
                    <rect x="16" y="4" width="3" height="18" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl mb-2">
                    BIGHIT MUSIC, VIRTUAL TICKET
                  </h4>
                  <a 
                    href="#" 
                    className="text-sm text-white hover:text-primary transition-colors underline"
                  >
                    Mais eventos do produtor
                  </a>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pl-8 md:pl-16">
              <p className="text-xs text-white/60 mb-4">Local do evento:</p>
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg mb-1">
                    SÃO PAULO - SP | Estádio do Morumbis
                  </h4>
                  <p className="text-sm text-white/80 mb-1">
                    Praça Roberto Gomes Pedrosa, 1 - Morumbi,
                  </p>
                  <p className="text-sm text-white/80 mb-3">
                    São Paulo - SP, 05653-070
                  </p>
                  <a 
                    href="#" 
                    className="text-sm text-white hover:text-primary transition-colors underline inline-block mb-4"
                  >
                    Mais eventos neste local
                  </a>
                  <div>
                    <Button 
                      variant="outline" 
                      className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white bg-transparent"
                    >
                      Ver local
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
