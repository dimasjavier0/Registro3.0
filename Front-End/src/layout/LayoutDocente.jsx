import React from 'react'
import HeaderDocente from '../components/HeaderDocente'
import { Outlet } from 'react-router-dom'

function LayoutDocente() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderDocente/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutDocente