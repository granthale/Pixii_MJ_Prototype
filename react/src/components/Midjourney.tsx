import { useState } from "react";
import { TNL } from "tnl-midjourney-api";

interface Props {}

function Midjourney() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Enter a prompt to generate an image"
  );

  const TNL_API_KEY = "ebb307c7-960f-4bb9-991d-444f50c110e5";
  const tnl = new TNL(TNL_API_KEY);

  const generateImage = async () => {
    setLoading(true);
    try {
      //////////////// Python Automated Solution ////////////////
      // // Start the long-running task and receive the task ID
      // const startResponse = await fetch("http://127.0.0.1:5000/start_task", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ prompt: prompt }),
      // });
      ////////////////////////////////////////////////////

      //////////////// TNL Solution ////////////////
      const res = await tnl.imagine(prompt);
      console.log(res);
      /////////////////////////////.////////////////

      let taskStatus = await fetch(
        `http://127.0.0.1:5000/task_status/${prompt}`
      );
      let taskStatusData = await taskStatus.json();

      // Poll the task status until it's completed
      while (taskStatusData.status === "running") {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        taskStatus = await fetch(`http://127.0.0.1:5000/task_status/${prompt}`);
        taskStatusData = await taskStatus.json();
      }

      // Once the task is completed, retrieve the image
      if (taskStatusData.status === "completed") {
        const imageUrl = taskStatusData.image_path;
        setResult(`http://127.0.0.1:5000/static/${imageUrl}`);
        console.log(imageUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <>
            <h3>Generating image... Please wait...</h3>
            <p>
              {" "}
              This may take awhile, Midjourney images take longer to create
            </p>
          </>
        ) : (
          <>
            <h2>Generate an Image using Midjourney</h2>

            <input
              type="text"
              className="form-control"
              id="basic-url"
              placeholder={placeholder}
              onChange={(e) => setPrompt(e.target.value)}
            ></input>
            <br></br>
            <button className="btn btn-primary p-1" onClick={generateImage}>
              Generate
            </button>
            <br></br>
            <br></br>
            {result.length > 0 ? (
              <div className="row">
                <div className="image-container">
                  <div className="col-md-6">
                    <img
                      className="result-image"
                      width="512"
                      height="512"
                      src={result}
                      alt="result"
                    />
                    <a
                      href={String(result)}
                      download={result}
                      className="download-button"
                    ></a>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Midjourney;
