import "../App.css";
import { useState } from "react";
import { Configuration, CreateImageRequestSizeEnum, OpenAIApi } from "openai";

interface Props {
  size: string;
}

function Dalle({ size }: Props) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [placeholder, setPlaceholder] = useState(
    "Enter a prompt to generate an image"
  );

  const configuration = new Configuration({
    apiKey: "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"
  });

  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setPlaceholder(`${prompt}..`);
    setLoading(true);

    try {
      const res = await openai.createImage({
        prompt: prompt,
        n: 4,
        size: size as CreateImageRequestSizeEnum,
      });
      console.log("res:", res);
      setLoading(false);
      setResult(res.data.data.map((item: any) => String(item.url)));
    } catch (error: any) {
      setLoading(false);
      console.error(
        `Error generating image: ${error.response.data.error.message}`
      );
    }
  };

  return (
    <div className="container">
      {loading ? (
        <>
          <h3>Generating image... Please Wait...</h3>
        </>
      ) : (
        <>
          <h2>Generate an Image using OpenAI</h2>

          <input
            type="text"
            className="form-control"
            id="basic-url"
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
          ></input>
          <br></br>
          <button className="btn btn-primary p-1" onClick={generateImage} disabled={!size && !prompt}>
            Generate
          </button>
          <br></br>
          <br></br>
          {result.length > 0 ? (
            <div className="row">
              {result.map((image: any, index: number) => (
                <div className="col-lg-4 p-2" key={index}>
                  <div className="image-container">
                    <img className="img-fluid" src={image} alt="result" />
                    <a
                      href={image}
                      download={`${image}_filename.jpg`}
                      className="download-button"
                    ></a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default Dalle;
