import { Router } from 'express';
import { getCategories, getProducts, getProductBySlug } from '../controllers/product.controller';

const router = Router();

router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

export default router;
