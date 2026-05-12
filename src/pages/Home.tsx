// pages/Home.tsx
import Hero from "../components/Hero";
import UpcomingTrips from "../components/UpcomingTrips";
import Testimonials from "../components/Testimonials"; 

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <UpcomingTrips />
      <Testimonials /> 
    </main>
  );
}