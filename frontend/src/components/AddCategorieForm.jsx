import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import SummaryApi from "../common";

const AddCategorieForm = ({ onClose, restaurants,fetchCategories }) => {
  
    const [restaurantIdSelected, setRestaurantIdSelected] = useState("")

 

  const formik = useFormik({
    initialValues: {
      name: "",
      restaurant: "",
      typeCategory : ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Le nom est requis"),
      restaurant: Yup.string().required("Le restaurant est requis"),
      typeCategory : Yup.string().required("Le type de ce produit est requis")
    }),
    onSubmit: async (values) => {
      

      const data = {category : values.name, typeCategory : values.typeCategory , restaurant : restaurantIdSelected};

      try {
        const response = await fetch(SummaryApi.addCategory.url, {
          method: SummaryApi.addCategory.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Catégorie ajoutée avec succès !");
          fetchCategories()
          onClose();
        } else {
          toast.error(result.message);
          console.error(result.message)
        }
      } catch (error) {
        toast.error("Erreur lors de l'ajout de la catégorie");
        console.error(error)
      }
    },
  });

  

  
  return (
    <div className="fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Ajouter une catégorie</h2>
          <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
        </div>
        <p className="text-gray-600 text-xs my-4">(ex Menu Sub Classiaque, Salade, Chips...)</p>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Nom de la catégorie"
            className={`text-[14px] border p-2 rounded w-full ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"}`}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && <p className="text-red-600 text-sm">{formik.errors.name}</p>}

          

          <select 
                className="select w-full border p-2 rounded" 
                value={formik.values.restaurant} 
                onChange={(e) => {
                  setRestaurantIdSelected(e.target.value); 
                  formik.setFieldValue("restaurant", e.target.value); 
                }}
              >
                <option value="">Choisir le restaurant</option>
                {restaurants.map((resto) => (
                  <option key={resto._id} value={resto._id}>
                    {resto.name}
                  </option>
                ))}
          </select>
              {formik.touched.restaurant && formik.errors.restaurant && <p className="text-red-600 text-sm">{formik.errors.restaurant}</p>}


              <select 
                className="select w-full border p-2 rounded" 
                value={formik.values.typeCategory} 
                onChange={(e) => {
                  formik.setFieldValue("typeCategory", e.target.value); 
                }}
              >
                <option value="">Choisir le type de cette catégorie</option>
                
                  <option value="Elémentaire">
                    Elémentaire
                  </option>
                  <option value="Menu">
                     Menu
                  </option>
                  <option value="Accompagnement">
                    Accompagnement
                  </option>
               
          </select>
              {formik.touched.typeCategory && formik.errors.typeCategory && <p className="text-red-600 text-sm">{formik.errors.typeCategory}</p>}



        
          <button type="submit" className="bg-black text-white text-[13px] py-3 rounded mt-5">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategorieForm;
