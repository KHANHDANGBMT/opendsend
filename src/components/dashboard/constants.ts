// Widget types for the "Add Widget" modal
export const WIDGET_TYPES = [
  {
    id: "identities-provided",
    title: "Identities Provided",
    description: "Number of identities your store has provided to customers",
    icon: "👤",
  },
  {
    id: "iterable-metric",
    title: "Iterable Metric",
    description: "Number of provided identities who opened emails",
    icon: "📨",
  },
  {
    id: "yotpo-metric",
    title: "Yotpo Metric",
    description: "Number of provided identities who clicked on emails",
    icon: "✉️",
  },
];

export type WidgetType = (typeof WIDGET_TYPES)[0]; 