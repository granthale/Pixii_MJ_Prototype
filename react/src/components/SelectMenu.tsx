interface Props {
  children: React.ReactNode;
  list: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function SelectMenu({ children, list, onChange }: Props) {
  return (
    <select className="form-select" onChange={onChange}>
    <option defaultChecked>{children}</option>
      {list.map((model, index) => (
        <option key={index} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}

export default SelectMenu;
