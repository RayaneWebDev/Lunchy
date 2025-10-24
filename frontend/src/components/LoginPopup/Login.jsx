import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import './Login.css';
import SummaryApi from '../../common';

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Champ obligatoire"),
  password: Yup.string().min(6, "6 caractères minimum").required("Champ obligatoire"),
});

const Login = ({ setShowLogout, setShowLogin, fetchUserDetails, setShowSendEmail }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-popup">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // ✅ Envoi correct de la requête
            const response = await axios.post(SummaryApi.signIN.url, values, {
              headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;

            if (data.success) {
              toast.success(data.message);

              // ✅ Sauvegarde du token et utilisateur dans localStorage
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));

              // ✅ Force axios à utiliser le token pour les requêtes suivantes
              axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

              // ✅ Mettre à jour le contexte utilisateur
              fetchUserDetails();

              setShowLogin(false);
              setShowLogout(true);

              navigate("/");
            } else {
              toast.error(data.message);
            }
          } catch (err) {
            console.error("Erreur connexion :", err);
            toast.error("Erreur de connexion");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="login-popup-container w-[330px] bg-white flex flex-col gap-[25px] px-6 py-[25px] rounded-[8px] text-[14px]">
            <div className="login-popup-title flex justify-between items-center text-black">
              <h2 className="font-bold text-[20px]">Connexion</h2>
              <IoMdClose onClick={() => setShowLogin(false)} className="cursor-pointer" />
            </div>

            <div className="flex flex-col items-start">
              <div className="login-popup-inputs flex flex-col gap-5">
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

              <label
                className="mt-2 text-xs text-gray-400 font-semibold cursor-pointer"
                onClick={() => { setShowLogin(false); setShowSendEmail(true); }}
              >
                Mot de passe oublié ?
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </button>

            <p className='text-sm text-center'>
              Pas de compte ?
              <Link
                to="/inscription"
                onClick={() => { setShowLogin(false); window.location.href = "/inscription"; }}
                className="text-primary hover:underline font-bold ml-2"
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
