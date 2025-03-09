import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to the top of the page when the route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Use 'auto' for instant scrolling without animation
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop; 