export const Footer = () => {
  return (
    <footer className="bg-event-darker text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quem somos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Trabalhe Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Termos e Políticas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Termos de uso
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Ajuda</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Regulamento
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Redes sociais</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <span>f</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <span>📸</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="text-xs text-gray-400 space-y-2">
            <p>Virtual Ticket LTDA - CNPJ: 27.956.430/0001-38</p>
            <p>Virtual Ticket LTDA: Garantimos a entrega de suas passagens dentro de 48 horas.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
