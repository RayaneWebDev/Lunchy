import React from 'react'
import Logo from '../../assets/logo.svg'
import './Footer.css'
import { Link } from 'react-router-dom'





const Footer = () => {
  return (
    
     
        <div className='footer text-black flex items-center flex-col gap-5 py-5 px-[8vw] font-Lato' id='footer'>
        <div className='footer-content w-[100%] grid ' >
          <div className='footer-content-left flex flex-col items-start gap-3 lg:pr-56'>
            <img src={Logo} alt='lunchy logo' className='w-32' />
            <p className='md:pr-14 leading-8 text-[13px]'>Chez Lunchy, nous vous offrons une cuisine authentique avec des ingrédients frais et des recettes savoureuses. Que ce soit pour un repas sur place, à emporter ou en livraison, votre satisfaction est notre priorité. Merci de choisir Lunchy !</p>
         </div>
         <div className='footer-content-center flex flex-col items-start  gap-7'>
                <h2 className='font-bold text-[16px] md:transform md:translate-y-5 md:mb-3'>Société</h2>
                <ul>
                 <li><Link to={'/'} onClick={() => window.location.href = "/"}></Link>Accueil</li>
                 <li><Link to={'/menu'} onClick={() => window.location.href = "/menu"}>Menu</Link></li>
                 <li><Link to={'/contact'} onClick={() => window.location.href = "/contact"}>Contact</Link></li>
                 <li><Link to={'/politiqueDeConfidentialite'} onClick={() => window.location.href = "/politiqueDeConfidentialite"}>Politique de Confidentialité</Link></li>
                 <li><Link to={'/conditionsUtilisation'} onClick={() => window.location.href = "/conditionsUtilisation"}>Conditions d'utilisation</Link></li>
                 <li><Link to={'/mentionslegales'} onClick={() => window.location.href = "/mentionslegales"}>Mentions légales </Link></li>
                </ul>
         </div>
         <div className='footer-content-right flex flex-col items-start gap-7'>
                <h2 className='font-bold text-[16px] md:transform md:translate-y-5 md:mb-3'>Nous Contacter</h2>
                <ul>
                 <li>+33 773 25 10 72</li>
                 <li>lunchyParis@gmail.com</li>
                </ul>
         </div>
          
          
         
        </div>

   
        <hr className='w-[100%] h-[2px] my-5 mx-0 bg-gray-400 border-none' />
        <p className='footer-copyright text-[9px]'>Copyright 2024 © {import.meta.env.VITE_DOMAINE_URL} - All Right Reserved.</p>
       </div>
      ) 
    
   
  
}

export default Footer