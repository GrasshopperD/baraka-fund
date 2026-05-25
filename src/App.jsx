import Hero from './components/Hero';
import TrustCarousel from './components/TrustCarousel';
import Simulator from './components/Simulator';
import Mission from './components/Mission';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <main>
        <Hero />
        <Simulator />
        <TrustCarousel />
        <Mission />
        <Footer />
      </main>
    </div>
  );
}
