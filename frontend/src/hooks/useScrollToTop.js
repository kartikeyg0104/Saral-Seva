import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for scroll management on route changes
 * @param {Object} options - Scroll configuration options
 * @param {boolean} options.smooth - Use smooth scrolling (default: true)
 * @param {number} options.delay - Delay before scrolling in ms (default: 0)
 * @param {Array} options.excludeRoutes - Routes to exclude from auto-scroll
 * @param {number} options.offset - Scroll offset from top in pixels (default: 0)
 */
export const useScrollToTop = (options = {}) => {
  const {
    smooth = true,
    delay = 0,
    excludeRoutes = [],
    offset = 0
  } = options;

  const { pathname } = useLocation();

  useEffect(() => {
    // Skip scroll for excluded routes
    if (excludeRoutes.includes(pathname)) {
      return;
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: offset,
        left: 0,
        behavior: smooth ? 'smooth' : 'instant'
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [pathname, smooth, delay, excludeRoutes, offset]);
};

/**
 * Utility function to scroll to top programmatically
 * @param {boolean} smooth - Use smooth scrolling (default: true)
 * @param {number} offset - Scroll offset from top (default: 0)
 */
export const scrollToTop = (smooth = true, offset = 0) => {
  window.scrollTo({
    top: offset,
    left: 0,
    behavior: smooth ? 'smooth' : 'instant'
  });
};

/**
 * Utility function to scroll to a specific element
 * @param {string} elementId - ID of the element to scroll to
 * @param {boolean} smooth - Use smooth scrolling (default: true)
 * @param {number} offset - Additional offset from element (default: -80 for header)
 */
export const scrollToElement = (elementId, smooth = true, offset = -80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop + offset;
    window.scrollTo({
      top: elementPosition,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  }
};