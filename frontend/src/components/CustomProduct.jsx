import React, { useEffect, useRef } from 'react';
import { CgClose } from "react-icons/cg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import SummaryApi from '../common';
import { useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const CustomProduct = ({ onClose, product }) => {
  const customizationRefs = useRef({}); // Utilisation d'un objet pour stocker les refs
  const {fetchCartCount, fetchUserCart} = useOutletContext()
  const dispatch = useDispatch()

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const formik = useFormik({
    initialValues: {
      customizations: product.customizations?.map(custom => ({
        customizationId: custom._id,
        name: custom.name,
        selectedOptions: []
      })) || []
    },
    validationSchema: Yup.object({
      customizations: Yup.array().of(
        Yup.object().shape({
          selectedOptions: Yup.array().of(Yup.object().shape({name : Yup.string().required() , price : Yup.number().required()}))
            .test(
              'required',
              'Veuillez sélectionner au moins une option',
              function(value) {
                const index = this.path.split('[')[1].split(']')[0];
                return !product.customizations[index].required || (value && value.length > 0);
              }
            )
            .test(
              'maxOptions',
              'Vous avez atteint le nombre maximum d\'options',
              function(value) {
                const index = this.path.split('[')[1].split(']')[0];
                const max = product.customizations[index].maxOptions;
                return !max || (value && value.length <= max);
              }
            )
        })
      )
    }),
    onSubmit: async (values, { setSubmitting }) => {
    
      const errors = {};
      let hasError = false;
      
      values.customizations.forEach((custom, index) => {
        if (product.customizations[index].required && custom.selectedOptions.length === 0) {
          errors[`customizations.${index}.selectedOptions`] = 'Veuillez sélectionner au moins une option';
          hasError = true;
        }
        if (product.customizations[index].maxOptions && custom.selectedOptions.length > product.customizations[index].maxOptions) {
          errors[`customizations.${index}.selectedOptions`] = `Vous ne pouvez pas sélectionner plus de ${product.customizations[index].maxOptions} options`;
          hasError = true;
        }
      });
    
      if (hasError) {
        formik.setErrors(errors);
        
        // Trouver le premier champ en erreur
        const firstErrorIndex = values.customizations.findIndex((custom, index) => 
          product.customizations[index].required && custom.selectedOptions.length === 0
        );
        if (firstErrorIndex !== -1 && customizationRefs.current[firstErrorIndex]) {
          const scrollableContainer = document.querySelector('.mainContent');
          if (scrollableContainer) {
            const refTopRelativeToContainer = customizationRefs.current[firstErrorIndex].offsetTop - scrollableContainer.offsetTop;
            scrollableContainer.scrollTo({
              top: refTopRelativeToContainer - 20,
              behavior: 'smooth',
            });
          }
        }
        
        return;
      }

      const filteredCustomizations = values.customizations.filter(
        (custom) => custom.selectedOptions && custom.selectedOptions.length > 0
      );
      
    
      const cartItem = {
        
          type: "product",
          product: product._id,
          quantity: 1,
          customizations: filteredCustomizations.map((custom, index) => {
            const original = product.customizations.find(c => c._id === custom.customizationId);
            return {
              name: custom.name,
              selectedOptions: custom.selectedOptions.map(optionName => {
                const opt = original.options.find(o => o.name === optionName.name);
                return {
                  name: opt.name,
                  price: parseFloat(opt.price || 0)
                };
              })
            };
          }),
          menuAccompaniments: [],
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
          toast.success("Produit ajouté au panier");
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
      
      setSubmitting(false)
    }
  });

  const handleCustomizationChange = (customIndex, optionName, isChecked) => {
    const newCustomizations = [...formik.values.customizations];
    const currentOptions = newCustomizations[customIndex].selectedOptions;
    const maxOptions = product.customizations[customIndex].maxOptions;
    const optionDetails = product.customizations[customIndex].options.find(opt => opt.name === optionName);
    const optionObj = { name: optionName, price: parseFloat(optionDetails?.price || 0) };
  
    if (isSingleChoice(customIndex)) {
      newCustomizations[customIndex].selectedOptions = isChecked ? [optionObj] : [];
    } else {
      if (isChecked) {
        if (maxOptions && currentOptions.length >= maxOptions) return;
        if (!currentOptions.some(opt => opt.name === optionName)) {
          newCustomizations[customIndex].selectedOptions = [...currentOptions, optionObj];
        }
      } else {
        newCustomizations[customIndex].selectedOptions = currentOptions.filter(opt => opt.name !== optionObj.name);
      }
    }
  
    formik.setFieldValue('customizations', newCustomizations);
  };
  
  const isOptionDisabled = (customIndex, optionName) => {
    const selected = formik.values.customizations[customIndex]?.selectedOptions || [];
    const maxOptions = product.customizations[customIndex].maxOptions;
    const isAlreadySelected = selected.some(opt => opt.name === optionName);
    return maxOptions && selected.length >= maxOptions && !isAlreadySelected && !isSingleChoice(customIndex);
  };
  

  const getBadgeColor = (customIndex) => {
    const custom = formik.values.customizations[customIndex];
    if (!custom) return 'bg-gray-200';
    
    if (custom.selectedOptions.length > 0) {
      return 'bg-green-500 text-white';
    } else if (product.customizations[customIndex].required) {
      return 'bg-red-500 text-white';
    }
    return 'bg-gray-200';
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const calculateTotalPrice = () => {
    let total = parseFloat(product.price);
    
    formik.values.customizations.forEach(custom => {
      const customization = product.customizations.find(c => c._id === custom.customizationId);
      if (customization) {
        custom.selectedOptions.forEach(option => {
          const selectedOption = customization.options.find(opt => opt.name === option.name);
          if (selectedOption) {
            total += parseFloat(selectedOption.price || 0);
          }
        });
      }
    });

    
    return formatPrice(total);
  };


  const isSingleChoice = (customIndex) => {
    return product.customizations[customIndex]?.maxOptions === 1;
  };
  
 

  return (
    <div>
      <div className="hidden md:flex fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 justify-center items-start z-50">
        <div className="bg-white p-6 rounded-2xl md:w-[100%] lg:w-[70%] max-h-screen">
          <CgClose className='cursor-pointer absolute' onClick={onClose} size={18} />
          <div className='mininav flex justify-center mb-6 items-center'>
            <p className='hidden md:block'>{product.name}</p>
          </div>
          <div className='flex gap-7'>
            <div className='w-1/2 flex-none h-[450px]'>
              <img src={product.image} className='w-full object-cover rounded-xl' />
            </div>
            <form onSubmit={formik.handleSubmit} className='mainContent w-1/2 flex flex-col overflow-y-auto max-h-[85vh] pr-2'>
              <div className='flex flex-col gap-1 pb-4 border-b-2 border-gray-200'>
                <h1 className='font-extrabold text-3xl font-Marcellus'>{product.name}</h1>
                <p className='text-gray-600 font-extrabold text-xl font-Lato mb-2'>{formatPrice(product.price)}€</p>
                <p className='font-Inter text-[14px]'>{product.description}</p>
              </div>

              {product.customizations?.map((customization, index) => {
                const currentCustom = formik.values.customizations[index] || {};
                const isError = formik.errors.customizations?.[index]?.selectedOptions;
                const maxOptions = customization.maxOptions;
              
                return (
                  <div
                    key={customization._id}
                    className='flex flex-col gap-4 py-4 font-Lato border-b-2 border-gray-200'
                    ref={el => customizationRefs.current[index] = el}
                  >
                    <div className='flex justify-between items-center'>
                      <div className='flex flex-col max-w-[70%] gap-1'>
                        <h2 className='text-lg font-bold'>{customization.name}</h2>
                        <p className='text-sm text-gray-500'>Choisissez-en {maxOptions}</p>
                      </div>
                      <p className={`${getBadgeColor(index)} px-2 text-sm font-semibold rounded-lg`}>
                        {customization.required && 'Obligatoire'}
                      </p>
                    </div>
              
                    {customization.options.map((option) => {
                      const isSelected = currentCustom.selectedOptions?.some(opt => opt.name === option.name);
                      const isDisabled = isOptionDisabled(index, option.name);

              
                      return (
                        <div key={option.name} className='flex py-3 justify-between items-center'>
                          <div className='flex flex-col gap-1 text-[14px]'>
                            <p className={`${isDisabled ? 'text-gray-400' : ''} font-semibold`}>
                              {option.name}
                              {option.price > 0 && (
                                <span className='text-gray-600 ml-2'>+{formatPrice(option.price)}€</span>
                              )}
                            </p>
                          </div>
                          <div className='flex gap-2'>
                          <input
                          type={isSingleChoice(index) ? "radio" : "checkbox"}
                          name={`custom-${index}`} // pour grouper les radios
                          checked={isSelected}
                          onChange={(e) => handleCustomizationChange(index, option.name, e.target.checked)}
                          disabled={isDisabled}
                          className={`checkbox checkbox-neutral checkbox-md ${isDisabled ? 'cursor-not-allowed' : ''}`}
                        />
                        
                          </div>
                        </div>
                      );
                    })}
              
                    {isError && (
                      <div className="text-red-500 font-semibold text-sm">{isError}</div>
                    )}
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Version mobile */}
      <div className='md:hidden fixed w-full h-full bg-white top-0 left-0 z-50 overflow-y-auto'>
        <CgClose className='cursor-pointer absolute left-3 top-3' onClick={onClose} size={30} />
        <img src={product.image} className='w-full' />
        <form onSubmit={formik.handleSubmit} className='mainContent p-5 flex flex-col'>
          <div className='flex flex-col gap-1 pb-4 border-b-2 border-gray-200'>
            <h1 className='font-extrabold text-3xl font-Marcellus'>{product.name}</h1>
            <p className='text-gray-600 font-extrabold text-xl font-Lato mb-2'>{formatPrice(product.price)}€</p>
            <p className='font-Inter text-[14px]'>{product.description}</p>
          </div>

          {product.customizations?.map((customization, index) => {
            const currentCustom = formik.values.customizations[index] || {};
            const isError = formik.errors.customizations?.[index]?.selectedOptions;
            const maxOptions = customization.maxOptions;
          
            return (
              <div
                key={customization._id}
                className='flex flex-col gap-4 py-4 font-Lato border-b-2 border-gray-200'
                ref={el => customizationRefs.current[index] = el}
              >
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col max-w-[70%] gap-1'>
                    <h2 className='text-lg font-bold'>{customization.name}</h2>
                    <p className='text-sm text-gray-500'>Choisissez-en {maxOptions}</p>
                  </div>
                  <p className={`${getBadgeColor(index)} px-2 text-sm font-semibold rounded-lg`}>
                    {customization.required && 'Obligatoire'}
                  </p>
                </div>
          
                {customization.options.map((option) => {
                  const isSelected = currentCustom.selectedOptions?.some(opt => opt.name === option.name);
                  const isDisabled = isOptionDisabled(index, option.name);

          
                  return (
                    <div key={option.name} className='flex py-3 justify-between items-center'>
                      <div className='flex flex-col gap-1 text-[14px]'>
                        <p className={`${isDisabled ? 'text-gray-400' : ''} font-semibold`}>
                          {option.name}
                          {option.price > 0 && (
                            <span className='text-gray-600 ml-2'>+{formatPrice(option.price)}€</span>
                          )}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                      <input
                      type={isSingleChoice(index) ? "radio" : "checkbox"}
                      name={`custom-${index}`} // pour grouper les radios
                      checked={isSelected}
                      onChange={(e) => handleCustomizationChange(index, option.name, e.target.checked)}
                      disabled={isDisabled}
                      className={`checkbox checkbox-neutral checkbox-md ${isDisabled ? 'cursor-not-allowed' : ''}`}
                    />
                    
                      </div>
                    </div>
                  );
                })}
          
                {isError && (
                  <div className="text-red-500 text-sm">{isError}</div>
                )}
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomProduct;    














