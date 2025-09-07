import React from 'react';

type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  primary?: boolean;
  size?: ButtonSize;
  label: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ primary = false, size = 'medium', label, onClick }) => {
  const fontSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        backgroundColor: primary ? '#1f6feb' : '#e5e7eb',
        color: primary ? '#fff' : '#111827',
        border: 'none',
        cursor: 'pointer',
        fontSize,
      }}
    >
      {label}
    </button>
  );
};

export default Button;
