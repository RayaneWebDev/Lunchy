import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import uploadImage from '../helpers/uploadImageRestaurants';
import { toast } from 'sonner';
import SummaryApi from '../common';
import { useOutletContext } from 'react-router-dom';

const AddRestaurantModal = ({ onClose }) => {
    const [logo, setLogo] = useState(null);
    const [mapImage, setMapImage] = useState(null);
    const [heroImage, setHeroImage] = useState(null)
    const [logoError, setLogoError] = useState('');
    const [mapImageError, setMapImageError] = useState('');
    const [heroImageError, setHeroImageError] = useState('')
    const {fetchRestaurants} = useOutletContext()

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            adresse: '',
            zip_code: '',
            phone: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Le nom est requis'),
            description: Yup.string().required('La description est requise'),
            adresse: Yup.string().required("L'adresse est requise"),
            zip_code: Yup.string().required('Le code postal est requis'),
            phone: Yup.string()
                .matches(/^0\d{9}$/, "Numéro de téléphone invalide")
                .required('Le téléphone est obligatoire'),        }),
        onSubmit: async (values) => {
            if (!logo) setLogoError('Le logo est requis');
            if (!mapImage) setMapImageError("L'image de la carte est requise");
            if(!heroImage) setHeroImageError("Une image représentant le restaurant est requise")
            if (!logo || !mapImage || !heroImage) return;

            const newRestaurant = { ...values, address : values.adresse , logo, mapImage, heroImage };

            try {
                const response = await fetch(SummaryApi.createRestaurant.url, {
                    method: SummaryApi.createRestaurant.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRestaurant),
                    credentials: "include",
                });

                const result = await response.json();
                if (result.success) {
                    toast.success(result.message);
                    fetchRestaurants();
                    onClose();
                } else {
                    toast.error(result.message);
                    console.log(result.message)
                }
            } catch (error) {
                toast.error("Erreur lors de la création du restaurant");
                console.log(error)
            }
        }
    });



    const handleUpload = async (e, setImage, setError) => {
        const file = e.target.files[0];
        if (!file) return;

        setError('');
        const uploadedImage = await uploadImage(file);
        setImage(uploadedImage.url);
    };

    return (
        <div className='fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-bold'>Ajouter un restaurant</h2>
                    <CgClose className='cursor-pointer text-2xl' onClick={onClose} />
                </div>
                <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3'>
                    {/** Nom */}
                    <div>
                        <input 
                            type='text' 
                            name='name' 
                            placeholder='Nom' 
                            className={`text-[14px] border p-2 rounded w-full ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`} 
                            {...formik.getFieldProps('name')} 
                        />
                        {formik.touched.name && formik.errors.name && <p className="text-red-600 text-sm">{formik.errors.name}</p>}
                    </div>


                    {/** Adresse */}
                    <div>
                        <input 
                            type='text' 
                            name='adresse' 
                            placeholder='Adresse' 
                            className={`text-[14px] border p-2 rounded w-full ${formik.touched.adresse && formik.errors.adresse ? 'border-red-500' : 'border-gray-300'}`} 
                            {...formik.getFieldProps('adresse')}
                        />
                        {formik.touched.adresse && formik.errors.adresse && <p className="text-red-600 text-sm">{formik.errors.address}</p>}
                    </div>

                    {/** Code postal */}
                    <div>
                        <input 
                            type='text' 
                            name='zip_code' 
                            placeholder='Code postal' 
                            className={`text-[14px] border p-2 rounded w-full ${formik.touched.zip_code && formik.errors.zip_code ? 'border-red-500' : 'border-gray-300'}`} 
                            {...formik.getFieldProps('zip_code')} 
                        />
                        {formik.touched.zip_code && formik.errors.zip_code && <p className="text-red-600 text-sm">{formik.errors.zip_code}</p>}
                    </div>

                    {/** Téléphone */}
                    <div>
                        <input 
                            type='text' 
                            name='phone' 
                            placeholder='Téléphone' 
                            className={`text-[14px] border p-2 rounded w-full ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'}`} 
                            {...formik.getFieldProps('phone')} 
                        />
                        {formik.touched.phone && formik.errors.phone && <p className="text-red-600 text-sm">{formik.errors.phone}</p>}
                    </div>

                     {/** Description */}
                     <div>
                     <textarea 
                         name='description' 
                         placeholder='Description' 
                         className={`text-[14px] border p-2 rounded w-full ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'}`} 
                         {...formik.getFieldProps('description')} 
                     />
                     {formik.touched.description && formik.errors.description && <p className="text-red-600 text-sm">{formik.errors.description}</p>}
                 </div>

                    {/** Upload Logo */}
                    <div>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <FaCloudUploadAlt className='text-[14px]' /> soumettre le logo du restaurant
                            <input type='file' className='hidden' onChange={(e) => handleUpload(e, setLogo, setLogoError)} />
                        </label>
                        {logo && <img src={logo} alt='Logo' className='h-16 mt-2' />}
                        {logoError && <p className="text-red-600 text-sm">{logoError}</p>}
                    </div>

                    {/** Upload Map Image */}
                    <div>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <FaCloudUploadAlt className='text-[14px]' /> soumettre la capture de l'adresse maps
                            <input type='file' className='hidden' onChange={(e) => handleUpload(e, setMapImage, setMapImageError)} />
                        </label>
                        {mapImage && <img src={mapImage} alt='Map' className='h-16 mt-2' />}
                        {mapImageError && <p className="text-red-600 text-sm">{mapImageError}</p>}
                    </div>

                     {/** Upload Restaurant Image */}

                    <div>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <FaCloudUploadAlt className='text-[14px]' /> soumettre une image représentant la gastronomie du restaurant
                            <input type='file' className='hidden' onChange={(e) => handleUpload(e, setHeroImage, setHeroImageError)} />
                        </label>
                        {heroImage && <img src={heroImage} alt='Map' className='h-16 mt-2' />}
                        {heroImageError && <p className="text-red-600 text-sm">{heroImageError}</p>}
                    </div>

                    <button
                    
                    className="bg-black text-white text-[13px] py-3 rounded mt-5">
                     Ajouter
                  </button>
                </form>
            </div>
        </div>
    );
};

export default AddRestaurantModal;
