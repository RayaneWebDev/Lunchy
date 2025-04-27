import React from 'react'
import './OrderFailed.css'
import { useNavigate } from 'react-router-dom'

const OrderFailed = () => {

    const navigate = useNavigate()
    useEffect(() => {
       window.scrollTo(0, 0);
    }, []);
  return (
    <div className='text-center mt-[70px]'>
   
 
        <div className="error-circle w-[80px] h-[80px] mx-auto mb-7">
            <div className="crossmark">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
            </div>
        </div>
  
        <div className='flex flex-col gap-8  font-Poppins'>
            <h1 className='text-xl md:text-3xl font-bold'>Echec de paiement </h1>
            <div className='flex flex-col gap-3 text-gray-500'>
                <p>
                Votre paiement n'a pas pu être effectué. Veuillez vérifier vos informations bancaires et réessayer
                </p>
                <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            </div>

            <button className="btn max-w-[300px] mx-auto bg-tomato hover:bg-orange-400 text-white" onClick={()=>navigate('/cart')}>Réassayer</button>             
        </div>
   
    </div>
  )
}

export default OrderFailed