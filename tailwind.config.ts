// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {},
  plugins: [],
} satisfies Config;
