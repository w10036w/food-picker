import React, { useState } from 'react';
import Select, { Option } from 'rc-select';
import './index.scss';

interface Language {
  label: string;
  value: string;
  flag?: string;
}

interface Props {
  showAutoDetect?: boolean
}

const languageOptions: Language[] = [
  { label: 'Auto detect', value: 'auto', flag: '🌍' },
  { label: 'English', value: 'en', flag: '🇬🇧' },
  { label: 'Simplified Chinese', value: 'zh-cn', flag: '🇨🇳' },
  { label: 'Traditional Chinese', value: 'zh-hk', flag: '🇭🇰' },
  { label: 'Spanish', value: 'es', flag: '🇪🇸' },
  { label: 'French', value: 'fr', flag: '🇫🇷' },
  { label: 'German', value: 'de', flag: '🇩🇪' },
  { label: 'Japanese', value: 'jp', flag: '🇯🇵' },
];

const LanguageSelect = (props: Props) => {
  const { showAutoDetect = true } = props
  const [selectedLanguage, setSelectedLanguage] = useState<string>();

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  return (
    <Select
      value={selectedLanguage}
      onChange={handleLanguageChange}
      placeholder="Select a language"
      showSearch
    >
      {languageOptions.map((option: Language) => {
        if(!showAutoDetect && option.value === 'auto') return null
        return (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        )
      })}
    </Select>
  );
};

export default LanguageSelect;
