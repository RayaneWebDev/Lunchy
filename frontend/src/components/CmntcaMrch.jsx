import React from 'react'
import ImgMobile from '../assets/sandwich2.jpg'
import ImgLarge from '../assets/sandwich3.svg'
import checkIcon from '../assets/checkIcon.svg'
import useScrollAnimation from '../helpers/useScrollAnimation'

const CmntcaMrch = () => {

    useScrollAnimation(".useList, .useImg"); 


  return (
    <div className='my-28'>
        <h1 className='font-Lato text-[24px] md:text-[35px] text-center mb-14 md:mb-28 font-bold'>Comment Ça Marche ?</h1>
        <div className='flex flex-col gap-7 items-center md:px-10 lg:px-20 md:flex-row-reverse'>

            <img src={ImgMobile} className='useImg md:hidden'/>
            <img src={ImgLarge} className='useImg hidden md:block w-1/2'/>

            <ul className='useList flex flex-col gap-12 lg:gap-28 font-Inter my-9 text-center px-12 lg:pr-56 lg:text-start'>
                <li className='flex flex-col items-center lg:items-start gap-4'>
                    <div className='flex gap-2 justify-center items-center lg:gap-4'>
                        <img src={checkIcon} className='w-4 lg:w-6'/>
                        <h3 className='text-primary font-extrabold text-[15px] md:text-[16px] lg:text-[20px]'>Choisissez vos menus</h3>
                    </div>
                    <p className='text-[11px] lg:text-[15px]'>Sélectionnez les menus et les quantités qui conviennent à vos équipes</p>
                </li>

                <li className='flex flex-col items-center gap-4 lg:items-start'>
                    <div className='flex gap-2 justify-center items-center lg:gap-4'>
                        <img src={checkIcon} className='w-4 lg:w-6'/>
                        <h3 className='text-primary font-extrabold text-[15px] md:text-[16px] lg:text-[20px]'>Validez votre commande</h3>
                    </div>
                    <p className='text-[11px] lg:text-[15px]'>Renseignez vos informations de livraison et confirmez votre commande</p>
                    <p className='text-[11px] text-gray-nav'>Le paiement peut être effectué ultérieurement, pas plus de 2 commandes</p>
                </li>

                <li className='flex flex-col items-center gap-4 lg:items-start'>
                    <div className='flex gap-2 justify-center items-center lg:gap-4'>
                        <img src={checkIcon} className='w-4 lg:w-6'/>
                        <h3 className='text-primary font-extrabold text-[15px] md:text-[16px] lg:text-[20px]'>Recevez et déguster</h3>
                    </div>
                    <p className='text-[11px] lg:text-[15px]'>Vos repas sont préparés avec soin et livrés à l'heure pour votre pause déjeuner</p>
                    <p className='text-[11px] text-gray-nav'>Le propriétaire du restaurant vous contactera pour finaliser les détails de livraison.</p>

                </li>

            </ul>
        </div>
    </div>
  )
}

export default CmntcaMrch