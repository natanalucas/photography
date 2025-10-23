// app/components/About.tsx
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function About() {
    // Variantes pour l'animation de l'image (vient de la gauche)
  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };
  return (
    <motion.section
    className="max-w-6xl mx-auto px-6 py-4"
    initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    viewport={{ once: false, amount: 0.5 }} // Changement ici : once est maintenant false
    >
        
        <section id="about-contact" className="max-w-6xl mx-auto px-6"> {/* Ajout de l'ID pour la navigation */}
        {/*
            Le conteneur principal `div` est la seule chose à modifier pour le fond et l'ombre.
        */}
        <div 
            className="bg-white dark:bg-gray-800 shadow-md dark:shadow-xl dark:shadow-gray-900/50 rounded-lg overflow-visible relative"
        >
            {/* La barre gradient reste la même (elle utilise des variables CSS) */}
            <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b rounded-r-lg overflow-hidden" 
                style={{ 
                    backgroundImage: "linear-gradient(to bottom, var(--my-blue), var(--my-pink))" 
                }} 
            />

            <div className="p-6 flex flex-col md:flex-row items-center md:items-stretch">
            <motion.div
                className="flex-shrink-0 flex justify-center md:block relative w-66 h-82 md:w-75 md:h-90 md:-left-12"
                initial="hidden"
                whileInView="visible"
                variants={imageVariants}
                viewport={{ once: false, amount: 0.5 }}
                >
                <img
                src="/gallery/23.jpeg"
                alt="About me"
                className="object-cover rounded-lg shadow w-full h-full"
                />
            </motion.div>

            <div className="flex-1 flex flex-col justify-between">
                <div> {/* Ajout d'un conteneur pour regrouper l'icône et le paragraphe */}
                {/* Icône de citation : éclaircir légèrement en mode sombre */}
                <FontAwesomeIcon icon={faQuoteLeft} size="2x" className="text-gray-400 dark:text-gray-500" />

                {/* Paragraphe de texte : éclaircir en mode sombre */}
                <p className="mt-2 text-gray-600 dark:text-gray-300 italic text-lg md:text-xl leading-relaxed">
                    Loorem ipsum dolor sit amet, consectetur adipiscing elit. In dolor
                    diam, feugiat quis enim sed, ullamcorper semper ligula. Mauris
                    consequat justo volutpat.
                </p>
                </div>

                <div className="mt-6">
                {/* Titre (Le gradient fonctionne déjà) */}
                <h1
                    className="text-gray-900 font-semibold text-4xl bg-clip-text text-transparent"
                    style={{
                        backgroundImage: "linear-gradient(to right, var(--my-blue), var(--my-pink))",
                    }}
                    >
                    Kevin RAMAROHETRA
                </h1>
                {/* Sous-titre/Email : éclaircir en mode sombre */}
                <p className="text-gray-900 dark:text-gray-200 text-sm">kevin.ramarohetra@gmail.com</p>
                </div>
            </div>
            </div>
        </div>
        </section>
    </motion.section>

  );
}