// app/components/Gallery.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation'; 

const images = [
  { id: 1, src: "/gallery/img1.jpg", alt: "Image 1Image 2 2Image 2 2Image 2 2Image 2 2Image 2 2Image 2 2Image 2 2" },
  { id: 2, src: "/gallery/img2.jpg", alt: "Image 2" },
  { id: 3, src: "/gallery/img3.jpg", alt: "Image 3" },
  { id: 4, src: "/gallery/img4.jpg", alt: "Image 4" },
  { id: 5, src: "/gallery/img5.jpg", alt: "Image 5" },
  { id: 6, src: "/gallery/img6.jpg", alt: "Image 6" },
  { id: 7, src: "/gallery/img1.jpg", alt: "Image 1" },
  { id: 8, src: "/gallery/img2.jpg", alt: "Image 2 2" },
  { id: 9, src: "/gallery/img3.jpg", alt: "Image 3" },
  { id: 10, src: "/gallery/img4.jpg", alt: "Image 4" },
  { id: 11, src: "/gallery/img5.jpg", alt: "Image 5" },
  { id: 12, src: "/gallery/img6.jpg", alt: "Image 6" },
  { id: 13, src: "/gallery/img1.jpg", alt: "Image 1" },
  { id: 14, src: "/gallery/img2.jpg", alt: "Image 2" },
  { id: 15, src: "/gallery/img3.jpg", alt: "Image 3" },
  { id: 16, src: "/gallery/img4.jpg", alt: "Image 4" },
  { id: 17, src: "/gallery/img5.jpg", alt: "Image 5" },
  { id: 18, src: "/gallery/img6.jpg", alt: "Image 6" },
  { id: 19, src: "/gallery/img1.jpg", alt: "Image 1" },
  { id: 20, src: "/gallery/img2.jpg", alt: "Image 2" },
  { id: 21, src: "/gallery/img3.jpg", alt: "Image 3" },
  { id: 22, src: "/gallery/img4.jpg", alt: "Image 4" },
  { id: 23, src: "/gallery/img5.jpg", alt: "Image 5" },
  { id: 24, src: "/gallery/img6.jpg", alt: "Image 6" },
  // ... répéter ou ajouter d'autres images
];

const columns = [
  [
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
  ],
  [
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
  ],
  [
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
  ],
  [
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
  ],
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleImages, setVisibleImages] = useState<number[]>([]);

  const router = useRouter(); 
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement; // cast ici
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
        <section className="max-w-7xl mx-auto px-4 py-12" id="gallery">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
        {images.map((img, index) => {
          const delay = Math.min((index % 4) * 0.1, 0.3); // cascade rapide

          return (
            <div
              key={img.id} // 
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              data-index={index}
              className="relative overflow-hidden rounded-none shadow-md group cursor-pointer"
            >
            <Image
              src={img.src}
              alt={img.alt}
              width={700}
              height={700}
              className={`object-cover w-full h-[350px] transition-transform duration-300 opacity-0
                ${visibleImages.includes(index) ? "animate-fadeIn" : ""}
              `}
              style={{ animationDelay: visibleImages.includes(index) ? `${delay}s` : "0s" }}
            />

              {/* Overlay au survol */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500
                transform translate-y-full group-hover:translate-y-0
                backdrop-blur-[10px] bg-gray-800/60">
                  <div className="flex flex-col items-center transition-all duration-300 transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    {/* Description qui apparaît en premier */}
                    <p className="text-white text-lg md:text-xl font-semibold mb-2 px-4 text-center transition-transform duration-300">
                      {img.alt}
                    </p>

                {/* Bouton en gradient plus petit */}
                <button
                  onClick={() => handleViewDetails(img.id)}
                  className="px-4 py-2 mt-2 rounded text-sm font-medium text-white bg-my-button-gradient hover:opacity-90 transition-opacity duration-300"
                >
                  Voir plus
                </button>
              </div>
            </div>





          </div>

            
          );
        })}
      </div>

      

      {/* Lightbox */}
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
