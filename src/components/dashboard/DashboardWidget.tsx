import { useState, useRef } from "react";
import { useDrag } from "react-dnd";
import { ResizableBox } from "react-resizable";
import { FaEdit } from "react-icons/fa";
import { Widget } from "../../features/widgets/widgetsSlice";

// Widget component
const DashboardWidget = ({
  widget,
  isAdmin,
  onPositionChange,
  onSizeChange,
  onEdit,
}: {
  widget: Widget;
  isAdmin: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onEdit: (widget: Widget) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { id: widget.id, type: "WIDGET" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as {
        x: number;
        y: number;
      } | null;
      if (item && dropResult) {
        onPositionChange(widget.id, dropResult);
      }
    },
    canDrag: () => !isResizing, // Prevent dragging while resizing
  });

  // Apply the drag ref to the widget
  drag(ref);

  // Stop propagation of mouse events in the resize handle area to prevent conflicting with drag
  const handleResizeAreaMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    // Add event listeners to detect when resize operation ends
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : isResizing ? "se-resize" : "grab",
      }}
    >
      <div className={`relative ${isResizing ? "resizing" : ""}`}>
        <ResizableBox
          width={widget.size.width}
          height={widget.size.height}
          minConstraints={[200, 150]}
          maxConstraints={[800, 500]}
          resizeHandles={["se"]}
          onResizeStart={() => setIsResizing(true)}
          onResize={(_, data) => {
            // Real-time resize feedback can be added here if needed
          }}
          onResizeStop={(_, data) => {
            onSizeChange(widget.id, {
              width: data.size.width,
              height: data.size.height,
            });
            setIsResizing(false);
          }}
          className={`
            bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
            ${isAdmin ? "hover:ring-2 hover:ring-primary/50" : ""}
            ${isResizing ? "ring-2 ring-primary shadow-lg" : ""}
            ${isDragging ? "shadow-xl" : ""}
            transition-shadow duration-200
          `}
        >
          {/* Add a drag handle at the top for better UX */}
          {isAdmin && (
            <div
              className="absolute top-0 left-0 right-0 h-8 cursor-grab bg-transparent z-20 hover:bg-primary/5"
              title="Drag to move"
            />
          )}

          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {widget.title}
              </h3>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(widget);
                  }}
                  className="text-gray-500 hover:text-primary transition-colors"
                  aria-label="Edit widget"
                  title="Edit widget"
                >
                  <FaEdit size={18} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {widget.description}
            </p>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-5xl font-bold text-primary">
                {widget.value || "0"}
              </div>
            </div>

            {isAdmin && !isResizing && (
              <div
                className="absolute inset-0 opacity-0 cursor-pointer"
                onClick={(e) => {
                  // Only trigger if we're not dragging
                  if (!isDragging) {
                    e.stopPropagation();
                    onEdit(widget);
                  }
                }}
              />
            )}
          </div>
        </ResizableBox>

        {isAdmin && (
          <div
            className={`
              absolute bottom-0 right-0 w-10 h-10 
              ${
                isResizing
                  ? "bg-primary text-white"
                  : "bg-primary bg-opacity-20 text-primary dark:text-white hover:bg-opacity-30"
              }
              rounded-tl-md flex items-center justify-center z-10
              transition-all duration-200 ease-in-out
            `}
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 2L12 12M22 8V2H16M22 22L12 12M16 22H22V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Enhanced resize handle area with better UX */}
        {isAdmin && (
          <div
            className={`
              absolute bottom-0 right-0 w-16 h-16 cursor-se-resize z-20
              hover:bg-primary hover:bg-opacity-10 transition-colors duration-150
              ${isResizing ? "active-resize-handle" : ""}
            `}
            onMouseDown={handleResizeAreaMouseDown}
            title="Click and drag to resize"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardWidget; 