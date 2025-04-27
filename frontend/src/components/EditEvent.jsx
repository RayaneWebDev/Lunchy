import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import SummaryApi from "../common";

const EditEvent = ({ onClose, fetchEvents , event }) => {
  const formik = useFormik({
    initialValues: {
      name: event.name || "",
      description: event.description || "",
      startDate:  "",
      endDate: "",
      maxOrdersPerUser: event.maxOrdersPerUser ,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Le nom est requis"),
      description: Yup.string().notRequired(),
      startDate: Yup.date().required("La date de début est requise"),
      endDate: Yup.date()
        .required("La date de fin est requise")
        .min(Yup.ref("startDate"), "La date de fin doit être après la date de début"),
      maxOrdersPerUser: Yup.number()
        .required("Le nombre max de commandes est requis")
        .positive("Le nombre doit être positif")
        .integer("Le nombre doit être un entier"),
    }),
    onSubmit: async (values) => {

      const eventData = {...values, startDate : new Date(values.startDate).toISOString() , endDate : new Date(values.endDate).toISOString()}
      try {
        const response = await fetch(SummaryApi.updateEvent(event._id).url, {
          method: SummaryApi.updateEvent(event._id).method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
          credentials: "include",
        }); 

        const result = await response.json();
        if (result.success) {
          toast.success(result.message);
          fetchEvents();
          onClose();
        } else {
          toast.error(result.message);
          console.error(result.message);
        }
      } catch (error) {
        toast.error("Erreur lors de la modification de l'événement");
        console.log(error);
      }
    },
  });

  return (
    <div className="fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Modifier cet événement</h2>
          <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            name="name"
            placeholder="Nom de l'événement"
            className={`text-[14px] border p-2 rounded w-full ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"}`}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && <p className="text-red-600 text-sm">{formik.errors.name}</p>}

          <textarea
            name="description"
            placeholder="Description de l'événement"
            className={`text-[14px] border p-2 rounded w-full ${formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"}`}
            {...formik.getFieldProps("description")}
          ></textarea>
          {formik.touched.description && formik.errors.description && <p className="text-red-600 text-sm">{formik.errors.description}</p>}

          <input
            type="date"
            name="startDate"
            className={`text-[14px] border p-2 rounded w-full ${formik.touched.startDate && formik.errors.startDate ? "border-red-500" : "border-gray-300"}`}
            {...formik.getFieldProps("startDate")}
          />
          {formik.touched.startDate && formik.errors.startDate && <p className="text-red-600 text-sm">{formik.errors.startDate}</p>}

          <input
            type="date"
            name="endDate"
            className={`text-[14px] border p-2 rounded w-full ${formik.touched.endDate && formik.errors.endDate ? "border-red-500" : "border-gray-300"}`}
            {...formik.getFieldProps("endDate")}
          />
          {formik.touched.endDate && formik.errors.endDate && <p className="text-red-600 text-sm">{formik.errors.endDate}</p>}

          <input
            type="number"
            name="maxOrdersPerUser"
            placeholder="Nombre max de commandes par utilisateur"
            className={`text-[14px] border p-2 rounded w-full ${formik.touched.maxOrdersPerUser && formik.errors.maxOrdersPerUser ? "border-red-500" : "border-gray-300"}`}
            {...formik.getFieldProps("maxOrdersPerUser")}
          />
          {formik.touched.maxOrdersPerUser && formik.errors.maxOrdersPerUser && <p className="text-red-600 text-sm">{formik.errors.maxOrdersPerUser}</p>}

          <button type="submit" className="bg-black text-white text-[13px] py-3 rounded mt-5">
            Enregistrer
          </button>
        </form>
      </div>
    </div>

  );
};

export default EditEvent;
