import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import SummaryApi from "../common";
import { FaStar } from "react-icons/fa";

const EditReview = ({ onClose, fetchReviews , review}) => {
  const [selectedRating, setSelectedRating] = useState(review.rating);

  const formik = useFormik({
    initialValues: {
      name: review.name || "",
      poste: review.poste ||"",
      rating: review.rating || "",
      avis: review.avis || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Le nom et prénom sont requis"),
      poste: Yup.string(),
      rating: Yup.number()
        .required("La note est obligatoire")
        .min(1, "La note doit être au moins 1")
        .max(5, "La note ne peut pas dépasser 5"),
      avis: Yup.string().required("L'avis est obligatoire"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(SummaryApi.updateReview(review._id).url, {
          method: SummaryApi.updateReview(review._id).method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
          credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
          toast.success(result.message);
          fetchReviews();
          onClose();
        } else {
          toast.error(result.message);
          console.error(result.message);
        }
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de l'avis");
        console.error(error);
      }
    },
  });

  return (
    <div className="fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Modifier cet avis</h2>
          <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Nom et prénom"
            className={`text-[14px] border p-2 rounded w-full ${
              formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
            }`}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && <p className="text-red-600 text-sm">{formik.errors.name}</p>}

          <input
            type="text"
            name="poste"
            placeholder="Poste ex: Directeur RH"
            className={`text-[14px] border p-2 rounded w-full ${
              formik.touched.poste && formik.errors.poste ? "border-red-500" : "border-gray-300"
            }`}
            {...formik.getFieldProps("poste")}
          />
          {formik.touched.poste && formik.errors.poste && <p className="text-red-600 text-sm">{formik.errors.poste}</p>}

          {/* Sélection de la note avec des étoiles */}
          <div className="flex items-center gap-2">
            <p className="text-sm">Note :</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-xl ${star <= selectedRating ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => {
                    setSelectedRating(star);
                    formik.setFieldValue("rating", star);
                  }}
                />
              ))}
            </div>
          </div>
          {formik.touched.rating && formik.errors.rating && <p className="text-red-600 text-sm">{formik.errors.rating}</p>}

          <textarea
            name="avis"
            placeholder="Votre avis..."
            className={`text-[14px] border p-2 rounded w-full h-36 ${
              formik.touched.avis && formik.errors.avis ? "border-red-500" : "border-gray-300"
            }`}
            {...formik.getFieldProps("avis")}
          />
          {formik.touched.avis && formik.errors.avis && <p className="text-red-600 text-sm">{formik.errors.avis}</p>}

          <button type="submit" className="bg-black text-white text-[13px] py-3 rounded mt-5">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReview;
