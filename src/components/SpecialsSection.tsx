// SpecialsSection.tsx
import { Users, Building2, Briefcase, MapPin, Bus, Wifi, AirVent, Tv, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SpecialsSection() {
  return (
    <section className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Servicios Exclusivos
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Viajes Especiales y Traslados Privados
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Más de 30 años de experiencia nos respaldan. Diseñamos cada viaje para adaptarnos a tus necesidades, con la comodidad, seguridad y calidad que nos distingue.
          </p>
        </div>

        {/* Sección: ¿Para quién? */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">¿Para quién está pensado este servicio?</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { icon: Building2, title: "Empresas", desc: "Traslados corporativos y ejecutivos." },
              { icon: Users, title: "Organizaciones", desc: "Delegaciones y grupos organizados." },
              { icon: Briefcase, title: "Turistas", desc: "Grupos turísticos y viajes familiares." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
                <item.icon className="mx-auto h-10 w-10 text-cyan-500" />
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cobertura */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-cyan-50 to-indigo-50 p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <MapPin className="h-8 w-8 text-cyan-600" />
              <h2 className="mt-4 text-2xl font-semibold">Cobertura Nacional e Internacional</h2>
              <p className="mt-4 text-slate-600">
                Realizamos viajes dentro de la Región de Coquimbo y a lo largo de todo Chile, adaptándonos a tu itinerario, horarios y requerimientos específicos.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center shadow-md">
              <p className="font-mono text-sm text-slate-400">Destinos destacados</p>
              <p className="mt-2 text-lg font-semibold">La Serena • Santiago • San Pedro de Atacama</p>
            </div>
          </div>
        </div>

        {/* Flota */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Nuestra Flota y Equipamiento</h2>
            <p className="mt-2 text-slate-500">Modernos buses equipados para una experiencia superior</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Bus, title: "Asientos Semicama", desc: "Amplio espacio y confort" },
              { icon: AirVent, title: "Aire Acondicionado", desc: "Climatización perfecta" },
              { icon: Tv, title: "Sistema de Entretenimiento", desc: "Viajes más amenos" },
              { icon: Wifi, title: "Internet Satelital", desc: "Starlink en unidades selectas" },
              { icon: ShieldCheck, title: "Conductores Profesionales", desc: "Altamente capacitados" },
              { icon: Sparkles, title: "Mantenimiento Preventivo", desc: "Flota siempre en óptimas condiciones" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <item.icon className="h-6 w-6 flex-shrink-0 text-cyan-500" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seguridad */}
        <div className="mt-20 rounded-2xl bg-slate-900 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <ShieldCheck className="h-8 w-8 text-cyan-400" />
              <h2 className="mt-4 text-2xl font-semibold">Seguridad y Confianza</h2>
              <p className="mt-4 text-slate-300">
                Contamos con el respaldo de ser una empresa registrada en SERNATUR, lo que garantiza un servicio formal, seguro y confiable para todos nuestros pasajeros.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Registro SERNATUR</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-20 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-fuchsia-500/10 via-amber-500/5 to-cyan-500/10 p-8 md:p-12">
            <h2 className="text-3xl font-semibold">¿Necesitas un viaje a tu medida?</h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-500">
              Contáctanos por WhatsApp y te asesoraremos de forma personalizada para encontrar la mejor opción según tu grupo y destino.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/56961256751"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Hablar por WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Solicitar Cotización
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400">Mi nombre es Max Oro Cortés, estaré encantado de asesorarte.</p>
          </div>
        </div>
      </div>
    </section>
  );
}