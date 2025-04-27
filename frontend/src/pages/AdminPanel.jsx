import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MdEvent } from "react-icons/md";
import logo from '../assets/logo.svg'
import { CiLogout } from "react-icons/ci";
import SummaryApi from '../common';
import { setUserDetails } from '../store/userSlice';
import { toast } from 'sonner';
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { GrNotes } from "react-icons/gr";
import { HiShoppingCart } from "react-icons/hi";
import { IoMdRestaurant } from "react-icons/io";
import { MdChecklist } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";



const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    const [restaurants, setRestaurants] = useState([])
    const [categories, setCategories] = useState([])

    const isActive = (path) => location.pathname.includes(path);

    

    const fetchCategories = async () => {
      try{
          const response = await fetch(SummaryApi.getCategories.url,{
              method : SummaryApi.getCategories.method,
              credentials : "include"
           })
           const dataApi = await response.json()
           if(dataApi.success){
              console.log("categories : ",dataApi.data)
              setCategories(dataApi.data)
              
           } else{
              toast.error(dataApi.message)
              console.log(dataApi.message)
           }
      } catch(error){
          console.log(error)
      }
       
    }

    


    const fetchRestaurants = async () => {
      try{
          const response = await fetch(SummaryApi.getRestaurants.url,{
              method : SummaryApi.getRestaurants.method,
              credentials : "include"
           })
           const dataApi = await response.json()
           if(dataApi.success){
              console.log("restaurants : ",dataApi.data)
              setRestaurants(dataApi.data)
              
           } else{
              toast.error(dataApi.message)
              console.log(dataApi.message)
           }
      } catch(error){
          console.log(error)
      }
       
    }


    const handleLogout = async ()=> {
        try {
          const response = await fetch(SummaryApi.logout_user.url, {
            method: SummaryApi.logout_user.method,
            credentials : "include"
          });
    
          const dataApi = await response.json();
          console.log("data Api : ",dataApi)
    
          if (dataApi.success) {
            toast.success(dataApi.message);
            dispatch(setUserDetails(null))
            navigate("/")
          } else if (dataApi.error) {
              console.log("Error : ",dataApi.error)
            toast.error(dataApi.message);
          }
        } catch (error) {
          toast.error('An error occurred. Please try again.');
        }
      }

      useEffect(()=>{
        fetchRestaurants()
        fetchCategories()
      },[])

  return (
    <div className='min-h-screen w-screen lg:flex hidden relative'>

    <aside className='bg-[#f2f2f2] flex flex-col w-full max-w-72 text-black p-4 fixed h-screen font-Inter'>
                <div className='flex justify-center items-center flex-col gap-6'>
                    <img src={logo} alt="" className="w-[130px] mb-6" />
                    <div>
                        <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                        <p className='text-sm'>{user?.role}</p>
                    
                    </div>
                </div>

                 {/***navigation */}       
                <div>   
                    <nav className='grid gap-2 mt-8'>
                    <Link
                    to={"dashboard"}
                    className={`flex items-center px-2 py-2 text-gray-800 rounded-lg ${isActive("dashboard") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                  >
                    <span className='mr-2'><MdDashboard /></span> Tableau de Bord
                  </Link>


                  <Link
                  to={"orders"}
                  className={` flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("orders")  ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                >
                <span className='mr-2'><GrNotes /></span>
                  Gérer les commandes
                </Link>
                  
                  <Link
                    to={"all-users"}
                    className={`flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("all-users") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                  >
                  <span className='mr-2'><FaUsers /></span>
                    Utilisateurs
                  </Link>
                  
                  <Link
                    to={"gestionRestaurants"}
                    className={`flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("gestionRestaurants") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                  >
                  <span className='mr-2'><HiShoppingCart /></span>
                    Gérer les restaurants
                  </Link>

                  <Link
                    to={"all-products"}
                    className={`flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("all-products") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                  >
                  <span className='mr-2'><IoMdRestaurant /></span>
                    Gérer les menus
                  </Link>

                  <Link
                    to={"all-customizations"}
                    className={`flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("all-customizations") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                  >
                  <span className='mr-2'><MdChecklist /></span>
                    Gérer les personnalisations
                  </Link>

                  <Link
                    to={"events"}
                    className={`flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("events") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                   >
                   <span className='mr-2'><MdEvent /></span>
                     Gérer les évènements
                   </Link>

                   <Link
                   to={"reviews"}
                   className={`flex items-center px-2 py-2 rounded-lg text-gray-800 ${isActive("reviews") ? "bg-[#ececec] font-semibold" : " hover:bg-gray-200 hover:text-black"}`}
                  >
                  <span className='mr-2'><BiSolidCommentDetail /></span>
                    Gérer les avis des clients
                  </Link>

                    </nav>
                </div> 
                <div className='absolute text-red-500 font-semibold bottom-7 pl-2 cursor-pointer flex gap-2 items-center' onClick={handleLogout}>
                  <CiLogout/>
                  <span>Se déconnecter</span>
                
                </div>

        </aside>

        <main className='absolute w-[80%] h-full p-2 left-72 overflow-y-scroll'>
            <Outlet context={{ restaurants, categories, fetchRestaurants , fetchCategories}}/>
        </main>
    </div>
  )
}

export default AdminPanel