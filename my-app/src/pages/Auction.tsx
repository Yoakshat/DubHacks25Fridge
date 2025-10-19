import { useLocation } from "react-router-dom";
import React, { useState } from "react";

// big fat iamge
export default function Auction(){
    const imgInfo = useLocation(); 
    const {imgSrc} = imgInfo.state || {};

    const [amount, setAmount] = useState(50); // initial value
    const [satisfied, setSatisfied] = useState(false); 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    // create a function (if satisified, then activate visa/some payment library)
    
    console.log("Image source: ", imgSrc)

    // flex: makes a horizontal grid (you can add spacing)
    return (
        <div>
            {imgSrc && <img src={imgSrc}
                             style={{height:'30vh', width: 'auto'}} />} 
            <div 
                style={{
                    position: "relative",
                    top: "-70px", // become a reference point for piggy bank
                }}
            >

                <img src="src/assets/coin.png"
                style={{width: "150px", height: "150px"}}/>

                <div
                    style={{
                        position:"absolute",
                        bottom: "-150px", 
                        left: "50px",  
                    }}
                >
                    <img src="src/assets/piggy.png"
                    style={{width: "300px", height: "300px"}}/> 
                </div>
            </div>
            
        
            <div
                style = {{
                    padding: 100,
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px" 
                }}
            >
                 <input
                    type="range"
                    min={0}
                    max={100}
                    value={20}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    height: "10px",
                    borderRadius: "5px",
                    background: `linear-gradient(to right, gold 0%, gold ${(amount)}%, #ccc ${amount}%, #ccc 100%)`,
                    outline: "none",
                    appearance: "none",
                    }}
                />
                
                <style>
                {`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 0px;
                    height: 0px;
                    cursor: pointer;
                }
                input[type=range]::-moz-range-thumb {
                    width: 0px;
                    height: 0px;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                }
                `}


                </style>
                
                <label>
                    <input
                        type="checkbox"
                        checked={satisfied}
                        onChange={() => setSatisfied(!satisfied)}
                    />
                </label>

                
            </div>

        </div> 
    )

}