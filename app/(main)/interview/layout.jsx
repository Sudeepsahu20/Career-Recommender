import React, { Suspense } from 'react'
import {DotLoader} from 'react-spinners'

const Layout = ({children}) => {
  return (
    <div className='px-5'>
            <Suspense 
            fallback={<DotLoader className='mt-4' width={'100%'} color='gray'/>}>
                {children}
            </Suspense>
            </div>
  )
}

export default Layout