import React, { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import SummaryApi from "../common";

const AllCustomizations = () => {
  const [customizations, setCustomizations] = useState([]);
  const [editedCustomizations, setEditedCustomizations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const fetchCustomizations = async () => {
    try {
      const response = await fetch(SummaryApi.getCustom.url, {
        method: SummaryApi.getCustom.method,
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setCustomizations(data.data);
        setEditedCustomizations(data.data); // Copier les données dans editedCustomizations
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des personnalisations", error);
      setError("Erreur de chargement des personnalisations.");
    }
  };

  const addCustomization = async () => {
    const newCustomization = {
      name: "",
      maxOptions: 1,
      required: false,
      options: [],
    };
  
    try {
      const response = await fetch(SummaryApi.createCustom.url, {
        method: SummaryApi.createCustom.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomization),
        credentials: "include",
      });
  
      const result = await response.json();
      if (result.success) {
        setCustomizations([...customizations, result.data]);
        setEditedCustomizations([...editedCustomizations, result.data]);
        fetchCustomizations()
        toast.success("Personnalisation ajoutée défilez vers le bas pour la remplir !");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la personnalisation");
      console.log(error);
    }
  };
  
  const deleteCustomization = async (customizationId) => {
    try {
      const response = await fetch(SummaryApi.deleteCustom(customizationId).url, {
        method: SummaryApi.deleteCustom(customizationId).method,
        credentials: "include",
      });
  
      const result = await response.json();
      if (result.success) {
        setCustomizations(customizations.filter(custom => custom._id !== customizationId));
        setEditedCustomizations(editedCustomizations.filter(custom => custom._id !== customizationId));
        fetchCustomizations()
        toast.success("Personnalisation supprimée avec succès !");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la personnalisation");
      console.log(error);
    }
  };
  

  const handleEditChange = (index, key, value) => {
    const updated = [...editedCustomizations];
    updated[index][key] = value;
    setEditedCustomizations(updated);
  };

  const updateOption = (customIndex, optIndex, key, value) => {
    const updated = [...editedCustomizations];
    updated[customIndex].options[optIndex][key] = value;
    setEditedCustomizations(updated);
  };

  const addOption = (customIndex) => {
    const updated = [...editedCustomizations];
    updated[customIndex].options.push({ name: "", price: 0 });
    setEditedCustomizations(updated);
  };

  const removeOption = (customIndex, optIndex) => {
    const updated = [...editedCustomizations];
    updated[customIndex].options.splice(optIndex, 1);
    setEditedCustomizations(updated);
  };

  const handleSave = async (customIndex) => {
    const customizationId = editedCustomizations[customIndex]._id;

    try {
      const response = await fetch(SummaryApi.editCustom(customizationId).url, {
        method: SummaryApi.editCustom(customizationId).method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editedCustomizations[customIndex]),
      });

      const data = await response.json();
      if (data.success) {
        setCustomizations([...editedCustomizations]); // Appliquer les modifications
        toast.success("Personnalisation mise à jour avec succès");
      } else {
        toast.error("Erreur de sauvegarde");
      }
    } catch (error) {
      toast.error("Erreur serveur");
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-6 font-Lato">
      <h1 className="text-[27px] font-bold">Personnalisations</h1>

      <button onClick={() => addCustomization()} className="bg-black text-white text-[13px] px-3 py-2 rounded my-6">Ajouter une personnalisation</button>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : editedCustomizations.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">Aucune personnalisation disponible.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {editedCustomizations.map((custom, index) => (
            <div key={index} className="border border-gray-400 p-3 rounded-lg flex flex-col gap-3 mb-3">
              <input
                type="text"
                placeholder="Nom"
                className="input w-full"
                value={custom.name}
                onChange={(e) => handleEditChange(index, "name", e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Nombre de choix max"
                className="input w-full"
                value={custom.maxOptions}
                onChange={(e) => handleEditChange(index, "maxOptions", e.target.value)}
                required
              />

              <div className="flex gap-2 items-center">
                <p className="text-[14px]">Obligatoire :</p>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={custom.required}
                  onChange={(e) => handleEditChange(index, "required", e.target.checked)}
                />
              </div>

              {custom.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Option"
                    value={opt.name}
                    className="border border-gray-400 text-[13px] p-2 rounded-lg"
                    onChange={(e) => updateOption(index, optIndex, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Prix"
                    value={opt.price}
                    className="border border-gray-400 text-[13px] p-2 rounded-lg"
                    onChange={(e) => updateOption(index, optIndex, "price", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index, optIndex)}
                    className="flex items-center gap-2 text-[13px] text-red-600"
                  >
                    <MdDelete /> Supprimer cette option
                  </button>
                </div>
              ))}

              <div className="buttons flex items-center gap-4">
                <button
                  type="button"
                  className="flex items-center gap-1 bg-black rounded-lg text-white text-xs p-2 max-w-fit"
                  onClick={() => addOption(index)}
                >
                  <IoIosAddCircleOutline /> Ajouter option
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1 bg-green-600 rounded-lg text-white text-xs p-2 max-w-fit"
                  onClick={() => handleSave(index)}
                >
                  Enregistrer
                </button>
              </div>
              
              <button className="flex items-center gap-1 bg-red-500 text-white p-2 text-[14px] max-w-fit rounded-lg" onClick={()=> deleteCustomization(custom._id)}><MdDelete />Supprimer cette personnalisation</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCustomizations;
