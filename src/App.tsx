// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Tours from "./pages/Tours"
import TourDetail from "./pages/TourDetail"
import Contacto from "./pages/Contact"
import Specials from "./pages/Specials" 
import About from "./pages/About"; 
import StudyTrips from "./pages/StudyTrips";
import Faq from "./pages/Faq";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/tours" element={<><Navbar /><Tours /><Footer /></>} />
          <Route path="/tours/:id" element={<><Navbar /><TourDetail /><Footer /></>} />
          <Route path="/contacto" element={<><Navbar /><Contacto /><Footer /></>} />
          <Route path="/specials" element={<><Navbar /><Specials /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/study-trips" element={<><Navbar /><StudyTrips /><Footer /></>} />
          <Route path="/faq" element={<><Navbar /><Faq /><Footer /></>} />
          
          {/* Rutas de admin (sin Navbar/Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App