import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPlus } from "react-icons/fa";
import { logout } from "../features/auth/authSlice";
import {
  updateWidgetPosition,
  updateWidgetSize,
  updateWidgetContent,
  addWidget,
  Widget,
} from "../features/widgets/widgetsSlice";
import { RootState } from "../store/store";
import "react-resizable/css/styles.css";

import {
  DashboardWidget,
  DropArea,
  EditWidgetModal,
  AddWidgetModal,
  WIDGET_TYPES,
  applyDashboardStyles
} from "../components/dashboard";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { widgets } = useSelector((state: RootState) => state.widgets);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  const isAdmin = user?.view?.type === "ADMIN";

  const handleLogout = () => {
    dispatch(logout());
  };

  const handlePositionChange = (
    id: string,
    delta: { x: number; y: number }
  ) => {
    const widget = widgets.find((w) => w.id === id);
    if (widget) {
      const newPosition = {
        x: widget.position.x + delta.x,
        y: widget.position.y + delta.y,
      };
      dispatch(updateWidgetPosition({ id, position: newPosition }));
    }
  };

  const handleSizeChange = (
    id: string,
    size: { width: number; height: number }
  ) => {
    dispatch(updateWidgetSize({ id, size }));
  };

  const handleEditWidget = (widget: Widget) => {
    setEditingWidget(widget);
  };

  const handleSaveWidget = (id: string, title: string, description: string) => {
    dispatch(updateWidgetContent({ id, title, description }));
  };

  const handleAddWidget = (
    type: string,
    config?: { title: string; description: string }
  ) => {
    const widgetType = WIDGET_TYPES.find((t) => t.id === type);

    if (widgetType) {
      dispatch(
        addWidget({
          type: type as any,
          title: config?.title || widgetType.title,
          description: config?.description || widgetType.description,
          position: { x: 20, y: 20 },
          size: { width: 300, height: 200 },
          value: "0",
        })
      );
    }

    setIsAddingWidget(false);
  };

  // If no widgets are available, add default ones for member users
  useEffect(() => {
    if (widgets.length === 0 && user?.view?.type === "CLIENT") {
      // Add default widgets for member users
      WIDGET_TYPES.forEach((widgetType, index) => {
        dispatch(
          addWidget({
            type: widgetType.id as any,
            title: widgetType.title,
            description: widgetType.description,
            position: { x: 20, y: 20 + index * 220 },
            size: { width: 300, height: 200 },
            value: "0",
          })
        );
      });
    }
  }, [widgets.length, user, dispatch]);

  // Add custom CSS for resize handle and responsive behavior
  useEffect(() => {
    // Apply dashboard styles and get cleanup function
    const cleanupStyles = applyDashboardStyles();
    
    // Clean up when component unmounts
    return cleanupStyles;
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white"></h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddingWidget(true)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md"
              >
                <FaPlus className="mr-2" size={14} />
                Add Widget
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>

          <DropArea onDrop={handlePositionChange}>
            {widgets.length > 0 ? (
              widgets.map((widget) => (
                <DashboardWidget
                  key={widget.id}
                  widget={widget}
                  isAdmin={isAdmin}
                  onPositionChange={handlePositionChange}
                  onSizeChange={handleSizeChange}
                  onEdit={handleEditWidget}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
                <div className="text-gray-400 mb-4 text-center">
                  <p className="text-xl font-medium">No widgets available</p>
                  <p className="text-sm mt-2">
                    {isAdmin
                      ? "Add widgets to customize your dashboard."
                      : "Your dashboard is currently empty."}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setIsAddingWidget(true)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-md"
                  >
                    <FaPlus className="mr-2" size={14} />
                    Add Widget
                  </button>
                )}
              </div>
            )}
          </DropArea>
        </div>

        {editingWidget && (
          <EditWidgetModal
            widget={editingWidget}
            onSave={handleSaveWidget}
            onClose={() => setEditingWidget(null)}
          />
        )}

        {isAddingWidget && (
          <AddWidgetModal
            onAdd={handleAddWidget}
            onClose={() => setIsAddingWidget(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default DashboardPage;
