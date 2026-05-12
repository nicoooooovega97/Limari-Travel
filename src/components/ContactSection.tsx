import { Mail, Phone, MapPin, Clock, Building, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    tourInterest: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
    // Resetear formulario
    setFormData({ name: "", email: "", phone: "", message: "", tourInterest: "" });
  };

  return (
    <section id="contacto" className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Contáctanos
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Ponte en Contacto
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            ¿Tienes dudas sobre algún tour o deseas organizar un viaje especial? 
            Escríbenos y un ejecutivo te asesorará.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          
          {/* Columna Izquierda - Información de Contacto */}
          <div className="space-y-8">
            {/* Tarjeta de información */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Información de Contacto</h2>
              <p className="mt-2 text-slate-500">
                Estamos para ayudarte a coordinar tu próxima gran experiencia.
              </p>
              
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-cyan-100 p-3 text-cyan-600">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Oficina Central</h3>
                    <p className="text-slate-600">Vicuña Mackenna 370, Oficina 3B, Ovalle</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Teléfono y WhatsApp</h3>
                    <a href="https://wa.me/56961256751" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-green-600 transition">
                      +56 9 6125 6751
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Correo Electrónico</h3>
                    <a href="mailto:contacto@limaritravel.cl" className="text-slate-600 hover:text-blue-600 transition">
                      contacto@limaritravel.cl
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Horario de Atención</h3>
                    <p className="text-slate-600">Lunes a Viernes: 10:00 - 18:30 hrs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
              <div className="bg-slate-100 p-4 border-b border-slate-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                  Nuestra Ubicación
                </h3>
              </div>
              <div className="aspect-[4/3] w-full bg-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.0675270952097!2d-71.20285919999999!3d-30.6038585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x968e4aa8b8152613%3A0xb347e2fa208eee9a!2sBenjamin%20Vicu%C3%B1a%20Mackenna%20370%2C%20oficina%203B%2C%201840000%20Ovalle%2C%20Coquimbo!5e0!3m2!1ses!2scl!4v1778530484842!5m2!1ses!2scl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Oficina Limari Travel - Vicuña Mackenna 370, Oficina 3B, Ovalle"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario de Contacto */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-[#F2AB27] p-2">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Envíanos un Mensaje</h2>
            </div>
            
            <p className="text-slate-500 mb-6">
              Completa el formulario y te responderemos a la brevedad.
            </p>

            {formSubmitted && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="+56 9 XXXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tourInterest" className="block text-sm font-medium text-slate-700">
                  ¿Te interesa algún tour en especial?
                </label>
                <select
                  id="tourInterest"
                  name="tourInterest"
                  value={formData.tourInterest}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="valle-elqui">Valle del Elqui</option>
                  <option value="san-pedro">San Pedro de Atacama</option>
                  <option value="full-day-buin">Full Day Buinzoo</option>
                  <option value="cotizar-especial">Cotizar Viaje Especial</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Cuéntanos tu consulta o requerimiento..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2AB27] px-6 py-3 font-semibold text-white transition hover:bg-[#e09a1a]"
              >
                <Send className="h-4 w-4" />
                Enviar Mensaje
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                También puedes contactarnos directamente por WhatsApp
              </p>
              <a
                href="https://wa.me/56961256751"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp 
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}