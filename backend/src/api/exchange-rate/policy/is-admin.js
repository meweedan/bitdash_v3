module.exports = async (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;

  // Allow public access to fetching exchange rates
  if (["api::exchange-rate.exchange-rate.find", "api::exchange-rate.exchange-rate.findOne", "api::exchange-rate.exchange-rate.latestRates"]
    .includes(policyContext.state.route.handler)) {
    return true;
  }

  // Restrict create, update, delete to admins only
  return user && user.role.type === "admin";
};
