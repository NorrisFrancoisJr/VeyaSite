/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                deepGreen: '#2E2E2E', // Now Charcoal
                offWhite: '#D1D0CB', // Now Light Stone
                charcoal: '#2E2E2E',
                earth: '#6E6353',
                stone: '#A2A092',
                luxStone: '#D1D0CB',
                black: '#1E1E1E',
            },
            fontFamily: {
                serif: ['"Bodoni Moda"', 'serif'],
                sans: ['"Barlow Condensed"', 'sans-serif'],
                mono: ['"Barlow Condensed"', 'sans-serif'],
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-33.333333%)' },
                }
            },
            animation: {
                marquee: 'marquee 20s linear infinite',
            }
        },
    },
    plugins: [],
}
