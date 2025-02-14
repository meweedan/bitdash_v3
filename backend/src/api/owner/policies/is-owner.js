// api/owner/policies/is-owner.js
module.exports = async (policyContext, config, { strapi }) => {
  // Allow public access to publicShop endpoint
  if (policyContext.state.route.handler === 'api::owner.owner.publicShop') {
    return true;
  }

  const { id } = policyContext.params;
  const user = policyContext.state.user;

  if (!user) {
    return false;
  }

  const owner = await strapi.entityService.findOne('api::owner.owner', id, {
    populate: ['user']
  });

  return owner?.user?.id === user.id;
};