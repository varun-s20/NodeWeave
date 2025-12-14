# NodeWeave

NodeWeave is a powerful, visual workflow automation builder designed to streamline complex logic creation through an intuitive drag-and-drop interface. Built with modern web technologies, it offers a seamless experience for designing, connecting, and managing workflow nodes.

<img width="1835" height="910" alt="image" src="https://github.com/user-attachments/assets/398b5bc9-6f59-4f18-819e-712accb9ac91" />


## 🚀 Features

- **Visual Workflow Builder**: An infinite canvas that allows for unrestricted movement and organization of workflow steps.
- **Drag-and-Drop Interface**: Easily connect logic blocks by dragging nodes from the sidebar onto the canvas.
- **Smart Connections**: intuitive connection system allowing linking between Input and Output ports.
- **Node Persistence**: Your workflows are automatically saved to local storage, ensuring you never lose progress between sessions.
- **Context Management**: Right-click context menus on nodes for quick actions like deletion.
- **Categorized Logic**: Nodes are organized into distinct categories (Triggers, Actions, Conditions, Loops) with color-coded visual cues.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS3 with CSS Variables for consistent theming.
- **State Persistence**: Browser LocalStorage API.

## 📦 Installation & Setup

Follow these steps to get NodeWeave running on your local machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/varun-s20/nodeweave.git
   cd nodeweave
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to `http://localhost:5173` (or the port shown in your terminal) to view the app.

## 🎮 Usage Guide

### Adding Nodes

1. Visit the Sidebar categories (Triggers, Actions, etc.).
2. Drag a node (e.g., "Webhook" or "Send Email") onto the central canvas area.

### Connecting Nodes

1. Hover over a node to see its connection ports (dots).
2. Click and drag from an **Output** port (Right side) of one node.
3. Drop the connection line onto an **Input** port (Left side) of another node.

### Deleting Nodes

1. Click the "Three Dots" menu icon on the node header.
2. Select **Delete** to remove the node and its associated connections.

### Navigation

- Click and drag on the empty canvas space to **Pan** around the workflow.

## 📂 Project Structure

```
src/
├── components/
│   ├── workflow/
│   │   ├── Canvas.jsx       # Main workspace logic (Drag, Drop, Pan, Zoom)
│   │   ├── Node.jsx         # Individual node component
│   │   ├── Sidebar.jsx      # Node palette
│   │   ├── Connections.jsx  # SVG connection lines
│   │   └── constants.js     # Config for categories and colors
├── pages/
│   ├── BuilderPage/         # Layout for the builder view
│   └── LoginPage/           # Authentication screens
├── App.jsx                  # Main routing and layout
└── main.jsx                 # Entry point
```

🔗 **Live Demo:** [View NodeWeave in Action](https://nodeweave.vercel.app/)

