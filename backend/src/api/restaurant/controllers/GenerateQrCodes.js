module.exports = {
  async generateQrCodes(ctx) {
    const { id } = ctx.params; // Restaurant ID

    try {
      const qrCodes = await strapi.services['restaurant'].generateQrForAllTables(id);
      return qrCodes;
    } catch (error) {
      ctx.throw(500, 'Unable to generate QR codes');
    }
  }
};
