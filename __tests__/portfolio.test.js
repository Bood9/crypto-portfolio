// __tests__/portfolio.test.js
const {
    addAsset,
    getAllAssets,
    deleteAsset,
    updateAsset,
  } = require('../models/assetModel');
  
  describe('Asset Model', () => {
    let testAssetId;
  
    it('should add a new asset', async () => {
      const asset = await addAsset('TestCoin', 'TEST', 10, 123.45);
      testAssetId = asset.id;
  
      expect(asset.name).toBe('TestCoin');
      expect(asset.symbol).toBe('TEST');
      expect(parseFloat(asset.amount)).toBe(10);
      expect(parseFloat(asset.price_usd)).toBeCloseTo(123.45);
    });
  
    it('should get all assets', async () => {
      const assets = await getAllAssets();
      expect(Array.isArray(assets)).toBe(true);
      expect(assets.length).toBeGreaterThan(0);
    });
  
    it('should update an asset', async () => {
      const updated = await updateAsset(testAssetId, 99, 999.99);
  
      expect(parseFloat(updated.amount)).toBe(99);
      expect(parseFloat(updated.price_usd)).toBeCloseTo(999.99);
    });
  
    it('should delete the asset', async () => {
      await deleteAsset(testAssetId);
      const assets = await getAllAssets();
      const exists = assets.some(a => a.id === testAssetId);
      expect(exists).toBe(false);
    });
  });
  