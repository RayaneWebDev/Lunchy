import { useEffect } from "react";

const useScrollAnimation = (selector) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show"); // Ajoute la classe d'animation
        }
      });
    }, { threshold: 0.3 }); // Déclenche quand 30% de l’élément est visible

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector]);
};

export default useScrollAnimation;
