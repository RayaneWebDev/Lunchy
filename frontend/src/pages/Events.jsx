import React, { useState } from "react";
import SummaryApi from "../common";
import { useEffect } from "react";
import { toast } from "sonner";
import AddEventForm from "../components/AddEventForm";
import { FaBullseye } from "react-icons/fa";
import EditEvent from "../components/EditEvent";

const Events = () => {
  const [ajouterEvenement, setAjoutEvenement] = useState(false);
  const [editEvent, setEditEvent] = useState(false)
  const [selectedEvent , setSelectedEvent] = useState("")
  const [events , setEvents] = useState([])


  const fetchEvents = async () => {
    try{
        const response = await fetch(SummaryApi.getEvents.url,{
            method : SummaryApi.getEvents.method,
            credentials : "include"
         })
         const dataApi = await response.json()
         if(dataApi.success){
           setEvents(dataApi.data)
         } else{
            toast.error(dataApi.message)
            console.log(dataApi.message)
         }
    } catch(error){
        console.log(error)
    }
     
  }

   const handleDeleteEvent = async (eventId) => {
      try{
          const response = await fetch(SummaryApi.deleteEvent(eventId).url,{
              method : SummaryApi.deleteEvent(eventId).method,
              credentials : "include"
           })
           const dataApi = await response.json()
           if(dataApi.success){
             toast.success(dataApi.message)
             fetchEvents()
           } else{
              toast.error(dataApi.message)
              console.log(dataApi.message)
           }
      } catch(error){
          console.log(error)
      }
       
    }

  

  
  useEffect(()=>{
    fetchEvents()
  },[])

 

  return (
    <div className="font-Lato p-4">
      <div className="hero flex flex-col gap-3 items-start">
        <h1 className="text-[27px] font-bold">Evènements</h1>
        <p>Créer et gérer les événements destiné spécialement aux entreprises pour leur permettre de commander plus d'une fois pendant cet</p>
      </div>

      <button
        onClick={() => setAjoutEvenement(true)}
        className="bg-black text-white text-[13px] px-3 py-2 rounded mt-5"
      >
        Ajouter un évènement
      </button>

      {ajouterEvenement && (
        <AddEventForm onClose={() => setAjoutEvenement(false)} fetchEvents={fetchEvents} />
      )}

      <div className="Events mt-14 flex flex-wrap min-[250px] gap-4 font-Inter">
      {
        events.map((event,index)=>{
            return (
                <div key={index} className="flex flex-col gap-4 py-6 pt-8 px-5 font-Inter w-80 border-[#F3F3F3] shadow-lg rounded-xl">
                    <h1 className="text-[20px] text-center">{event.name}</h1>
                    <p className="text-[13px] mt-4">{event.description === "" ? 'Pas de descripton' : event.description}</p>
                    <div className="flex items-center justify-between font-Lato font-bold">
                        <p>Date debut : <span className="text-gray-500">{new Date(event.startDate).toLocaleDateString('fr-FR')}</span></p>
                        <p>Date fin : <span className="text-gray-500">{new Date(event.endDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}</span></p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <p className={`${event.status === "actif" ? 'text-green-500' : 'text-red-500'} font-bold text-[14px]`}>{event.status}</p>
                          <button className="bg-black p-2 rounded-md text-white text-[14px]" onClick={()=> {setEditEvent(true) ; setSelectedEvent(event)}}>Modifier</button>
                        </div>
                       <button className="bg-black p-2 rounded-md text-white text-[14px]" onClick={()=> handleDeleteEvent(event._id)}>Supprimer</button>
                    </div>
                    
                </div>
            )
        })
      }
      </div>

      {
        editEvent && (
          <EditEvent fetchEvents={fetchEvents} event={selectedEvent} onClose={() => setEditEvent(false)}/>
        )
      }


    </div>
  );
};

export default Events;
