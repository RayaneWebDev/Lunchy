import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import uploadImage from "../helpers/uploadImageProduct";
import SummaryApi from "../common";
import { MdDelete } from "react-icons/md";

const EditMenuForm = ({ onClose, menu , restaurants, products, categories , fetchMenus}) => {
  const [image, setImage] = useState(menu.image || null);
  const [imageError, setImageError] = useState("");
  const [accompaniments, setAccompaniments] = useState(menu.accompaniments);

  const formik = useFormik({
    initialValues: {
      name: menu.name || "",
      description: menu.description || "",
      price: menu.price || "",
      category : menu.category._id,
      restaurant: menu.restaurant._id,
      mainProduct: menu.mainProduct._id,
      isAvailable: menu.isAvailable,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Le nom est requis"),
      description: Yup.string().notRequired(),
      price: Yup.number().min(0, "Le prix doit être positif").required("Le prix est requis"),
      category : Yup.string().required("La catégorie est obligatoire"),
      restaurant: Yup.string().required("Le restaurant est requis"),
      mainProduct: Yup.string().required("Le produit principal est requis"),
    }),
    onSubmit: async (values) => {
      if (!image) {
        setImageError("L'image est requise");
        return;
      }

      const newMenu = { ...values, image, accompaniments };

      try {
        const response = await fetch(SummaryApi.updateMenu(menu._id).url, {
          method: SummaryApi.updateMenu(menu._id).method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMenu),
          credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
          fetchMenus()
          toast.success("Menu mis à jour avec succès !");
          onClose();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Erreur lors de la modification du menu");
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

  const addAccompaniment = () => {
    setAccompaniments([...accompaniments, { categories: [], maxChoices: 1, required: false }]);
  };

  const updateAccompaniment = (index, field, value) => {
    const newAccompaniments = [...accompaniments];
    newAccompaniments[index][field] = value;
    setAccompaniments(newAccompaniments);
  };

  const toggleCategorySelection = (index, categoryId) => {
    const newAccompaniments = [...accompaniments];
    
    // Récupère les ID des catégories dans cet accompagnement
    const categoriesId = newAccompaniments[index].categories.map(item => item._id);
  
    // Si la catégorie est déjà sélectionnée, on la supprime, sinon on l'ajoute
    if (categoriesId.includes(categoryId)) {
      newAccompaniments[index].categories = newAccompaniments[index].categories.filter(item => item._id !== categoryId);
    } else {
      // On rajoute l'ID de la catégorie dans le tableau
      newAccompaniments[index].categories.push({ _id: categoryId });
    }
  
    setAccompaniments(newAccompaniments);
  };
  

  const removeAccompaniment = (index) => {
    setAccompaniments(accompaniments.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Modifier ce menu</h2>
          <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <input type="text" name="name" placeholder="Nom du menu" className="border p-2 rounded w-full" {...formik.getFieldProps("name")} />
          {formik.touched.name && formik.errors.name && <p className="text-red-600 text-sm">{formik.errors.name}</p>}

          <textarea name="description" placeholder="Description" className="border p-2 rounded w-full" {...formik.getFieldProps("description")} />
          {formik.touched.description && formik.errors.description && <p className="text-red-600 text-sm">{formik.errors.description}</p>}

          <input type="number" name="price" placeholder="Prix" className="border p-2 rounded w-full" {...formik.getFieldProps("price")} />
          {formik.touched.price && formik.errors.price && <p className="text-red-600 text-sm">{formik.errors.price}</p>}

          <select className="border p-2 rounded w-full" {...formik.getFieldProps("restaurant")}>
            <option value="">Choisir le restaurant</option>
            {restaurants.map((resto) => (
              <option key={resto._id} value={resto._id}>{resto.name}</option>
            ))}
          </select>
          {formik.touched.restaurant && formik.errors.restaurant && <p className="text-red-600 text-sm">{formik.errors.restaurant}</p>}


          <select className="border p-2 rounded w-full" {...formik.getFieldProps("mainProduct")}>
            <option value="">Choisir le produit principal</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>{prod.name}</option>
            ))}
          </select>
          {formik.touched.mainProduct && formik.errors.mainProduct && <p className="text-red-600 text-sm">{formik.errors.mainProduct}</p>}


          <select className="border p-2 rounded w-full" {...formik.getFieldProps("category")}>
            <option value="">Choisir la catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && <p className="text-red-600 text-sm">{formik.errors.category}</p>}

          <div className="flex gap-2 items-center my-3">
            <p>Disponible</p>
            <input type="checkbox" className="toggle toggle-success" checked={formik.values.isAvailable} onChange={(e) => formik.setFieldValue("isAvailable",e.target.checked)} />
          </div>


           <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <FaCloudUploadAlt className="text-[14px]" /> Télécharger une image
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
              {image && <img src={image} alt="Menu" className="h-16 mt-2" />}
              {imageError && <p className="text-red-600 text-sm">{imageError}</p>}
            </div>

          <h3 className="font-semibold">Accompagnements</h3>
          <p className="text-xs">si vous choisissez deux catégories ou plus l'utilisateur doit choisir une d'elles seulement c'est à dire un choix possible par accompagnement</p>
          {accompaniments.map((acc, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
              {categories.filter(cat => (cat.typeCategory=="Accompagnement")).map(cat => (
                <label key={cat._id} className="border p-2 rounded cursor-pointer text-xs">
                  <input type="checkbox" checked={acc.categories.map(item => item._id).includes(cat._id)} onChange={() => toggleCategorySelection(index, cat._id)} /> {cat.name}
                </label>
              ))}
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-[14px] font-bold">Nombre de choix max</p>
                <input type="number" className="border p-1 rounded w-1/4" value={acc.maxChoices} min="1" onChange={(e) => updateAccompaniment(index, "maxChoices", e.target.value)} />
              </div>
              <div className="flex gap-2">
               <p className="text-[14px] font-bold">Obligatoire</p>
                <input type="checkbox" checked={acc.required} onChange={(e) => updateAccompaniment(index, "required", e.target.checked)} />
              </div>
              <button type="button" onClick={() => removeAccompaniment(index)} className="bg-red-500 text-white text-xs flex items-center p-1 rounded-md w-fit"><MdDelete /> Supprimer cet accompagnement</button>
            </div>
          ))}
          <button type="button" className="bg-gray-300 p-2 rounded" onClick={addAccompaniment}>Ajouter un accompagnement</button>
          <button type="submit" className="bg-black text-white py-3 rounded mt-5">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default EditMenuForm;