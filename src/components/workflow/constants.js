export const CATEGORY_COLORS = {
  Triggers: "#6366f1", // Indigo
  Actions: "#10b981", // Emerald
  Conditions: "#f59e0b", // Amber
  Loops: "#8b5cf6", // Violet
  Variables: "#ec4899", // Pink
  Default: "#64748b", // Slate
};

export const NODE_CATEGORIES = {
  "Webhook": "Triggers",
  "Schedule": "Triggers",

  "Send Email": "Actions",
  "Database Query": "Actions",
  "Chat Completion": "Actions",

  "If-Else": "Conditions",
  "Switch": "Conditions",

  "For Loop": "Loops",
  "While Loop": "Loops",

  "Set Variable": "Variables",
  "Get Variable": "Variables",
};
