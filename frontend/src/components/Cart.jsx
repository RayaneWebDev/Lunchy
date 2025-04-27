import React from 'react'
import { CgClose } from 'react-icons/cg'
import { useDispatch } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { updateCartItem } from '../store/cartSlice';
import { removeFromCart } from '../store/cartSlice';
import { toast } from 'sonner';
import SummaryApi from '../common';

const Cart = ({onClose, userProducts , fetchUserCart , fetchCartCount , handleOpenLivraison}) => {

    console.log("user cart : ",userProducts)
    const dispatch = useDispatch()
    
 
    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
      };

  const calculateTotalPrice = () => {
      let total = 0 ;
      if(userProducts?.length > 0){
        userProducts.forEach(item => {
            total += parseFloat(item.totalItemPrice)
          });
         
      }


      return formatPrice(total)
  }

  const getAccompanimentsByCategory = (item) => {
    return item.menuAccompaniments.reduce((acc,accomp) => {
        if(acc[accomp.category.name]) acc[accomp.category.name].push(accomp.name) 
        else acc[accomp.category.name] = [accomp.name]
    return acc
    },{})
  }

  const updateQuantity = async (quantity, itemId) => {

  
    const item = userProducts.find((i) => i._id === itemId);
    if (!item) return;
  
    const basePrice = item.type === "product" 
      ? item.product.price 
      : item.menu.price;

  
    const optionsPrice = item.customizations.reduce((acc, custom) => {
      const optTotal = custom.selectedOptions.reduce((sum, opt) => sum + parseFloat(opt.price || 0), 0);
      return acc + optTotal;
    }, 0);
    
  
    const newTotal = ((basePrice + optionsPrice ) * quantity).toFixed(2);
  
    const body = {
      quantity,
      totalItemPrice: newTotal,
    };
  
    try {
      const response = await fetch(SummaryApi.updateQuantityCart(itemId).url, {
        method: SummaryApi.updateQuantityCart(itemId).method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
  
      const result = await response.json();
      if (result.success) {
        dispatch(updateCartItem({
          index: itemId,
          updatedItem: {
            quantity,
            totalItemPrice: newTotal
          }
        }));
  
        fetchCartCount();
        fetchUserCart(); // recharge les vrais prix depuis le backend
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
        const response = await fetch(SummaryApi.removeFromCart(itemId).url, {
          method: SummaryApi.removeFromCart(itemId).method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
    
        const result = await response.json();
        if (result.success) {
          toast.success(result.message)
          dispatch(removeFromCart({index: itemId}));
          fetchCartCount();
          fetchUserCart(); // recharge les vrais prix depuis le backend
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.log(error);
      }
  }
  

  return (
 <div>
    <div className='hidden md:flex fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 justify-center items-center z-50'>
       <div className="bg-white flex flex-col p-6 rounded-2xl md:w-[100%] lg:w-[40%] min-h-[650px] flex-none font-Lato">
             <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold font-Inter">Votre Panier</h2>
                      <CgClose className="cursor-pointer text-2xl" onClick={onClose} />
             </div>
             <div className='flex justify-between items-center text-lg mt-6 '>
             <p className='font-semibold'>2 articles</p>
             <p className='text-gray-500'>Sous Total : <span className='font-semibold'>{calculateTotalPrice()}€</span></p>
             </div>
             <div className='flex flex-col flex-1 overflow-y-auto mt-4 no-scrollbar'>
             { 
                userProducts.length == 0 ? (
                    <div className='w-full h-full flex justify-center items-center'>    
                        <h3>Aucun élément dans le panier</h3>
                    </div>
                ) :
                userProducts.map((item,index) => {
                    const accompanimentsList = getAccompanimentsByCategory(item)
                    return  (

                   <div key={index} className='flex items-start gap-4 border-t-2 border-gray-200 py-5'>

                    <select
                    value={item.quantity}
                   onChange={(e) => updateQuantity(parseInt(e.target.value),item._id)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.067l3.71-3.837a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z' /%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 3px center',
                      backgroundSize: '18px',
                    }}
                    className='bg-black appearance-none w-12 gap-[2px] right-[15px] text-white text-xs md:text-base rounded-[50px] px-2 py-0.5 cursor-pointer'>
                    {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                   </select>
                

                 <div className='flex flex-col gap-3 w-full'>
                    <div className='flex justify-between'>
                       <p className='font-extrabold text-[17px]'>{item.type == "product" ? item.product.name : item.menu.name}</p>
                       <p className='text-gray-500 font-semibold'>{item.totalItemPrice}€</p>
                    </div>

                    {
                       item.type == "menu" && (
                           <p className='text-gray-600 text-sm font-semibold'>{item.menu.mainProduct.name}</p>
                       )
                    }

                    <div className='flex flex-wrap text-sm gap-x-10'>

                    { item.customizations.map((custom,index) => {
                        return (
                            <div key={index} className='flex flex-col gap-1'>
                            <p className='text-gray-500 font-semibold'>{custom.name}</p>
                            {custom.selectedOptions.map((opt,index) => {
                                return (
                                    <p key={index}>{opt.name}</p>
                                   )
                               })}
                               </div>
                           )
                       })}
                       
                       <div className='flex flex-wrap text-sm gap-x-10 mt-3'>
                       
                       {
                          item.type == "menu" && (
                          Object.entries(accompanimentsList).map(([categoryName, accompList],i) => {
                               return (
                                   <div key={i} className='flex items-center gap-2'>
                                       <p className='text-gray-500 font-semibold'>{categoryName} : </p>
                                       <div className='flex gap-3'>
                                           {accompList.map((accomp,index)=>{
                                               return(
                                                   <p key={index}>{accomp}</p>
                                               )
                                           })}
                                       </div>
                                   </div>
                               )
                           })
                       )
                     }
                    </div>
                      
                    </div>

                    <button type="button" onClick={()=>removeItemFromCart(item._id)} className="flex items-center max-w-fit gap-2 text-[12px] text-white bg-black mt-2 rounded-[20px] px-2 py-1" >
                            <MdDelete /> Supprimer du panier
                    </button>


                 </div>
                    </div>
                   
                    )

                })}
             </div>

             <button onClick={()=>handleOpenLivraison()} type="button" className="bg-black text-white w-full font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md">
                Commander
             </button>

        </div>
    </div>

    {/* Version mobile */}
  <div className='md:hidden fixed w-full h-full bg-white top-0 left-0 z-50 p-5 flex flex-col'>
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold font-Inter">Votre Panier</h2>
      <CgClose className="cursor-pointer text-xl" onClick={onClose} />
    </div>
  
    <div className='flex justify-between items-center text-lg mt-6'>
      <p className='font-semibold'>{userProducts?.length || 0} articles</p>
      <p className='text-gray-500'>Total : <span className='font-semibold'>{calculateTotalPrice()}€</span></p>
    </div>
  
    <div className='flex flex-col overflow-y-auto mt-4 flex-grow no-scrollbar'>
      {
        userProducts.length == 0 ? (
            <div className='w-full h-full flex justify-center items-center'>    
                <h3>Aucun élément dans le panier</h3>
            </div>
        ) :
        userProducts.map((item, index) => {
        const accompanimentsList = getAccompanimentsByCategory(item);
        return  (
          <div key={index} className='flex items-start gap-4 border-t-2 border-gray-200 py-5'>
          <select
          value={item.quantity}
         onChange={(e) => updateQuantity(parseInt(e.target.value),item._id)}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.067l3.71-3.837a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 2px center',
            backgroundSize: '18px',
          }}
          className='bg-black appearance-none w-12 gap-[2px] right-[15px] text-white text-base md:text-base rounded-[50px] px-2 py-0.5 cursor-pointer'>
          {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
         </select>

          
      
  
            <div className='flex flex-col gap-3 w-full'>
              <div className='flex justify-between'>
                <p className='font-semibold text-[15px]'>{item.type === "product" ? item.product.name : item.menu.name}</p>
                <p className='text-gray-500 font-semibold'>{item.totalItemPrice}€</p>
              </div>
  
              {item.type === "menu" && (
                <p className='text-gray-600 text-sm font-semibold'>{item.menu.mainProduct.name}</p>
              )}
  
              <div className='flex flex-wrap text-sm gap-y-2 md:gap-y-0 gap-x-10'>
                {item.customizations.map((custom, index) => (
                  <div key={index} className='flex flex-col gap-1'>
                    <p className='text-gray-500 font-semibold'>{custom.name}</p>
                    {custom.selectedOptions.map((opt, index) => (
                      <p key={index}>{opt.name}</p>
                    ))}
                  </div>
                ))}
  
                {item.type === "menu" && (
                  <div className='flex flex-wrap text-sm gap-y-2 md:gap-y-0 gap-x-10 mt-3'>
                    {Object.entries(accompanimentsList).map(([categoryName, accompList], i) => (
                      <div key={i} className='flex items-center gap-2'>
                        <p className='text-gray-500 font-semibold'>{categoryName} :</p>
                        <div className='flex gap-3'>
                          {accompList.map((accomp, index) => (
                            <p key={index}>{accomp}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" onClick={()=>removeItemFromCart(item._id)} className="flex items-center max-w-fit gap-2 text-[12px] text-white bg-black mt-2 rounded-[20px] px-2 py-1" >
                    <MdDelete /> Supprimer du panier
              </button>
            </div>
          </div>
        );
      })}
    </div>
  
    <button onClick={()=>handleOpenLivraison()} type="button" className="bg-black text-white w-full font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md mt-4">
       Commander
    </button>
  </div>
  
  </div>
    
  )
}

export default Cart