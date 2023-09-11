import { Input } from "antd";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const EditableValue = (props: Props) => {
  const { value: defaultValue, onChange } = props;
  const [value, setValue] = useState(defaultValue);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const onClick = () => {
    setEditable(true);
  };
  const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    onChange(e.currentTarget.value);
    setEditable(false);
  };
  return editable ? (
    <Input
      style={{ width: defaultValue.length * 10 }}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      value={value}
    />
  ) : (
    <span onClick={onClick}>{value}</span>
  );
};

export default EditableValue;
