/**
 * Get or create the root where we want to render Playroom.
 * - If `configPath` is set, use an element with ID "root" as the root.
 * - If no template is provided, simply create a `<div />` element and return it.
 *
 * @param configPath Path to the HTML template
 */
module.exports = (configPath) => {
  if (configPath) {
    const root = document.getElementById('root');

    if (!root) {
      // If #root element is not found, throw error as we won't be able to render Playroom.
      throw new Error(
        'No element found in body with ID "root". Playroom won\'t be rendered. Put a `<div id="root"></div>` in your HTML template where you want to render Playroom.'
      );
    }

    return root;
  }

  const outlet = document.createElement('div');
  document.body.appendChild(outlet);

  return outlet;
};
