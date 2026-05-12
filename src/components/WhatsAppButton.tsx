import TourCard from "./TourCard"

const tours = [
  {
    title: "Valle del Elqui",
    image: "/tour1.jpg",
    date: "15 Junio 2026",
    price: "$49.990",
    id: 1,
  },
  {
    title: "San Pedro de Atacama",
    image: "/tour2.jpg",
    date: "22 Julio 2026",
    price: "$320.000",
    id: 2,
  },
]

export default function ToursSection() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center">
          Tours Destacados
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {tours.map((tour) => (
            <TourCard key={tour.title} {...tour} />
          ))}
        </div>
      </div>
    </section>
  )
}