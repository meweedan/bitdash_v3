'use strict';

/**
 * agent services
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::agent.agent');
