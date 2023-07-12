import "../App.css";
import { useState } from "react";
import { TNL } from "tnl-midjourney-api";

interface Props {}

function Midjourney() {
  //   const [prompt, setPrompt] = useState("");
  //   const [result, setResult] = useState("");

  //   const [loading, setLoading] = useState(false);

  //   const [placeholder, setPlaceholder] = useState(
  //     "Search for a lion with paint brushes painting the Mona Lisa..."
  //   );

  //   const TNL_API_KEY = "sk-ebb307c7-960f-4bb9-991d-444f50c110e5";
  //   const tnl = new TNL(TNL_API_KEY);
  //   const prompt = "A watercolor painting of a venetian canal";
  //   const res = tnl.imagine(prompt);
  //   console.log("res:", res);

  ////////////////////////////////////////////////////////////////////////
  var axios = require("axios").default;
  var data = JSON.stringify({
    msg: "A watercolor painting of a venetian canal",
    ref: "",
    webhookOverride: "",
  });

  var config = {
    method: "post",
    url: "https://api.thenextleg.io/v2/imagine",
    headers: {
      Authorization: "sk-ebb307c7-960f-4bb9-991d-444f50c110e5",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response: any) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error: any) {
      console.log(error);
    });
  ////////////////////////////////////////////////////////////////////////

  //   const generateImage = async () => {
  //     setPlaceholder(`${prompt}..`);
  //     setLoading(true);
  //     try {
  //       const prompt = "A watercolor painting of a venetian canal";
  //       const res = await tnl.imagine(prompt);
  //       console.log("res:", res);
  //       setLoading(false);
  //     //   setResult("Hello")
  //     } catch (error: any) {
  //       setLoading(false);
  //       console.error(
  //         `Error generating image: ${error.response.data.error.message}`
  //       );
  //     }
  //   };

  //   return (
  //     // <div className="container">
  //     //   {loading ? (
  //     //     <>
  //     //       <h3>Generating image... Please Wait...</h3>
  //     //     </>
  //     //   ) : (
  //     //     <>
  //     //       <h2>Generate an Image using Midjourney</h2>

  //     //       <input
  //     //         type="text"
  //     //         className="form-control"
  //     //         id="basic-url"
  //     //         placeholder={placeholder}
  //     //         onChange={(e) => setPrompt(e.target.value)}
  //     //       ></input>

  //     //       <button className="btn btn-primary p-1" onClick={generateImage}>
  //     //         Generate
  //     //       </button>
  //     //       <br></br>
  //     //       <br></br>
  //     //       {/* {result.length > 0 ? (
  //     //         <div className="row">
  //     //           {result.map((image: any, index: number) => (
  //     //             <div className="col-md-6" key={index}>
  //     //               <img className="result-image" src={image} alt="result" />
  //     //             </div>
  //     //           ))}
  //     //         </div>
  //     //       ) : (
  //     //         <></>
  //     //       )} */}
  //     //     </>
  //     //   )}
  //     // </div>
  //   );
  return <div></div>;
}

export default Midjourney;
