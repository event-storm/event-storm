import React from 'react';

function Button({
  children,
  className,
  ...rest
}) {
  return (
    <button className={`${className} example-button`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
