import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import TermsAndConditions from '../pages/TermsAndConditions'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import SignUp from '../pages/SignUp/SignUp'
import Contact from '../pages/Contact'
import MonCompte from '../components/MonCompte'
import AdminPanel from '../pages/AdminPanel'
import Dashboard from '../components/Dashboard'
import AllUsers from '../pages/AllUsers'
import Restaurants from '../pages/Restaurants'
import AllOrders from '../pages/AllOrders'
import AllProducts from '../pages/AllProducts'
import AllCustomizations from '../pages/AllCustomizations'
import Events from '../pages/Events'
import Reviews from '../pages/Reviews'
import Menu from '../pages/Menu'
import OrderSuccess from '../pages/OrderMessage/OrderSuccess'
import OrderFailed from '../pages/OrderMessage/OrderFailed'
import PageNotFound from '../pages/PageNotFound'
import LegalNotice from '../pages/LegalNotice'
import { redirect } from 'react-router-dom';




const checkAdmin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-admin`, {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      return data.isAdmin;
    } catch (err) {
      console.error("Erreur lors de la vérification admin :", err);
      return false;
    }
  };

    
  


const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children : [
            {
                path: "",
                element: <Home/>
            },
            {
                path : "conditionsUtilisation",
                element : <TermsAndConditions/>
            },
            {
                path : "politiqueDeConfidentialite",
                element : <PrivacyPolicy/>
            },
            {
                path : "mentionslegales",
                element : <LegalNotice/>
            },
            {
                path : "inscription",
                element : <SignUp/>
            },
            {
                path : "contact",
                element : <Contact/>
            },
            {
                path : "moncompte",
                element : <MonCompte />
            },
            {
                path : "menu",
                element : <Menu />
            },
            {
                path : "order-success",
                element : <OrderSuccess />
            },
            {
                path : "order-failed",
                element : <OrderFailed />
            },
            {
                path: "404",
                element: <PageNotFound />
            },
            {
                path: "*",
                element: <PageNotFound />
            },
            {
                path : "admin-panel",
                element : <AdminPanel /> ,
                loader: async () => {
                    const isAdmin = await checkAdmin();
                    if (!isAdmin) {
                      return redirect("/404"); // <<< redirige
                    }
                    return null;
                  },
                children : [
                    {
                        path : "dashboard",
                        element :  <Dashboard /> 
                    },
                    {
                        path : "all-users",
                        element : <AllUsers /> 
                    },
                    {
                        path : "all-products",
                        element : <AllProducts /> 
                    },
                    {
                        path : "gestionRestaurants",
                        element :  <Restaurants /> 
                    },
                    {
                        path : "orders",
                        element :  <AllOrders /> 
                    },
                    {
                        path : "all-customizations",
                        element :  <AllCustomizations /> 
                    },
                    {
                        path : "events",
                        element :  <Events /> 
                    },
                    {
                        path : "reviews",
                        element :  <Reviews /> 
                    }
                ]
            },


            // {
            //     path : "login",
            //     element : <Login/>
            // },
            // {
            //     path : "signup",
            //     element : <SignUp/>
            // },
            // {
            //     path : "cart",
            //     element : <Cart2/>
            // },
            // {
            //     path : 'menu',
            //     element : <Menu />
            // },
            // {
            //     path : 'moncompte',
            //     element : <Profile />
            // },
           
            // {
            //     path : "contact",
            //     element : <Contact />
            // },
          
            // {
            //     path : "checkout",
            //     element : <Checkout />
            // },
            // {
            //     path : "order-success",
            //     element : <OrderSuccess />
            // },
            // {
            //     path : "order-failed",
            //     element : <OrderFailed />
            // },
            // {
            //     path : "admin-panel",
            //     element : <AdminPanel/>,
            //     children : [
            //         {
            //             path : "all-users",
            //             element : <AllUsers/>
            //         },{
            //             path : "all-products",
            //             element : <AllProducts />
            //         },{
            //             path : "dashboard",
            //             element : <Dashboard />
            //         },{
            //             path : "orders",
            //             element : <Orders />
            //         }
            //     ]
            // },
            
        ]
    },
    {
        future: {
            v7_fetcherPersist: true,
          },
    }
])


export default router