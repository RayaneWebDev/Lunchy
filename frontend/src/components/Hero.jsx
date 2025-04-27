import React, { useState } from 'react';
import heroImgMobile from '../assets/heroImage2.svg';
import heroImgDesktop from '../assets/heroImageDesktop.svg';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const {restaurants} = useOutletContext()
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="mt-[30px]">
      {/* Version mobile */}
      <div className="header-contents w-full relative flex justify-center items-center lg:hidden">
        <div className="absolute w-full h-full bg-black opacity-50 z-10"></div>

        {/* Skeleton si image non chargée */}
        {isLoading && (
          <div className="w-full lg:hidden h-[600px] bg-white z-0"></div>
        )}

        {/* Image mobile */}
        <img
          src={heroImgMobile}
          className={`z-0 w-full h-auto ${isLoading ? 'hidden' : ''}`}
          alt="hero Image"
          onLoad={() => setIsLoading(false)}
        />

        {/* Contenu texte */}
        {!isLoading && (
          <div className="flex flex-col text-center gap-3 absolute w-full z-20 text-white">
            <h1 className="font-Marcellus font-extralight text-[29px] px-7 md:px-14">
              Vos équipes méritent une pause déjeuner exceptionnelle
            </h1>
            <h4 className="font-Pacifico px-9 my-5 md:px-20 text-[14px] md:text-[16px] leading-[24px] md:leading-[30px]">
              Avec Lunchy, découvrez nos repas frais, variés et livrés à temps, pour des pauses déjeuner savoureuses et sans stress. Simplifiez la vie de vos équipes et faites de chaque pause un moment de plaisir avec Lunchy !
            </h4>
            <button
              className="btn w-[183px] mt-4 mx-auto px-5 py-2 font-Lato border-none bg-white hover:bg-primary hover:text-white text-primary rounded-[50px] cursor-pointer transition duration-[0.3s]"
              onClick={() => navigate(`/menu?restaurant=${restaurants[0].name}&restaurantId=${restaurants[0]._id}`)}
            >
              Commander
            </button>
          </div>
        )}
      </div>

      {/* Version Desktop */}
      <div className="gap-44 hidden lg:flex px-20 py-10">
        <div className="homeContent flex flex-col text-start gap-11 w-1/2 py-16">
          <h1 className="font-Marcellus font-extralight text-[42px]">
            Vos équipes méritent une pause déjeuner exceptionnelle
          </h1>
          <h4 className="font-Pacifico text-[18px] leading-[50px]">
            Avec Lunchy, découvrez nos repas frais, variés et livrés à temps, pour des pauses déjeuner savoureuses et sans stress. Simplifiez la vie de vos équipes et faites de chaque pause un moment de plaisir avec Lunchy !
          </h4>
          <button
            className="btn w-[183px] mt-11 px-5 py-6 font-Lato border-none bg-primary hover:bg-primary-hover text-white rounded-[50px] cursor-pointer transition duration-[0.3s]"
            onClick={() => navigate(`/menu?restaurant=${restaurants[0].name}&restaurantId=${restaurants[0]._id}`)}
          >
            Commander
          </button>
        </div>

        <div className="w-1/2">
          <img
            src={heroImgDesktop}
            className={`homeImage w-full h-auto ${isLoading ? 'hidden' : ''}`}
            alt="hero Image"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
