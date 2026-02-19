# Portfolio - Mohammed Yaseen Sutar

A high-performance, interactive portfolio showcasing dual expertise in **AI/ML Engineering** and **Backend Engineering**. 

This project features a unique **Dual-Layer Reveal System**, where content dynamically shifts based on user interaction and selection.

## 🌟 Key Features

### 1. Dual-Layer Experience (The "Reveal" Effect)
The portfolio is built around two distinct personas that coexist on the same page:
- **Front Layer (Default):** Represents the **Backend Engineer** persona. Clean, structured, and foundational.
- **Reveal Layer (Interactive):** Represents the **AI & ML Engineer** persona. Vibrant, creative, and forward-thinking.
- **Interaction:** Users can switch between these modes via the initial **Loading Screen** or explore both simultaneously using the **Spotlight Cursor**.

### 2. Interactive Loading Screen
- **Choice-Driven:** Users select their preferred journey ("Backend", "AI & ML", or "Both") right from the start.
- **Spotlight Effect:** A dynamic spotlight follows the cursor, illuminating options before entry.
- **Sticky Cursor:** The custom cursor magnetically "sticks" to options for a tactile feel.

### 3. Advanced Animations & Interactions
- **Custom Cursor:** A custom-built cursor with multiple states:
  - **Default:** Small dot.
  - **Hover:** Expands to a ring.
  - **Text Reveal:** In "Both" mode, the cursor acts as a lens, revealing the underlying AI/ML layer.
- **Smooth Scroll:** Integrated **Lenis Scroll** for buttery smooth navigation.
- **3D Elements:** Features a reactive **Distortion Sphere** (Three.js/React Three Fiber) that responds to cursor movement.
- **Framer Motion:** Extensive use of Framer Motion for page transitions, staggers, and entry animations.

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics:** [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)
- **Linting:** ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open locally:**
    Visit `http://localhost:5173` in your browser.

## 📂 Project Structure

```bash
src/
├── components/
│   ├── 3d/                 # Three.js components (DistortionSphere)
│   ├── layout/             # Layout components (Navbar, SideBar, Background)
│   ├── sections/           # Page sections (Hero, About, Projects, etc.)
│   └── ui/                 # Reusable UI elements (CustomCursor, LoadingScreen)
├── App.tsx                 # Main application logic & State Management
├── main.tsx                # Entry point
└── index.css               # Global styles & Tailwind directives
```

## 🎨 Customizing Content

- **Hero Section:** Edit `src/components/sections/Hero.tsx` to change the main headlines.
- **About Me:** Edit `src/components/sections/About.tsx`.
- **Experience/Projects:** Update the data arrays in their respective files in `src/components/sections/`.

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
