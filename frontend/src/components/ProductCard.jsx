import React , {useState , useEffect} from 'react'
import { useDispatch } from 'react-redux';
import addIcon from '../assets/add_icon_white.png'
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { updateCartItem } from '../store/cartSlice';
import SummaryApi from '../common';
import { toast } from 'sonner';

const ProductCard = ({product , type , setSelectedType , setOpenCustomProd , setSelectedProduct }) => {

    const user = useSelector((state) => state.user.user);
    const cartItems = useSelector((state) => state.cart.items)
    const {fetchCartCount, fetchUserCart} = useOutletContext()
    const dispatch = useDispatch()



    const [productQty, setProductQty] = useState(0);
    const [itemId, setItemId] = useState()
    const [IsAlreadyInCart , setIsAlreadyInCart] = useState(false)

    const { userProducts } = useOutletContext();

 
    const updateQuantity = async (quantity) => {

  
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


    useEffect(() => {
      if (!userProducts?.length) return;
    
      const found = userProducts.find(item =>
        type === "Menu"
          ? item.menu?._id === product._id
          : item.product?._id === product._id
      );
    
      setIsAlreadyInCart(!!found);
      setProductQty(found?.quantity || 0);
      setItemId(found?._id || null); 
    }, [userProducts, product._id, type]);
    
    


  return (
     <div className='flex justify-between border border-[#F3F3F3] font-Lato rounded-2xl cursor-pointer' onClick={(e)=>{ 
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return; 
      else{
        if(user) {
          setOpenCustomProd(true) ; setSelectedProduct(product) ; setSelectedType(type)
        }
        else toast.error("Veuillez vous connectez pour passer une commande")
      }
      }}>
                                <div className={`${!product.isAvailable ? 'opacity-45' : ''} left-0 p-3 md:p-4 flex flex-col gap-3`}>
                                  <h3 className='text-[12px] md:text-[18px] font-bold'>
                                    {product.name}
                                    {!product.isAvailable && (
                                      <span className='text-[10px] md:text-[13px] text-gray-500 ml-5'>Indisponible(s)</span>
                                    )}
                                  </h3>
                                  <p className='line-clamp-2 text-[10px] md:text-[13px] text-gray-500'>{product.description}</p>
                                  <p className='text-[15px] md:text-[18px] font-bold'>{product.price}€</p>
                                </div>
                                <div className='relative w-[130px] h-[130px] md:w-[160px] md:h-[160px] shrink-0 bg-[#FAFAFA]'>
                                  <img src={product.image} alt={product.name} className='w-full h-full object-contain rounded-tr-2xl rounded-br-2xl' />
                                  
                                    {IsAlreadyInCart && user ? (
                                      
                                        <select
                                          value={productQty}
                                          onChange={(e) => updateQuantity(parseInt(e.target.value))}
                                          style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.067l3.71-3.837a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z' /%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 2px center',
                                            backgroundSize: '18px',
                                          }}
                                          className='bg-black appearance-none absolute bottom-[10px] gap-[2px] right-[15px] text-white text-xs md:text-base rounded-[50px] px-2 py-0.5 cursor-pointer'>
                                          {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                          ))}
                                        </select>
                                      
                                    ) : product.isAvailable && (
                                      <img
                                        src={addIcon}
                                        alt='ajouterProduit'
                                        className='w-[35px] absolute bottom-[10px] right-[15px] cursor-pointer rounded-[50%] shadow-md'
                                      />
                                    )}
                                </div>

                              </div>

                             
  )
}

export default ProductCard