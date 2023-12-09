import React from 'react'

function VistaPrincipal() {
    return (
        <>
        <div className=' mt-36 flex justify-center mb-28  pt-principalcentro'>
        <img 
        className='hover:scale-130'
        src="/img/UNAH-version-horizontal.png" alt="UNAH-version-horizontal" />
        </div>
        <footer className="bg-gray-700 text-white py-6  text-center img-footer">
        <div className='grid grid-rows-2 '>
            
            <div className='row-span-1'>
                <p className="mb-2">© UNIVERSIDAD NACIONAL AUTÓNOMA DE HONDURAS</p>
            </div>

            <div className='row-span-1 mt-3  '>
                <p> Bulevar Suyapa, Tegucigalpa, M.D.C, Honduras, Centroamérica
                    2216-6100, 2216-5100, 2216-3000, 2216-7000</p>
            </div>
            <div className='mt-10 mb-5 pd-footer'>
                <div className='flex items-center justify-between '>
                <div className="width-45 border-b"></div>
                <div>
                    <a 
                    href="https://www.facebook.com/unahoficial"
                    className="mr-4 ">
                    <i className="fa-brands fa-facebook-f fa-bounce text-xl iconos"></i>
                    </a>

                    <a href="https://twitter.com/unahoficial"  
                    className="mr-4">
                    <i className="fa-brands fa-twitter fa-bounce text-xl"></i>
                    </a>

                    <a href="https://www.instagram.com/unahoficial" 
                    className="mr-4">
                    <i className="fab fa-instagram fa-bounce text-xl"></i>

                    </a>
                    <a href="https://www.linkedin.com/school/unahoficial"  
                    className="mr-4">
                    <i className="fab fa-linkedin-in fa-bounce text-xl"></i>
                    </a>
                </div>
                <div className="width-45 border-b"></div>
                </div>
            </div>
        </div>
        </footer>

        </>
        
    )
}

export default VistaPrincipal
