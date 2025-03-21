import React from 'react';
import { Input } from 'antd';

const TextBox = ({ label, value, onChange, maxLength, minLength, required }) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ fontWeight: 'bold' }}>{label}</label>
      <Input
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
      />
    </div>
  );
};

export default TextBox;
