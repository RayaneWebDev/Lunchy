import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import './Login.css';
import SummaryApi from '../../common';

// Validation Schema avec Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email est invalide")
    .required("Champ obligatoire"),
  password: Yup.string()
    .min(6, "Votre mot de passe doit contenir au moins 6 caractères")
    .required("Champ obligatoire"),
});

const Login = ({ setShowLogout, setShowLogin, fetchUserDetails, setShowSendEmail }) => {
  const navigate = useNavigate()
  const [showPassword , setShowPassword] = useState(false);


  return (
    <div className="login-popup">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={ async(values, { setSubmitting }) => {
          try{
            const dataResponse = await fetch(SummaryApi.signIN.url, {
              method: SummaryApi.signIN.method,
              headers: { "Content-type": "application/json" },
              body: JSON.stringify(values),
              credentials : "include"
            });
        
            const dataApi = await dataResponse.json();
        
            if (dataApi.success) {
              toast.success(dataApi.message);
              console.log("data-api:",dataApi)
              setShowLogin(false); // Fermer le pop-up après la connexion réussie
              setShowLogout(true);
              fetchUserDetails();
              //fetchUserAddToCart()
            }
        
            if (dataApi.error) {
              toast.error(dataApi.message);
            }
            
          } catch(err){
            toast.error("Erreur de connexion")
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
              <h2 className="font-bold text-[20px]">Connexion</h2>
              <IoMdClose onClick={() => setShowLogin(false)} className="cursor-pointer" />
            </div>

            <div className="flex flex-col items-start">
              <div className="login-popup-inputs container flex flex-col gap-5">
                <Field
                  type="email"
                  name="email"
                  placeholder="Votre email"
                  className={`input-field ${errors.email && touched.email ? 'input-error' : ''}`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />

                <div className="relative w-full">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Votre mot de passe"
                    className={`input-field w-full pr-10 ${errors.password && touched.password ? 'input-error' : ''}`}
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
              </div>

              <label className="mt-2 text-xs text-gray-400 font-semibold cursor-pointer" onClick={()=> {setShowLogin(false) ; setShowSendEmail(true)}}>
                Mot de passe oublié ?
              </label>
            </div>

            <button type="submit" className="btn-submit font-Lato" disabled={isSubmitting}>
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </button>

            <p className='font-Lato'>
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/inscription"
                onClick={() =>  {setShowLogin(false) ; window.location.href = "/inscription"}}
                className="text-primary hover:text-primary-hover hover:underline font-bold ml-2"
              >
                S'inscrire
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
