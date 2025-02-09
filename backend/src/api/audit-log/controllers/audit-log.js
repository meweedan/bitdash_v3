'use strict';

/**
 * captain controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::audit-log.audit-log');
