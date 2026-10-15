import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, difficulty, minPrice, maxPrice, sort, productType, page = 1, limit = 12 } = req.query;

    const query: any = { isPublished: true };

    if (productType) {
      query.productType = productType;
    } else {
      query.productType = { $ne: 'placement_prep' };
    }

    if (category) {
      const catObj = await Category.findOne({ slug: category }).lean();
      if (catObj) {
        query.category = catObj._id;
      }
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { techStack: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sortOptions: any = { isPinned: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { isPinned: -1, price: 1, createdAt: -1 };
    if (sort === 'price_desc') sortOptions = { isPinned: -1, price: -1, createdAt: -1 };
    if (sort === 'popular') sortOptions = { isPinned: -1, downloadCount: -1, createdAt: -1 };
    if (sort === 'rating') sortOptions = { isPinned: -1, ratingAverage: -1, createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fast HTTP Cache headers: serve instantly from cache and revalidate in background
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

    // Select only card fields to reduce payload from megabytes to few kilobytes
    const cardFields = 'title slug shortDescription price originalPrice discountPercentage thumbnail techStack difficulty ratingAverage ratingCount hasCode hasPPT hasReport hasSupport hasDoc hasDocumentation hasSetupSupport demoVideoUrl liveDemoUrl productType isPinned pinnedAt category currentVersion createdAt';

    const [products, total] = await Promise.all([
      Product.find(query)
        .select(cardFields)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    console.error('[GET PRODUCTS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const isId = mongoose.isValidObjectId(slug);
    const product = await Product.findOne({
      $or: [{ slug }, ...(isId ? [{ _id: slug }] : [])],
      isPublished: true,
    })
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      res.status(404).json({ success: false, message: 'Project package not found' });
      return;
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isPublished: true,
    })
      .select('title slug shortDescription price originalPrice discountPercentage thumbnail techStack difficulty ratingAverage ratingCount hasCode hasPPT hasReport hasSupport hasDoc hasDocumentation hasSetupSupport')
      .limit(3)
      .lean();

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
};
