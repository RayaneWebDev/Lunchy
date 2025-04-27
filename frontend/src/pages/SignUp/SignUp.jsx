import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import SummaryApi from '../../common/index';
import { toast } from 'sonner';
import './SignUp.css';

// Validation Schema avec Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Le nom et prénom sont obligatoires'),
  email: Yup.string().email("Email invalide").required("L'email est obligatoire"),
  societe: Yup.string().notRequired(),
  address: Yup.string().required("L'adresse est obligatoire"),
  zip_code: Yup.string()
    .matches(/^75\d{3}$/, "Le code postal doit être au format 75XXX")
    .required("L'adresse postale est obligatoire"),
  phone: Yup.string()
    .matches(/^0\d{9}$/, "Numéro de téléphone invalide")
    .required('Le téléphone est obligatoire'),
  password: Yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required('Le mot de passe est obligatoire'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Les mots de passe doivent correspondre")
    .required("Veuillez confirmer votre mot de passe"),

});

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="container mx-auto flex justify-center items-center my-4 text-[14px]">
      <Formik
        initialValues={{
          name: '',
          email: '',
          societe: '',
          address: '',
          zip_code: '',
          phone: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await fetch(SummaryApi.signUP.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });
            const dataApi = await response.json();

            if (dataApi.success) {
              toast.success(dataApi.message);
              console.log("data : ",values)
              navigate('/');
            } else {
              toast.error(dataApi.message);
              console.log(dataApi.message)
            }
          } catch (error) {
            toast.error('Une erreur est survenue. Veuillez réessayer.');
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md w-[400px] md:w-[600px]">
            <h2 className="text-xl font-bold mb-12">Créer votre compte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label>Nom et Prénom *</label>
                <Field 
                  type="text" 
                  name="name" 
                  className={`input-field ${errors.name && touched.name ? 'input-error' : ''}`} 
                  
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex flex-col">
                <label>Email *</label>
                <Field 
                  type="email" 
                  name="email" 
                  className={`input-field ${errors.email && touched.email ? 'input-error' : ''}`} 
                  
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex flex-col">
                <label>Société <span className='text-[9px] text-gray-700'>(obligatoire seulement si vous êtes une entreprise)</span></label>
                <Field 
                  type="text" 
                  name="societe" 
                  className='input-field' 
                />
              </div>

              <div className="flex flex-col">
                <label>Adresse *</label>
                <div className='relative'>
                  <span className='absolute left-2 top-3'><MdLocationOn size={20}/></span>
                  <Field 
                  type="text" 
                  name="address" 
                  className={`input-field w-full pl-10 ${errors.address && touched.address ? 'input-error' : ''}`} 
                  placeholder = 'ex 60 avenue des gobelins'
                />
                </div>
               
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex flex-col">
                <label>Code postal *</label>
                <Field 
                  type="text" 
                  name="zip_code" 
                  className={`input-field ${errors.zip_code && touched.zip_code ? 'input-error' : ''}`} 
                  placeholder='ex 75013'
                />
                <ErrorMessage name="zip_code" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex flex-col">
                <label>Numéro de Téléphone *</label>
                <Field 
                  type="text" 
                  name="phone" 
                  className={`input-field ${errors.phone && touched.phone ? 'input-error' : ''}`} 
                  placeholder="07XXXXXXXX" 
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex flex-col">
                <label>Mot de passe *</label>
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

              <div className="flex flex-col">
                <label>Confirmer le mot de passe *</label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`input-field w-full pr-10 ${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`}
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

            <div className='login-popup-condition flex items-start gap-2 mt-[25px]'>
            <input className='mt-[5px]' type='checkbox' required />
            <p className='text-sm md:text-[12px]'>J'accepte les<Link className='font-bold' to={'/conditionsUtilisation'} onClick={() => window.location.href = "/conditionsUtilisation"}> conditions d'utilisation</Link> et <Link className='font-bold' to={'/politiqueDeConfidentialite'} onClick={() => window.location.href = "/politiqueDeConfidentialite"}>la politique de confidentialité</Link></p>
           </div>

            <button 
              type="submit" 
              className="btn-submit w-full mt-8" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </button>

            <p className="text-center mt-4">
              Déjà un compte ?{' '}
              <span 
                onClick={() => navigate('/')} 
                className="text-primary hover:text-primary-hover hover:underline cursor-pointer"
              >
                Connexion
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
