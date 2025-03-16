import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { WidgetType } from "./constants";

// Widget configuration modal
const ConfigureWidgetModal = ({
  widgetType,
  onSave,
  onBack,
  onClose,
}: {
  widgetType: WidgetType;
  onSave: (config: { title: string; description: string }) => void;
  onBack: () => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(() => {
    if (widgetType.id === "yotpo-metric") return "Clicked";
    if (widgetType.id === "iterable-metric") return "Opened message";
    return widgetType.title;
  });

  const [description, setDescription] = useState(() => {
    if (widgetType.id === "yotpo-metric")
      return "Number of provided identities who clicked on emails for the selected time period.";
    if (widgetType.id === "iterable-metric")
      return "Number of provided identities who opened emails during the selected time period.";
    return widgetType.description;
  });

  // Check if form is valid - require both title and description to be non-empty
  const isFormValid = title.trim() !== "" && description.trim() !== "";

  const handleSave = () => {
    if (isFormValid) {
      onSave({ title, description });
    }
  };

  // Get display content based on widget type
  const getWidgetDisplayContent = () => {
    if (widgetType.id === "yotpo-metric") {
      return {
        title: "CLICKED",
        icon: (
          <div className="bg-green-200 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
            <span role="img" aria-label="email">
              ✉️
            </span>
          </div>
        ),
        value: "0",
        description:
          "Number of provided identities who clicked on emails for the selected time period.",
      };
    }

    if (widgetType.id === "iterable-metric") {
      return {
        title: "OPENED MESSAGE",
        icon: (
          <div className="bg-blue-200 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
            <span role="img" aria-label="envelope">
              📨
            </span>
          </div>
        ),
        value: "0",
        description:
          "Number of provided identities who opened emails during the selected time period.",
      };
    }

    // Default for identities-provided
    return {
      title: "IDENTITIES PROVIDED",
      icon: (
        <div className="bg-yellow-200 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
          A
        </div>
      ),
      value: "0",
      description: "New identities provided during the selected time period.",
    };
  };

  const displayContent = getWidgetDisplayContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Configure widget
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
          Add a title and select data to display on the overview page.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="uppercase text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {displayContent.title}
            </div>
            <div className="flex items-center">
              {displayContent.icon}
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {displayContent.value}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {displayContent.description}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Widget type
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {widgetType.title} - TEXT
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="widget-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="widget-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="widget-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="widget-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-md ${
              isFormValid
                ? "bg-primary text-white cursor-pointer"
                : "bg-gray-300 text-white cursor-not-allowed opacity-70"
            }`}
            disabled={!isFormValid}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureWidgetModal; 