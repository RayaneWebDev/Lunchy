import React, { useState, useEffect, useRef } from 'react';
import { CgClose } from "react-icons/cg";
import { toast } from 'sonner';
import { useOutletContext } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiArrowRightSLine } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import SummaryApi from '../common';

const CustomMenu = ({ onClose, menu, restaurantId ,handleOpenMainProduct, customizations}) => {
  const [categoryProducts, setCategoryProducts] = useState({});
  const {fetchCartCount, fetchUserCart} = useOutletContext()
  const [maxReached, setMaxReached] = useState({});
  const dispatch = useDispatch()
  const accompanimentRefs = useRef({});


  const toSmartSingular = (phrase) => {
    return phrase
      .split(" ")
      .map(word => {
        if (word.length > 4 && word.endsWith("s")) {
          return word.slice(0, -1);
        }
        return word;
      })
      .join(" ");
  };


  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const formik = useFormik({
    customizations: customizations?.length > 0,
    initialValues: {
      accompaniments: menu.accompaniments.reduce((acc, accomp) => {
        acc[accomp._id] = {
          selectedProducts: [],
          maxChoices: accomp.maxChoices
        };
        return acc;
      }, {}),
    },
    validationSchema: Yup.object({
      customizations: Yup.boolean().oneOf([true], 'Veuillez sélectionner une personnalisation.'),
      accompaniments: Yup.object().shape(
        menu.accompaniments.reduce((acc, accomp) => {
          acc[accomp._id] = Yup.object().shape({
            selectedProducts: Yup.array()
              .min(1, `Veuillez choisir au moins un produit`)
              .max(
                accomp.maxChoices, 
                `Vous ne pouvez pas choisir plus de ${accomp.maxChoices} produits`
              )
          });
          return acc;
        }, {})
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Validation en cours...")
    
      const filteredCustomizations = customizations.filter(
        (custom) => custom.selectedOptions && custom.selectedOptions.length > 0
      );
      
    
      const cartItem = {
        
          type: "menu",
          menu: menu._id,
          quantity: 1,
          customizations: filteredCustomizations.map((custom, index) => {
            return {
              name: custom.name,
              selectedOptions: custom.selectedOptions
            };
          }),
          menuAccompaniments: Object.values(values.accompaniments).flatMap(accomp => accomp.selectedProducts),
          totalItemPrice : calculateTotalPrice()
          

        
      };

      console.log("Données valides:", values);
      
      
      console.log("new product : ",cartItem)

      try {
        const response = await fetch(SummaryApi.addToCart.url, {
          method: SummaryApi.addToCart.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cartItem),
          credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Menu ajouté au panier");
          dispatch(addToCart(cartItem))
          fetchCartCount()
          fetchUserCart()
          onClose();
        } else {
          toast.error(result.message);
          console.log(result.message)
        }
      } catch (error) {
        toast.error("Erreur lors de l'ajout du produit au panier");
        console.log(error)
      }
      
      setSubmitting(false);
    }
    
  });

  const handleAccompanimentChange = (accompId, productId, isChecked) => {
    const currentAccomp = formik.values.accompaniments[accompId];
    let newSelectedProducts;

    if (isChecked) {
      newSelectedProducts = [...currentAccomp.selectedProducts, productId]; // ajout du produit au tableau
    } else {
      newSelectedProducts = currentAccomp.selectedProducts.filter(id => id !== productId);  // suppression du produit du tableau
    }

    formik.setFieldValue(`accompaniments.${accompId}`, {
      ...currentAccomp,
      selectedProducts: newSelectedProducts
    });

    setMaxReached(prev => ({
      ...prev,
      [accompId]: newSelectedProducts.length >= currentAccomp.maxChoices
    }));
  };

  const isAccompanimentSelected = (accompId) => {
    const accompaniment = formik.values.accompaniments[accompId];
    return accompaniment?.selectedProducts.length > 0;
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await fetch(SummaryApi.getProductsByCategory(restaurantId, categoryId).url, {
        method: SummaryApi.getProductsByCategory(restaurantId, categoryId).method,
        credentials: "include"
      });
      const data = await response.json();

      if (data.success) {
        setCategoryProducts((prevState) => ({
          ...prevState,
          [categoryId]: data.data
        }));
      } else {
        console.error("Erreur lors de la récupération des produits");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API :", error);
    }
  };

  useEffect(() => {
    menu.accompaniments.forEach(accomp => {
      accomp.categories.forEach(cat => {
        fetchProductsByCategory(cat._id);
      });
    });
  }, [menu]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const calculateTotalPrice = () => {
    let total = parseFloat(menu.price);
    
    // Ajouter le prix des options de personnalisation
    if (customizations?.length > 0) {
      customizations.forEach(custom => {
        if (custom.selectedOptions) {
          custom.selectedOptions.forEach(option => {
            total += parseFloat(option.price) || 0;
          });
        }
      });
    }
  
    return formatPrice(total);
  };
  

  useEffect(() => {
    // Vérifier si le tableau contient au moins un élément
    const hasCustomizations = customizations?.length > 0;
    formik.setFieldValue("customizations", hasCustomizations);
  }, [customizations]);
  

  return (
    <div>
      <div className="hidden md:flex fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 justify-center items-start z-50">
        <div className="bg-white p-6 rounded-2xl md:w-[100%] lg:w-[70%] max-h-screen">
          <CgClose className='cursor-pointer absolute' onClick={onClose} size={18} />
          <div className='mininav flex justify-center mb-6 items-center'>
            <p className='hidden md:block'>{menu.name}</p>
          </div>
          <div className='flex gap-7'>
            <div className='w-1/2 flex-none h-[450px]'>
              <img src={menu.image} className='w-full object-cover rounded-xl' />
            </div>
            <form  onSubmit={async (e) => {
              e.preventDefault();
              const errors = await formik.validateForm();

              console.log("subbmitt")
              
              // Validation manuelle des accompagnements
              menu.accompaniments.forEach(accomp => {
                if (!formik.values.accompaniments[accomp._id]?.selectedProducts?.length) {
                  errors.accompaniments = errors.accompaniments || {};
                  errors.accompaniments[accomp._id] = {
                    selectedProducts: `Veuillez sélectionner au moins un produit`
                  };
                }
              });
        
              if (Object.keys(errors).length > 0) {
                formik.setErrors(errors);
                const firstErrorId = menu.accompaniments.find(a => 
                  !formik.values.accompaniments[a._id]?.selectedProducts?.length
                )?._id;
                
                if (firstErrorId) {
                  const ref = accompanimentRefs.current[firstErrorId];
                  const scrollableContainer = document.querySelector('.mainContent');
                  
                  if (ref && scrollableContainer) {
                    const refTopRelativeToContainer =
                      ref.offsetTop - scrollableContainer.offsetTop;
                  
                    scrollableContainer.scrollTo({
                      top: refTopRelativeToContainer,
                      behavior: 'smooth',
                    });
                  }
                  
                }
                return;
              }
        
              // Si tout est valide
              console.log("Soumission du formulaire:", formik.values);
              formik.handleSubmit();
            }} className='mainContent w-1/2 flex flex-col overflow-y-auto max-h-[85vh] pr-2'>
              <div className='flex flex-col gap-1 pb-4 border-b-2 border-gray-200'>
                <h1 className='font-extrabold text-3xl font-Marcellus'>{menu.name}</h1>
                <p className='text-gray-600 font-extrabold text-xl font-Lato mb-2'>{formatPrice(menu.price)}€</p>
                <p className='font-Inter text-[14px]'>{menu.description}</p>
              </div>

              <div className='flex flex-col gap-4 py-4 font-Lato border-b-2 border-gray-200 cursor-pointer' onClick={() => { handleOpenMainProduct();}}>
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-bold'>Personnalisez Votre {menu.mainProduct?.category?.name || ''}</h2>
                  <p className={`${formik.errors.customizations ? 'bg-red-500 text-white' : 'bg-green-600 text-white'} bg-gray-200 px-1 text-sm font-semibold rounded-lg`}>Obligatoire</p>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='text-[14px]'>{menu.mainProduct?.name}</p>
                  <div className='flex gap-2'>
                  <input 
                  type="radio"
                  name="customizations"
                  checked={!!formik.values.customizations} // Double négation pour booléen
                  onChange={formik.handleChange} // Gestionnaire Formik
                  className="radio radio-md"
                />

                    <button><RiArrowRightSLine size={20} /></button>
                  </div>
                </div>

                { customizations.length > 0 && (
                  <div className='bg-[#F3F3F3] p-3 font-Lato flex flex-col items-start gap-7 rounded-md'>
                      <ul className='flex flex-col gap-3 text-[14px]'>
                        { customizations.map((custom,index) => {
                          return (  (custom.selectedOptions.length != 0) &&
                            <li key={index} className='flex flex-col gap-1'>
                              <h3 className='font-semibold'>{custom.name}</h3>
                              <div className='flex gap-1'>
                                { custom.selectedOptions.map((opt,index) => {
                                  return (
                                    <p key={index}>{opt.name} <span className='bg-black h-1 w-1 rounded-[50%]'></span></p>
                                  )})}
                              </div>
                            </li>
                          )})
                         }
                      </ul>

                      <button onClick={()=>handleOpenMainProduct()} className='bg-black btn btn-neutral'>Modifier les sélections</button>
                  
                  </div> 
                )}
               
              </div>

              {menu.accompaniments.map((accomp) => {
                const isMaxReachedForAccomp = maxReached[accomp._id];
                const isSelected = isAccompanimentSelected(accomp._id);
                
                return (
                  <div key={accomp._id} className='flex flex-col gap-4 py-4 font-Lato'>
                    <div className='flex justify-between items-start'>
                      <div className='flex flex-col max-w-[70%] gap-1'>
                        <h2 className='text-lg font-bold' ref={(el) => (accompanimentRefs.current[accomp._id] = el)} >Choisissez Votre {accomp.categories.map((cat) => toSmartSingular(cat.name)).join(" ou ")}</h2>
                        <p className='text-sm text-gray-500'>Choisissez-en {accomp.maxChoices}</p>
                      </div>

                      <p className={`px-1 text-sm font-semibold rounded-lg ${
                        isMaxReachedForAccomp
                          ? 'bg-green-500 text-white'
                          : !isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200'
                      }`}>
                        Obligatoire
                      </p>
                    </div>

                    {accomp.categories.map((cat) => {
                      const categoryItems = categoryProducts[cat._id];
                      
                      return categoryItems && (
                        <div key={cat._id} className='flex flex-col font-Lato border-b-2 border-gray-200'>
                          {categoryItems.map((item) => {
                            const isItemSelected = formik.values.accompaniments[accomp._id]?.selectedProducts.includes(item._id);
                            const isDisabled = !item.isAvailable || (isMaxReachedForAccomp && !isItemSelected);
                            
                            return (
                              <div key={item._id} className='flex justify-between py-5 items-start border-b-[1.5px] border-gray-200'>
                                <div className='flex flex-col gap-1 text-[14px]'>
                                  <p className={`${!item.isAvailable ? 'text-gray-500' : ''} font-semibold`}>
                                    {item.name}
                                  </p>
                                  {!item.isAvailable && <p className='text-gray-500'>Indisponible</p>}
                                </div>
                                <input 
                                  type="checkbox"
                                  checked={isItemSelected}
                                  onChange={(e) => handleAccompanimentChange(accomp._id, item._id, e.target.checked)}
                                  disabled={isDisabled}
                                  className={`checkbox checkbox-neutral checkbox-md border-gray-700 border-2 ${
                                    !item.isAvailable ? 'cursor-not-allowed' : ''
                                  }`}
                                />
                                {formik.touched.customizations && formik.errors.customizations && (
                                  <div className="text-red-500 text-sm">{formik.errors.customizations}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              <div className='flex flex-col gap-7 mt-4'>
                <div className='flex gap-4 text-lg'>
                  <p className='font-Lato'>Prix total</p>
                  <p className='font-bold'>{calculateTotalPrice()}€</p>
                </div>
                <button 
                  type="submit" 
                  className="hidden bg-black text-white font-Lato py-3 hover:opacity-70 whitespace-nowrap md:block rounded-md"
                  >
                  Ajouter au panier
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='md:hidden fixed w-full h-full bg-white top-0 left-0 z-50 overflow-y-auto'>
        <CgClose className='cursor-pointer absolute left-3 top-3' onClick={onClose} size={30} />
        <img src={menu.image} className='w-full' />
        <form 
        onSubmit={async (e) => {
          e.preventDefault();
          const errors = await formik.validateForm();
          
          // Validation manuelle des accompagnements
          menu.accompaniments.forEach(accomp => {
            if (!formik.values.accompaniments[accomp._id]?.selectedProducts?.length) {
              errors.accompaniments = errors.accompaniments || {};
              errors.accompaniments[accomp._id] = {
                selectedProducts: `Veuillez sélectionner au moins un produit`
              };
            }
          });
    
          if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            const firstErrorId = menu.accompaniments.find(a => 
              !formik.values.accompaniments[a._id]?.selectedProducts?.length
            )?._id;
            
            if (firstErrorId) {
              const ref = accompanimentRefs.current[firstErrorId];
              ref?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          
          formik.handleSubmit()
         
        }} className='mainContent p-5 flex flex-col'>
          <div className='flex flex-col gap-1 pb-4 border-b-2 border-gray-200'>
            <h1 className='font-extrabold text-3xl font-Marcellus'>{menu.name}</h1>
            <p className='text-gray-600 font-extrabold text-xl font-Lato mb-2'>{formatPrice(menu.price)}€</p>
            <p className='font-Inter text-[14px]'>{menu.description}</p>
          </div>

          <div className='flex flex-col gap-4 py-4 font-Lato border-b-2 border-gray-200' onClick={() => { handleOpenMainProduct();}}>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-bold'>Personnalisez Votre {menu.mainProduct?.category?.name}</h2>
                  <p className={`${customizations.length > 0  ? 'bg-green-600 text-white' : 'bg-red-500 text-white'} bg-gray-200 px-1 text-sm font-semibold rounded-lg`}>Obligatoire</p>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-[14px]'>{menu.mainProduct?.name}</p>
              <div className='flex gap-2'>
              <input 
                type="radio"
                name="customizations"
                checked={!!formik.values.customizations} // Double négation pour booléen
                onChange={formik.handleChange} // Gestionnaire Formik
                className="radio radio-md"
              />
                <button><RiArrowRightSLine size={20} /></button>
              </div>
            </div>

              { customizations.length > 0 && (
                  <div className='bg-[#F3F3F3] p-3 font-Lato flex flex-col items-start gap-7 rounded-md'>
                      <ul className='flex flex-col gap-3 text-[14px]'>
                        { customizations.map((custom,index) => {
                          return (  (custom.selectedOptions.length != 0) &&
                            <li key={index} className='flex flex-col gap-1'>
                              <h3 className='font-semibold'>{custom.name}</h3>
                              <div className='flex gap-1'>
                                { custom.selectedOptions.map((opt,index) => {
                                  return (
                                    <p key={index}>{opt.name} <span className='bg-black h-1 w-1 rounded-[50%]'></span></p>
                                  )})}
                              </div>
                            </li>
                          )})
                         }
                      </ul>

                      <button onClick={()=>handleOpenMainProduct()} className='bg-black btn btn-neutral'>Modifier les sélections</button>
                  
                  </div> 
                )}

            {formik.touched.customizations && formik.errors.customizations && (
              <div className="text-red-500 text-sm">{formik.errors.customizations}</div>
            )}

          </div>

          {menu.accompaniments.map((accomp) => {
            const isMaxReachedForAccomp = maxReached[accomp._id];
            const isSelected = isAccompanimentSelected(accomp._id);
            
            return (
              <div key={accomp._id}  className={`accomp-${accomp._id} flex flex-col gap-4 py-4 font-Lato`}>
                <div className='flex justify-between items-start'>
                  <div className='flex flex-col max-w-[70%] gap-1'>
                    <h2 className='text-lg font-bold' ref={(el) => (accompanimentRefs.current[accomp._id] = el)}>Choisissez Votre {accomp.categories.map((cat) => toSmartSingular(cat.name)).join(" ou ")}</h2>
                    <p className='text-sm text-gray-500'>Choisissez-en {accomp.maxChoices}</p>
                  </div>

                  <p className={`px-1 text-sm font-semibold rounded-lg ${
                    isMaxReachedForAccomp
                      ? 'bg-green-500 text-white'
                      : !isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200'
                  }`}>
                    Obligatoire
                  </p>
                </div>

                {accomp.categories.map((cat) => {
                  const categoryItems = categoryProducts[cat._id];
                  
                  return categoryItems && (
                    <div key={cat._id} className='flex flex-col font-Lato border-b-2 border-gray-200'>
                      {categoryItems.map((item) => {
                        const isItemSelected = formik.values.accompaniments[accomp._id]?.selectedProducts.includes(item._id);
                        const isDisabled = !item.isAvailable || (isMaxReachedForAccomp && !isItemSelected);
                        
                        return (
                          <div key={item._id} className='flex justify-between py-5 items-start border-b-[1.5px] border-gray-200'>
                            <div className='flex flex-col gap-1 text-[14px]'>
                              <p className={`${!item.isAvailable ? 'text-gray-500' : ''} font-semibold`}>
                                {item.name}
                              </p>
                              {!item.isAvailable && <p className='text-gray-500'>Indisponible</p>}
                            </div>
                            <input 
                              type="checkbox"
                              checked={isItemSelected}
                              onChange={(e) => handleAccompanimentChange(accomp._id, item._id, e.target.checked)}
                              disabled={isDisabled}
                              className={`checkbox checkbox-neutral checkbox-md border-gray-700 border-2 ${
                                !item.isAvailable ? 'cursor-not-allowed' : ''
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className='flex flex-col gap-7 mt-4'>
            <div className='flex gap-4 text-lg'>
              <p className='font-Lato'>Prix total</p>
              <p className='font-bold'>{calculateTotalPrice()}€</p>
            </div>
            <button 
              type="submit" 
              className="bg-black text-white font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md"
              
            >
              Ajouter au panier
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default CustomMenu;