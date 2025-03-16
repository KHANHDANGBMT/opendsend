import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { WIDGET_TYPES, WidgetType } from "./constants";
import ConfigureWidgetModal from "./ConfigureWidgetModal";

// Add widget modal
const AddWidgetModal = ({
  onAdd,
  onClose,
}: {
  onAdd: (
    type: string,
    config?: { title: string; description: string }
  ) => void;
  onClose: () => void;
}) => {
  const [selectedWidgetType, setSelectedWidgetType] = useState<WidgetType | null>(
    null
  );

  const handleWidgetTypeSelect = (type: string) => {
    const widgetType = WIDGET_TYPES.find((t) => t.id === type);
    if (widgetType) {
      setSelectedWidgetType(widgetType);
    }
  };

  const handleConfigureSave = (config: {
    title: string;
    description: string;
  }) => {
    if (selectedWidgetType) {
      onAdd(selectedWidgetType.id, config);
    }
  };

  // If a widget type is selected, show the configure modal
  if (selectedWidgetType) {
    return (
      <ConfigureWidgetModal
        widgetType={selectedWidgetType}
        onSave={handleConfigureSave}
        onBack={() => setSelectedWidgetType(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add a metric
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select a widget type to add to the overview page.
        </p>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-white">
            Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WIDGET_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={() => handleWidgetTypeSelect(type.id)}
                className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex flex-col items-center cursor-pointer hover:border-primary dark:hover:border-primary"
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-center">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {type.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              WIDGET_TYPES.length > 0
                ? handleWidgetTypeSelect(WIDGET_TYPES[0].id)
                : onClose()
            }
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal; 