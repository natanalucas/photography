"use client";

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, X, Frown } from 'lucide-react'; 
import { useState, useEffect } from 'react';

import { images } from '@/app/data/galleryData';
import { useLanguage } from '@/app/context/LanguageContext'; 

const getNextImage = (id: number) => {
    const validImageIds = images.map(img => img.id);
    const currentIndex = validImageIds.indexOf(id);
    if (currentIndex === -1) return null;

    const totalImages = images.length;

    const nextImageId1 = validImageIds[(currentIndex + 1) % totalImages];
    const nextImageId2 = validImageIds[(currentIndex + 2) % totalImages];

    const nextImage1 = images.find(img => img.id === nextImageId1);
    const nextImage2 = images.find(img => img.id === nextImageId2);

    if (!nextImage1 || !nextImage2) return null;

    return [nextImage1, nextImage2];
};


export default function ImageDetail() {
    const { t } = useLanguage(); 
    
    // ⭐️ AJOUT: État de montage pour résoudre l'hydratation
    const [mounted, setMounted] = useState(false);
    
    const gradientTextStyle = {
        backgroundImage: 'linear-gradient(to right, #70cdff, #015d54)', 
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', 
    } as React.CSSProperties;


    // --- Début des Hooks : DOIVENT TOUS ÊTRE NON-CONDITIONNELS ---
    const params = useParams();
    const imageId = parseInt(params.id as string, 10);

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasLightboxAnimated, setHasLightboxAnimated] = useState(false);

    // ⭐️ AJOUT: useEffect pour gérer le montage côté client
    useEffect(() => {
        setMounted(true);
    }, []);

    // LOGIQUE D'ANIMATION DE L'IMAGE PRINCIPALE
    useEffect(() => {
        setHasLoaded(false);
        const timer = setTimeout(() => {
            setHasLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [imageId]);

    // LOGIQUE D'ANIMATION DE LA LIGHTBOX
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (isLightboxOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden'; 
            document.body.style.paddingRight = `${scrollBarWidth}px`; 

            timer = setTimeout(() => setHasLightboxAnimated(true), 10);
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
            setHasLightboxAnimated(false);
        }
        return () => {
            document.body.style.overflow = 'auto'; 
            document.body.style.paddingRight = '0';
            if (timer) clearTimeout(timer);
        };
    }, [isLightboxOpen]);
    // --- Fin des Hooks ---


    // --- Logique et return conditionnel après les Hooks ---
    const image = images.find(img => img.id === imageId);
    const nextImages = getNextImage(imageId);

    // DÉPLACÉ APRÈS TOUS LES HOOKS pour respecter les règles de React.
    if (!image) {
        // Personnalisation de la page 404
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-8">
                <Frown className="w-20 h-20 mb-6 text-gray-400 dark:text-gray-600" />
                <p 
                    className="text-3xl sm:text-4xl font-bold mb-8"
                    style={gradientTextStyle} 
                >
                    Nous n'avons pas pu trouver l'œuvre que vous recherchez. 
                    Elle a peut-être été déplacée ou n'a jamais existé.
                </p>
                <Link
                    href="/"
                    className="flex items-center text-xl font-medium px-6 py-3 rounded-lg shadow-xl 
                               bg-[#015d54] text-white hover:bg-[#004d42] transition duration-200"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Retourner à la galerie
                </Link>
            </div>
        );
    }
    // --- Fin du bloc conditionnel ---


    const handleOpenLightbox = () => {
        setIsLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setIsLightboxOpen(false);
    }


    return (
        <div className="w-full bg-white dark:bg-gray-900 pt-12 min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* COLONNE GAUCHE (IMAGE PRINCIPALE) */}
                    <div
                        className="lg:col-span-3 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-8rem)] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer group overflow-hidden"
                        onClick={handleOpenLightbox}
                    >
                        <img
                            key={image.id}
                            src={image.src}
                            alt={image.altKey}
                            className={`object-cover w-full h-full absolute transition-all duration-700 ease-out group-hover:scale-105
                                ${hasLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}
                            `}
                            loading="eager" 
                        />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                         <div className="absolute inset-0 pointer-events-none">
                             <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 via-black/0 to-transparent"></div>
                             <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/10 via-black/0 to-transparent"></div>
                         </div>
                    </div>

                    {/* COLONNE DROITE (DESCRIPTION ET MINI-GALERIE) */}
                    <div className="lg:col-span-2 flex flex-col pt-4">

                        {/* BOUTON RETOUR */}
                        <Link
                            href="/"
                            className="flex items-center text-lg hover:opacity-80 transition font-medium mb-8 text-[#015d54] dark:text-[#70cdff] group"
                        >
                            <ChevronLeft 
                                className="w-6 h-6 mr-1" 
                            /> 
                            <span style={gradientTextStyle} className="font-bold">
                                Retour à la galerie
                            </span>
                        </Link>

                        {/* CONTENEUR FLEX-GROW: Zone de description avec style gradient */}
                        <div className="flex-grow">                            
                            <div 
                                className="relative p-4 rounded-lg overflow-hidden" 
                                style={{
                                    background: 'linear-gradient(to bottom, rgba(var(--my-blue-rgb), 0.1), rgba(var(--my-pink-rgb), 0.1))',
                                    border: '1px solid transparent', 
                                    boxShadow: '0 0 0 1px rgba(var(--my-blue-rgb), 0.3), 0 0 0 2px rgba(var(--my-pink-rgb), 0.2)', 
                                }}
                            >
                                {/* Barre verticale dégradée */}
                                <div 
                                    className="absolute top-0 left-0 h-full w-1.5 rounded-l-lg" 
                                    style={{
                                        backgroundImage: 'linear-gradient(to bottom, var(--my-blue), var(--my-pink))',
                                    }}
                                ></div>

                                {/* Zone de texte avec max-hauteur et défilement */}
                                <div className="max-h-60 overflow-y-auto pr-2 relative z-10">
                                    
                                    {/* 💥 CORRECTION DE L'HYDRATATION APPLIQUÉE ICI 💥 */}
                                    {mounted ? (
                                        // Affiche le contenu traduit UNIQUEMENT après l'hydratation
                                        <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic pl-3">
                                            {t(`descriptions.${image.altKey}`)}
                                        </p>
                                    ) : (
                                        // Affiche un placeholder (squelette) durant la première passe du SSR
                                        <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic pl-3">
                                            <span className="inline-block w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></span>
                                            <span className="inline-block w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* MINI-GALERIE */}
                        {nextImages && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-10">
                                <span 
                                    className="text-2xl font-bold mb-4" 
                                    style={gradientTextStyle} 
                                >
                                    Autres réalisations
                                </span>
                                <div className="flex space-x-4">
                                    {nextImages.map((nextImage) => (
                                        <Link
                                            key={nextImage.id}
                                            href={`/image/${nextImage.id}`}
                                            className="w-1/2 relative aspect-[4/3] rounded-lg overflow-hidden group hover:opacity-80 transition-opacity"
                                            aria-label={`Voir l'image ${nextImage.id}`}
                                        >
                                            <img
                                                src={nextImage.src}
                                                alt={nextImage.altKey}
                                                className="object-cover w-full h-full absolute"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent transition-opacity"></div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* LIGHTBOX PLEIN ÉCRAN */}
            {isLightboxOpen && (
                <div
                    className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 
                                transition-opacity duration-300 ease-out ${hasLightboxAnimated ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleCloseLightbox}
                >
                    <button
                        aria-label="Fermer l'image"
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCloseLightbox();
                        }}
                    >
                        <X size={32} />
                    </button>

                    <div
                        className={`relative w-full h-full max-w-6xl max-h-[90vh] transition-transform duration-300 ease-out 
                                    ${hasLightboxAnimated ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <img
                            src={image.src}
                            alt={`Agrandissement de : ${image.altKey}`}
                            className="object-contain w-full h-full absolute"
                            loading="eager"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}