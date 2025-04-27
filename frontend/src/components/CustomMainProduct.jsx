import React , {useRef ,useEffect} from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";


const CustomMainProduct = ({product , onClose, customizations , setCustomizations}) => {
     const customizationRefs = useRef({}); // Utilisation d'un objet pour stocker les refs
    
      const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
      };
    
      const formik = useFormik({
        initialValues: {
          customizations: customizations.length == 0 ? product.customizations?.map(custom => ({
            customizationId: custom._id,
            name: custom.name,
            selectedOptions: []
          })) :  customizations 
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
        onSubmit:  (values, { setSubmitting }) => {
        
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
                errors[`customizations.${index}.selectedOptions`]
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
        
        
          console.log("Données valides:", values);
          setCustomizations(values.customizations)
          onClose();
          
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
    
    


    
      const isSingleChoice = (customIndex) => {
        return product.customizations[customIndex]?.maxOptions === 1;
      };
      
     
  return (
    <div>
         <div className="hidden md:flex fixed w-full h-full bg-gray-500 bg-opacity-50 top-0 left-0 justify-center items-center z-50">
           <div className="bg-white p-6 rounded-2xl md:w-[100%] lg:w-[40%] max-h-screen">
             <FaArrowLeft className='cursor-pointer absolute' onClick={onClose} size={18} />
             <div className='mininav flex justify-center mb-6 items-center'>
               <p className='hidden md:block'>{product.name}</p>
             </div>
              <div className='relative mainContent w-full overflow-y-auto max-h-[75vh] pr-2'>
              <form onSubmit={formik.handleSubmit} className='flex flex-col'>
   
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

             
            
              </form>
              <div className='sticky bottom-0 bg-white px-6 py-4 mt-4'>
              <button 
              type="submit" 
              onClick={formik.handleSubmit}
               disabled={formik.isSubmitting}
              className="bg-black text-white w-full font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md"
            >
              Enregistrer
            </button>
            </div>
           

              </div>
             
           </div>
         </div>
   
         {/* Version mobile */}
         <div className='md:hidden fixed w-full h-full bg-white top-0 left-0 z-50 overflow-y-auto'>
           <FaArrowLeft className='cursor-pointer absolute left-3 top-3' onClick={onClose} size={25} />
           <form onSubmit={formik.handleSubmit} className='mainContent p-5 flex flex-col mt-8 mb-[80px]'>
   
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
   
            
           </form>
           <div className='fixed bottom-0 left-0 w-full bg-white px-5 py-4 z-50'>
              <button 
                type="submit" 
                 disabled={formik.isSubmitting}
                onClick={formik.handleSubmit}
                className="bg-black text-white w-full font-Lato py-3 hover:opacity-70 whitespace-nowrap rounded-md"
              >
                Enregistrer
              </button>
            </div>

         </div>
       </div>
  )
}

export default CustomMainProduct