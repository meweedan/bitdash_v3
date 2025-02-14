module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.route.handler === 'api::owner.owner.publicShop') {
    return true;
  }

  return false;
};