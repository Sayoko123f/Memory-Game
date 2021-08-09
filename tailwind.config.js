module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/Components/*.vue',
      './src/*.vue',
      './src/*.html',
    ]
  }
  ,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'kuro': '#080808',
        'sumi': '#1C1C1C',
        'keshizumi': '#434343',
        'gofun': '#FFFFFB',
        'ginnezumi': '#91989F',
      },

    },
  },
  variants: {
    borderWidth: ['hover'],
    ringWidth: ['hover'],
    ringColor: ['hover']
  },
  plugins: [],
}
