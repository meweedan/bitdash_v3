module.exports = async (ctx, config, { strapi }) => {
  if (ctx.state.user) {
    return true;
  }

  return false;
};