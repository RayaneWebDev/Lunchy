import {Outlet} from 'react-router-dom'
import React, { useState } from 'react'
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Toaster } from 'sonner';
import { useLocation } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import {clearCart, setCart} from "./store/cartSlice"
import { setUserDetails } from "./store/userSlice";
import { useEffect } from "react";
import SummaryApi from "./common";
import { HelmetProvider } from 'react-helmet-async';

const App = () => {

  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(state => state.user.user);
  const shouldShowFullPage = location.pathname.startsWith('/admin-panel')
  const [cartCount , setCartProductCount] = useState(0)

  const [restaurants , setRestaurants] = useState([])
  const [userProducts , setUserProducts] = useState([])

  const fetchUserDetails = async () => {
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include"
      });
  
      const dataApi = await dataResponse.json();
  
      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      } else {
        dispatch(setUserDetails(null));
      }
  
      console.log("data-user : ", dataApi);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      dispatch(setUserDetails(null));
    }
  };
  
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

  const fetchCartCount = async ()=>{
    const dataResponse = await fetch(SummaryApi.countAddToCart.url,{
      method : SummaryApi.countAddToCart.method,
      credentials : "include"
    })

    const dataApi = await dataResponse.json()


    console.log("count : ",dataApi?.data?.count)

    
    setCartProductCount(dataApi?.data?.count)

  }

  const fetchUserCart = async () => {
    if(user){
      
      try {
        const response = await fetch(SummaryApi.getUserCart.url, {
          method: SummaryApi.getUserCart.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const responseData = await response.json();
        if (responseData.success) {

          setUserProducts(responseData.data);
          dispatch(setCart(responseData.data));
          console.log("user cart : ",userProducts)

        }
        else {
          console.log("error in food item : ",responseData.message)

        }
      } catch (error) {
        console.error('Error fetching user products:', error);
      
      }
    }
    
  };



  useEffect(()=>{
  
    // user details
    console.log("use effect called")
     
      fetchUserDetails()
      fetchRestaurants()
    // user details cart product
    
    
  },[location.pathname])

  useEffect(() => {
    if (user) {
      fetchUserCart();
      fetchCartCount()

    }
  }, [user]);

  return (
    
    <HelmetProvider>
    <div>

          { !shouldShowFullPage && (
            <Navbar fetchUserDetails={fetchUserDetails} restaurants={restaurants} cartCount={cartCount} fetchCartCount={fetchCartCount} fetchUserCart={fetchUserCart} userProducts={userProducts}/>
          )}
          <Toaster richColors/>
          <main className={`${shouldShowFullPage ? 'min-h-screen' : 'min-h-[calc(100vh-120px)] app pt-10 lg:pt-20'} `}>
            <Outlet context={{
              fetchUserDetails,
              fetchCartCount,
              cartCount,
              fetchUserCart,
              userProducts,
              setUserProducts,
              setCartProductCount,
              restaurants
            }} />
          </main>
          
          { !shouldShowFullPage && (
            <Footer />
          )}
      </div>
    </HelmetProvider>
    
  )
}

export default App


