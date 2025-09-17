import { useEffect, useState } from 'react';

export function useScreenSizer() {
  const [expandAt, setExpandAt] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) setExpandAt(2);
      else if (window.innerWidth < 1224) setExpandAt(3);
      else setExpandAt(3);
    };

    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return expandAt;
}