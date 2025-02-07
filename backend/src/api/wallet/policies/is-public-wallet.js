module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.route.handler === 'api::wallet.wallet.publicWallet') {
    return true;
  }
  return false;
};