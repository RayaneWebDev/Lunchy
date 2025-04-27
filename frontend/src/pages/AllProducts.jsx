import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm';
import AddCategorieForm from '../components/AddCategorieForm';
import { toast } from 'sonner';
import SummaryApi from '../common';
import AddMenuForm from '../components/AddMenuForm';
import EditProduct from '../components/EditProduct';
import EditMenuForm from '../components/EditMenuForm';

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([])
  const [menus , setMenus] = useState([])
  const [addProduct, setAddProduct] = useState(false)
  const [addCategory, setAddCategory] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedMenu, setSelectedMenu] = useState("")
  const [addMenu, setAddMenu] = useState(false)
  const [openEditProduct, setOpenEditProduct] = useState(false)
  const [openEditMenu, setOpenEditMenu] = useState(false)
  const { restaurants = [], categories = [], fetchCategories , fetchRestaurants} = useOutletContext() || {};

 
  const fetchProducts = async () => {
        try{
            const response = await fetch(SummaryApi.getProducts.url,{
                method : SummaryApi.getProducts.method,
                credentials : "include"
             })
             const dataApi = await response.json()
             if(dataApi.success){
                setProducts(dataApi.data)
                
             } else{
                toast.error(dataApi.message)
                console.log(dataApi.message)
             }
        } catch(error){
            console.log(error)
        }
         
      }

      const fetchMenus = async () => {
        try{
            const response = await fetch(SummaryApi.getMenus.url,{
                method : SummaryApi.getMenus.method,
                credentials : "include"
             })
             const dataApi = await response.json()
             if(dataApi.success){
                setMenus(dataApi.data)
             } else{
                toast.error(dataApi.message)
                console.log(dataApi.message)
             }
        } catch(error){
            console.log(error)
        }
         
      }

      const handleDeleteProduct = async (productId, restaurantId) => {
        const isConfirmed = window.confirm("Voulez-vous vraiment supprimer ce produit ?");
        
        if (!isConfirmed) return;
      
        try {
          const response = await fetch(SummaryApi.deleteProduct(productId).url, {
            method: SummaryApi.deleteProduct(productId).method,
            credentials: "include",
            body: JSON.stringify(restaurantId)
          });
      
          const dataApi = await response.json();
          if (dataApi.success) {
            toast.success(dataApi.message);
            fetchProducts(); // Correction : fetchReviews() → fetchProducts()
          } else {
            toast.error(dataApi.message);
            console.log(dataApi.message);
          }
        } catch (error) {
          console.log(error);
        }
      };


      const handleDeleteMenu = async (menuId, restaurantId) => {
        const isConfirmed = window.confirm("Voulez-vous vraiment supprimer ce menu ?");
        
        if (!isConfirmed) return;
      
        try {
          const response = await fetch(SummaryApi.deleteMenu(menuId).url, {
            method: SummaryApi.deleteMenu(menuId).method,
            credentials: "include",
            body: JSON.stringify(restaurantId)
          });
      
          const dataApi = await response.json();
          if (dataApi.success) {
            toast.success(dataApi.message);
            fetchMenus(); 
          } else {
            toast.error(dataApi.message);
            console.log(dataApi.message);
          }
        } catch (error) {
          console.log(error);
        }
      };
      

  // Filtrage des produits
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRestaurant ? product.restaurant.name === selectedRestaurant : true) &&
    (selectedCategory ? product.category.name === selectedCategory : true)
  );

  // Filtrage des menus
  const filteredMenus = menus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRestaurant ? menu.restaurant.name === selectedRestaurant : true) &&
    (selectedCategory ? menu.category.name === selectedCategory : true)
  );
  const groupedItems = filteredProducts.concat(filteredMenus).reduce((acc, item) => {
    const key = item.restaurant?.name || "Restaurant inconnu";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  

  console.log("groupedItems : ",groupedItems)
  
 

  useEffect(()=>{
    fetchRestaurants()
    fetchCategories()
    fetchProducts()
    fetchMenus()
  }, [])

  

  return (
    <div className='font-Lato p-4'>
      <div className="hero flex flex-col gap-3 items-start">
        <h1 className="text-[27px] font-bold">Menus</h1>
        <p>Gérer et consulter différents menus des restaurants de Lunch</p>
      </div>

      <div className='flex gap-8 mt-4'>
            <button
                    onClick={() => setAddProduct(true)} className="bg-black text-white text-[13px] px-3 py-2 rounded mt-5">
                    Ajouter un produit simple
            </button>

            <button
                    onClick={() => setAddMenu(true)} className="bg-black text-white text-[13px] px-3 py-2 rounded mt-5">
                    Ajouter un menu
            </button>

            <button
                    onClick={() => setAddCategory(true)} className="bg-black text-white text-[13px] px-3 py-2 rounded mt-5">
                    Ajouter une catégorie
            </button>

            
      </div>

      {addProduct && (
        <AddProductForm onClose={() => setAddProduct(false)} restaurants={restaurants} fetchProducts={fetchProducts} />
      )}

      {addCategory && (
        <AddCategorieForm onClose={() => setAddCategory(false)} restaurants={restaurants} fetchCategories={fetchCategories} />
      )}

      {addMenu && (
        <AddMenuForm onClose={() => setAddMenu(false)} restaurants={restaurants} products={products} categories={categories} fetchMenus={fetchMenus} />
      )}

      
      {openEditProduct && (
        <EditProduct onClose={() => setOpenEditProduct(false)} fetchProducts={fetchProducts} restaurants={restaurants} product={selectedProduct} />
      )}

      {openEditMenu && (
        <EditMenuForm onClose={() => setOpenEditMenu(false)} menu={selectedMenu} restaurants={restaurants} products={products} categories={categories} fetchMenus={fetchMenus} />
      )}
      

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 my-4 mt-6">
        <input
          type="text"
          placeholder="Rechercher"
          className="border p-2 rounded w-1/3 text-[15px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded w-1/4 text-[15px]"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option value="">Tous les restaurants</option>
          {restaurants.map((restaurant, index) => (
            <option key={index} value={restaurant.name}>{restaurant.name}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-1/4 text-[15px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Liste des menus */}
      <div className="overflow-x-auto mt-12">
        {Object.entries(groupedItems).map(([restaurantName, items]) => (
          <div key={restaurantName} className="mb-6">
            <h2 className="text-xl font-bold mb-2">{restaurantName}</h2>
            <table className="table w-full z-0">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Prix</th>
                  <th>Disponibilité</th>
                  <th>Modification</th>
                  <th>Suppression</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td><img src={item.image} className='w-16 h-16'/></td>
                    <td>{item.name}</td>
                    <td>{item.mainProduct ? "Menu" : "Produit"}</td>
                    <td>{item.price} €</td>
                    <td>
                      <span className={`badge ${item.isAvailable ? "badge-success" : "badge-error"}`}>
                        {item.isAvailable ? "Disponible" : "Indisponible"}
                      </span>
                    </td>
                    <td>
                      <button type='button' className="btn btn-sm btn-outline" onClick={()=>{
                        if(item.mainProduct){
                          setSelectedMenu(item)
                          setOpenEditMenu(true)
                        }
                        else{
                          setSelectedProduct(item)
                          setOpenEditProduct(true)
                        }
                      }}>Modifier</button>
                    </td>
                    <td>
                      <button className='btn btn-sm btn-outline bg-red-500 text-white' onClick={()=> item.mainProduct ? handleDeleteMenu(item._id, item.restaurant) : handleDeleteProduct(item._id, item.restaurant)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>

    
  );
};

export default AllProducts;
