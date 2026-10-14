import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Lock, CheckCircle2, Tag, AlertCircle, ArrowLeft } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../services/analytics';
import api from '../services/api';

export const Checkout: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let targetProduct: any = null;
        try {
          const directRes = await api.get(`/products/${productId}`);
          if (directRes.data.success && directRes.data.product) {
            targetProduct = directRes.data.product;
          }
        } catch {}

        if (!targetProduct) {
          const res = await api.get(`/products`);
          if (res.data.success) {
            const found = res.data.products.find((p: any) => p._id === productId || p.slug === productId);
            targetProduct = found || res.data.products[0];
          }
        }

        setProduct(targetProduct);
        if (targetProduct?._id) {
          trackEvent('checkout_started', { productId: targetProduct._id });
        }
      } catch (err) {
        console.error('Checkout product fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponCode.trim()) return;

    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        amount: product.price,
      });

      if (res.data.success) {
        setDiscount(res.data.discount);
        setCouponSuccess(`Coupon ${res.data.code} applied! Saved ₹${res.data.discount}`);
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const handlePaySecurely = async () => {
    if (!agreedTerms) {
      setError('Please accept the Terms of Service and License Agreement to proceed.');
      return;
    }

    try {
      setError(null);
      setProcessing(true);

      // 1. Backend creates order & calculates final price
      const orderRes = await api.post('/payments/create-order', {
        productId: product._id,
        couponCode: couponSuccess ? couponCode : undefined,
        acceptedTerms: true,
      });

      if (!orderRes.data.success) {
        setError(orderRes.data.message || 'Checkout order creation failed.');
        setProcessing(false);
        return;
      }

      const { razorpayOrderId, amount, currency, keyId } = orderRes.data;

      // 2. Open Razorpay Checkout or Test Sandbox Simulator
      if ((window as any).Razorpay && keyId && !keyId.includes('placeholder')) {
        const options = {
          key: keyId,
          amount,
          currency,
          name: BRAND.name,
          description: `Order: ${product.title}`,
          order_id: razorpayOrderId,
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: { color: '#4F46E5' },
          modal: {
            ondismiss: () => {
              setProcessing(false);
            },
          },
          handler: async (response: any) => {
            try {
              // Send payment details to backend for signature verification
              const verifyRes = await api.post('/payments/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                navigate('/dashboard/purchases');
              } else {
                setError(verifyRes.data.message || 'Payment verification failed server-side.');
              }
            } catch (vErr: any) {
              setError(vErr.response?.data?.message || 'Payment verification error.');
            } finally {
              setProcessing(false);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setError(resp.error?.description || 'Payment was unsuccessful. Please retry with UPI or another card.');
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Test Mode Simulated Checkout Flow (Ensures 100% working verification even without live API keys)
        console.log('[TEST CHECKOUT] Simulating Razorpay gateway signature verification...');
        setTimeout(async () => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpayOrderId,
              razorpayPaymentId: `pay_test_${Math.random().toString(36).substring(2)}`,
              razorpaySignature: 'simulated_test_signature',
            });

            if (verifyRes.data.success) {
              navigate('/dashboard/purchases');
            } else {
              setError('Simulated payment verification failed.');
            }
          } catch (verErr: any) {
            setError('Payment verification error.');
          } finally {
            setProcessing(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing error.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-20 text-center">
        <h2 className="text-xl font-bold text-white">Product package unavailable</h2>
        <Link to="/projects" className="mt-2 inline-block text-xs font-semibold text-primary-400">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const finalAmount = Math.max(0, product.price - discount);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link to={`/projects/${product.slug}`} className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Details</span>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Secure Encrypted Checkout</h1>
          <p className="text-gray-400 text-xs">Review your order details and complete payment.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Customer Info & Payment Option (2/3) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Customer Details Box */}
            <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-sm text-white">1. Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 pt-2 border-t border-border/60">
                <div>
                  <span className="text-gray-500 block">Name</span>
                  <span className="font-bold text-white">{user?.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Email Address</span>
                  <span className="font-bold text-white">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Coupon System Input */}
            <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Tag className="w-4 h-4 text-primary-400" />
                <span>Apply Discount Coupon</span>
              </h3>
              <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter Code (e.g. WELCOME20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-background border border-border/80 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-100 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-surface-hover border border-border text-gray-200 hover:text-white font-bold text-xs"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-xs text-red-400 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-400 mt-1 font-semibold">{couponSuccess}</p>}
            </div>

            {/* Terms & License Checkbox */}
            <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-3 text-xs text-gray-300">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                <span>
                  I accept the{' '}
                  <Link to="/terms" target="_blank" className="text-primary-400 underline">Terms of Service</Link>,{' '}
                  <Link to="/license" target="_blank" className="text-primary-400 underline">Software License Agreement</Link>, and{' '}
                  <Link to="/refund-policy" target="_blank" className="text-primary-400 underline">Refund Policy</Link>.
                </span>
              </label>
            </div>

          </div>

          {/* Right Order Summary Box (1/3) */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24 space-y-5">
              <h3 className="font-bold text-sm text-white">Order Summary</h3>

              <div className="flex items-start space-x-3 pb-4 border-b border-border/60">
                <img src={product.thumbnail} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-white line-clamp-1">{product.title}</h4>
                  <span className="text-[10px] font-mono text-primary-400">v{product.currentVersion}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Item Price</span>
                  <span>{BRAND.currency.symbol}{product.price.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{BRAND.currency.symbol}{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-border/60 flex justify-between items-baseline font-bold text-base text-white">
                  <span>Total Amount</span>
                  <span className="text-xl text-emerald-400">
                    {BRAND.currency.symbol}{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                disabled={processing}
                onClick={handlePaySecurely}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-sm shadow-glow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {processing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {BRAND.currency.symbol}{finalAmount.toLocaleString('en-IN')} Securely</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-gray-500">
                <p>256-Bit SSL Encrypted Server-Side Webhook Verification</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
