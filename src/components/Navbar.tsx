// components/Navbar.tsx
import { Link, NavLink } from "react-router-dom"
import { Menu, X} from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll para ocultar la barra superior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cerrar menú al hacer click en un enlace
  const closeMenu = () => setIsMenuOpen(false)

  // Clases para los enlaces activos e inactivos (igual que original)
  const activeClass = "border-b-4 pb-1"
  const inactiveClass = "transition hover:text-slate-950"

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar - originalmente siempre visible, en móvil se oculta al hacer scroll */}
      <div 
        className={`text-slate-100 transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 py-0 opacity-0 md:max-h-24 md:py-3 md:opacity-100" : "max-h-24 py-3 opacity-100"
        }`}
        style={{ backgroundColor: "#020873" }}
      >
        <div className="mx-auto flex flex-col gap-2 px-6 py-3 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span className="inline-flex items-center justify-center gap-2" style={{ color: "#F2AB27" }}>
            <span>WhatsApp</span>
            <strong className="text-slate-100" style={{ color: "#F2AB27" }}>+56 9 1234 5678</strong>
            <span style={{ color: "#F2AB27" }}>·</span>
            <span style={{ color: "#F2AB27" }}>purbea@gmail.com</span>
          </span>

          <div 
            className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm shadow-sm"
            style={{ 
              backgroundColor: "#020873", 
              borderColor: "#F2AB27",
              color: "#F2AB27"
            }}
          >
            Servicio Turístico Registrado en Sernatur
          </div>

          <div className="inline-flex items-center justify-center gap-3 sm:justify-end">
            <a 
              href="https://www.facebook.com/p/Limar%C3%AD-Travel-100068878241335/?locale=es_LA" 
              target="_blank" 
              rel="noreferrer" 
              className="transition hover:text-white"
              style={{ color: "#F2AB27" }}
            >
              <svg 
                className="h-4 w-4" 
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
            >
              <svg 
                className="h-4 w-4" 
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
          </div>
        </div>
      </div>

      {/* Main navbar - igual que original */}
      <div className="bg-slate-100 border-b border-slate-200 shadow-sm">
        <div className="mx-auto grid gap-4 px-6 py-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <Link to="/" className="inline-flex items-center gap-3 text-slate-950">
            <img 
              src="/logo.png" 
              alt="Limari Travel Logo"
              className="h-14 w-14 rounded-full object-cover shadow-lg shadow-cyan-500/20"
            />
            <div>
              <p className="text-base font-semibold">Limari Travel</p>
            </div>
          </Link>

          {/* Desktop Navigation - visible en desktop */}
          <nav className="hidden sm:flex flex-wrap justify-center gap-5 text-sm font-semibold text-slate-700 overflow-x-auto whitespace-nowrap">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/tours" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Tours
            </NavLink>
            <NavLink 
              to="/study-trips" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Giras
            </NavLink>
            <NavLink 
              to="/specials" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Especiales
            </NavLink>
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Galería
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Nosotros
            </NavLink>
            <NavLink 
              to="/faq" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Preguntas Frecuentes
            </NavLink>
            <NavLink 
              to="/contacto" 
              className={({ isActive }) => isActive ? activeClass : inactiveClass}
              style={({ isActive }) => isActive ? { borderBottomColor: "#F2AB27", color: "#F2AB27" } : {}}
            >
              Contacto
            </NavLink>
          </nav>

          {/* Botón menú hamburguesa - solo visible en móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute right-4 top-5 sm:hidden p-2 rounded-lg hover:bg-slate-200 transition"
            aria-label="Menú"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-slate-700" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col border-t border-slate-200 bg-slate-100 pb-4">
            <NavLink 
              to="/" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/tours" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Tours
            </NavLink>
            <NavLink 
              to="/study-trips" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Giras de Estudio
            </NavLink>
            <NavLink 
              to="/specials" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Viajes Especiales
            </NavLink>
            <NavLink 
              to="/gallery" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Galería
            </NavLink>
            <NavLink 
              to="/about" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Nosotros
            </NavLink>
            <NavLink 
              to="/faq" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Preguntas Frecuentes
            </NavLink>
            <NavLink 
              to="/contacto" 
              onClick={closeMenu}
              className={({ isActive }) => 
                `px-6 py-3 text-base font-medium transition ${
                  isActive 
                    ? "bg-cyan-50 text-[#F2AB27] border-l-4 border-[#F2AB27]" 
                    : "text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              Contacto
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}