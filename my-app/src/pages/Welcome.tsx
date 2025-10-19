export default function Welcome() {
    return (
        <div>
          <h1>Welcome to ArtFridge!</h1>
          <p>*Title is tentative</p>
          <img  src="/" alt="Fridge image" style={{ width: "300px", height: "auto", borderRadius: "8px" }}></img>
          <br></br> 
          <button type="button" style={{
                width: "160px",       // fixed width
                padding: "10px 0",
                fontSize: "16px",       // text size
                borderRadius: "5px",    // rounded corners
                backgroundColor: "#353581", // optional color
                color: "white"          // text color
            }}>Sign Up</button> <br></br>
            <br></br>
          <button type="button" style={{
                width: "160px",       // fixed width
                padding: "10px 0",
                fontSize: "16px",       // text size
                borderRadius: "5px",    // rounded corners
                backgroundColor: "#5299BF", // optional color
                color: "white"          // text color
            }} >Log In</button>
        </div>
        
      )
}