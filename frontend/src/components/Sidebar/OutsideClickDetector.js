import React, { useRef, useEffect } from 'react';

export const OutsideClickDetector = ({ children, handleClickOutside }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        handleClickOutside();
      }
    };

    document.addEventListener('click', handleClick);

    // Cleanup 
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClickOutside]);

  return (<div ref={wrapperRef}>{children}</div>);
};

