import React from 'react';

const Card = ({
  children,
  className = '',
  shadow = true,
  hover = true,
  padding = 'p-6',
  border = true,
  rounded = 'rounded-2xl'
}) => {
  const baseClasses = `
    bg-white backdrop-blur-sm
    ${border ? 'border border-gray-100' : ''}
    ${shadow ? 'shadow-lg' : ''}
    ${hover ? 'hover:shadow-2xl transition-all duration-300 hover:-translate-y-1' : ''}
    ${rounded}
    ${padding}
    ${className}
  `;

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default Card;