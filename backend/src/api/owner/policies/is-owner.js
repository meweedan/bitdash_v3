// api/owner/policies/is-owner.js
module.exports = async (policyContext, config, { strapi }) => {
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