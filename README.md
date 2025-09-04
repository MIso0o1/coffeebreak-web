# Coffee Break Escape

## Overview

Coffee Break Escape is a web-based application built with React that offers a collection of engaging mini-games and activities designed to provide a fun and refreshing break from daily tasks. It includes games like "The Daily Grind," "Procrastination Station," "Mug Shot Challenge," "True Color Game," "Unique Game," "Reaction Time Game," and "Useless Facts."

## Features

*   **The Daily Grind:** A clicker game where players grind coffee beans while avoiding distractions.
*   **Procrastination Station:** A narrative-driven game where players make choices that reflect common procrastination scenarios.
*   **Mug Shot Challenge:** A target-shooting game where players aim to hit moving coffee mugs.
*   **True Color Game:** A game testing color perception.
*   **Unique Game:** A game challenging players to find unique elements.
*   **Reaction Time Game:** A game measuring and improving reaction speed.
*   **Useless Facts:** Provides entertaining and random facts.
*   **Responsive Design:** Optimized for various screen sizes, including mobile.
*   **Cookie Consent:** Implements a cookie consent mechanism.

## Technologies Used

*   **Frontend:** React, Vite
*   **Styling:** Tailwind CSS, Radix UI
*   **Animation:** Framer Motion
*   **State Management:** React Hooks
*   **Routing:** React Router DOM

## Setup and Installation

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd coffee-break-escape
    ```

2.  **Install dependencies:**

    The project uses `pnpm` as its package manager. If you don't have `pnpm` installed, you can install it via npm:

    ```bash
    npm install -g pnpm
    ```

    Then, install the project dependencies:

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    This will start the development server, usually at `http://localhost:5173`.

4.  **Build for production:**

    To create a production-ready build, run:

    ```bash
    pnpm build
    ```

    The build artifacts will be located in the `dist/` directory.

## Project Structure

```
coffee-break-escape/
├── public/
│   └── assets/             # Static assets like images and favicons
├── src/
│   ├── assets/             # Game-specific images and icons
│   ├── components/         # Reusable React components
│   │   └── ui/             # UI components from Radix UI/Shadcn UI
│   ├── data/               # Data files for games (e.g., uselessFacts.js)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global CSS styles
│   └── main.jsx            # Entry point of the React application
├── .eslintrc.js            # ESLint configuration
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── pnpm-lock.yaml          # pnpm lock file
└── vite.config.js          # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.

## License

This project is open-source and available under the MIT License.

