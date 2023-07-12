interface Props {
  children : React.ReactNode;
}

function PromptForm ({children} : Props) {
  return (
    <>
        <input
          type="text"
          className="form-control"
          id="basic-url"
          placeholder={String(children)}
        ></input>
    </>
  );
};

export default PromptForm;
