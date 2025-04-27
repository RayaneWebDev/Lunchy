import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SummaryApi from "../common";
import { toast } from "sonner";
import emailIcon from '../assets/email.svg'
import phoneIcon from '../assets/phone.svg'
import addressIcon from '../assets/localisation.svg'
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const Contact = () => {

  const {restaurants} = useOutletContext()
  
  // Validation avec Yup
  const validationSchema = Yup.object({
    lastName: Yup.string().required("Le nom est requis"),
    firstName: Yup.string().required("Le prénom est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    message: Yup.string().required("Le message est requis"),
    company: Yup.string(),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Le numéro de téléphone doit contenir uniquement des chiffres")
  });

  // Formik pour gérer le formulaire
  const formik = useFormik({
    initialValues: {
      lastName: "",
      firstName: "",
      email: "",
      company: "",
      phone: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("values email : ",values)
        const response = await fetch(SummaryApi.sendEmailContact.url, {
          method: SummaryApi.sendEmailContact.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
    
        const dataApi = await response.json();
    
        if (dataApi.success) {
          toast.success(dataApi.message)
          resetForm()
        } else if (dataApi.error) {
          toast.error("Une erreur est survenue");
          console.log(dataApi.message)
        }
      } catch (error) {
        console.log("Error in fetching sending email contact : ",error)
        toast.error('An error occurred. Please try again.');
      }
    },
  });

  return (
    <>
    <Helmet>
      <title>Contactez Lunchy - Livraison de repas à Paris</title>
      <meta name="description" content="Besoin d'aide ? Contactez Lunchy pour toute question sur vos commandes ou services de livraison à Paris." />
      <meta property="og:title" content="Contactez Lunchy" />
      <meta property="og:description" content="Contactez notre équipe pour toute assistance concernant vos commandes Lunchy." />
      <meta property="og:image" content={`${import.meta.env.VITE_DOMAINE_URL}/assets/seo-img.png`} />
      <meta property="og:url" content={`${import.meta.env.VITE_DOMAINE_URL}/contact`} />
    </Helmet>
    <div className="font-Lato mt-[60px] mb-[80px]">
    <div className="flex flex-col items-center gap-4 justify-center">
      <h1 className="font-bold text-[20px] md:text-[25px] lg:text-[30px]">Contactez-nous</h1>
      <p className="font-Inter text-[9px] text-center leading-5 text-gray-600 px-7 md:text-[12px]">
        Si vous ne trouvez pas ce que vous cherchez dans la FAQ ci-dessous, veuillez nous envoyer un message après avoir rempli le formulaire
      </p>
    </div>

  <div className="lg:mx-44 flex flex-col items-center gap-9 lg:flex-row lg:items-start ">

    {/*ici le formulaire*/}
    <div className="container mx-auto lg:mx-0 max-w-[90%] md:max-w-[500px] p-6 mt-6 lg:mt-12 border-[#F3F3F3] shadow-[0px_2px_14px_3px_rgba(0,0,0,0.16)] rounded-[17px]">
    <h2 className="text-primary pb-7 lg:pb-9 font-bold lg:text-[20px]">Envoyez-nous un message</h2>
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 lg:gap-7">
      {/* Nom */}
      <div className="flex flex-col items-start">
        <label className="text-xs lg:text-[14px]">Nom *</label>
        <input
          type="text"
          name="lastName"
          className={`border border-solid text-sm lg:text-[14px] border-gray-400 p-2 w-full rounded-md ${
            formik.touched.lastName && formik.errors.lastName ? "input-error" : ""
          }`}
          {...formik.getFieldProps("lastName")}
        />
        {formik.touched.lastName && formik.errors.lastName && <div className="text-red-600 text-xs">{formik.errors.lastName}</div>}
      </div>

      {/* Prénom */}
      <div className="flex flex-col items-start">
        <label className="text-xs lg:text-[14px]">Prénom *</label>
        <input
          type="text"
          name="firstName"
          className={`border border-solid text-sm lg:text-[14px] border-gray-400 p-2 w-full rounded-md ${
            formik.touched.firstName && formik.errors.firstName ? "input-error" : ""
          }`}
          {...formik.getFieldProps("firstName")}
        />
        {formik.touched.firstName && formik.errors.firstName && <div className="text-red-600 text-xs">{formik.errors.firstName}</div>}
      </div>

      {/* Email */}
      <div className="flex flex-col items-start">
        <label className="text-xs lg:text-[14px]">Email *</label>
        <input
          type="email"
          name="email"
          className={`border border-solid text-sm lg:text-[14px] border-gray-400 p-2 w-full rounded-md ${
            formik.touched.email && formik.errors.email ? "input-error" : ""
          }`}
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && <div className="text-red-600 text-xs">{formik.errors.email}</div>}
      </div>

      {/* Société */}
      <div className="flex flex-col items-start">
        <label className="text-xs lg:text-[14px]">Société</label>
        <input
          type="text"
          name="company"
          className="border border-solid text-sm lg:text-[14px] border-gray-400 p-2 w-full rounded-md"
          {...formik.getFieldProps("company")}
        />
      </div>

      {/* Téléphone */}
      <div className="flex flex-col items-start">
        <label className="text-xs lg:text-[14px]">Téléphone</label>
        <input
          type="text"
          name="phone"
          className={`border border-solid text-sm lg:text-[14px] border-gray-400 p-2 w-full rounded-md ${
            formik.touched.phone && formik.errors.phone ? "input-error" : ""
          }`}
          {...formik.getFieldProps("phone")}
        />
        {formik.touched.phone && formik.errors.phone && <div className="text-red text-sm">{formik.errors.phone}</div>}
      </div>

      {/* Message */}
      <div className="flex flex-col items-start">
        <label className="text-xs lg:text-[14px]">Message *</label>
        <textarea
          name="message"
          placeholder="Entrez votre message ici"
          className={`border border-solid text-sm border-gray-400 p-2 w-full rounded-md h-28 ${
            formik.touched.message && formik.errors.message ? "input-error" : ""
          }`}
          {...formik.getFieldProps("message")}
        ></textarea>
        {formik.touched.message && formik.errors.message && <div className="text-red-600 text-xs">{formik.errors.message}</div>}
      </div>

      {/* Bouton Submit */}
      <button type="submit" className="btn-submit hover:bg-primary-hover w-full mt-2 !text-[12px] lg:!text-[15px]">
        Envoyer
      </button>
    </form>
    </div>
  
    
    {/*ici les coordonnnes*/}

    <div className="mt-6 lg:mt-12">
    <div className="flex flex-col items-center">
      <h2 className="font-bold text-[20px] mb-9 text-center">Nos Coordonnées</h2>
  
      <div className="flex flex-col lg:flex-row lg:justify-evenly gap-6 lg:gap-10 text-[15px] lg:text-[13px]">
        <div className="flex items-center gap-2">
          <img src={emailIcon} />
          <p>lunchyParis@gmail.com</p>
        </div>
        <div className="flex items-center gap-2">
          <img src={phoneIcon} />
          <p>+33 760 13 59 96</p>
        </div>
        <div className="flex items-center gap-2">
          <img src={addressIcon} />
          <p>60 Avenue des Gobelins Paris 75013</p>
        </div>
      </div>
    </div>
  
    <div className="mt-10 lg:mt-7 mx-8">
      <div
        className={`${
          restaurants.length === 1 ? "w-full" : "grid grid-cols-1 gap-8"
        } md:grid-cols-2`}
      >
        {restaurants.map((restaurant, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <h3 className="font-bold text-[16px]">{restaurant.name}</h3>
            <img
              src={restaurant.mapImage}
              className="w-full lg:w-[100%] md:w-[300px] flex-grow"
              alt={restaurant.name}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
  
       

  </div>

        {/*ici la FAQ */}
        <section className="faq mt-9 mx-3 md:mx-20 flex flex-col items-center gap-3">
        <h1 className="text-center text-[20px] md:text-[25px] lg:text-[30px] my-4 lg:my-10 font-semibold">FAQ</h1>
        <div className="collapse collapse-arrow bg-base-100 border border-[#F3F3F3] shadow-[0px_2px_4px_1px_rgba(0,0,0,0.25)] ">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title font-semibold text-[14px] md:text-[16px]">Est-ce que Lunchy est destiné aux entreprises seulement ?</div>
        <div className="collapse-content text-sm">Non, Lunchy est aussi destiné aux particuliers à condition que le prix total de la commande soit au minimum 50 euros .</div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-[#F3F3F3] shadow-[0px_2px_4px_1px_rgba(0,0,0,0.25)]">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold text-[14px] md:text-[16px]">Comment passer une commande sur Lunchy ?</div>
        <div className="collapse-content text-sm"> Pour commander, créez un compte et connectez-vous, sélectionnez un restaurant, personnalisez vos menus et validez votre commande. La commande doit être d’un minimum supérieur au devis.</div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-[#F3F3F3] shadow-[0px_2px_4px_1px_rgba(0,0,0,0.25)]">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold text-[14px] md:text-[16px]">Quels sont les restaurants disponibles ?</div>
        <div className="collapse-content text-sm">Nous travaillons avec 4 restaurants partenaires : Subway, Libanais, Sushi et Traditionnel.</div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-[#F3F3F3] shadow-[0px_2px_4px_1px_rgba(0,0,0,0.25)]">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold text-[14px] md:text-[16px]">Dans quelle zone livrez-vous ?</div>
        <div className="collapse-content text-sm">Nous livrons uniquement dans Paris intra-muros (75) et les frais de livraison dépendent de la région où vous êtes par rapport au point de livraison.</div>
      </div>
      <div className="collapse collapse-arrow bg-base-100 border border-[#F3F3F3] shadow-[0px_2px_4px_1px_rgba(0,0,0,0.25)]">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold text-[14px] md:text-[16px]">Puis-je modifier ou annuler une commande après validation ?</div>
        <div className="collapse-content text-sm">Vous pouvez modifier la date de livraison ,et vous pouvez annuler votre commande mais aucun remboursement n'est possible </div>
      </div>
  </section>
  
    
  </div>
    </>
  );
};

export default Contact;
