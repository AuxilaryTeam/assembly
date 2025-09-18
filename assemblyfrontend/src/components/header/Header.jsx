import React from 'react'
import img from './Logo.png'


const Header = () => {
  return (
    <div  className='flex justify-center'>
    <div >
    <img src={img}  alt="" />
    <div className='flex justify-center'>
    <h1 className='font-bold my-3 mx-auto' >Customer receipt  </h1>
    {/* <button onClick={downloadpdf} data-html2canvas-ignore className='my-3 mx-10 bg-[#f1ab15] rounded p-0.5'>Download</button> */}
    </div>
    </div>


    
</div>
  )
}

export default Header