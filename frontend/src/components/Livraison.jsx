import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { CgClose } from 'react-icons/cg'
import { MdLocationOn } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartTotal, clearCart } from '../store/cartSlice'
import {loadStripe} from '@stripe/stripe-js'


import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from 'react'
import SummaryApi from '../common'
import { toast } from 'sonner'

const Livraison = ({onClose , goBackToCart}) => {

  const user = useSelector(state => state.user.user)
  const cartItems = useSelector(state => state.cart.items)
  const subTotal = useSelector(selectCartTotal)
  const [zip , setZipeCode] = useState(user.zip_code || "")
  const [deliveryFee , setDeliveryFee] = useState(0)
  const lowCostZipCodes = ["75005", "75006", "75007", "75013", "75014", "75015"];
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


  const now = new Date();
  const minDate = new Date();
  if (now.getHours() >= 17) {
    // Si il est 17h ou plus, la livraison ne peut pas être aujourd'hui
    minDate.setDate(now.getDate() + 1);
  }
  minDate.setHours(0, 0, 0, 0);
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 15);
  maxDate.setHours(23, 59, 59, 999);

  const formatDateLocal = (date) => {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  };
  

   const validationSchema = Yup.object({
      name: Yup.string().required("Le nom et prénom est requis"),
      address: Yup.string().required("L'adresse est obligatoire"),
      email: Yup.string().email("Email invalide").required("L'email est obligatoire"),
      zip_code: Yup.string()
          .matches(/^75\d{3}$/, "Le code postal doit être à paris")
          .required("L'adresse postale est obligatoire"),
      dateLivraison: Yup.date()
        .required("La date de livraison est obligatoire")
        .min(minDate, "La date ne peut pas être antérieure à aujourd'hui")
        .max(maxDate, "La date doit être dans les 15 jours"),

     
    });
    const formik = useFormik({
        initialValues: {
          name : user?.name || "",
          email: user?.email || "",
          address : user?.address || "",
          zip_code: user?.zip_code || "",
          dateLivraison : ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {

            if(user.role == "entreprise" && user.societe != null){
                if(subTotal + deliveryFee >= 150) {
                    try {
                        const response = await fetch(SummaryApi.createOrder.url, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          credentials : "include" ,
                          body: JSON.stringify({
                            ...values,
                            deliveryFee,
                            totalPrice: subTotal + deliveryFee,
                            items: cartItems,
                          })
                        });
                    
                
                    
                        const result = await response.json();
                        if(result.success) {

                            try {
                                const response = await fetch(SummaryApi.clearCart.url, {
                                  method: SummaryApi.clearCart.method,
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  credentials : "include" ,
                                });
                            
                               const result = await response.json();
                                if(result.success) {
                                    dispatch(clearCart())
                                    onClose();
                                    navigate('/order-success')
                                } else {
                                    console.log(result.message)
                                }                                
                              } catch (error) {
                                console.error(error);
                                
                              }
                            toast.success(result.message)
                            resetForm();
                        } else {
                            toast.error(result.message)
                            console.log(result.message)
                        }
                        
                        
                      } catch (error) {
                        console.error(error);
                        alert("Une erreur est survenue !");
                      }
                } else toast.warning("Devis insuffisant 150 euros minimum")
                
            } else {
                if(subTotal + deliveryFee >= 50){
                    await makePayment()
                } else toast.warning("Devis insuffisant 50 euros minimum")
            }
            
        },
      });

      const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
      };

    

    useEffect(() => {
        setZipeCode(formik.values.zip_code)
      }, [formik.values.zip_code])      

      useEffect(() => {
        setDeliveryFee(lowCostZipCodes.includes(zip) ? 15 : 30);
      }, [zip]);


      const makePayment = async () => {
        const stripe = await stripePromise;
      
        const body = {
          items : cartItems,
          deliveryFee,
          userId: user._id, 
          adrLivraison : formik.values.address,
          zip_code : formik.values.zip_code,
          dateLivraison : formik.values.dateLivraison
        };
      
      
        try {
          const response = await fetch(SummaryApi.createPayment.url, {
            method: SummaryApi.createPayment.method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
            credentials: 'include',
          });
      
          const session = await response.json();
      
          if (!session || !session.id) {
            toast.error('Erreur lors de la création de la session de paiement.');
            return;
          }
      
          console.log("Stripe session:", session);
      
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
      
          if (result.error) {
            console.error("Stripe error:", result.error);
            toast.error('Le paiement a échoué, veuillez réessayer.');
          } 
      
          // Pas de toast success ici car la commande sera confirmée côté Stripe → webhook → base de données
      
        } catch (error) {
          console.error("Erreur pendant le paiement:", error);
          toast.error('Une erreur est survenue lors du traitement du paiement.');
        }
      };
      
      

  return (
    <div>
        <div className='fixed hidden md:flex w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 justify-center items-center z-50'>
           <div className="bg-white flex flex-col p-6 rounded-2xl md:w-[100%] lg:w-[40%] max-h-[650px] flex-none font-Lato">
                 <div className="flex justify-between items-center">
                          <FaArrowLeft className='cursor-pointer' onClick={()=>goBackToCart()} size={18} />
                          <h2 className="text-2xl font-semibold font-Inter">Détails de la livraison</h2>
                          <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
                 </div>

              <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5 mt-8 font-Inter'>
                    <div className="flex flex-col items-start">
                        <label className="text-[14px]">Nom et Prénom *</label>
                        <input
                          type="text"
                          name="name"
                          readOnly
                          className={`border border-solid text-[14px] border-gray-400 p-2 w-full rounded-md`}
                          {...formik.getFieldProps("name")}
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="text-[14px]">Email *</label>
                        <input
                          type="email"
                          name="email"
                          readOnly
                          className={`border border-solid text-[14px] border-gray-400 p-2 w-full rounded-md`}
                          {...formik.getFieldProps("email")}
                        />
                    </div>

                      <div className="flex gap-3 w-full">
                         <div className="w-[75%] flex flex-col items-start">
                           <label className="text-[14px]">Adresse *</label>
                           <div className="relative w-full">
                             <span className="absolute left-2 top-2">
                               <MdLocationOn size={20} />
                             </span>
                             <input
                               type="text"
                               name="address"
                               className={`border border-solid text-[14px] border-gray-400 p-2 pl-8 w-full rounded-md ${
                                 formik.touched.address && formik.errors.address ? "input-error" : ""
                               }`}
                               {...formik.getFieldProps("address")}
                             />
                             {formik.touched.address && formik.errors.address && (
                               <div className="text-red-600 text-xs">{formik.errors.address}</div>
                             )}
                           </div>
                         </div>
                  
                            <div className="w-[25%] flex flex-col items-start">
                              <label className="text-[14px]">Code postal *</label>
                              <input
                                type="text"
                                name="zip_code"
                                className={`border border-solid text-[14px] border-gray-400 p-2 w-full rounded-md ${
                                  formik.touched.zip_code && formik.errors.zip_code ? "input-error" : ""
                                }`}
                                {...formik.getFieldProps("zip_code")}
                              />
                              {formik.touched.zip_code && formik.errors.zip_code && (
                                <div className="text-red-600 text-xs">{formik.errors.zip_code}</div>
                              )}
                            </div>
                      </div>

                      <div className='flex justify-between gap-5 w-full'>
                             <div className="flex flex-col items-start w-[35%]">
                             <label className="text-[14px]">Date de livraison *</label>
                             <input
                                   type="date"
                                   name="dateLivraison"
                                   min={formatDateLocal(minDate)}
                                   max={formatDateLocal(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000))}
                                   className={`text-[14px] border p-2 rounded w-full ${
                                     formik.touched.dateLivraison && formik.errors.dateLivraison ? "border-red-500" : "border-gray-300"
                                   }`}
                                   {...formik.getFieldProps("dateLivraison")}
                                 />

                             {formik.touched.dateLivraison && formik.errors.dateLivraison && <div className="text-red-600 text-xs">{formik.errors.dateLivraison}</div>}
                            </div>
                            <div className='flex flex-col gap-3 w-[65%]'>
                                  <h2 className='text-black font-bold'>Total de la commande</h2>
                                  <div className='flex justify-between items-center text-[15px]'>
                                      <p className='text-gray-700'>Sous Total</p>
                                      <p>{subTotal}€</p>
                                  </div>
                                  <div className='flex justify-between items-center text-[15px]'>
                                      <p className='text-gray-700'>Frais de livraison</p>
                                      <p>{deliveryFee}€</p>
                                  </div>
                                  <div className='flex justify-between items-center py-3 border-t-2 border-t-gray-500 text-[15px]'>
                                     <p className='font-extrabold'>Total</p>
                                     <p className='font-extrabold'>{formatPrice(subTotal + deliveryFee)}€</p>
                                  </div>
                             </div>
                      
                      </div>

                      
                    <p className='text-xs'><span className='text-gray-600 font-semibold'>Remarque : </span>La date de livraison est à choisir pas plus de 15 jours à l'avance et l'annulation est possible max 1 jour avant et sans aucun remboursement si la commande a déjà été payé</p>
                    
                    <button type="submit" disabled={!formik.isValid || formik.isSubmitting} className="!bg-black text-white w-full font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md">
                    {formik.isSubmitting ? "Chargement..." : "Confirmer la commande"}
                     </button>
              </form>

           </div>
        </div>

    {/*version mobile */}

  <div className='md:hidden fixed w-full h-full bg-white top-0 left-0 z-50 p-5 flex flex-col'>
            <div className="flex justify-between items-center">
            <FaArrowLeft className='cursor-pointer' onClick={()=>goBackToCart()} size={18} />
            <h2 className="text-2xl font-semibold font-Inter">Détails de la livraison</h2>
            <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
            </div>

                    <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5 mt-8 font-Inter overflow-y-auto no-scrollbar'>
                      <div className="flex flex-col items-start">
                          <label className="text-[14px]">Nom et Prénom *</label>
                          <input
                            type="text"
                            name="name"
                            readOnly
                            className={`border border-solid text-[14px] border-gray-400 p-2 w-full rounded-md`}
                            {...formik.getFieldProps("name")}
                          />
                      </div>
                            
                      <div className="flex flex-col items-start">
                          <label className="text-[14px]">Email *</label>
                          <input
                            type="email"
                            name="email"
                            readOnly
                            className={`border border-solid text-[14px] border-gray-400 p-2 w-full rounded-md`}
                            {...formik.getFieldProps("email")}
                          />
                      </div>
                            
                        <div className="flex gap-3 w-full">
                           <div className="w-[75%] flex flex-col items-start">
                             <label className="text-[14px]">Adresse *</label>
                             <div className="relative w-full">
                               <span className="absolute left-2 top-2">
                                 <MdLocationOn size={20} />
                               </span>
                               <input
                                 type="text"
                                 name="address"
                                 className={`border border-solid text-[14px] border-gray-400 p-2 pl-8 w-full rounded-md ${
                                   formik.touched.address && formik.errors.address ? "input-error" : ""
                                 }`}
                                 {...formik.getFieldProps("address")}
                               />
                               {formik.touched.address && formik.errors.address && (
                                 <div className="text-red-600 text-xs">{formik.errors.address}</div>
                               )}
                             </div>
                           </div>
                           
                              <div className="w-[25%] flex flex-col items-start">
                                <label className="text-[14px] text-nowrap">Code postal*</label>
                                <input
                                  type="text"
                                  name="zip_code"
                                  className={`border border-solid text-[14px] border-gray-400 p-2 w-full rounded-md ${
                                    formik.touched.zip_code && formik.errors.zip_code ? "input-error" : ""
                                  }`}
                                  {...formik.getFieldProps("zip_code")}
                                />
                                {formik.touched.zip_code && formik.errors.zip_code && (
                                  <div className="text-red-600 text-xs">{formik.errors.zip_code}</div>
                                )}
                              </div>
                        </div>
                            
                             <div className="flex flex-col items-start">
                               <label className="text-[14px]">Date de livraison *</label>
                               <input
                                     type="date"
                                     name="dateLivraison"
                                     min={formatDateLocal(minDate)}
                                     max={formatDateLocal(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000))}
                                     className={`text-[14px] border p-2 rounded w-full ${
                                       formik.touched.dateLivraison && formik.errors.dateLivraison ? "border-red-500" : "border-gray-300"
                                     }`}
                                     {...formik.getFieldProps("dateLivraison")}
                                   />
                                    
                               {formik.touched.dateLivraison && formik.errors.dateLivraison && <div className="text-red-600 text-xs">{formik.errors.dateLivraison}</div>}
                             </div>
                              <p className='text-xs'><span className='text-gray-600 font-semibold'>Remarque : </span>La date de livraison est à choisir pas plus de 15 jours à l'avance et l'annulation est possible max 1 jour avant et sans aucun remboursement si la commande a déjà été payé</p>

                              <div className='flex flex-col gap-3'>
                                    <h2 className='text-black font-bold'>Total de la commande</h2>
                                    <div className='flex justify-between items-center text-[15px]'>
                                        <p className='text-gray-700'>Sous Total</p>
                                        <p>{formatPrice(subTotal)}€</p>
                                    </div>
                                    <div className='flex justify-between items-center text-[15px]'>
                                        <p className='text-gray-700'>Frais de livraison</p>
                                        <p>{formatPrice(deliveryFee)}€</p>
                                    </div>
                                    <div className='flex justify-between items-center py-3 border-t-2 border-t-gray-500 text-[15px]'>
                                       <p className='font-extrabold'>Total</p>
                                       <p className='font-extrabold'>{formatPrice(subTotal + deliveryFee)}€</p>
                                    </div>
                               </div>
                                    
                        
                                    
                                    
                                    
                      <button type="submit" disabled={!formik.isValid || formik.isSubmitting} className="!bg-black text-white w-full font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md">
                      {formik.isSubmitting ? "Chargement..." : "Confirmer la commande"}
                       </button>
                    </form>
        </div>



    </div>
  )
}

export default Livraison