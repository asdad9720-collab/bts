import { Heart, Calendar, MapPin, Clock, User } from "lucide-react";
import bannerImage from "../assets/banner-vaquejada.jpg";

export const EventBanner = () => {
  return (
    <section className="bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
         
          <div className="bg-gray-900 rounded-lg overflow-hidden w-full aspect-video lg:h-[400px] lg:aspect-auto">
            <img
              src={bannerImage}
              alt="Banner do Evento Vaquejada de Garanhuns"
              className="w-full h-full object-cover" // Isso está correto
            />
          </div>

          {/* Event Info Card */}
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
              BTS WORLD TOUR: ARIRANG
            </h1>
            
            <div className="space-y-4 mb-6">
              {/* Date */}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span className="text-gray-900 font-medium">31 de outubro de 2026</span>
              </div>
              
              {/* Favorite */}
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">SÃO PAULO - SP | ESTÁDIO DO MORUMBIS</p>
                  <p className="mt-1">Praça Roberto Gomes Pedrosa, 1 - Morumbi,</p>
                  <p>São Paulo - SP, 05653-070</p>
                </div>
              </div>
              
              {/* Time */}
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">21:00</span>
              </div>
              
              {/* Classification */}
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">Classificação: 16 anos (Menores de 05 a 15 anos apenas acompanhados dos pais ou responsáveis legais)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
