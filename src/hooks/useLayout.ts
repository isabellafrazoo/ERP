import { useState, useEffect } from 'react';

interface LayoutState {
  contentHeight: number;
  headerHeight: number;
}

export function useLayout(): LayoutState {
  const [dimensions, setDimensions] = useState<LayoutState>({
    contentHeight: window.innerHeight - 64,
    headerHeight: 64,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        contentHeight: window.innerHeight - 64,
        headerHeight: 64,
      });
    }

    handleResize(); // Call immediately to set initial dimensions
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}