import React, { useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import './LoginPopup/Login.css';
import SummaryApi from '../common/index';

// Validation Schema avec Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email est invalide")
    .required("Champ obligatoire"),
});

const EnterEmail = ({ setShowSendEmail, setShowEmailVerif }) => {
  const navigate = useNavigate()

  return (
    <div className="login-popup">
      <Formik
        initialValues={{ email: ""}}
        validationSchema={validationSchema}
        onSubmit={ async(values, { setSubmitting }) => {
          try{
            const dataResponse = await fetch(SummaryApi.sendOtp.url, {
              method: SummaryApi.sendOtp.method,
              headers: { "Content-type": "application/json" },
              body: JSON.stringify(values),
            });
        
            const dataApi = await dataResponse.json();
        
            if (dataApi.success) {
              localStorage.setItem("otpToken", dataApi.otpToken);
              localStorage.setItem("email",values.email);
              toast.success(dataApi.message);
              console.log("data-api:",dataApi)
              setShowSendEmail(false); 
              setShowEmailVerif(true);
            }
        
            if (dataApi.error) {
              toast.error(dataApi.message);
              console.log(dataApi.message)
            }
            
          } catch(err){
            toast.error("Erreur dans l'envoi du code")
            console.log(err)
          }
          finally{
            setSubmitting(false);
          }
          
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="login-popup-container w-[330px] bg-white flex flex-col gap-[25px] px-6 py-[25px] md:px-[30px] rounded-[8px] text-[14px]">
            <div className="login-popup-title flex justify-between items-center text-black">
              <h2 className="font-bold text-[20px]">Entrez votre email</h2>
              <IoMdClose onClick={() => setShowSendEmail(false)} className="cursor-pointer" />
            </div>

            <p className='text-[12px] text-gray-500'>Un code vous sera envoyé pour vérifier votre identité</p>

              <div className="login-popup-inputs container flex flex-col gap-5">
                <Field
                  type="email"
                  name="email"
                  placeholder="Votre email"
                  className={`input-field ${errors.email && touched.email ? 'input-error' : ''}`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />

             </div>

            <button type="submit" className="btn-submit font-Lato" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </button>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EnterEmail;
