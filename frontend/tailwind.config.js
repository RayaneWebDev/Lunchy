/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily :{
        'Inter' : ['Inter', 'sans-serif'],
        'Marcellus' : ['Marcellus', 'sans-serif'],
        'Pacifico' : ['Pacifico' , 'sans-serif'],
        'Lato' : ['Lato' , 'sans-serif']
        
      },
      colors :{
        'primary' : '#119146',
        'primary-hover' : '#1EC162',
        'gray-nav' : "#969494",
        "gray-input" : "#8C8C8C",
        "green-testimonials" : "#79FFB1"
        
      }
    },  
  },
 
  plugins: [require('daisyui')]
}

