import React from 'react';
import Textarea, { TextAreaProps } from 'rc-textarea';
import './index.scss';

interface Props extends TextAreaProps {
  value: string;
  onValueChange?: (value: string) => void;
}

const WordInput: React.FC<Props> = (props: Props) => {
  const { value, onValueChange, ...rest } = props;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <Textarea placeholder='please input word' value={value} onChange={handleChange} {...rest} />
  );
};

export default WordInput;