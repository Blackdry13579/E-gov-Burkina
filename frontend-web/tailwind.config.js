/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Palette officielle (alignée sur AppColors Flutter) ---
        brand: {
          primary:      '#1A237E', // AppColors.primary      - Bleu navy profond
          dark:         '#0F2244', // AppColors.primaryDark  - Navy très foncé
          light:        '#2952A3', // AppColors.primaryLight - Navy clair
          accent:       '#EAB208', // AppColors.accent       - Or / Jaune d'accent
          'accent-light':'#F5C842',// AppColors.accentLight  - Or clair
        },
        // --- Couleurs sémantiques ---
        egov: {
          success:  '#10B981', // AppColors.success  - Émeraude
          warning:  '#F59E0B', // AppColors.warning  - Ambre
          error:    '#EF4444', // AppColors.error    - Rouge
          bg:       '#F5F7FA', // AppColors.background
          card:     '#FFFFFF', // AppColors.cardBg
          section:  '#EFF3FA', // AppColors.sectionBg
          footer:   '#0F1F3D', // AppColors.footerBg
          divider:  '#E2E8F0', // AppColors.divider
          'text-dark':   '#1A1A2E', // AppColors.textDark
          'text-medium': '#4A5568', // AppColors.textMedium
          'text-light':  '#718096', // AppColors.textLight
        },
        // --- Rétro-compat ---
        institutional: '#1A237E',
        success:       '#10B981',
        danger:        '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

