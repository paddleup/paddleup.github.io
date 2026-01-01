module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        "surface-highlight": "var(--surface-highlight)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        "text-accent": "var(--text-accent)",
        border: "var(--border)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-light": "var(--primary-light)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        teko: ["Teko", "sans-serif"]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
}
