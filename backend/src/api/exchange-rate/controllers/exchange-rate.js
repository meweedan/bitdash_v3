'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::exchange-rate.exchange-rate');