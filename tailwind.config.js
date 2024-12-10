/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
		  colors: {
			brand: {
			  DEFAULT: '#2196f3',
			  100: '#42a5f5',
			},
			red: '#FF7474',
			error: '#b80000',
			green: '#3DD9B3',
			blue: '#56B8FF',
			pink: '#EEA8FD',
			orange: '#F9AB72',
			light: {
			  100: '#42a5f5',
			  200: '#64b5f6',
			  300: '#90caf9',
			  400: '#bbdefb',
			},
			dark: {
			  100: '#1e88e5',
			  200: '#1565c0',
			},
		  },
		  fontFamily: {
			poppins: ['var(--font-poppins)'],
		  },
		  boxShadow: {
			'drop-1': '0px 10px 30px 0px rgba(66, 71, 97, 0.1)',
			'drop-2': '0 8px 30px 0 rgba(65, 89, 214, 0.3)',
			'drop-3': '0 8px 30px 0 rgba(65, 89, 214, 0.1)',
		  },
		  borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
		  },
		  keyframes: {
			'caret-blink': {
			  '0%,70%,100%': { opacity: '1' },
			  '20%,50%': { opacity: '0' },
			},
		  },
		  animation: {
			'caret-blink': 'caret-blink 1.25s ease-out infinite',
		  },
		},
	  },
  plugins: [require("tailwindcss-animate")],
}

