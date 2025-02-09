'use strict';

/**
 * captain controller
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::company.company');
