'use strict';

/**
 * auto-dealer router
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction');
