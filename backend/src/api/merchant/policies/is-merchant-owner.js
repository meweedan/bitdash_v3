module.exports = async (policyContext, config, { strapi }) => {
  // Get the authenticated user
  const { user } = policyContext.state;

  // Get the merchant ID from the request parameters
  const { id } = policyContext.params;

  // If no user is authenticated, deny access
  if (!user) {
    return false;
  }

  try {
    // Find the merchant associated with the user
    const merchant = await strapi.entityService.findMany('api::merchant.merchant', {
      filters: { 
        users_permissions_user: user.id 
      },
      limit: 1
    });

    // If no merchant found or merchant ID doesn't match, deny access
    if (!merchant || merchant.length === 0 || merchant[0].id !== parseInt(id)) {
      return false;
    }

    // Allow access if merchant is found and IDs match
    return true;
  } catch (error) {
    console.error('Merchant ownership policy error:', error);
    return false;
  }
};