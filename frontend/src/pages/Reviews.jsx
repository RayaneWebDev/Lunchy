import React, { useState } from "react";
import SummaryApi from "../common";
import { useEffect } from "react";
import { toast } from "sonner";
import AddReviewForm from "../components/AddReviewForm";
import EditReview from "../components/EditReview";

const Reviews = () => {
  const [addReview, setAddReview] = useState(false);
  const [editReview, setEditReview] = useState(false)
  const [selectedReview , setSelectedReview] = useState("")
  const [reviews , setReviews] = useState([])


  

  const fetchReviews = async () => {
    try{
        const response = await fetch(SummaryApi.getReviews.url,{
            method : SummaryApi.getReviews.method,
            credentials : "include"
         })
         const dataApi = await response.json()
         if(dataApi.success){
           setReviews(dataApi.data)
         } else{
            toast.error(dataApi.message)
            console.log(dataApi.message)
         }
    } catch(error){
        console.log(error)
    }
     
  }

   const handleDeleteReview = async (eventId) => {
      try{
          const response = await fetch(SummaryApi.deleteReview(eventId).url,{
              method : SummaryApi.deleteReview(eventId).method,
              credentials : "include"
           })
           const dataApi = await response.json()
           if(dataApi.success){
             toast.success(dataApi.message)
             fetchReviews()
           } else{
              toast.error(dataApi.message)
              console.log(dataApi.message)
           }
      } catch(error){
          console.log(error)
      }
       
    }

  useEffect(()=>{
    fetchReviews()
  },[])

 

  return (
    <div className="font-Lato p-4">
      <div className="hero flex flex-col gap-3 items-start">
        <h1 className="text-[27px] font-bold">Avis des clients</h1>
        <p>Voir , modifier , ajouter ou supprimer les avis des clients</p>
      </div>

      <button
        onClick={() => setAddReview(true)}
        className="bg-black text-white text-[13px] px-3 py-2 rounded mt-5"
      >
        Ajouter un avis
      </button>

      {addReview && (
        <AddReviewForm fetchReviews={fetchReviews} onClose={() => setAddReview(false)} />
      )}

      <div className=" mt-14 flex flex-wrap min-[250px] gap-4 font-Lato">
      {
        reviews.map((review,index)=>{
            return (
            <div key={index} className="flex flex-col gap-4 py-6 pt-8 px-5 font-Inter w-80 border-[#F3F3F3] shadow-lg rounded-xl">
                <div className="flex justify-between">
                    <div className="flex flex-col items-start gap-3">
                        <h3>{review.name}</h3>
                        <h5 className="text-gray-500 text-xs">{review.poste}</h5>
                    </div>
                    <div className="flex text-yellow-400">
                        {Array.from({ length: review.rating }, (_, i) => (
                            <span key={i}>⭐</span>
                        ))}
                    </div>
                </div>
                
                
                <p className="text-[13px] mt-4">{review.avis}</p>
                    <div className="flex justify-between">
                            <button className="bg-black text-white text-[13px] px-2 py-2 rounded mt-5" onClick={()=> {setEditReview(true) ; setSelectedReview(review)}}>
                            Modifier
                          </button>
                          <button className="bg-red-500 text-white text-[13px] px-2 py-2 rounded mt-5" onClick={() => handleDeleteReview(review._id)}>
                            Supprimer
                          </button> 
                   </div>
            </div>
            )
        })
      }
      </div>

      {
        editReview && (
          <EditReview fetchReviews={fetchReviews} review={selectedReview} onClose={() => setEditReview(false)}/>
        )
      }

    </div>
  );
};

export default Reviews;
