import React from 'react'
import HeaderSolicitudes from '../components/HeaderSolicitudes'
import { Outlet } from 'react-router-dom'

function LayoutSolicitudes() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderSolicitudes/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutSolicitudes