// components/TourCard.tsx
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  image: string;
  price: string;
  date: string;
};

export default function TourCard({ id, title, image, price, date }: Props) {
  const whatsappNumber = "56961256751";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola, me interesa reservar el tour "${title}" para la fecha ${date}.`
  )}`;

  return (
    <Link
      to={`/tours/${id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <img src={image} alt={title} className="h-60 w-full object-cover" />

      <div className="p-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-gray-500 mt-2">{date}</p>
        <p className="text-blue-600 font-bold text-xl mt-4">{price}</p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: "#F2AB27" }}
          className="mt-4 w-full text-white py-3 rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2 transition-all hover:brightness-110"
        >
          <MessageCircle className="h-5 w-5" />
          Reservar
        </a>
      </div>
    </Link>
  );
}