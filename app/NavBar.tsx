"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"; 
import { Linkedin, Instagram, Facebook, Sun, Moon, Image as ImageIcon, Mail } from "lucide-react"; 
import { useLanguage } from './context/LanguageContext';
import { useTheme } from 'next-themes'; 


// ====================================================================
// ThemeToggle (Corrige l'hydratation)
// ====================================================================
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme(); 
    const [mounted, setMounted] = useState(false); 

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Retourne un bouton invisible pour éviter les problèmes d'hydratation
        return <button className="p-2 rounded-full" style={{ visibility: 'hidden' }} aria-hidden="true" />;
    }

    const nextTheme = theme === 'light' || theme === 'system' ? 'dark' : 'light';
    const currentIcon = theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
    ) : (
        <Moon size={20} className="text-gray-700 dark:text-gray-300" />
    );

    return (
        <button
            onClick={() => setTheme(nextTheme)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label={`Switch to ${nextTheme} mode`}
        >
            {currentIcon}
        </button>
    );
};
// ====================================================================


export default function Navbar() {
  const { t, toggleLanguage } = useLanguage();
  
  // L'état initial est false, donc le serveur rendra le style par défaut (top-3)
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery"); 

  // Composant pour choisir l'icône sur mobile
  const MobileIcon = ({ nameKey, size = 20 }: { nameKey: string, size?: number }) => {
    switch (nameKey) {
        case 'gallery':
            return <ImageIcon size={size} />;
        case 'contact':
            return <Mail size={size} />;
        default:
            return null;
    }
  };

  const menuItems = [
    { nameKey: "gallery", id: "gallery" },
    { nameKey: "contact", id: "about-contact" },
  ];

  // Références pour le calcul du soulignement desktop
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]); 
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);    
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Gestion du scroll pour l'effet de navbar
  useEffect(() => {
    // Le serveur rend avec scrolled=false. 
    // Au moment de l'hydratation, useEffect se déclenche, et la logique client commence.
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Fonction de calcul du soulignement (uniquement pour le desktop)
  const calculateUnderlinePosition = useCallback(() => {
    const currentIndex = menuItems.findIndex(item => item.nameKey === activeTab);
    
    const currentSpan = spanRefs.current[currentIndex];
    const menuContainer = tabRefs.current[0]?.parentElement;

    if (currentSpan && menuContainer) {
        const spanRect = currentSpan.getBoundingClientRect();
        const containerRect = menuContainer.getBoundingClientRect();

        // Calcule la position relative au conteneur du menu
        const finalLeft = spanRect.left - containerRect.left;
        const correctedWidth = currentSpan.offsetWidth;

        setUnderlineStyle({
            left: finalLeft,
            width: correctedWidth,
        });
    }
  }, [activeTab, t]); 

  // 1. Calcul initial et changement d'onglet/langue (useLayoutEffect pour la performance)
  useLayoutEffect(() => {
    calculateUnderlinePosition();
  }, [calculateUnderlinePosition]); 

  // 2. Calcul lors du redimensionnement de la fenêtre
  useEffect(() => {
    window.addEventListener('resize', calculateUnderlinePosition);
    
    const timeoutId = setTimeout(calculateUnderlinePosition, 100);

    return () => {
        window.removeEventListener('resize', calculateUnderlinePosition);
        clearTimeout(timeoutId);
    }
  }, [calculateUnderlinePosition]);

  // ** CORRECTION APPLIQUÉE ICI **
  // Le serveur rend la classe par défaut (top-3). Le client se base sur cette classe, puis 
  // la met à jour vers top-0 si scrolled devient true.
  const topPositionClass = scrolled ? 'top-0' : 'top-0';

  return (
    <nav 
      className={`fixed w-full ${topPositionClass} left-0 z-50 transition-colors duration-300 
                 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(255,255,255,0.6)] 
                 dark:bg-gray-900/80 
                 dark:shadow-[0_4px_10px_rgba(0,0,0,0.3)]`} 
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/gallery/23.jpeg"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain rounded-full"
            />
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:flex justify-center items-center flex-1 relative">
            {menuItems.map((item, index) => {
                const displayedName = t(`navbar.${item.nameKey}`);
                const isActive = activeTab === item.nameKey;
                
                return (
                  <button
                    key={item.id}
                    ref={(el) => (tabRefs.current[index] = el)}
                    onClick={() => {
                      setActiveTab(item.nameKey); 
                      
                      const targetElement = document.getElementById(item.id);
                      if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`relative py-1 transition-all duration-300 cursor-pointer ${
                      isActive ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {/* Le span porte le padding horizontal et la classe inline-block */}
                    <span 
                        ref={(el) => (spanRefs.current[index] = el)} 
                        className={`inline-block px-2 ${isActive 
                            ? "bg-clip-text text-transparent bg-my-gradient font-bold" 
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {displayedName}
                    </span>
                  </button>
                );
            })}

            {/* Tiré animé gradient */}
              <div
                className="absolute bottom-0 h-0.5 rounded transition-all duration-300"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                  backgroundImage: "linear-gradient(to right, var(--my-blue), var(--my-pink))",
                }}
              />
          </div>


          {/* Icônes/Langue Desktop */}
          <div className="hidden lg:flex space-x-3 items-center flex-shrink-0">
             <ThemeToggle />

             {/* Bouton de langue desktop */}
             <button
                onClick={toggleLanguage}
                className="px-2 py-1 text-sm font-bold border rounded-lg transition-colors duration-200 
                           text-[#015d54] border-[#015d54] hover:bg-[#015d54] hover:text-white
                           dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
             >
                {t('navbar.toggle_lang_to')}
             </button>
            
            {/* Icônes sociales desktop */}
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={20} className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} className="text-gray-700 hover:text-pink-500 dark:text-gray-300 dark:hover:text-pink-400" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
            </a>
          </div>

          {/* Mobile menu (Non modifié, affiché jusqu'à 1023px) */}
          <div className="flex lg:hidden space-x-2 items-center">
            
            {/* Boutons de navigation mobile (ICONS) */}
            {menuItems.map((item) => {
              const isActive = activeTab === item.nameKey;
              
              // Classes pour les boutons (taille, bordures arrondies, flex pour centrer l'icône)
              const baseClasses = "p-2 rounded-full transition-all duration-300 flex items-center justify-center";
              // Styles actifs : utilise le gradient en background, l'icône est blanche
              const activeClasses = "text-white shadow-md"; 
              // Styles inactifs : couleur d'icône standard, fond clair au survol
              const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
              
              const activeStyle = isActive 
                ? { background: "linear-gradient(to right, var(--my-blue), var(--my-pink))" }
                : {};

              return (
              <button
                key={item.nameKey}
                onClick={() => {
                  setActiveTab(item.nameKey);
                  const targetElement = document.getElementById(item.id);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                style={activeStyle}
                aria-label={t(`navbar.${item.nameKey}`)} // Important pour l'accessibilité
              >
                {/* Affiche l'icône */}
                <MobileIcon nameKey={item.nameKey} size={20} />
              </button>
            )})}

            {/* Icônes sociales mobiles (toujours visibles sur mobile/tablette) */}
            <div className="flex space-x-3">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} className="text-gray-700 hover:text-pink-500 dark:text-gray-300 dark:hover:text-pink-400" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
              </a>
            </div>
             
             <ThemeToggle />

            {/* Bouton de langue mobile (placé à la fin) */}
             <button
                onClick={toggleLanguage}
                className="px-2 py-1 text-sm font-bold border rounded-lg transition-colors duration-200 
                           text-[#015d54] border-[#015d54] hover:bg-[#015d54] hover:text-white
                           dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
             >
                {t('navbar.toggle_lang_to')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}