module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.route.handler === 'api::customer-profile.customer-profile.getPublicProfile') {
    return true;
  }
  return false;
};