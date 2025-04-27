import React from 'react'
import _ from 'lodash'

const MenuHero = ({ restaurant }) => {
  const isLoading = !restaurant || Object.keys(restaurant).length === 0
  
  return (
    <div className='mt-[30px]'>
      {/* Mobile View */}
      <div className='flex flex-col gap-8 items-center lg:hidden'>
        {isLoading ? (
          <>
            <div className='w-full h-[200px] bg-gray-200 animate-pulse rounded-xl' />
            <div className='w-full px-7 md:px-14 flex flex-col items-center gap-3'>
              <div className='w-2/3 h-6 bg-gray-200 animate-pulse rounded-md' />
              <div className='w-full h-16 bg-gray-200 animate-pulse rounded-md' />
            </div>
          </>
        ) : (
          <>
            <img src={restaurant.heroImage} className='homeImage z-0 w-full h-auto' alt='hero Image' />
            <div className='homeContent flex flex-col text-center gap-3 w-full z-20'>
              <h1 className='font-Marcellus font-extralight text-[29px] px-7 md:px-14 text-primary'>
                {_.capitalize(restaurant.name)}
              </h1>
              <h4 className='font-Pacifico px-9 my-5 md:px-20 text-[14px] md:text-[18px] leading-[30px] md:leading-[30px]'>
                {restaurant.description}
              </h4>
            </div>
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className='gap-44 hidden lg:flex px-16 py-10 items-center'>
        {isLoading ? (
          <>
            <div className='w-1/2 flex flex-col gap-11'>
              <div className='w-2/3 h-10 bg-gray-200 animate-pulse rounded-md' />
              <div className='w-full h-24 bg-gray-200 animate-pulse rounded-md' />
            </div>
            <div className='w-1/2 h-[300px] bg-gray-200 animate-pulse rounded-xl' />
          </>
        ) : (
          <>
            <div className='homeContent flex flex-col text-start gap-11 w-1/2'>
              <h1 className='font-Marcellus font-extralight text-[42px] text-primary'>
                {_.capitalize(restaurant.name)}
              </h1>
              <h4 className='font-Pacifico text-[18px] leading-[50px]'>
                {restaurant.description}
              </h4>
            </div>
            <div className='w-1/2'>
              <img src={restaurant.heroImage} className='homeImage h-auto' alt='hero Image' />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MenuHero
