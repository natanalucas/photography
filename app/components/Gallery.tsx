// app/components/Gallery.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation'; 

import { images } from '@/app/data/galleryData';
import { useLanguage } from '@/app/context/LanguageContext'; // ⭐️ Import du hook de langue
// NOTE: Le tableau 'columns' n'est pas utilisé pour cette implémentation.

export default function Gallery() {
  const { t } = useLanguage(); 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleImages, setVisibleImages] = useState<number[]>([]);

  const router = useRouter(); 
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement; 
          if (entry.isIntersecting) {
            const index = Number(target.dataset.index);
            setVisibleImages((prev) => [...new Set([...prev, index])]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
  
    imageRefs.current.forEach((el) => el && observer.observe(el));
  
    return () => observer.disconnect();
  }, []);

  const handleViewDetails = (id: number) => {
    router.push(`/image/${id}`); 
  };

  return (
    <>
        <section className="max-w-7xl mx-auto px-4 py-15" id="gallery">
            
            {/* 🟢 CHANGEMENT CLÉ: Utilisation des classes 'columns-x' pour Masonry */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-1">
                {images.map((img, index) => {
                    const delay = Math.min((index % 4) * 0.1, 0.3);

                    return (
                        <div
                            key={img.id}
                            ref={(el) => {
                                imageRefs.current[index] = el;
                            }}
                            data-index={index}
                            onClick={() => handleViewDetails(img.id)} // Le bloc entier est cliquable
                            // 🟢 CHANGEMENT CLÉ: mb-4 pour l'espacement vertical et break-inside-avoid
                            className="relative mb-4 overflow-hidden rounded-lg shadow-lg group cursor-pointer break-inside-avoid"
                        >
                            <Image
                                src={img.src}
                                alt={img.altKey}
                                // Remplacer width/height si vous utilisez `fill`
                                width={700}
                                height={700}
                                // 🟢 CHANGEMENT CLÉ: Suppression de h-[350px] pour laisser l'image déterminer sa hauteur
                                className={`object-cover w-full h-auto transition-all duration-500 opacity-0 group-hover:scale-105
                                    ${visibleImages.includes(index) ? "animate-fadeIn" : ""}
                                `}
                                style={{ animationDelay: visibleImages.includes(index) ? `${delay}s` : "0s" }}
                            />

                            {/* Overlay au survol (version fade-in propre) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-300
                                bg-gray-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100">
                                <div className="flex flex-col items-center text-center">
                                    <p className="text-white text-lg md:text-xl font-semibold mb-3 px-4 italic">
                                      {t(`descriptions.${img.altKey}`)}
                                    </p>
                                    <span
                                        className="px-4 py-2 rounded text-sm text-white bg-my-button-gradient hover:opacity-90 transition-opacity duration-300 font-bold"
                                    >
                                      {t('voir_plus')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Lightbox (inchangé) */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gray-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <div className="relative max-w-4xl w-full px-4">
                        <Image
                            src={selectedImage}
                            alt="Agrandissement"
                            width={1200}
                            height={800}
                            className="object-contain w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            )}
        </section>
    </>
  );
}

export const scrollToId = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};