
const backendDomain = import.meta.env.VITE_BACKEND_URL


const SummaryApi = {
    signUP : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signIN : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    },
    sendEmailContact : {
        url : `${backendDomain}/api/send-email-contact`,
        method : "post"
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    sendOtp : {
        url : `${backendDomain}/api/send-otp`,
        method : "post"
    },
    otpVerification : {
        url : `${backendDomain}/api/otp-verification`,
        method : "post"
    },
    resetPwd : {
        url : `${backendDomain}/api/reset-password`,
        method : "post"
    },
    updateProfile : {
        url : `${backendDomain}/api/update-profile`,
        method : 'post'
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomain}/api/all-user`,
        method : 'get'
    },
    blockUser : (userId) => (
        {
            url : `${backendDomain}/api/all-user/${userId}/block`,
            method : 'post'
        }
    ) ,
    createRestaurant : {
        url : `${backendDomain}/api/admin-panel/createRestaurant`,
        method : 'post'
    },
    getRestaurants : {
        url : `${backendDomain}/api/getRestaurants`,
        method : 'get'
    },
    getRestaurant : (restaurantId) => ({
        url : `${backendDomain}/api/getRestaurant/${restaurantId}`,
        method : 'get'
    }),
    updateRestaurantStatus : (restaurantId) => ({
        url : `${backendDomain}/api/admin-panel/updateRestaurantStatus/${restaurantId}`,
        method : 'post'
    }),
    getCategoriesByRestaurant : (restaurantId) => ({
        url : `${backendDomain}/api/getCategoriesByRestaurant/${restaurantId}`,
        method : 'get'
    }),
    addCategory : {
        url : `${backendDomain}/api/admin-panel/addCategory`,
        method : 'post'
    },
    getCategories : {
        url : `${backendDomain}/api/admin-panel/getCategories`,
        method : 'get'
    },
    createMenu : {
        url : `${backendDomain}/api/admin-panel/createMenu`,
        method : 'get'
    },
    getCustom : {
        url : `${backendDomain}/api/admin-panel/getCustom`,
        method : 'get'
    },
    createCustom : {
        url : `${backendDomain}/api/admin-panel/createCustom`,
        method : 'post'
    },
    editCustom : (customizationId) => (
        {
            url : `${backendDomain}/api/admin-panel/editCustom/${customizationId}`,
            method : 'put'
        }
    ) ,
    deleteCustom : (customizationId) => (
        {
            url : `${backendDomain}/api/admin-panel/deleteCustom/${customizationId}`,
            method : 'post'
        }
    ) ,

    getMenus : {
        url : `${backendDomain}/api/admin-panel/getMenus`,
        method : 'get'
    },
    getMenusByRestaurant : (restaurantId) => (
        {
            url : `${backendDomain}/api/admin-panel/getMenuByResto/${restaurantId}`,
            method : 'get'
        }
    ),
    getMenu : (menuId) => (
        {
            url : `${backendDomain}/api/admin-panel/menus/${menuId}`,
            method : 'get'
        }
    ),
    updateMenu : (menuId) => (
        {
            url : `${backendDomain}/api/admin-panel/updateMenu/${menuId}`,
            method : 'post'
        }
    ),
    deleteMenu : (menuId) => (
        {
            url : `${backendDomain}/api/admin-panel/deleteMenu/${menuId}`,
            method : 'post'
        }
    ),
    createMenu : {
        url : `${backendDomain}/api/admin-panel/createMenu`,
        method : 'post'
    },
    getProductsByRestaurant : (restaurantId) => (
        {
            url : `${backendDomain}/api/admin-panel/getProductsByResto/${restaurantId}`,
            method : 'get'
        }
    ),
    getProducts : {
        url : `${backendDomain}/api/admin-panel/getProducts`,
        method : 'get'
    },
    
    addProduct : {
        url : `${backendDomain}/api/admin-panel/addProduct`,
        method : 'post'
    },
    getProduct : (productId) => (
        {
            url : `${backendDomain}/api/admin-panel/products/${productId}`,
            method : 'get'
        }
    ),
    updateProduct : (productId) => (
        {
            url : `${backendDomain}/api/admin-panel/updateProduct/${productId}`,
            method : 'post'
        }
    ), 
    deleteProduct : (productId) => (
        {
            url : `${backendDomain}/api/admin-panel/deleteProduct/${productId}`,
            method : 'post'
        }
    ),
    getAllMenuByCat : (restaurantId) => (
        {
            url : `${backendDomain}/api/produits-par-categorie/${restaurantId}`,
            method : 'get'
        }
    ),
    getEvents : {
        url : `${backendDomain}/api/admin-panel/getEvents`,
        method : 'get'
    },
    createEvent : {
        url : `${backendDomain}/api/admin-panel/createEvent`,
        method : 'post'
    },
    generateFinaleInvoice : (eventId) => (
        {
            url : `${backendDomain}/api/admin-panel/events/generate-invoice/${eventId}`,
            method : 'get'
        }
    ),
    updateEventStatus : (eventId) => (
        {
            url : `${backendDomain}/api/admin-panel/events/updateStatus/${eventId}`,
            method : 'post'
        }
    ),
    deleteEvent : (eventId) => (
        {
            url : `${backendDomain}/api/admin-panel/events/deleteEvent/${eventId}`,
            method : 'delete'
        }
    ),
    updateEvent : (eventId) => (
        {
            url : `${backendDomain}/api/admin-panel/events/updateEvent/${eventId}`,
            method : 'post'
        }
    ),
    createReview : {
        url : `${backendDomain}/api/admin-panel/createReview`,
        method : 'post'
    },
    getReviews : {
        url : `${backendDomain}/api/admin-panel/getReviews`,
        method : 'get'
    },
    getReview : (reviewId) => (
        {
            url : `${backendDomain}/api/admin-panel/getReview/${reviewId}`,
            method : 'get'
        }
    ),
    updateReview : (reviewId) => (
        {
            url : `${backendDomain}/api/admin-panel/updateReview/${reviewId}`,
            method : 'post'
        }
    ),
    deleteReview : (reviewId) => (
        {
            url : `${backendDomain}/api/admin-panel/deleteReview/${reviewId}`,
            method : 'delete'
        }
    ),
    getAllOrders : {
        url : `${backendDomain}/api/getAllOrders`,
        method : 'get'
    },
    addToCart : {
        url : `${backendDomain}/api/addToCart`,
        method : 'post'
    },
    getUserCart : {
        url : `${backendDomain}/api/getUserCart`,
        method : 'get'
    },
    removeFromCart : (itemId) => (
        {
            url : `${backendDomain}/api/removeFromCart/${itemId}`,
            method : 'delete'
        }
    ),
    updateQuantityCart : (itemId) => (
        {
            url : `${backendDomain}/api/updateQuantityCart/${itemId}`,
            method : 'post'
        }
    ),
    clearCart : {
        url : `${backendDomain}/api/clearCart`,
        method : 'post'
    },
    countAddToCart : {
        url : `${backendDomain}/api/countAddToCart`,
        method : 'get'
    },
    getUserCart : {
        url : `${backendDomain}/api/getUserCart`,
        method : 'get'
    },
    getProductsByCategory : (restaurantId, categoryId) => (
        {
            url : `${backendDomain}/api/getProductsByCategory/${restaurantId}/${categoryId}`,
            method : 'get'
        }
    ),
    getMenusByCategory : (restaurantId, categoryId) => (
        {
            url : `${backendDomain}/api/getMenusByCategory/${restaurantId}/${categoryId}`,
            method : 'get'
        }
    ),

    createOrder : {
            url : `${backendDomain}/api/create-order`,
            method : 'post'
    },
    createPayment : {
        url : `${backendDomain}/api/create-checkout-session`,
        method : 'post' 
    },
    getUserOrders :  {
        url : `${backendDomain}/api/getUserOrders`,
        method : 'get'
    },
    updateOrderStatus : (orderId) => (
        {
            url : `${backendDomain}/api/updateOrderStatus/${orderId}`,
            method : 'post'
        }
    ),
    updateDeliveryDate : (orderId) => (
        {
            url : `${backendDomain}/api/updateDeliveryDate/${orderId}`,
            method : 'post'
        }
    ),
    createCompanyPayment : {
        url : `${backendDomain}/api/create-checkout-session-company`,
        method : 'post'
    },
    getTestimonials : {
        url : `${backendDomain}/api/getTestimonials`,
        method : 'get'
    },
    createTestimonial : {
        url : `${backendDomain}/api/createTestimonial`,
        method : 'post'
    },
    dashboardStats : {
        url : `${backendDomain}/api/dashboardStats`,
        method : 'get'
    },
    ordersPerDay : {
        url : `${backendDomain}/api/orders-per-day`,
        method : 'get'
    },
    ordersStatusStats : {
        url : `${backendDomain}/api/orders-status-stats`,
        method : 'get'
    },



    






   

}


export default SummaryApi