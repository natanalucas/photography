"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { motion, Variants } from 'framer-motion'; // Ajout de Variants pour le typage des animations

// ====================================================================
// 1. Définition des types (Interface)
// ====================================================================

interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

// ====================================================================
// 2. Composant Modale (Lightbox) - CORRECTION APPLIQUÉE
// ====================================================================
// ✅ CORRECTION : Ajout de ImageModalProps pour typer les props
const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gère le body scroll et le padding (pour empêcher le contenu de sauter)
  useEffect(() => {
    if (!imageUrl) return;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    
    // CORRECTION : scrollBarBarWidth n'est pas défini. Utiliser scrollBarWidth.
    document.body.style.paddingRight = `${scrollBarWidth}px`; 
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [imageUrl]); 

  if (!imageUrl || !mounted) return null;

  return createPortal(
    <div 
      // La couleur de fond de la modale est fixe et sombre
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in duration-300 backdrop-blur-sm"
      onClick={onClose} 
    >
      <motion.div 
        className="relative max-w-5xl max-h-[90vh] overflow-y-auto p-4 animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()} 
      >
        <img 
          src={imageUrl} 
          alt="Aperçu en taille réelle" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </motion.div>

      <button 
        className="absolute top-4 right-4 text-white text-3xl font-bold p-2 bg-black/50 rounded-full hover:bg-black/70 transition z-50"
        onClick={onClose}
      >
        &times;
      </button>
    </div>,
    document.body 
  );
};

// ====================================================================
// 3. Composant Galerie (PortfolioGallery)
// ====================================================================
const PortfolioGallery = () => {
  // ✅ CORRECTION : Typer l'état pour accepter une chaîne de caractères ou null
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ CORRECTION : Typer l'argument de la fonction
  const handleImageClick = (imageUrl: string) => { setSelectedImage(imageUrl); };
  const handleCloseModal = () => { setSelectedImage(null); };

  const imageContainerClasses = "cursor-pointer";

  // Variantes Framer Motion (typage optionnel pour plus de sécurité)
  const mainVariants: Variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 1.2, 
            ease: "easeOut",
            when: "beforeChildren", 
            staggerChildren: 0.1, 
        }
    },
  };

  const leftImageVariants: Variants = {
    hidden: { x: -200, opacity: 0 }, 
    visible: { 
        x: 0, 
        opacity: 1, 
        transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const rightImageVariants: Variants = {
    hidden: { x: 200, opacity: 0 }, 
    visible: { 
        x: 0, 
        opacity: 1, 
        transition: { duration: 0.5, ease: "easeOut" },
    },
  };


  return (
    <motion.div
        className="relative w-full h-screen overflow-visible"
        variants={mainVariants} 
        initial="hidden"        
        whileInView="visible"   
        viewport={{ once: false, amount: 0.5 }} 
    > 
      
      <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />

      {/* 🌟 EFFET "NUAGES FLOUX" HAUT */}
      
      {/* Mode CLAIR : Visible en light:, caché en dark:hidden */}
      <div 
          className="absolute top-0 left-0 w-full h-32 z-20 pointer-events-none dark:hidden" 
      />
      
      {/* Mode SOMBRE : Caché en light:, visible en dark:block */}
      <div 
          className="absolute top-0 left-0 w-full h-32 z-20 pointer-events-none hidden dark:block" 
      />
      
      {/* 🌟 EFFET "NUAGES FLOUX" BAS */}

      {/* Mode CLAIR : Visible en light:, caché en dark:hidden */}
      <div 
          className="absolute bottom-0 left-0 w-full h-32 z-20 pointer-events-none dark:hidden" 
      />

      {/* Mode SOMBRE : Caché en light:, visible en dark:block */}
      <div 
          className="absolute bottom-0 left-0 w-full h-32 z-20 pointer-events-none hidden dark:block" 
      />
    
      {/* Conteneur de gauche : Images à z-40 pour être CLICABLE */}
      {/* J'ai augmenté la translation latérale pour que les images s'éloignent davantage sur les grands écrans. */}
      <div className="absolute top-15 left-50 h-full w-1/3 flex flex-col items-start justify-around -translate-x-24 xl:-translate-x-48 z-[40]">
        
        {/* ... (Blocs d'images à gauche) ... */}
        <motion.div 
          className={`w-[70%] h-[35%] -rotate-[9deg] transform origin-top-left -translate-y-10 ${imageContainerClasses}`}
          onClick={() => handleImageClick("/gallery/24.jpeg")}
          variants={leftImageVariants} 
        >
            <img
              src="/gallery/24.jpeg"
              alt="Image inclinée en haut à gauche"
              className="w-full h-full object-cover rounded-lg"
            />
        </motion.div>
        
        <motion.div 
          className={`w-[70%] h-[35%] rotate-[5deg] transform origin-top-left -translate-y-12 ${imageContainerClasses}`}
          onClick={() => handleImageClick("/gallery/21.jpeg")}
          variants={leftImageVariants}
        >
            <img
              src="/gallery/21.jpeg"
              alt="Image inclinée au milieu à gauche"
              className="w-full h-full object-cover rounded-lg"
            />
        </motion.div>

        <motion.div 
          className={`w-[70%] h-[35%] -rotate-[10deg] transform origin-top-left ${imageContainerClasses}`}
          onClick={() => handleImageClick("/gallery/20.jpeg")}
          variants={leftImageVariants}
        >
            <img
              src="/gallery/20.jpeg"
              alt="Image inclinée en bas à gauche"
              className="w-full h-full object-cover rounded-lg"
            />
        </motion.div>
      </div>

      {/* Contenu central : z-30. */}
      {/* J'ai augmenté la translation Y pour que le bloc soit centré par rapport aux images latérales */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-30 -translate-y-5 xl:-translate-y-10 pointer-events-none">
        
        {/* Cercle central - CORRECTION TAILLE */}
        <div className="bg-white/10 p-2 rounded-full border border-white/30 mb-4 
                        w-80 h-80 lg:w-80 lg:h-80 xl:w-96 xl:h-96 2xl:w-[28rem] 2xl:h-[28rem]
                        flex items-center justify-center pointer-events-auto
                        dark:bg-gray-800/20 dark:border-gray-700/50">
          <img
            src="/gallery/23.jpeg"
            alt="Photo de profil"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        
        {/* Nom - CORRECTION TAILLE */}
        <h1
            className="font-semibold text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl bg-clip-text text-transparent pointer-events-auto"
            style={{ backgroundImage: "linear-gradient(to right, #70cdff, #015d54)" }}
            >
            Kevin RAMAROHETRA
        </h1>
        
        {/* Email - CORRECTION TAILLE */}
        <p className="text-gray-700 dark:text-gray-400 mb-4 text-xl lg:text-2xl xl:text-2xl pointer-events-auto">
          kevin.ramarohetra@gmail.com
        </p>
        <br/>
        
        <div className="flex flex-col items-center px-4 pointer-events-auto">
          {/* SVG Quote Icon - CORRECTION TAILLE */}
          <svg className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#4A5568" viewBox="0 0 18 14">
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
            className="fill-gray-700 dark:fill-gray-400" /> 
          </svg>
          
          {/* Texte de la citation - CORRECTION TAILLE */}
          <p className="text-gray-700 dark:text-gray-400 italic 
                      text-lg lg:text-xl xl:text-xl 2xl:text-xl 
                      text-center mb-2 max-w-lg xl:max-w-xl pointer-events-auto">
           Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi numquam accusantium dolores natus officiis quaerat? Consequatur quasi, amet laudantium quo assumenda ducimus magni veniam, quas ipsum rerum vel tempore quidem.
          </p>
        </div>
      </div>

      {/* Conteneur de droite : Images à z-40 pour être CLICABLE */}
      {/* J'ai augmenté la translation latérale pour que les images s'éloignent davantage sur les grands écrans. */}
      <div className="absolute top-5 right-50 h-full w-1/3 flex flex-col items-end justify-around translate-x-24 xl:translate-x-48 z-[40]">
        
        <motion.div 
          className={`w-[70%] h-[35%] rotate-[16deg] transform origin-top-right translate-y-20 ${imageContainerClasses}`}
          onClick={() => handleImageClick("/gallery/19.jpeg")}
          variants={rightImageVariants}
        >
            <img
              src="/gallery/19.jpeg"
              alt="Image inclinée en haut à droite"
              className="w-full h-full object-cover rounded-lg"
            />
        </motion.div>

        <motion.div 
          className={`w-[70%] h-[35%] -rotate-[10deg] transform origin-top-right -translate-y-12 ${imageContainerClasses}`}
          onClick={() => handleImageClick("/gallery/22.jpeg")}
          variants={rightImageVariants}
        >
            <img
              src="/gallery/22.jpeg"
              alt="Image inclinée au milieu à droite"
              className="w-full h-full object-cover rounded-lg"
            />
        </motion.div>

        <motion.div 
          className={`w-[70%] h-[35%] rotate-[10deg] transform origin-top-right ${imageContainerClasses}`}
          onClick={() => handleImageClick("/gallery/12.jpg")}
          variants={rightImageVariants}
        >
            <img
              src="/gallery/12.jpg"
              alt="Image inclinée en bas à droite"
              className="w-full h-full object-cover rounded-lg"
            />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PortfolioGallery;
