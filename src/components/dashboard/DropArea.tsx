import { useState, useRef, useEffect, useCallback } from "react";
import { useDrop } from "react-dnd";

// Dashboard drop area
const DropArea = ({
  children,
  onDrop,
}: {
  children: React.ReactNode;
  onDrop: (id: string, delta: { x: number; y: number }) => void;
}) => {
  // Use a state reference instead of ref.current for storing the DOM element
  // This avoids the "cannot assign to 'current'" error
  const [dropAreaElement, setDropAreaElement] = useState<HTMLDivElement | null>(
    null
  );
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });
  const [autoscrollDirection, setAutoscrollDirection] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const autoscrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor scroll position
  useEffect(() => {
    if (!dropAreaElement) return;

    const handleScroll = () => {
      setScrollPosition({
        top: dropAreaElement.scrollTop,
        left: dropAreaElement.scrollLeft,
      });
    };

    dropAreaElement.addEventListener("scroll", handleScroll);
    return () => {
      dropAreaElement.removeEventListener("scroll", handleScroll);
    };
  }, [dropAreaElement]);

  // Handle auto-scrolling when dragging near edges
  useEffect(() => {
    if (autoscrollDirection.x === 0 && autoscrollDirection.y === 0) {
      if (autoscrollIntervalRef.current) {
        clearInterval(autoscrollIntervalRef.current);
        autoscrollIntervalRef.current = null;
      }
      return;
    }

    if (!autoscrollIntervalRef.current && dropAreaElement) {
      autoscrollIntervalRef.current = setInterval(() => {
        dropAreaElement.scrollTop += autoscrollDirection.y * 10;
        dropAreaElement.scrollLeft += autoscrollDirection.x * 10;
      }, 50);
    }

    return () => {
      if (autoscrollIntervalRef.current) {
        clearInterval(autoscrollIntervalRef.current);
        autoscrollIntervalRef.current = null;
      }
    };
  }, [autoscrollDirection, dropAreaElement]);

  const [, drop] = useDrop<
    { id: string },
    { x: number; y: number } | undefined,
    unknown
  >({
    accept: "WIDGET",
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !dropAreaElement) return;

      const dropRect = dropAreaElement.getBoundingClientRect();
      const dropAreaHeight = dropRect.bottom - dropRect.top;
      const dropAreaWidth = dropRect.right - dropRect.left;

      // Edge detection constants (pixels from edge)
      const edgeThreshold = 50;

      // Calculate distances from edges
      const distanceFromTop = clientOffset.y - dropRect.top;
      const distanceFromBottom = dropRect.bottom - clientOffset.y;
      const distanceFromLeft = clientOffset.x - dropRect.left;
      const distanceFromRight = dropRect.right - clientOffset.x;

      // Set auto-scroll direction based on edge proximity
      let xDirection = 0;
      let yDirection = 0;

      if (distanceFromTop < edgeThreshold) {
        yDirection = -1;
      } else if (distanceFromBottom < edgeThreshold) {
        yDirection = 1;
      }

      if (distanceFromLeft < edgeThreshold) {
        xDirection = -1;
      } else if (distanceFromRight < edgeThreshold) {
        xDirection = 1;
      }

      setAutoscrollDirection({ x: xDirection, y: yDirection });
    },
    drop: (item, monitor) => {
      setAutoscrollDirection({ x: 0, y: 0 });
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return undefined;

      const x = Math.round(delta.x || 0);
      const y = Math.round(delta.y || 0);

      // Adjust for scroll position
      const adjustedDelta = {
        x: x + scrollPosition.left,
        y: y + scrollPosition.top,
      };

      onDrop(item.id, adjustedDelta);
      return adjustedDelta;
    },
  });

  // Create a ref callback that both updates our state and connects the drop ref
  const setDropAreaRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Apply the drop ref
      drop(node);
      // Update our state reference
      setDropAreaElement(node);
    },
    [drop]
  );

  return (
    <div
      ref={setDropAreaRef}
      className="relative min-h-[600px] w-full bg-gray-100 dark:bg-gray-900 rounded-lg p-4 shadow-sm overflow-auto"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      {children}

      {/* Visual indicator for autoscroll direction */}
      {autoscrollDirection.y !== 0 && (
        <div
          className={`absolute ${
            autoscrollDirection.y < 0 ? "top-0" : "bottom-0"
          } left-0 right-0 h-12 pointer-events-none z-40 ${
            autoscrollDirection.y < 0 ? "bg-gradient-to-b" : "bg-gradient-to-t"
          } from-primary/20 to-transparent`}
        />
      )}
      {autoscrollDirection.x !== 0 && (
        <div
          className={`absolute ${
            autoscrollDirection.x < 0 ? "left-0" : "right-0"
          } top-0 bottom-0 w-12 pointer-events-none z-40 ${
            autoscrollDirection.x < 0 ? "bg-gradient-to-r" : "bg-gradient-to-l"
          } from-primary/20 to-transparent`}
        />
      )}
    </div>
  );
};

export default DropArea; 