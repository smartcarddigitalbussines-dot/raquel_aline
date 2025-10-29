import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import BookingSection from './components/BookingSection';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="home" className="pt-16">
        <Hero />
        <ServicesSection />
        <BookingSection />
        <AdminPanel />
      </main>
      <Footer />
    </div>
  );
}

export default App;
