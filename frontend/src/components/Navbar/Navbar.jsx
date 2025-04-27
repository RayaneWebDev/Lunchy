import React, { useRef } from 'react'
import { useEffect, useState } from 'react'
import { Link , useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import cartIcon from '../../assets/cartIcon.svg'
import logo from '../../assets/logo.svg'
import './Navbar.css'
import Login from '../LoginPopup/Login'
import EmailVerification from '../EmailVerification'
import EnterEmail from '../EnterEmail'
import ResetPwd from '../ResetPwd'
import Cart from '../Cart'
import Livraison from '../Livraison'

const Navbar = ({fetchUserDetails, fetchCartCount, fetchUserCart , restaurants, cartCount , userProducts}) => {

  const [isSticky, setSticky] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showEmailVerif, setShowEmailVerif] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [cartOpen , setCartOpen] = useState(false)
  const [livraisonOpen , setLivraisonOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef(null);
  const location = useLocation()
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();




    useEffect(() => {
    
        const handleScroll = () => {
          const offset = window.scrollY;
          setSticky(offset > 0);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);



      const isActiveLink = (path) => {
        const params = new URLSearchParams(location.search);
        const restaurantParam = params.get("restaurant");
        const restaurantIdParam = params.get("restaurantId");
      
        // Si le chemin correspond à `/menu` et que les paramètres de la recherche correspondent
        if (location.pathname === '/menu' && restaurantParam === path.name && restaurantIdParam === path.id) {
          return 'text-primary';
        }
      
        // Si c'est une autre page
        if (location.pathname === path) {
          return 'text-primary';
        }
      
        return 'text-gray-nav';
      };
      


      const handleOpenLivraison = ()=>{
        setLivraisonOpen(true)
        setCartOpen(false)
      }

      const goBackToCart = () =>{
        setLivraisonOpen(false)
        setCartOpen(true)
      }

     

  return (
    <header className={`navbar bg-white px-[5%] fixed pt-3 z-30 transition-all duration-300 ease-in-out ${isSticky ? "shadow-md bg-base-100" : ""}`}>
    <div className='navbar-start z-50'>
    <div className="dropdown">
    {/* Bouton Hamburger */}
    <div
      ref={buttonRef}
      tabIndex={0}
      role="button"
      className="btn btn-ghost md:hidden pl-0"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="relative w-7 h-7 flex flex-col justify-center items-start">
        <span
          className={`block h-0.5 w-6 bg-primary transition-all duration-300 ease-in-out 
            ${isFocused ? 'rotate-45 translate-y-1' : '-translate-y-1'}
          `}
        ></span>
        <span
          className={`block h-0.5 w-3 bg-primary my-[2px] transition-all duration-300 ease-in-out 
            ${isFocused ? 'opacity-0' : 'opacity-100'}
          `}
        ></span>
        <span
          className={`block h-0.5 w-6 bg-primary transition-all duration-300 ease-in-out 
            ${isFocused ? '-rotate-45 -translate-y-1' : 'translate-y-1'}
          `}
        ></span>
      </div>
    </div>

    {/* Dropdown menu */}
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content space-y-2 rounded-box mt-3 w-52 p-2 shadow"
      style={{ position: 'absolute', zIndex: 50, background: 'white' }}
    >
      <li>
        <Link
          className={`${isActiveLink('/')} text-[15px]`}
          onClick={() => document.activeElement.blur()}
        >
          Accueil
        </Link>
      </li>
      <li className="mr-8">
        {Array.isArray(restaurants) && restaurants.length === 1 && restaurants[0]?.name && restaurants[0]?._id ? (
          <Link
            to={`/menu?restaurant=${restaurants[0].name}&restaurantId=${restaurants[0]._id}`}
            className={`${isActiveLink({ name: restaurants[0].name, id: restaurants[0]._id })} text-[15px]`}
            onClick={() => document.activeElement.blur()}
          >
            Menu
          </Link>
        ) : (
          <details>
            <summary className={`${isActiveLink('/menu')} text-[15px]`}>Menu</summary>
            <ul className="p-2 bg-white">
              {restaurants.map((restaurant, index) => (
                restaurant?.name && restaurant?._id && (
                  <li key={index}>
                    <Link
                      to={`/menu?restaurant=${restaurant.name}&restaurantId=${restaurant._id}`}
                      className={isActiveLink({ name: restaurant.name, id: restaurant._id })}
                      onClick={() => document.activeElement.blur()}
                    >
                      {restaurant.name}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </details>
        )}
      </li>
      <li>
        <Link
          to="/contact"
          className={`${isActiveLink('/contact')} text-[15px]`}
          onClick={() => document.activeElement.blur()}
        >
          Contact
        </Link>
      </li>
    </ul>
  </div>
      <Link to="/">
        <img src={logo} className='md:h-16 h-11'/>
      </Link>
    </div>
    <div className="navbar-center hidden space-x-5 md:flex">
      <ul className="menu menu-horizontal px-1 font-Marcellus">
        <li><Link to="/" className={`${isActiveLink('/')} mr-8`}>Accueil</Link></li>
        <li className='mr-8'>
        {Array.isArray(restaurants) && restaurants.length === 1 && restaurants[0]?.name && restaurants[0]?._id ? (
          // Un seul restaurant → lien direct
          <Link
            to={`/menu?restaurant=${restaurants[0].name}&restaurantId=${restaurants[0]._id}`}
            className={isActiveLink({ name: restaurants[0].name, id: restaurants[0]._id })}
          >
            Menu
          </Link>
        ) : (
          // Plusieurs restaurants → dropdown
          <details>
            <summary className={isActiveLink('/menu')}>
              Menu
            </summary>
            <ul className="p-2 bg-white">
              {restaurants.map((restaurant, index) => (
                restaurant?.name && restaurant?._id && (
                  <li key={index}>
                    <Link
                      to={`/menu?restaurant=${restaurant.name}&restaurantId=${restaurant._id}`}
                      className={isActiveLink({ name: restaurant.name, id: restaurant._id })}
                    >
                      {restaurant.name}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </details>
        )}
      </li>
      

        <li><Link to="/contact" className={`${isActiveLink('/contact')} mr-8`}>Contact</Link></li>
      </ul>
    </div>
    <div className="navbar-end gap-5">
      {user != null ? (
        <div className="relative flex items-center gap-6 md:mr-5 hover:bg-slate-200 p-2 rounded-full transition duration-300 ease-in-out" onClick={()=>setCartOpen(true)}>
        <button>
          <img src={cartIcon} alt="Cart" className="min-w-[20px] max-w-[23px] flex-none"  />
        </button>
        {cartCount > 0 && (
          <div className="absolute flex justify-center items-center text-[12px] md:text-[12px] text-white h-[17px] w-[17px] bg-primary rounded-full font-semibold -top-[2px] -right-[2px]">
            {cartCount}
          </div>
        )}
      </div>
      
      ) : ""}
      {user && user?._id  
        ? (
        <button
          className="btn px-5 py-2 font-Lato border border-primary bg-transparent hover:bg-primary text-primary hover:text-white md:py-[10px] md:px-[30px] rounded-[50px] cursor-pointer transition duration-[0.3s]" onClick={()=>navigate("/moncompte")}>
          Mon Compte
        </button>
        ): (
        <button
        className="btn font-[500] min-w-20 lg:min-w-32 px-5 py-2 font-Lato border-none bg-primary hover:bg-primary-hover text-white md:py-[10px] md:px-[30px] rounded-[50px] cursor-pointer transition duration-[0.3s]"
        onClick={() => setShowLogin(true)}
        >
        Se connecter
      </button>
      )}
    </div>

        {showLogin && <Login setShowLogin={setShowLogin} setShowSignUp={setShowSignup} setShowLogout={setShowLogout} setShowSendEmail={setShowSendEmail} fetchUserDetails={fetchUserDetails} fetchCartCount={fetchCartCount} />}
        {showEmailVerif && <EmailVerification setShowEmailVerif={setShowEmailVerif} setShowResetPwd={setShowResetPwd}/>}
        {showSendEmail && <EnterEmail setShowSendEmail={setShowSendEmail} setShowEmailVerif={setShowEmailVerif}/>}
        {showResetPwd && <ResetPwd setShowResetPwd={setShowResetPwd}/>}
        {cartOpen && <Cart userProducts={userProducts} onClose={()=>setCartOpen(false)} fetchCartCount={fetchCartCount} fetchUserCart={fetchUserCart} handleOpenLivraison={handleOpenLivraison}/>}
        {livraisonOpen && <Livraison onClose={()=>setLivraisonOpen(false)} goBackToCart={goBackToCart}/>}
    </header>
  )
}

export default Navbar