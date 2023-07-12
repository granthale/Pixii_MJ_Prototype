import { useState } from "react";
import "./App.css";

import SelectMenu from "./components/SelectMenu";
import Dalle from "./components/Dalle";
import Midjourney from "./components/Midjourney";
import Navbar from "./components/Navbar";

function App() {
  const [model, setModel] = useState("");
  const [size, setSize] = useState("");
  const models = ["OpenAI", "Midjourney"];
  const sizes = ["256x256", "512x512", "1024x1024"];

  const handleModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let model = String(event.target.value);
    setModel(model);
    console.log(model);
  };

  const handleSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let size = String(event.target.value);
    setSize(size);
    console.log(size);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="row">
        <div className="col-md-3">
          <main className="container mt-5">
            <div className="p-5">
              <h3>Models</h3>
              <label htmlFor="modelSelect">Select model:</label>
              <SelectMenu list={models} onChange={handleModel}>
                ----
              </SelectMenu>
              {model === "OpenAI" && (
                <>
                  <label htmlFor="modelSelect">Select size:</label>
                  <SelectMenu list={sizes} onChange={handleSize}>
                    ----
                  </SelectMenu>
                </>
              )}
            </div>
          </main>
        </div>
        <br />
        <div className="col-md-9 p-5">
          {model === "OpenAI" && (
            <>
              <div className="container mx-10">
                <header className="App-header">
                  <Dalle size={size}></Dalle>
                </header>
              </div>
            </>
          )}
          {model === "Midjourney" && (
            <>
              <div className="container mx-10">
                <header className="App-header">
                  <Midjourney></Midjourney>
                </header>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
