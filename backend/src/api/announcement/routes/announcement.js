'use strict';

/**
 * auto-dealer router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::announcement.announcement');
