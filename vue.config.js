module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    // ...
    iconPaths: {
      favicon32: 'logo.png',
      favicon16: 'logo.png',
    },
    manifestOptions: {
      name: 'Delivery',
      short_name: 'Delivery',
      theme_color: '#FFFCBB',
      background_color: '#FFFCBB',
      start_url: 'index.html',
      icons: [
        {
          src: './logo.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: './logo.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: './logo.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: './logo.png',
          sizes: '144x144',
          type: 'image/png',
        },
      ],
    },
    // ...
  },
}
