export default async (req, res) => {
  try {
    const wallet = await strapi.entityService.findOne(
      'api::wallet.wallet',
      req.query.id,
      { populate: ['assets'] }
    );
    
    const total = wallet.assets.reduce((sum, asset) => sum + asset.value, 0);
    
    res.status(200).json({
      total,
      assets: wallet.assets
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load portfolio data' });
  }
};