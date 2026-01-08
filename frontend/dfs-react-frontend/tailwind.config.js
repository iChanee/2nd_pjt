/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            animation: {
                'sway': 'sway 4s ease-in-out infinite',
                'sway-reverse': 'sway-reverse 3s ease-in-out infinite',
                'wave': 'wave 8s ease-in-out infinite',
            },
            keyframes: {
                sway: {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                'sway-reverse': {
                    '0%, 100%': { transform: 'rotate(2deg)' },
                    '50%': { transform: 'rotate(-2deg)' },
                },
                wave: {
                    '0%, 100%': { transform: 'translateX(-100%) skewX(0deg)' },
                    '50%': { transform: 'translateX(-50%) skewX(5deg)' },
                }
            }
        },
    },
    plugins: [],
}