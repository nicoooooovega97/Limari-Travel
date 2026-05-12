import { Award, Bus, Heart, MapPin, Shield, Users, Clock, Compass, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header con frase principal */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Experiencia en Viajar
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Buses Pulpica,{" "}
            <span className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
              Experiencia en Viajar
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Creemos que viajar no es solo trasladarse, es vivir una experiencia.
          </p>
        </div>

        {/* Sello Sernatur */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-cyan-50 px-6 py-3 text-cyan-700">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Servicio Turístico Registrado en Sernatur</span>
          </div>
        </div>

        {/* Historia */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold">Nuestra Historia</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                Nuestra historia comienza hace más de <strong className="text-fuchsia-600">30 años</strong>, cuando nuestro padre,{" "}
                <strong>Jorge Oro Cortés</strong>, inició el transporte de pasajeros en el recorrido local entre Pulpica y Ovalle. 
                Con esfuerzo y compromiso, sentó las bases de lo que hoy somos.
              </p>
              <p>
                Con el tiempo, hemos evolucionado, manteniendo nuestros recorridos locales y potenciando con fuerza una nueva etapa:{" "}
                <strong className="text-cyan-600">el turismo</strong>. Hoy nos enfocamos en entregar experiencias de viaje que van más 
                allá del traslado, combinando seguridad, comodidad y un trato cercano que nos caracteriza.
              </p>
              <p>
                Seguimos creciendo con el mismo espíritu de nuestros inicios, pero con una visión clara:{" "}
                <strong>hacer de cada viaje una experiencia memorable</strong>.
              </p>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-50 to-cyan-50 p-6 italic text-slate-700">
                <p className="text-lg font-medium">"Llevamos más de tres décadas conectando familias y creando recuerdos inolvidables."</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 p-6 text-center">
                <Bus className="mx-auto h-8 w-8 text-fuchsia-600" />
                <p className="mt-2 text-2xl font-bold text-fuchsia-700">30+</p>
                <p className="text-sm text-slate-600">Años de experiencia</p>
              </div>
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-cyan-600" />
                <p className="mt-2 text-2xl font-bold text-cyan-700">Miles</p>
                <p className="text-sm text-slate-600">Pasajeros satisfechos</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 p-6 text-center">
                <MapPin className="mx-auto h-8 w-8 text-amber-600" />
                <p className="mt-2 text-2xl font-bold text-amber-700">Chile</p>
                <p className="text-sm text-slate-600">Cobertura nacional</p>
              </div>
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 p-6 text-center">
                <Award className="mx-auto h-8 w-8 text-indigo-600" />
                <p className="mt-2 text-2xl font-bold text-indigo-700">SERNATUR</p>
                <p className="text-sm text-slate-600">Registro oficial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-fuchsia-100 p-3 text-fuchsia-600">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Misión</h3>
            </div>
            <p className="mt-4 text-slate-600">
              “Entregar el mejor servicio de turismo, transformando cada viaje en una verdadera experiencia, con un enfoque en la seguridad, cercanía y confianza”
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-100 p-3 text-cyan-600">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Visión</h3>
            </div>
            <p className="mt-4 text-slate-600">
              “Ser la mejor empresa de viajes de turismo de la región de Coquimbo, reconocida por la calidad de nuestras experiencias y el compromiso con cada Viajero”
            </p>
          </div>
        </div>

        {/* Valores / Sello distintivo */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Nuestro Compromiso</h2>
            <p className="mt-2 text-slate-500">Lo que nos hace diferentes</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Heart, title: "Trato Cercano", desc: "La calidez que nos caracteriza desde nuestros inicios" },
              { icon: Shield, title: "Seguridad", desc: "Flota moderna y conductores altamente capacitados" },
              { icon: Clock, title: "Puntualidad", desc: "Respeto por tu tiempo y compromiso con cada viaje" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
                <item.icon className="mx-auto h-10 w-10 text-cyan-500" />
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}