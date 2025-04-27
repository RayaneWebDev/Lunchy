import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import './LoginPopup/Login.css';
import SummaryApi from '../common/index.js'
// Validation Schema avec Yup
const validationSchema = Yup.object().shape({
   password: Yup.string()
     .min(6, "Le mot de passe doit contenir au moins 6 caractères")
     .required('Le mot de passe est obligatoire'),
   confirmPassword: Yup.string()
     .oneOf([Yup.ref('password'), null], "Les mots de passe doivent correspondre")
     .required("Veuillez confirmer votre mot de passe"),
});

const ResetPwd = ({setShowResetPwd}) => {
  const navigate = useNavigate()
  const [showPassword , setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <div className="login-popup">
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={ async(values, { setSubmitting }) => {
            try{
            const email = localStorage.getItem("email");
            if(!email){
                toast.error("Session expiré, veuillez recommencer")
                setShowResetPwd(false)
                return
            }
                const response = await fetch(SummaryApi.resetPwd.url,{
                    method: SummaryApi.resetPwd.method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password : values.password, email }),
                })

                const data = await response.json()
                if (data.success) {
                    toast.success("Mot de passe réinitialisé avec succès !");
                    setShowResetPwd(false);
                    navigate("/");
                } else {
                    toast.error(data.message);
                    console.log(data.message)
                }
            } catch(error){
                toast.error("Erreur survenue")
                console.log("Erreur dans la réinitialisation du mot de passe",error)
            }
            finally{
                setSubmitting(false)
            }
          
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="login-popup-container w-[330px] bg-white flex flex-col gap-[25px] px-6 py-[25px] md:px-[30px] rounded-[8px] text-[14px]">
            <div className="login-popup-title flex justify-between items-center text-black">
              <h2 className="font-bold text-[20px]">Réinitialisez votre mot de passe</h2>
              <IoMdClose onClick={() => setShowResetPwd(false)} className="cursor-pointer" />
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col w-full">
                              <label>mot de passe</label>
                              <div className="relative">
                                <Field
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  className={`input-field w-full pr-10 ${errors.password && touched.password ? 'input-error' : ''}`}
                                />
                                <span
                                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                </span>
                              </div>
                              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
             
               <div className="flex flex-col w-full">
                             <label>confirmer votre mot de passe</label>
                             <div className="relative">
                               <Field
                                 type={showConfirmPassword ? "text" : "password"}
                                 name="confirmPassword"
                                 className={`input-field w-full pr-10 ${errors.password && touched.password ? 'input-error' : ''}`}
                               />
                               <span
                                 className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                               >
                                 {showConfirmPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                               </span>
                             </div>
                             <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                </div>
            </div>

            <button type="submit" className="btn-submit font-Lato" disabled={isSubmitting}>
              {isSubmitting ? "En cours" : "Valider"}
            </button>

           
          </Form>
        )}
      </Formik>
    </div>
  );
 
};

export default ResetPwd;
