import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { MdLocationOn } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { setUserDetails } from '../store/userSlice';
import SummaryApi from '../common';
import { useNavigate, useOutletContext } from 'react-router-dom';
import HistoriqueCmd from './HistoriqueCmd';

const MonCompte = () => {
  const {fetchUserDetails} = useOutletContext()
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [valuesToSubmit, setValuesToSubmit] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Chargement de vos informations...
      </div>
    );
  }
  

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Le nom et prénom sont obligatoires'),
    email: Yup.string().email("Email invalide").required("L'email est obligatoire"),
    societe: Yup.string().when([], {
      is: () => !!user?.societe,
      then: schema => schema.required("Le nom de votre société est obligatoire"),
      otherwise: schema => schema.notRequired(),
    }),
    address: Yup.string().required("L'adresse est obligatoire"),
    zip_code: Yup.string()
      .matches(/^75\d{3}$/, "Le code postal doit être au format 75XXX")
      .required("L'adresse postale est obligatoire"),
    phone: Yup.string()
      .matches(/^0\d{9}$/, "Numéro de téléphone invalide")
      .required('Le téléphone est obligatoire'),
  });

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });
      const dataApi = await response.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        dispatch(setUserDetails(null));
        navigate('/');
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleConfirm = async () => {
    if (!valuesToSubmit) return;

    try {
      const response = await fetch(SummaryApi.updateProfile.url, {
        method: SummaryApi.updateProfile.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valuesToSubmit),
        credentials: "include",
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        setValuesToSubmit(null);
        document.getElementById('my_modal_5').close();
        setShowModal(false);
        fetchUserDetails();
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className='my-[50px]'>
    
      <Formik
        enableReinitialize
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          societe: user?.role === "entreprise" ? user?.societe : '',
          address: user?.address || '',
          zip_code: user?.zip_code || '',
          phone: user?.phone || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setValuesToSubmit(values);
          setShowModal(true);
          document.getElementById('my_modal_5').showModal();
          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, validateForm, handleSubmit }) => (
          <Form className='container mx-auto flex flex-col max-w-[90%] py-7 px-7 md:py-8 md:px-12 mt-6 lg:mt-12 border-[#F3F3F3] shadow-[0px_2px_14px_3px_rgba(0,0,0,0.16)] rounded-[17px]'>

            <h2 className='text-primary font-bold text-[20px] mb-12'>Compte</h2>

            <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-x-14 md:gap-y-8">
              <div className="flex flex-col">
                <label>Nom et Prénom *</label>
                <Field type="text" name="name" className={`input-field ${errors.name && touched.name ? 'input-error' : ''}`} />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex flex-col">
                <label>Email *</label>
                <Field type="email" name="email" className={`input-field ${errors.email && touched.email ? 'input-error' : ''}`} />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              {user.societe != null && (
                <div className="flex flex-col">
                  <label>Société</label>
                  <Field type="text" name="societe" className={`input-field ${errors.societe && touched.societe ? 'input-error' : ''}`} />
                  <ErrorMessage name="societe" component="div" className="text-red-500 text-sm" />
                </div>
              )}

              <div className="flex flex-col">
                <label>Numéro de Téléphone *</label>
                <Field type="text" name="phone" className={`input-field ${errors.phone && touched.phone ? 'input-error' : ''}`} />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <div className='flex flex-col md:flex-row gap-4'>
                <div className="flex flex-col flex-grow">
                  <label>Adresse *</label>
                  <div className='relative'>
                    <span className='absolute left-2 top-3'><MdLocationOn size={20} /></span>
                    <Field type="text" name="address" className={`input-field w-full min-w-[200px] pl-10 ${errors.address && touched.address ? 'input-error' : ''}`} />
                  </div>
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="flex flex-col">
                  <label>Code postal *</label>
                  <Field type="text" name="zip_code" className={`input-field md:w-auto ${errors.zip_code && touched.zip_code ? 'input-error' : ''}`} />
                  <ErrorMessage name="zip_code" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className='flex flex-col md:flex-row items-start md:items-center gap-12 justify-between mt-7'>
                <button
                  type="submit"
                  className="btn md:w-48 bg-primary text-white w-full"
                >
                  Enregistrer
                </button>
                <p className='text-red-600 font-semibold font-Lato text-[14px] md:text-[17px] cursor-pointer' onClick={handleLogout}>Se déconnecter</p>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Modal de confirmation */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className='flex justify-between items-center'>
            <h3 className="font-bold text-lg">Confirmer vos choix</h3>
            <IoMdClose onClick={() => {
              document.getElementById("my_modal_5").close();
              setShowModal(false);
            }} className="cursor-pointer" size={30} />
          </div>
          <p className="py-4">Vous pouvez toujours revenir et modifier vos informations si nécessaire</p>
          <div className="modal-action">
            <button className="btn bg-primary text-white" onClick={handleConfirm}>Confirmer</button>
          </div>
        </div>
      </dialog>

      <HistoriqueCmd />
    </div>
  );
};

export default MonCompte;
