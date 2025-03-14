const QRCode = require('qrcode');

module.exports = {
  generateQrForTable: async (restaurantID, tableID) => {
    try {
      // Generate the URL for the table's QR code
      const url = `https://bitdash.ai/qr/${restaurantID}/${tableID}`;

      // Generate the QR code image as a base64 string
      const qrCodeDataUrl = await QRCode.toDataURL(url);

      // Return the generated QR code
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Unable to generate QR code');
    }
  },

  generateQrForAllTables: async (restaurantID) => {
    try {
      // Fetch the restaurant and its tables from the database
      const restaurant = await strapi.services.restaurant.findOne({ id: restaurantID });

      if (!restaurant) throw new Error('Restaurant not found');

      const qrCodes = {};

      for (const table of restaurant.tables) {
        const tableID = table.id;
        const qrCodeDataUrl = await module.exports.generateQrForTable(restaurantID, tableID);
        qrCodes[tableID] = qrCodeDataUrl;
      }

      return qrCodes;
    } catch (error) {
      console.error('Error generating QR codes for tables:', error);
      throw new Error('Unable to generate QR codes');
    }
  }
};
