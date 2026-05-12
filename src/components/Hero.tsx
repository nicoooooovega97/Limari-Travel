// components/Hero.tsx
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* Imagen de fondo */}
      <img 
        src="/torres.jpg" 
        alt="Torres del Paine"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-500/20 to-transparent" />
      
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 px-6 py-24 text-center lg:py-28">
        <div className="max-w-3xl space-y-8">
          <p className="text-base font-semibold uppercase tracking-[0.38em] text-amber-300">
            Experiencia en Viajar
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Descubre Nuevos Destinos con Limari Travel
          </h1>

          <p className="mx-auto max-w-2xl text-slate-200 sm:text-lg">
            Empresa de Turismo de Ovalle, Región de Coquimbo. Confort, seguridad y la mejor atención para tus viajes inolvidables.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0511F2] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Próximos Viajes Disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F2AB27] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}