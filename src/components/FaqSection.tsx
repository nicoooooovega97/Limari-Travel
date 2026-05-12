import { useState } from "react";
import { ChevronDown, MessageCircle, CreditCard, IdCard, Luggage, Baby, Dog, Wifi, MapPin, Info, Users, CalendarX, Beer, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";


function FaqItem({ question, answer, icon: Icon }: { question: string; answer: string; icon: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:bg-slate-50/50 px-4 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
          <span className="font-semibold text-slate-800">{question}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <div className="px-4 pr-8 text-slate-600 leading-relaxed">
          {answer.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  // Agrupación de preguntas por categoría
  const faqCategories = [
    {
      title: "Reservas y Pagos",
      icon: CreditCard,
      items: [
        {
          question: "¿Cómo puedo reservar y pagar mi pasaje?",
          answer: "Todas las reservas se realizan a través de WhatsApp, al número indicado en cada publicación. Al momento de escribirnos, debes enviar tu nombre completo y lugar de residencia para gestionar correctamente tu reserva.\n\nPara asegurar tu cupo, es necesario realizar un abono mediante transferencia; sin este pago, tu asiento no será reservado. Una vez confirmado, tu cupo quedará asegurado. El saldo restante puede pagarse antes o durante el viaje, ya sea por transferencia o en efectivo.",
          icon: CreditCard
        },
        {
          question: "¿Puedo solicitar la devolución de mi pasaje si no deseo viajar?",
          answer: "Sí, puedes solicitar la devolución de tu abono siempre que lo hagas con al menos 30 días de anticipación a la fecha de inicio del viaje.\n\nNo se realizan devoluciones de pasajes si la solicitud se realiza con menos de ese plazo. En ese caso, puedes cambiar el pasaje a otro pasajero durante este periodo.\n\nEsta política nos permite organizar de mejor manera cada viaje y asegurar la disponibilidad de cupos para todos nuestros pasajeros.",
          icon: CalendarX
        },
        {
          question: "¿Puedo seleccionar mi asiento al momento de viajar?",
          answer: "No, la selección de asientos no se realiza de forma directa por parte del pasajero.\n\nLa asignación de asientos se efectúa según el orden de confirmación de las reservas, es decir, las primeras personas en reservar obtienen los primeros asientos, y así sucesivamente hasta completar la capacidad del bus.\n\nEl número de asiento será informado un día antes del viaje, junto con los detalles finales del servicio.\n\nDe esta forma, mantenemos una organización clara y equitativa para todos nuestros pasajeros.",
          icon: Users
        }
      ]
    },
    {
      title: "Documentación y Normativas",
      icon: IdCard,
      items: [
        {
          question: "¿Debo llevar mi cédula de identidad?",
          answer: "Sí, es obligatorio portar tu cédula de identidad al momento de viajar.\n\nDe acuerdo con la normativa chilena, toda persona debe poder acreditar su identidad durante el trayecto, especialmente en viajes interurbanos, controles en ruta o al momento de abordar.\n\nTe recomendamos llevar tu documento vigente y en buen estado, ya que puede ser solicitado en cualquier momento por personal del servicio o autoridades correspondientes.",
          icon: IdCard
        },
        {
          question: "¿Puede viajar un adulto mayor solo?",
          answer: "Sí, un adulto mayor puede viajar solo, siempre que sea autovalente y pueda desenvolverse de manera independiente durante el viaje.\n\nEn caso contrario, deberá viajar acompañado por un adulto responsable, quien se haga cargo de su asistencia y necesidades durante el trayecto.\n\nDe esta forma, buscamos resguardar la seguridad y bienestar de todos nuestros pasajeros.",
          icon: Users
        },
        {
          question: "¿Puedo consumir alcohol o fumar durante el viaje?",
          answer: "No está permitido consumir alcohol ni fumar al interior de nuestros buses.\n\nDe acuerdo con la legislación chilena, se prohíbe el consumo de bebidas alcohólicas y el uso de cigarrillos en vehículos de transporte de pasajeros. Además, el conductor no puede permitir el ingreso de personas en estado de ebriedad o que no mantengan un comportamiento adecuado.\n\nDe esta forma, garantizamos la seguridad, el respeto y una buena convivencia durante todo el viaje.",
          icon: Beer
        }
      ]
    },
    {
      title: "Equipaje y Mascotas",
      icon: Luggage,
      items: [
        {
          question: "¿Cuánto equipaje puedo llevar?",
          answer: "Se permite llevar equipaje moderado y acorde al tipo de viaje.\n\nGeneralmente se permite una maleta por persona más un bolso o mochila de mano, ya que el espacio en bodega es limitado.\n\nDe esta forma, aseguramos un viaje cómodo, ordenado y seguro para todos.",
          icon: Luggage
        },
        {
          question: "¿Se permiten mascotas en los Viajes de Turismo?",
          answer: "Para garantizar el bienestar de todos los pasajeros, no está permitido el transporte de mascotas en nuestros viajes de turismo.",
          icon: Dog
        }
      ]
    },
    {
      title: "Viajes con Niños",
      icon: Baby,
      items: [
        {
          question: "¿Puedo viajar con niños?",
          answer: "Sí, todos pueden viajar con nosotros, incluyendo niños.\n\nCada niño debe ocupar su propio asiento y utilizar siempre su cinturón de seguridad, tal como lo establece la normativa vigente en Chile para el transporte de pasajeros en buses, donde el uso del cinturón es obligatorio para todos los ocupantes.\n\nDe esta forma, aseguramos un viaje cómodo y seguro para todos nuestros pasajeros, especialmente los más pequeños.",
          icon: Baby
        }
      ]
    },
    {
      title: "Servicios a Bordo",
      icon: Wifi,
      items: [
        {
          question: "¿Los buses cuentan con baños y Wifi?",
          answer: "Algunas de nuestras unidades cuentan con servicios higiénicos a bordo, aire acondicionado y WiFi satelital, especialmente en viajes de larga distancia. Sin embargo, estos servicios pueden variar según el bus asignado al tour.",
          icon: Wifi
        },
        {
          question: "¿Qué incluye el pasaje?",
          answer: "Nuestros programas turísticos incluyen transporte ida y vuelta.\n\nDependiendo del destino, también pueden incorporar servicios adicionales como desayuno, comidas, alojamiento en cabañas y guía turístico.\n\nToda esta información se detalla claramente en cada uno de nuestros flyers y publicaciones de viajes, para que puedas conocer exactamente lo que incluye tu experiencia antes de reservar.",
          icon: Info
        }
      ]
    },
    {
      title: "Logística",
      icon: MapPin,
      items: [
        {
          question: "¿Cuáles son los puntos de recogida?",
          answer: "Los horarios y lugares de salida pueden variar según el tour contratado. Generalmente, nuestros puntos de partida son Monte Patria y el Terminal de Buses de Ovalle, en la Región de Coquimbo.\n\nLos detalles exactos se confirman previamente a través de WhatsApp, para brindarte mayor seguridad y organización.",
          icon: MapPin
        }
      ]
    }
  ];

  return (
    <section className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Resolución de Dudas
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Preguntas Frecuentes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            ¿Tienes dudas? Aquí te ayudamos. Si no encuentras lo que buscas, no dudes en contactarnos directamente.
          </p>
        </div>

        {/* Acordeón de preguntas agrupadas */}
        <div className="mt-12 space-y-10">
          {faqCategories.map((category) => (
            <div key={category.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-cyan-600" />
                  <h2 className="text-xl font-semibold text-slate-800">{category.title}</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {category.items.map((item, idx) => (
                  <FaqItem
                    key={idx}
                    question={item.question}
                    answer={item.answer}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final - Aún tienes preguntas */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-fuchsia-50 to-cyan-50 p-8 text-center md:p-10">
          <HelpCircle className="mx-auto h-10 w-10 text-fuchsia-500" />
          <h2 className="mt-3 text-2xl font-semibold text-slate-800">¿Aún tienes preguntas?</h2>
          <p className="mx-auto mt-2 max-w-md text-slate-600">
            Nuestro equipo está listo para ayudarte con cualquier consulta adicional que tengas.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/56961256751"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" />
              Contactar Ahora
            </a>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Ir a Contacto
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}