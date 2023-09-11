import React from 'react';
import Input, { InputProps } from 'rc-input';
import './index.scss';

interface Props extends InputProps {
  value: string;
  error?: string;
  onValueChange?: (value: string) => void;
}

const KeyInput: React.FC<Props> = (props: Props) => {
  const { value, onValueChange, error, ...rest } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <div className='input-wrapper'>
      <Input placeholder='please input Key' value={value} onChange={handleChange} {...rest} />
      {!!error && <span className='err-msg'>{error}</span>}
    </div>
  );
};

export default KeyInput;