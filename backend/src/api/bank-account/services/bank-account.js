'use strict';

/**
 * auto-dealer router
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bank-account.bank-account');
