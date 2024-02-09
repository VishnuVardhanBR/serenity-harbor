import React from 'react'
import Logo from "../static/logo-text.png";

const Description = () => {
    const description=["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui.", "Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui.", "Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui."]
    const images=[Logo, Logo, Logo]
    return (
    <div className='w-full justify-center items-center'>
            {description.map((item, index) => {
                if (index % 2 === 0) {
                    return (
                        <div key={index} className="w-full flex justify-center items-center mt-10">
                            <div className="w-[60%] flex justify-center items-center gap-5">
                                <div className="flex flex-col w-3/4 gap-2 items-center">
                                    <p className="text-xl font-semibold leading-[2]">
                                        {item}
                                    </p>
                                </div>
                                <div className="w-1/4">
                                    <img src={images[index]} alt="logo" className=" w-full h-full" />
                                </div>
                            </div>
                        </div>
                    )
                }
                else {
                    return (
                        <div key={index} className="w-full flex justify-center items-center mt-10">
                            <div className="w-[60%] flex justify-center items-center gap-5">
                                <div className="w-1/4">
                                    <img src={images[index]} alt="logo" className=" w-full h-full" />
                                </div>
                                <div className="flex flex-col w-3/4 gap-2 items-center">
                                    <p className="text-xl font-semibold leading-[2]">
                                        {item}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            })}
    </div>
  )
}

export default Description
