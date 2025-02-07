'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kyc-verification.kyc-verification');