import React from 'react'
import fourchetteImg from '../assets/fourchetteImg.svg'
import couteauImg from '../assets/couteauImg.svg'
import contentImg from '../assets/pourquoiLunchyImage.svg'
import truck from '../assets/Truck.svg'
import serviceImg from '../assets/serviceImg.svg'
import menuVariesImg from '../assets/menuvaries.svg'
import ingredientsImg from '../assets/naturalIngredients.svg'
import useScrollAnimation from '../helpers/useScrollAnimation'

const PourquoiLunchy = () => {

    useScrollAnimation(".pourquoiLunchyImg, .listPourquoi"); 


  return (
    <div>
        <div className='flex gap-4 md:gap-8 justify-center items-center mt-10 mb-20'>
            <img src={fourchetteImg} className='h-28' alt='fourchette Image'/>
            <h1 className='font-Marcellus text-[28px] md:text-[32px] lg:text-[37px]'>À Propos</h1>
            <img src={couteauImg} className='h-28' alt='couteau Image'/>
        </div>
        <img src={contentImg} className='pourquoiLunchyImg md:hidden w-full' alt='Pourquoi choisir Lunchy'/>
        <h1 className='font-Inter md:hidden text-center font-bold my-11 text-[18px] md:text-[25px]'>Pourquoi choisir <span className='font-Pacifico text-primary ml-2 text-[20px] md:text-[28px] font-light'>Lunchy</span></h1>

        {/*mobile section*/}
        <div className='flex justify-center items-center'>
            <ul className='listPourquoi md:hidden flex flex-col gap-8 font-Inter items-start text-[11px] pl-10'>
             <li className='flex items-center gap-2'>
                 <img src={truck} className='w-7' alt='truck'/>
                 <p>Livraison rapide pour respecter vos horaires</p>
             </li>
             <li className='flex items-center gap-2'>
                 <img src={menuVariesImg} className='w-6' alt='menu varies' />
                 <p>Des menus équilibrés et adaptés à tous les goûts</p>
             </li>
             <li className='flex items-center gap-2'>
                 <img src={serviceImg} className='w-6' alt='service image'/>
                 <p>Un service conçu pour les entreprises, sans tracas</p>
             </li>
             <li className='flex items-center gap-2'>
                 <img src={ingredientsImg} className='w-6' alt='ingredients image'/>
                 <p>Des ingrédients frais et locaux, chaque jour</p>
             </li>
            </ul>
        </div>
       

        {/*tablet and desktop section*/}

        <div className='hidden p-7 md:flex gap-8 lg:gap-20 items-center w-full'>
          
            <img src={contentImg} className='pourquoiLunchyImg w-2/3 h-auto rounded-[62px]'alt='Pourquoi choisir Lunchy'/>
            
            <ul className='listPourquoi flex flex-col md:gap-8 lg:gap-10 font-Inter items-start md:text-[11px] lg:text-[16px] pl-10 w-1/2 py-6'>
               <h1 className='font-Inter text-center font-bold my-11 text-[25px]'>Pourquoi choisir <span className='font-Pacifico text-primary ml-2 text-[28px] font-light'>Lunchy</span></h1> 
                <li className='flex items-center gap-7'>
                    <img src={truck} className='w-7' alt='truck'/>
                    <p>Livraison rapide pour respecter vos horaires</p>
                </li>
                <li className='flex items-center gap-7'>
                    <img src={menuVariesImg} className='w-6' alt='menu varies'/>
                    <p>Des menus équilibrés et adaptés à tous les goûts</p>
                </li>
                <li className='flex items-center gap-7'>
                    <img src={serviceImg} className='w-6' alt='service image' />
                    <p>Un service conçu pour les entreprises, sans tracas</p>
                </li>
                <li className='flex items-center gap-7'>
                    <img src={ingredientsImg} className='w-6' alt='ingredients image'/>
                    <p>Des ingrédients frais et locaux, chaque jour</p>
                </li>
             </ul>
        </div>
        <div>
        </div>
    </div>
  )
}

export default PourquoiLunchy