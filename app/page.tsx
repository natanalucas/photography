import About from "./components/About";
import Gallery from "./components/Gallery";
import PortfolioGallery from "./components/PortfolioGallery";

export default function Home() {
  return (
// Dans le fichier où se trouve ce bloc de code
<div className="min-h-screen flex flex-col items-center justify-start bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-300">
  
  <Gallery />
  
  {/* Le conteneur d'About doit s'étirer verticalement pour que le h-full fonctionne à l'intérieur */}
  <div className="w-full flex-1" id="about-contact">
    
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
