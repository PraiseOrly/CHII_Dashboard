import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        // HEMP brand — violet
        hemp: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",  // primary
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        // HENT brand — deep teal
        hent: {
          50:  "#edfafa",
          100: "#d5f5f6",
          200: "#afe9eb",
          300: "#74d7db",
          400: "#33bcc3",
          500: "#17a2ab",
          600: "#147f8a",
          700: "#0d6b72",  // primary
          800: "#0e5560",
          900: "#0f4650",
        },
        tremor: {
          brand: {
            faint:    "#edfafa",
            muted:    "#afe9eb",
            subtle:   "#33bcc3",
            DEFAULT:  "#0d6b72",
            emphasis: "#0e5560",
            inverted: "#ffffff",
          },
          background: {
            muted:    "#f9fafb",
            subtle:   "#f3f4f6",
            DEFAULT:  "#ffffff",
            emphasis: "#374151",
          },
          border:     { DEFAULT: "#e5e7eb" },
          ring:       { DEFAULT: "#0d6b72" },
          content: {
            subtle:   "#9ca3af",
            DEFAULT:  "#6b7280",
            emphasis: "#374151",
            strong:   "#111827",
            inverted: "#ffffff",
          },
        },
      },
      boxShadow: {
        "tremor-input":    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":     "0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)",
      },
      borderRadius: {
        "tremor-small":   "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full":    "9999px",
      },
      fontSize: {
        "tremor-label":   ["0.75rem",  { lineHeight: "1rem"    }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title":   ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric":  ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border|ring|fill|stroke)-(tremor|hent|hemp)-/ },
    {
      pattern:
        /^(bg|text|border|ring)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
  ],
  plugins: [],
};

export default config;
