import { useState, useCallback, useEffect, useRef } from 'react';
import { Widget } from '../components/dashboard/DashboardWidget';

interface DashboardGridOptions {
  gridSize?: number;
  initialWidgets: Widget[];
  onChange?: (widgets: Widget[]) => void;
}

interface GridState {
  widgets: Widget[];
  containerBounds: { width: number; height: number };
}

/**
 * Custom hook for managing dashboard grid layout functionality
 */
const useDashboardGrid = ({ 
  gridSize = 10, 
  initialWidgets,
  onChange
}: DashboardGridOptions) => {
  const [state, setState] = useState<GridState>({
    widgets: initialWidgets,
    containerBounds: { width: 0, height: 0 }
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update container bounds when resized
  const updateContainerBounds = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setState(prev => ({
        ...prev,
        containerBounds: { width: rect.width, height: rect.height }
      }));
    }
  }, []);
  
  // Update widget position
  const updateWidgetPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setState(prev => {
      const newWidgets = prev.widgets.map(widget => 
        widget.id === id 
          ? { ...widget, position } 
          : widget
      );
      
      if (onChange) {
        onChange(newWidgets);
      }
      
      return {
        ...prev,
        widgets: newWidgets
      };
    });
  }, [onChange]);
  
  // Update widget size
  const updateWidgetSize = useCallback((id: string, size: { width: number; height: number }) => {
    setState(prev => {
      const newWidgets = prev.widgets.map(widget => 
        widget.id === id 
          ? { ...widget, size } 
          : widget
      );
      
      if (onChange) {
        onChange(newWidgets);
      }
      
      return {
        ...prev,
        widgets: newWidgets
      };
    });
  }, [onChange]);
  
  // Check for widget collisions
  const checkCollision = useCallback((
    widgetId: string, 
    newPosition: { x: number; y: number },
    newSize?: { width: number; height: number }
  ) => {
    const widget = state.widgets.find(w => w.id === widgetId);
    
    if (!widget) return false;
    
    const widgetRect = {
      x: newPosition.x,
      y: newPosition.y,
      width: newSize ? newSize.width : widget.size.width,
      height: newSize ? newSize.height : widget.size.height
    };
    
    // Check collision with other widgets
    return state.widgets.some(otherWidget => {
      if (otherWidget.id === widgetId) return false;
      
      const otherRect = {
        x: otherWidget.position.x,
        y: otherWidget.position.y,
        width: otherWidget.size.width,
        height: otherWidget.size.height
      };
      
      return !(
        widgetRect.x + widgetRect.width < otherRect.x ||
        widgetRect.x > otherRect.x + otherRect.width ||
        widgetRect.y + widgetRect.height < otherRect.y ||
        widgetRect.y > otherRect.y + otherRect.height
      );
    });
  }, [state.widgets]);
  
  // Find a valid position for a widget (avoid collisions)
  const findValidPosition = useCallback((widgetId: string, size: { width: number; height: number }) => {
    const maxAttempts = 10;
    let attempts = 0;
    let position = { x: 20, y: 20 };
    
    const containerWidth = state.containerBounds.width || 800;
    const maxX = containerWidth - size.width - 20;
    
    while (checkCollision(widgetId, position) && attempts < maxAttempts) {
      // Try next position
      position.x += gridSize * 2;
      
      // If we hit the right edge, move down and reset X
      if (position.x > maxX) {
        position.x = 20;
        position.y += gridSize * 10;
      }
      
      attempts++;
    }
    
    return position;
  }, [checkCollision, gridSize, state.containerBounds.width]);
  
  // Add a new widget
  const addWidget = useCallback((widget: Omit<Widget, 'id' | 'position'>) => {
    const id = Date.now().toString();
    
    // Create new widget
    const newWidget: Widget = {
      ...widget,
      id,
      position: { x: 20, y: 20 }, // Initial position will be updated
      size: widget.size || { width: 300, height: 200 }
    };
    
    // Find a valid position
    const position = findValidPosition(id, newWidget.size);
    newWidget.position = position;
    
    // Add to state
    setState(prev => {
      const newWidgets = [...prev.widgets, newWidget];
      
      if (onChange) {
        onChange(newWidgets);
      }
      
      return {
        ...prev,
        widgets: newWidgets
      };
    });
    
    return newWidget;
  }, [findValidPosition, onChange]);
  
  // Remove a widget
  const removeWidget = useCallback((id: string) => {
    setState(prev => {
      const newWidgets = prev.widgets.filter(widget => widget.id !== id);
      
      if (onChange) {
        onChange(newWidgets);
      }
      
      return {
        ...prev,
        widgets: newWidgets
      };
    });
  }, [onChange]);
  
  // Update container bounds on window resize
  useEffect(() => {
    updateContainerBounds();
    
    const handleResize = () => {
      updateContainerBounds();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateContainerBounds]);
  
  // Update state when initialWidgets changes
  useEffect(() => {
    setState(prev => ({ ...prev, widgets: initialWidgets }));
  }, [initialWidgets]);
  
  return {
    widgets: state.widgets,
    containerRef,
    containerBounds: state.containerBounds,
    updateWidgetPosition,
    updateWidgetSize,
    addWidget,
    removeWidget,
    gridSize
  };
};

export default useDashboardGrid; 