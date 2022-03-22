export default {
  /**
   * Pour corriger la fonntion stateFromHTML() bug coté server de draft.js
   */
  plugins: [new webpack.IgnorePlugin(/jsdom$/)],
};
