// menu-items/policies/is-public.js
module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.route.handler === 'api::menu-item.menu-item.find' || 
      policyContext.state.route.handler === 'api::menu-item.menu-item.findOne') {
    return true;
  }

  return false;
};