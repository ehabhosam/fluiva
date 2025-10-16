import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                aclonica: "Aclonica",
                "lilita-one": "Lilita One",
                primary: "Montserrat",
            },
            gridTemplateColumns: {
                "auto-fit": "repeat(auto-fit, minmax(140px, 1fr))",
            },
            backgroundImage: {
                "header-gradient":
                    "linear-gradient(90deg, #3B82F6 0%, #2DD4BF 100%)",
                "card-daily":
                    "linear-gradient(135deg, #34D399 0%, #2DD4BF 100%)",
                "card-sprint":
                    "linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)",
                "card-goals":
                    "linear-gradient(135deg, #60A5FA 0%, #FBBF24 100%)",
                "card-new": "linear-gradient(135deg, #C084FC 0%, #60A5FA 100%)",
                "button-primary":
                    "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)",
                "button-primary-hover":
                    "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
                "button-secondary":
                    "linear-gradient(90deg, #F97316 0%, #EC4899 100%)",
                "button-secondary-hover":
                    "linear-gradient(90deg, #EA580C 0%, #DB2777 100%)",
                "button-next":
                    "linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)",
                "button-next-hover":
                    "linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)",
                "button-accent":
                    "linear-gradient(90deg, #2DD4BF 0%, #34D399 100%)",
                "button-accent-hover":
                    "linear-gradient(90deg, #14B8A6 0%, #10B981 100%)",
                "overwhelm-banner":
                    "linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)",
                "button-generate":
                    "linear-gradient(90deg, #F97316 0%, #A78BFA 50%, #60A5FA 100%)",
                "button-generate-hover":
                    "linear-gradient(90deg, #EA580C 0%, #8B5CF6 50%, #3B82F6 100%)",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground":
                        "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground":
                        "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                // Custom Fluiva theme colors from images
                Fluiva: {
                    background: "#F8FAFC", // App background
                    foreground: "#334155", // Primary text
                    "muted-foreground": "#64748B", // Muted text
                    blue: "#60A5FA",
                    purple: "#A78BFA",
                    pink: "#EC4899",
                    orange: "#F97316",
                    green: "#34D399",
                    teal: "#2DD4BF",
                    yellow: "#FBBF24",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-out": {
                    "0%": { opacity: "1", transform: "translateY(0)" },
                    "100%": { opacity: "0", transform: "translateY(10px)" },
                },
                "pulse-gentle": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.8" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "fade-out": "fade-out 0.3s ease-out",
                "pulse-gentle":
                    "pulse-gentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config;
