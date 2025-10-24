import About from "./components/About";
import Gallery from "./components/Gallery";
import PortfolioGallery from "./components/PortfolioGallery";

export default function Home() {
  return (
    // ✅ CORRECTION : Suppression de "items-center" pour permettre au contenu de s'étendre
    // Le conteneur doit maintenant utiliser "w-full" pour tous les enfants qui doivent s'étendre.
    <div className="min-h-screen flex flex-col justify-start w-full bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-300">
      
      {/* Gallery prend désormais 100% de la largeur du viewport (moins les marges) */}
      <Gallery />
      
      {/* Le conteneur d'About doit s'étirer verticalement pour que le h-full fonctionne à l'intérieur */}
      <div className="w-full flex-1" id="about-contact">
        
        {/* Le composant PortfolioGallery est maintenant full width */}
        <div className="hidden lg:block">
          <PortfolioGallery />
        </div>
        
        <div className="block md:hidden">
          <About />
        </div>
        
      </div>

      {/* <Description/> */}
      {/* ... (commentaires et autres contenus) ... */}

    </div>

  );
}
