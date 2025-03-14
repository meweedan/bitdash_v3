module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.route.handler === 'api::restaurant.restaurant.publicMenu') {
    return true;
  }

  return false;
};