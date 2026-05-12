import { Link } from "react-router-dom"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-16" style={{ backgroundColor: "#020873" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Columna 1: Logo y descripción */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
                <span className="leading-tight">Limari Travel</span>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 text-center text-xs uppercase tracking-[0.25em] text-slate-200">
                Sernatur
              </div>
            </div>
            <p className="max-w-md text-slate-100">
              Empresa de Turismo de la comuna de Ovalle giras nacionales e internacionales de viajes grupales.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-xl font-semibold text-white">Enlaces</h3>
            <ul className="mt-6 space-y-3 text-slate-100">
              <li><Link to="/" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Inicio</Link></li>
              <li><Link to="/tours" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Nuestros Tours</Link></li>
              <li><Link to="/study-trips" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Giras de Estudio</Link></li>
              <li><Link to="/" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Viajes Especiales</Link></li>
              <li><Link to="/" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Galería</Link></li>
              <li><Link to="/about" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Nosotros</Link></li>
              <li><Link to="/faq" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Preguntas Frecuentes</Link></li>
              <li><Link to="/contacto" className="inline-flex items-center gap-2 transition hover:text-white"><span className="text-fuchsia-300">›</span> Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contáctanos */}
          <div>
            <h3 className="text-xl font-semibold text-white">Contáctanos</h3>
            <ul className="mt-6 space-y-4 text-slate-100">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5" style={{ color: "#F2AB27" }} />
                +56 9 1234 5678
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5" style={{ color: "#F2AB27" }} />
                purbea@gmail.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5" style={{ color: "#F2AB27" }} />
                <span>Vicuña Mackenna 370, Oficina 3B, Ovalle</span>
              </li>
              {/* Redes Sociales - mismo estilo que navbar */}
              <li className="flex items-center gap-4 pt-2">
                <a
                  href="https://www.facebook.com/p/Limar%C3%AD-Travel-100068878241335/?locale=es_LA"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                  style={{ color: "#F2AB27" }}
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 2h-3a6 6 0 0 0-6 6v3H6v4h3v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h2V2z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/limari_travel?igsh=cDJscG41OGh1NHd1"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                  style={{ color: "#F2AB27" }}
                  aria-label="Instagram"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ubicación con mapa */}
          <div>
            <h3 className="text-xl font-semibold text-white">Ubicación</h3>
            <div className="mt-4 rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-xl shadow-black/20">
              <div className="mb-3 flex justify-end">
                <a
                  href="https://www.google.com/maps/search/Vicuña+Mackenna+370+Oficina+3B+Ovalle"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  Abrir en Maps
                </a>
              </div>
              <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.0675270952097!2d-71.20285919999999!3d-30.6038585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x968e4aa8b8152613%3A0xb347e2fa208eee9a!2sBenjamin%20Vicu%C3%B1a%20Mackenna%20370%2C%20oficina%203B%2C%201840000%20Ovalle%2C%20Coquimbo!5e0!3m2!1ses!2scl!4v1778530484842!5m2!1ses!2scl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa oficina Limari Travel"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-slate-200">
          © 2026 Limari Travel. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}