module.exports = {
  purge: {
    enabled: false,
    content: [
      './src/memory/Components/*.vue',
      './src/memory/*.vue',
      './src/memory/*.html',
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
      width: {
        sm: '36px',
        md: '54px'
      },
      height: {
        sm: '48px',
        md: '72px',
      }
    },
  },
  variants: {
  },
  plugins: [],
}
