// api/shop-item/policies/is-item-owner.js
module.exports = async (policyContext, config, { strapi }) => {
  // Allow public access to publicItem and search endpoints
  if (['api::shop-item.shop-item.publicItem', 'api::shop-item.shop-item.search']
      .includes(policyContext.state.route.handler)) {
    return true;
  }

  const { id } = policyContext.params;
  const user = policyContext.state.user;

  if (!user) {
    return false;
  }

  const item = await strapi.entityService.findOne('api::shop-item.shop-item', id, {
    populate: ['owner.user']
  });

  return item?.owner?.user?.id === user.id;
};
