// Note: configuration used only for testing.
// The final bundle is generated by rollup, and the transpilation is made
// by svelte itself.

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
