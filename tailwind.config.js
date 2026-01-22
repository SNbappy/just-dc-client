/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors (Deep Blue)
                primary: {
                    DEFAULT: '#1E40AF',
                    dark: '#1E3A8A',
                    light: '#3B82F6',
                },
                // Secondary Colors (Bold Red)
                secondary: {
                    DEFAULT: '#DC2626',
                    dark: '#991B1B',
                    light: '#EF4444',
                },
                // Neutral Colors
                dark: '#1F2937',
                gray: {
                    DEFAULT: '#6B7280',
                    light: '#F3F4F6',
                },
                // Status Colors
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Body text
                heading: ['Poppins', 'sans-serif'], // Headings
            },
        },
    },
    plugins: [],
}
