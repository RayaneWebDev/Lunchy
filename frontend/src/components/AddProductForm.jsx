import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import uploadImage from "../helpers/uploadImageProduct";
import SummaryApi from "../common";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";


const AddProductForm = ({ onClose, restaurants, fetchProducts }) => {
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const { categories } = useOutletContext();
  const [customizations, setCustomizations] = useState([]);

   const fetchCustomizations = async () => {
      try {
        const response = await fetch(SummaryApi.getCustom.url, {
          method: SummaryApi.getCustom.method,
          credentials: "include",
        });
  
        const data = await response.json();
  
        if (data.success) {
          setCustomizations(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log("Erreur lors de la récupération des personnalisations", error);
        setError("Erreur de chargement des personnalisations.");
      } 
    };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      restaurant: "",
      customizations : [],
      isAvailable: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Le nom est requis"),
      description: Yup.string().notRequired(),
      price: Yup.number().min(0, "Le prix doit être positif").required("Le prix est requis"),
      category: Yup.string().required("La catégorie est requise"),
      restaurant: Yup.string().required("Le restaurant est requis"),
    }),
    onSubmit: async (values) => {
      if (!image) {
        setImageError("L'image est requise");
        return;
      }

      const newProduct = { ...values, image };
      console.log("new product : ",newProduct)

      try {
        const response = await fetch(SummaryApi.addProduct.url, {
          method: SummaryApi.addProduct.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
          credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Produit ajouté avec succès !");
          fetchProducts()
          onClose();
        } else {
          toast.error(result.message);
          console.log(result.message)
        }
      } catch (error) {
        toast.error("Erreur lors de l'ajout du produit");
        console.log(error)
      }
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError("");
    const uploadedImage = await uploadImage(file);
    setImage(uploadedImage.url);
  };


  useEffect(()=>{
    fetchCustomizations()
  },[])

  return (
    <div className="fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Ajouter un produit</h2>
          <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
        </div>
        <p className="text-gray-600 text-xs my-4">(Ex: Sandwich, Boisson, Salade...)</p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Nom du produit"
            className="text-[14px] border p-2 rounded w-full"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && <p className="text-red-600 text-sm">{formik.errors.name}</p>}

          <textarea
            name="description"
            placeholder="Description"
            className="text-[14px] border p-2 rounded w-full"
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && <p className="text-red-600 text-sm">{formik.errors.description}</p>}

          <input
            type="number"
            name="price"
            placeholder="Prix (ex 15.25)"
            className="text-[14px] border p-2 rounded w-full"
            {...formik.getFieldProps("price")}
          />
          {formik.touched.price && formik.errors.price && <p className="text-red-600 text-sm">{formik.errors.price}</p>}

          <select className="select w-full" {...formik.getFieldProps("category")}>
            <option value="">Choisir la catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select className="select w-full" {...formik.getFieldProps("restaurant")}>
            <option value="">Choisir le restaurant</option>
            {restaurants.map((resto) => (
              <option key={resto._id} value={resto._id}>{resto.name}</option>
            ))}
          </select>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <FaCloudUploadAlt className="text-[14px]" /> Télécharger une image
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
            {image && <img src={image} alt="Menu" className="h-16 mt-2" />}
            {imageError && <p className="text-red-600 text-sm">{imageError}</p>}
          </div>

          <h3 className="text-[15px] font-semibold">Personnalisations</h3>
           <div className="flex flex-col gap-5">
            { customizations.map((custom, index) => {
              return (
              <div key={index} className="flex justify-between p-3 w-full">
                <h4>{custom.name}</h4>
                <input type="checkbox" value={custom._id} className="checkbox checkbox-neutral" checked={formik.values.customizations.includes(custom._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    formik.setFieldValue("customizations", [...formik.values.customizations, custom._id]);
                  } else {
                    formik.setFieldValue("customizations", formik.values.customizations.filter(id => id !== custom._id));
                  }
                }}
                />
              </div>
              )
            })}
           </div>

          <button type="submit" className="bg-black text-white text-[13px] py-3 rounded mt-5">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
