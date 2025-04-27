import React from 'react'
import SubwayLogo from '../assets/SubwayLogo.svg'

const Restaurants = () => {
  return (
    <div className='flex flex-col py-16 px-8 font-Inter'>
        <h1 className='text-[24px] lg:text-[30px] font-semibold text-center'>Votre pause déjeuner entre de bonnes mains</h1>
        <ul className='mt-12 md:mt-20 grid grid-cols-2 gap-16 md:gap-8 md:grid-cols-4'>
            <li className='flex flex-col gap-4 mx-auto items-center w-[120px] md:w-[200px]'>
                <img src={SubwayLogo} className=''/>
                <h4 className='text-[10px] text-center text-gray-input'>60 Avenue des Gobelins, Paris 75013</h4>
            </li>
            <li className='flex flex-col gap-4 mx-auto items-center w-[120px] md:w-[200px]'>
                <img src={SubwayLogo} className=''/>
                <h4 className='text-[10px] text-center text-gray-input'>60 Avenue des Gobelins, Paris 75013</h4>
            </li>
            <li className='flex flex-col gap-4 mx-auto items-center w-[120px] md:w-[200px]'>
                <img src={SubwayLogo} className=''/>
                <h4 className='text-[10px] text-center text-gray-input'>60 Avenue des Gobelins, Paris 75013</h4>
            </li>
            <li className='flex flex-col gap-4 mx-auto items-center w-[120px] md:w-[200px]'>
                <img src={SubwayLogo} className=''/>
                <h4 className='text-[10px] text-center text-gray-input'>60 Avenue des Gobelins, Paris 75013</h4>
            </li>
        </ul>
    </div>
  )
}

export default Restaurants