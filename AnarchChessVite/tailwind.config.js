/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
                wobble: {
                    "0%": { transform: "translateX(0px)" },
                    "5%": { transform: "translateX(2x)" },
                    "15%": { transform: "translateX(2.5px) rotate(-5deg)" },
                    "30%": { transform: "translateX(5px) rotate(3deg)" },
                    "45%": { transform: "translateX(-5px) rotate(-3deg)" },
                    "50%": { transform: "rotateX(180deg)" },
                    "60%": { transform: "translateX(5px) rotate(2deg)" },
                    "75%": { transform: "translateX(-2.5px) rotate(-1deg)" },
                    "95%": { transform: "translateX(2x) rotate(1deg)" },
                    "100%": { transform: "translateX(0px)" },
                },
                flipvertical: {
                    "50%": { transform: "rotateX(180deg)" },
                },
            },
            animation: {
                wiggle: "wiggle 0.2s ease-in-out infinite",
                wobble: "wobble 2s ease-in-out infinite",
                flip: "flipvertical 0.5s ease-in-out",
            },
        },
    },
    plugins: [require("daisyui")],
};
