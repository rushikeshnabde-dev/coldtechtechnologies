const Product = require('../models/Product');

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
      ];
    }
    if (req.query.minPrice != null || req.query.maxPrice != null) {
      filter.sellingPrice = {};
      if (req.query.minPrice != null) filter.sellingPrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice != null) filter.sellingPrice.$lte = Number(req.query.maxPrice);
    }

    // New filters
    if (req.query.condition) filter.condition = { $in: req.query.condition.split(',') };
    if (req.query.ram)         filter.ram = { $in: req.query.ram.split(',') };
    if (req.query.storageType) filter.storageType = { $in: req.query.storageType.split(',') };
    if (req.query.processor)   filter.processor = { $in: req.query.processor.split(',') };
    if (req.query.inStock === 'true') filter.stock = { $gt: 0 };
    if (req.query.inStock === 'false') filter.stock = 0;

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { sellingPrice: 1 };
    if (req.query.sort === 'price_desc') sort = { sellingPrice: -1 };
    if (req.query.sort === 'popularity') sort = { popularity: -1 };
    if (req.query.sort === 'rating') sort = { rating: -1 };
    if (req.query.sort === 'newest') sort = { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      products: items,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load products' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();
    res.json({ product, related });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load product' });
  }
};

exports.meta = async (_req, res) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    const prices = await Product.aggregate([
      { $group: { _id: null, min: { $min: '$sellingPrice' }, max: { $max: '$sellingPrice' } } },
    ]);
    const range = prices[0] || { min: 0, max: 0 };
    res.json({ categories, brands, priceRange: { min: range.min, max: range.max } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load filters' });
  }
};
