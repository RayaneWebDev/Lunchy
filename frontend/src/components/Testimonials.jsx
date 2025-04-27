import React, { useEffect, useState } from 'react';
import testimonialsImgM from '../assets/testimonialsMobile.svg';
import testimonialsImgL from '../assets/testimonialsLarge.svg';
import starIcon from '../assets/starIcon.svg';  // Étoile pleine
import emptyStar from '../assets/emptyStar.svg'
import { FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import useScrollAnimation from '../helpers/useScrollAnimation';
import SummaryApi from '../common';
import AddReviewByClient from './AddReviewByClient';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [openAddTestimonial, setOpenAddTestimonial] = useState(false)

  const slideLeft = () => {
    const slider = document.getElementById('slider');
    slider.scrollLeft -= 370;
  };

  const slideRight = () => {
    const slider = document.getElementById('slider');
    slider.scrollLeft += 300;
  };

  const slideUp = () => {
    const slider = document.getElementById('slider');
    slider.scrollTop -= 500;
  };

  const slideDown = () => {
    const slider = document.getElementById('slider');
    slider.scrollTop += 500;
  };

  useScrollAnimation(".testimonialsImg");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(SummaryApi.getTestimonials.url, {
        method: SummaryApi.getTestimonials.method,
        credentials: "include"
      });
      const dataApi = await response.json();
      if (dataApi.success) {
        // Filtrer les avis avec une note de 4 étoiles ou plus
        const filteredReviews = dataApi.data.filter(review => review.rating >= 4);
        setTestimonials(filteredReviews);
      } else {
        console.log(dataApi.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col font-Lato'>
      <h1 className='text-[24px] md:text-[35px] text-center mb-14 md:mb-28 font-bold'>Avis des clients</h1>

      <div className='flex flex-col md:flex-row gap-24 md:gap-0 lg:gap-6 md:mx-10 lg:mx-48'>
        <img src={testimonialsImgM} className='testimonialsImg container mx-auto lg:hidden w-[80%] md:w-[350px] md:h-[450px]' />
        <img src={testimonialsImgL} className='testimonialsImg hidden lg:block max-w-[400px]' />
        {testimonials.length != 0 && (
            <div className='relative flex md:flex-col items-center w-full'>
          <FaChevronLeft className='absolute left-4 md:hidden' onClick={slideLeft} />
          <FaChevronUp className='hidden md:block left-[50%] top-0 cursor-pointer hover:bg-green-testimonials rounded-[50%] hover:text-white' onClick={slideUp} />
          
          <div id='slider' className='flex overflow-x-scroll scroll-smooth w-full h-full md:flex-col md:gap-5 md:overflow-x-hidden md:overflow-y-scroll md:h-[500px]'>
            {testimonials.map((review, index) => (
              <div
                key={index}
                className='flex flex-col mx-14 md:ml-[50%] md:mr-0 transform md:-translate-x-[50%] my-3 gap-8 p-6 md:gap-4 min-w-[70%] md:w-2/3 lg:max-w-[400px] items-start border border-green-testimonials rounded-[15px] shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.15)] hover:bg-green-testimonials'
              >
                <div className='flex gap-1'>
                  {/* Affichage des étoiles pleines et vides */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <img
                      key={i}
                      src={i < review.rating ? starIcon : emptyStar} // Si l'index est inférieur à la note, on affiche une étoile pleine, sinon une étoile vide
                      alt="star"
                    />
                  ))}
                </div>

                <p className='text-[11px] leading-7'>“ {review.avis || 'Aucun avis rédigé.'} “</p>

                <div className='flex flex-col gap-2'>
                  <h3 className='text-[13px] font-bold'>{review.name}</h3>
                  <h4 className='text-[9px] text-gray-nav'>{review.poste || ''}</h4>
                </div>
              </div>
            ))}
          </div>

          <FaChevronRight className='absolute right-4 md:hidden' onClick={slideRight} />
          <FaChevronDown className='hidden md:block left-[50%] bottom-0 cursor-pointer hover:bg-green-testimonials rounded-[50%] hover:text-white' onClick={slideDown} />
        </div>
        )}
        </div>
        <button onClick={()=>setOpenAddTestimonial(true)} className="btn btn-wide btn-neutral container my-20 mx-auto rounded-lg">Donnez votre avis</button>

        {openAddTestimonial && <AddReviewByClient fetchReviews={fetchReviews} onClose={()=>setOpenAddTestimonial(false)}/>}
    </div>
        )
};

export default Testimonials;
