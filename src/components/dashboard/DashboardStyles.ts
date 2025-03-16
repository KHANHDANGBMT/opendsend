// Generate and apply dashboard-specific styles
export const applyDashboardStyles = (): () => void => {
  // Create a style element
  const styleEl = document.createElement("style");
  
  // Add enhanced CSS for the resize behavior and responsive drag-drop
  styleEl.innerHTML = `
    /* Make the resize handle more visible and interactive */
    .react-resizable-handle {
      position: absolute !important;
      bottom: 0 !important;
      right: 0 !important;
      width: 32px !important;
      height: 32px !important;
      display: block !important;
      background-image: none !important;
      cursor: se-resize !important;
      z-index: 30 !important;
      opacity: 0 !important;
    }
    
    /* Visual feedback during active resizing */
    .resizing {
      will-change: width, height;
    }
    
    .resizing .react-resizable-handle {
      opacity: 1 !important;
    }
    
    /* Highlight the resize handle when active */
    .active-resize-handle {
      background: rgba(0, 123, 255, 0.1) !important;
      border-top-left-radius: 50% !important;
    }
    
    /* Add a subtle resize indicator */
    .react-resizable {
      transition: box-shadow 0.2s ease-in-out;
    }
    
    /* Initial resize feedback */
    .react-resizable:active {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                  0 5px 10px -5px rgba(0, 0, 0, 0.04) !important;
    }
    
    /* Enhanced cursor area to make resizing easier */
    .react-resizable-handle:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      border-right: 3px solid rgba(0, 123, 255, 0.5);
      border-bottom: 3px solid rgba(0, 123, 255, 0.5);
    }
    
    /* Custom scrollbar for the drop area */
    .overflow-auto::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .overflow-auto::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .overflow-auto::-webkit-scrollbar-thumb {
      background: rgba(0, 123, 255, 0.3);
      border-radius: 4px;
    }
    
    .overflow-auto::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 123, 255, 0.5);
    }
    
    /* Improve drag-drop in scrollable container */
    .overflow-auto {
      scroll-behavior: smooth;
    }
  `;

  // Append to the head
  document.head.appendChild(styleEl);

  // Return a cleanup function
  return () => {
    if (document.head.contains(styleEl)) {
      document.head.removeChild(styleEl);
    }
  };
}; 