'use strict';

/**
 * captain controller
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::audit-log.audit-log');
