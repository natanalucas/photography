// components/AnimatedImage.tsx

"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

// Enregistrez le plugin ScrollTrigger une fois au niveau global
gsap.registerPlugin(ScrollTrigger);

export default function AnimatedImage({ src, alt }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.set(imageRef.current, { scale: 0.8, opacity: 0 });

        gsap.to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden my-12"
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={1000}
        height={600}
        className="object-cover w-full h-full"
      />
    </div>
  );
}