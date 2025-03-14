const QRCode = require('qrcode');

module.exports = {
  async generateQrCodes(ctx) {
    const { id } = ctx.params; // Restaurant ID

    try {
      // Fetch restaurant and associated tables
      const restaurant = await strapi.services.restaurant.findOne({ id });
      if (!restaurant) {
        return ctx.badRequest('Restaurant not found');
      }

      const qrCodes = {};

      // Loop through tables and generate a QR code for each table
      for (const table of restaurant.tables) {
        const tableID = table.id;
        const qrCodeUrl = `https://menu.bitdash.app/qr/${restaurant.id}/${tableID}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

        qrCodes[tableID] = qrCodeImage; // Store the QR code image
      }

      return qrCodes;
    } catch (error) {
      console.error('Error generating QR codes:', error);
      return ctx.internalServerError('Unable to generate QR codes');
    }
  }
};
