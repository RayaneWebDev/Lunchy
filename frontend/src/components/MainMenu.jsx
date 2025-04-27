import React, { useRef, useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ProductCard from './ProductCard'
import CustomMenu from './CustomMenu'
import CustomProduct from './CustomProduct'
import CustomMainProduct from './CustomMainProduct'

const MainMenu = ({ categories, productsMenus , isLoading , restaurantId}) => {
  const scrollRef = useRef()
  const underlineRef = useRef()
  const btnRefs = useRef([])
  const [selected, setSelected] = useState(0)
  const [openCustomProd, setOpenCustomProd] = useState(false)
  const [selectedProduct , setSelectedProduct] = useState()
  const [openMainProduct, setOpenMainProduct] = useState(false)
  const [selectedType , setSelectedType] = useState()
  const [customizations , setCustomizations] = useState([])




  // Scroll horizontal du menu
  const handleScroll = (dir) => {
    const container = scrollRef.current
    const scrollAmount = 250
    container.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  const handleCategoryClick = (idx) => {
    if (isLoading) return;
  
    const section = document.getElementById(`section-${idx}`);
    if (section) {
      const yOffset = -120; // Ajuste selon ta navbar
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
  
      setSelected(idx); // Important : après le scroll
    }
  }
  

  // Animation de l'underline
  const updateUnderline = () => {
    const currentBtn = btnRefs.current[selected]
    const underline = underlineRef.current
    const container = scrollRef.current

    if (!currentBtn || !underline || !container) return


    if (currentBtn && underline && container) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = currentBtn.getBoundingClientRect()
      const offsetLeft = buttonRect.left - containerRect.left + container.scrollLeft

      underline.style.width = `${buttonRect.width}px`
      underline.style.transform = `translateX(${offsetLeft}px)`

      const scrollTo = offsetLeft - container.offsetWidth / 2 + buttonRect.width / 2;
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }

 


  useEffect(() => {
    if (!isLoading) {
      updateUnderline();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      updateUnderline();
    }
  }, [selected]);
  
  


useEffect(() => {
  if (isLoading || productsMenus.length === 0) return;

  const handleScroll = () => {
    const scrollY = window.scrollY + 130;

    const visibleIndex = productsMenus.findIndex((_, idx) => {
      const section = document.getElementById(`section-${idx}`);
      if (!section) return false;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      return scrollY >= top && scrollY < bottom;
    });

    if (visibleIndex !== -1 && visibleIndex !== selected) {
      setSelected(visibleIndex);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [selected, isLoading, productsMenus]);



  
  const goBackToMenu = () => {
    setOpenMainProduct(false);  
    setSelectedType("Menu");
    setOpenCustomProd(true)
  };

  const handleOpenMainProduct = () => {
    setOpenMainProduct(true)
    setOpenCustomProd(false)
  }
  return (
    <div>
      {/* --- Sticky menu --- */}
      <div className="w-full bg-white sticky top-[60px] md:top-[84px] z-10">
      {/* Arrows */}
        <div className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <button onClick={() => handleScroll('left')} className="bg-gray-200 p-2 rounded-full shadow">
            <FaChevronLeft size={14} />
          </button>
        </div>
        <div className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <button onClick={() => handleScroll('right')} className="bg-gray-200 p-2 rounded-full shadow">
            <FaChevronRight size={14} />
          </button>
        </div>

        {/* Scrollable category bar */}
        <div
        ref={scrollRef}
        className="flex items-center overflow-x-auto md:px-6 py-3 no-scrollbar relative"
      >
      
        <span
          ref={underlineRef}
          className="absolute bottom-2 left-0 h-1.5 bg-black rounded-full transition-all duration-300 ease-in-out"
        />

        {categories.map((cat, idx) => (
          <button
            key={idx}
            ref={(el) => (btnRefs.current[idx] = el)}
            onClick={() => handleCategoryClick(idx)}
            className={`min-w-fit text-[14px] md:text-[15px] whitespace-nowrap font-semibold relative px-5 py-4 ${
              selected === idx ? 'text-black' : 'text-gray-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
      

      {/* --- Sections produits --- */}
      <div className="mt-10 px-4">
        {isLoading ? (
            Array(2).fill().map((_, sectionIdx) => (
                <div key={sectionIdx} className="mb-10">
                  <div className="h-6 w-[200px] bg-gray-200 animate-pulse rounded-md mb-5"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(2).fill().map((_, i) => (
                      <div key={i} className="flex border border-[#F3F3F3] rounded-2xl p-4">
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] bg-gray-200 animate-pulse rounded-xl ml-4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
        ) : 
            (
                productsMenus.map((item, index) => (
                    <div key={index} id={`section-${index}`} className="mb-10">
                      <h2 className="text-xl md:text-2xl font-bold font-Marcellus mb-5">{item.category}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.data.map((product, i) => (
                         <ProductCard key={i} product={product} setOpenCustomProd={setOpenCustomProd} setSelectedType={setSelectedType} type={item.type} setSelectedProduct={setSelectedProduct} />
                        ))}
                      </div>
                    </div>
                  ))
            )
           }
      </div>
      {openCustomProd && selectedType == 'Menu' && (
        <CustomMenu onClose={() => setOpenCustomProd(false)} menu={selectedProduct} restaurantId={restaurantId}  handleOpenMainProduct={handleOpenMainProduct} customizations={customizations}/>
      )}
      {openCustomProd && selectedType != 'Menu' && (
        <CustomProduct onClose={() => setOpenCustomProd(false)} product={selectedProduct} />
      )}

      { openMainProduct && selectedType == 'Menu' && <CustomMainProduct onClose={()=> goBackToMenu()} product={selectedProduct.mainProduct} customizations={customizations} setCustomizations={setCustomizations}/>}


    </div>
  )
}

export default MainMenu
