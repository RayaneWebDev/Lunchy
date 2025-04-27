import React, { useState } from "react";
import AddRestaurantForm from "../components/AddRestaurantForm";
import SummaryApi from "../common";
import { useEffect } from "react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";

const Restaurants = () => {
  const [ajouterRestaurant, setAjoutRestaurant] = useState(false);
  const {restaurants , fetchRestaurants} = useOutletContext()


  

  const handleUpdateStatus = async (restaurantId) => {
    try{
        const response = await fetch(SummaryApi.updateRestaurantStatus(restaurantId).url,{
            method : SummaryApi.updateRestaurantStatus(restaurantId).method,
            credentials : "include"
         })
         const dataApi = await response.json()
         if(dataApi.success){
           toast.success(dataApi.message)
           fetchRestaurants()
         } else{
            toast.error(dataApi.message)
            console.log(dataApi.message)
         }
    } catch(error){
        console.log(error)
    }
     
  }

  useEffect(()=>{
    fetchRestaurants()
  },[])

 

  return (
    <div className="font-Lato p-4">
      <div className="hero flex flex-col gap-3 items-start">
        <h1 className="text-[27px] font-bold">Restaurants</h1>
        <p>Gérez les restaurants et leurs disponibilités</p>
      </div>

      <button
        onClick={() => setAjoutRestaurant(true)}
        className="bg-black text-white text-[13px] px-3 py-2 rounded mt-5"
      >
        Ajouter un restaurant
      </button>

      {ajouterRestaurant && (
        <AddRestaurantForm onClose={() => setAjoutRestaurant(false)} />
      )}

      <div className="restaurants mt-14 flex flex-wrap min-[250px] gap-4">
  {restaurants.map((restaurant, index) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-4 py-6 pt-8 px-5 font-Inter w-80 border-[#F3F3F3] shadow-lg rounded-xl relative"
      >
        <img
          src={restaurant.logo}
          alt={restaurant.name}
          className="w-36 transform translate-x-[50%]"
        />
        <p className="text-[13px] mt-4 flex-grow">{restaurant.description}</p>
        <div className="flex justify-between mt-auto">
          <button
            className={`${
              restaurant.isActive ? "bg-red-500" : "bg-green-600"
            } text-white text-[13px] px-2 py-2 rounded mt-5 w-full`}
            onClick={() => handleUpdateStatus(restaurant._id)}
          >
            {restaurant.isActive ? "Désactiver" : "Activer"}
          </button>
        </div>
      </div>
    );
  })}
</div>



    </div>
  );
};

export default Restaurants;
