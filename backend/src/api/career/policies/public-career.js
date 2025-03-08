// Path: ./src/policies/public-career.js
// This policy will ensure that career listings can be accessed publicly without authentication

module.exports = (policyContext, config, { strapi }) => {
  // This is a simple policy that always returns true to allow public access
  // to career listings. If you want to add additional checks in the future,
  // you can modify this policy.
  return true;
};