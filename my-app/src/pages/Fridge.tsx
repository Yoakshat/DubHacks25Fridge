import { useNavigate } from "react-router-dom";

// compute the positions first, then place according to it
function getPositions(numImages: number, fridgeWidth: number, imageSize: number, gap: number){
    const magnetPos = [] 
    const padding = 72
    const perRow = Math.floor((fridgeWidth - padding) / (imageSize + gap));
    
    for (let i = 0; i < numImages; i++){
        const row = Math.floor(i / perRow); 
        const col = i % perRow

        const top = 50 + row * (imageSize + gap)
        const left = 100 + col * (imageSize + gap)

        magnetPos.push([top, left]);
    }

    return magnetPos
}

export default function Fridge(){
    // a bit of image-grabbing logic: grab the images that you have, 
    // and put on the fridge
    const images = ["kid1.jpeg", "kid2.jpeg", "kid5.jpg", "kid3.webp"] 
    const fridgeWidth = 400
    const imgSize = 80
    const fridgePositions: number[][] = getPositions(images.length, fridgeWidth, imgSize, 30)
    const navigate = useNavigate()
    // fridge renders and get the top corner (specify type)

    const zoomIn = (imgSrc: string) => {
        // should render new page and actually pass the image in 
        // with a piggy bank
        navigate("/auction", {state: {imgSrc: imgSrc}})
    }   

    return (
        // center the fridge
        // make the image extend the entire div
        // ref to the DOM object

        // parent relative and child absolute
        // place images on fridge grid

        // each kid's drawing should be a button and you an zoom in
        <div 
            className='fridge'
            style={{ position: "relative", width: `${fridgeWidth}px`}}
        >   

            <img 
                src="src/assets/kidfridge.png" 
                style={{ width: '100%', height: 'auto' }} 
            />
            
            <div> 
                {images.map((imgSrc, index) => (

                    // notice style is in the beginning tag
                    <button
                        style={{
                            position: "absolute",
                            // and potentially wrap around
                            top: `${fridgePositions[index][0]}px`, // grid positions
                            left: `${fridgePositions[index][1]}px`,
                            padding: 0,            
                            border: "none",         
                            background: "none", 
                            cursor: "pointer",
                        }}
                        onClick={() => zoomIn("src/assets/test_kid_images/" + imgSrc)}
                    >

                        <img
                            key={index}
                            src={'src/assets/test_kid_images/' + imgSrc}
                            alt={`Fridge magnet ${index}`}
                            style={{
                                width: `${imgSize}px`,
                                height:`${imgSize}px`,
                                objectFit: "cover",
                                border: "2px solid white",
                                borderRadius: "10px",
                            }}
                        />
                    </button> 
                ))}
            </div> 
        </div>
    )

    

}