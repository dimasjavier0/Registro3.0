import React from 'react'
import HeaderJefeDpto from '../components/HeaderJefeDpto'
import { Outlet } from 'react-router-dom'

function LayoutJefeDpto() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderJefeDpto/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutJefeDpto