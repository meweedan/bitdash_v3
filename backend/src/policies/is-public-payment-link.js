module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.route.handler === 'api::payment-link.payment-link.publicPaymentLink') {
    return true;
  }

  return false;
};