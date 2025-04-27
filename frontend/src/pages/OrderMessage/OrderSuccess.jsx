import React from 'react'
import './OrderSuccess.css'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../../common'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../store/cartSlice'

const OrderSuccess = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0);
    const clearCartFromServer = async () => {
      try {
        const res = await fetch(SummaryApi.clearCart.url, {
          method: SummaryApi.clearCart.method,
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        const data = await res.json()
        if (data.success) {
          dispatch(clearCart())
        } else {
          console.error("Erreur serveur lors du clearCart :", data.message)
        }
      } catch (err) {
        console.error("Erreur réseau lors du clearCart :", err)
      }
    }

    clearCartFromServer()
  }, [])

    const navigate = useNavigate()
  return (
    <div className='text-center mt-[50px]'>
         <div className="animation-container mx-auto mb-10 bg-transparent max-w-[90%] h-[200px] md:max-w-[400px]">
         {/* Points dispersés */}
         {[...Array(20)].map((_, index) => (
           <div key={index} className="orange-dot"></div>
         ))}
      
         {/* Cercle central */}
         <div className="circle w-[80px] h-[80px]">
           <div className="checkmark">✓</div>
         </div>
       </div>

         <div className='flex flex-col gap-8  font-Poppins'>
             <h1 className='text-xl md:text-3xl font-bold'>Merci d'avoir choisi Lunchy !</h1>
             <div className='flex flex-col gap-3 text-gray-500'>
                 <p>
                     Votre commande a été crée avec succès. Vous recevrez bientôt un email de confirmation contenant les détails de votre commande et les contacts du responsable pour la livraison.
                 </p>
                 <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
             </div>

             <button className="btn max-w-[300px] mx-auto bg-primary text-white rounded-lg" onClick={()=>navigate('/')}>Retour à l'acceuil</button>             
         </div>
        
   </div>
  )
}

export default OrderSuccess