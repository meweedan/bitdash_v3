// src/policies/is-agent.js
module.exports = async (policyContext, config, { strapi }) => {
  // Check if user is authenticated
  if (!policyContext.state.user) {
    return false;
  }

  // Find the agent associated with this user
  const agent = await strapi.entityService.findOne('api::agent.agent', {
    filters: { 
      users_permissions_user: policyContext.state.user.id 
    }
  });

  // Return true if agent exists, false otherwise
  return !!agent;
};