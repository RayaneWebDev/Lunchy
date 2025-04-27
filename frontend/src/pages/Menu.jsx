import React , {useState , useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import MenuHero from '../components/MenuHero';
import MainMenu from '../components/MainMenu';
import { Helmet } from "react-helmet-async";


const Menu = () => {
    
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const restaurantFromUrl = urlParams.get('restaurant');
  const restaurantId = urlParams.get('restaurantId')


  console.log("restoid : ",restaurantId)

  const [restaurant, setRestaurant] = useState(restaurantFromUrl);
  const [categories , setCategories] = useState([])
  const [productsMenus , setProductsMenus] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  

  const getRestaurantById = async () => {
         try{
                const response = await fetch(SummaryApi.getRestaurant(restaurantId).url,{
                    method : SummaryApi.getRestaurant(restaurantId).method,
                    credentials : "include"
                 })
                 const dataApi = await response.json()
                 if(dataApi.success){
                    setRestaurant(dataApi.data)
                 } else{
                    console.log(dataApi.message)
                 }
            } catch(error){
                console.log(error)
            }
  }

  const getCategoriesByRestaurant = async () => {
    try{
           const response = await fetch(SummaryApi.getCategoriesByRestaurant(restaurantId).url,{
               method : SummaryApi.getCategoriesByRestaurant(restaurantId).method,
               credentials : "include"
            })
            const dataApi = await response.json()
            if(dataApi.success){
               setCategories(dataApi.data)
               console.log("categories : ",dataApi.data)
            } else{
               console.log(dataApi.message)
            }
       } catch(error){
           console.log(error)
       }
      }

    const fetchAllMenus = async () => {
          try{
              const response = await fetch(SummaryApi.getAllMenuByCat(restaurantId).url,{
                  method : SummaryApi.getAllMenuByCat(restaurantId).method,
                  credentials : "include"
               })
               const dataApi = await response.json()
               if(dataApi.success){
                  console.log("produits et menus : ",dataApi.data)
                  setProductsMenus(dataApi.data)
                  
               } else{
                  console.log("Erreur dans get des produits et menus par restaurant")
               }
          } catch(error){
              console.log(error)
          }
           
        }

  

  // Synchroniser l'état `restaurant` lorsque l'URL change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        getRestaurantById(),
        getCategoriesByRestaurant(),
        fetchAllMenus()
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, [restaurantFromUrl]);

  return (
    <div className='md:px-16 lg:px-32'>
    <Helmet>
      <title>Menu Lunchy - Découvrez nos repas frais livrés à Paris</title>
      <meta name="description" content="Parcourez le menu Lunchy et choisissez parmi une variété de repas frais livrés rapidement à Paris." />
      <meta property="og:title" content="Menu Lunchy - Repas frais à Paris" />
      <meta property="og:description" content="Découvrez nos plats délicieux, prêts à être livrés en moins de 30 minutes." />
      <meta property="og:image" content={`${import.meta.env.VITE_DOMAINE_URL}/assets/seo-img.png`} />
      <meta property="og:url" content={`${import.meta.env.VITE_DOMAINE_URL}/menus`} />
    </Helmet>
        <MenuHero restaurant={restaurant} />
        <MainMenu categories={categories} productsMenus={productsMenus} isLoading={isLoading} restaurantId={restaurantId}/>
    </div>
  )
}

export default Menu