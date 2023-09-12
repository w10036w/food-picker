import { Input, InputRef, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const EditableValue = (props: Props) => {
  const { value: defaultValue, onChange } = props;
  const [value, setValue] = useState(defaultValue);
  const [editable, setEditable] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if(editable && inputRef.current) {
      inputRef.current.focus({
        cursor: 'start',
      })
    }
  }, [editable])

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
  const width = (textRef?.current?.getBoundingClientRect().width || 50) + 30
  return editable ? (
    <Input
      ref={inputRef}
      style={{ width }}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      value={value}
    />
  ) : (
    <Tooltip title="double click to change tab name">
      <span ref={textRef} onDoubleClick={onClick}>{value}</span>
    </Tooltip>
  );
};

export default EditableValue;
