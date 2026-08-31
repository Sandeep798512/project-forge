import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, difficulty, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query: any = { isPublished: true };

    if (category) {
      const catObj = await Category.findOne({ slug: category });
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

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'popular') sortOptions = { downloadCount: -1 };
    if (sort === 'rating') sortOptions = { ratingAverage: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
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
    const product = await Product.findOne({ slug, isPublished: true }).populate('category', 'name slug');

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
      .select('title slug shortDescription price originalPrice thumbnail techStack difficulty ratingAverage')
      .limit(3);

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
};
