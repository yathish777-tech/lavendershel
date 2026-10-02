import React, { useState } from 'react';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import ProductIllustration from '../components/product/ProductIllustration.jsx';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api.js';

export default function ProductForm({
  product = null, // null for add, object for edit
  categories = [],
  onSubmit,
  onCancel
}) {
  const [name, setName] = useState(product?.name || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 18.00);
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice || '');
  const [stock, setStock] = useState(product?.stock !== undefined ? product?.stock : 25);
  const [illustrationType, setIllustrationType] = useState(product?.illustrationType || 'envelope');
  const [images, setImages] = useState(product?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubscription, setIsSubscription] = useState(!!product?.isSubscription);
  const [isFeatured, setIsFeatured] = useState(!!product?.isFeatured);
  const [isActive, setIsActive] = useState(product?.isActive !== false);
  const [badgeText, setBadgeText] = useState(product?.badges?.[0] || 'Handmade');
  const [tagsInput, setTagsInput] = useState(product?.tags?.join(', ') || 'Stationery, Gift');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsUploading(true);
    try {
      const res = await api.uploadAdminImage(file);
      if (res?.url) {
        setImages(prev => [...prev, res.url]);
      }
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const subscriptionPlans = isSubscription
      ? [
          { id: "sub-monthly", name: "Month-to-Month", discount: 0, price: Number(price), interval: "monthly" },
          { id: "sub-3mo", name: "3-Month Prepaid", discount: 10, price: Number((price * 0.9).toFixed(2)), interval: "every 3 months", isPopular: true },
          { id: "sub-6mo", name: "6-Month Prepaid", discount: 15, price: Number((price * 0.85).toFixed(2)), interval: "every 6 months" }
        ]
      : [];

    const payload = {
      name: name.trim(),
      categoryId,
      description: description.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stock: Number(stock),
      illustrationType,
      images,
      isSubscription,
      subscriptionPlans,
      isFeatured,
      isActive,
      badges: badgeText ? [badgeText.trim()] : [],
      tags
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Visual illustration selector & preview */}
      <div className="p-4 bg-[#FAF5FE] rounded-2xl border border-[#E6DEF8] flex flex-col sm:flex-row items-center gap-5">
        <div className="w-28 h-24 bg-white rounded-xl border border-[#E6DEF8] p-1 shrink-0 overflow-hidden flex items-center justify-center">
          <ProductIllustration type={illustrationType} />
        </div>
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-semibold text-[#4A3B5C]">
            Product Artwork Illustration Motif:
          </label>
          <select
            value={illustrationType}
            onChange={(e) => setIllustrationType(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E6DEF8] rounded-xl text-xs outline-none"
          >
            <option value="envelope">Wax-Sealed Keepsake Envelope</option>
            <option value="journal">Hardcover Linen Guided Journal</option>
            <option value="waxkit">Brass Wax Seal & Beads Starter Kit</option>
            <option value="stickers">Holographic Affirmation Stickers</option>
            <option value="grandbundle">Sanctuary Gift Set Box</option>
          </select>
          <span className="text-[10px] text-[#8A7B9C] block">
            Renders delicate vector pastel art dynamically.
          </span>
        </div>
      </div>

      {/* Supabase Storage Image Upload */}
      <div className="p-4 bg-[#FFFDFB] rounded-2xl border border-[#E6DEF8] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#4A3B5C] flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#8F7BD1]" />
            <span>Product Photography & Storage Images (Max 5MB)</span>
          </label>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5FE] hover:bg-[#E6DEF8] text-xs font-semibold text-[#8F7BD1] border border-[#E6DEF8] transition-colors">
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Bucket</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && (
          <p className="text-xs text-[#E74C3C]">{uploadError}</p>
        )}

        {images.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-xl border border-[#E6DEF8] overflow-hidden group">
                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-[#8A7B9C]">
            No uploaded photography yet. Vector pastel illustration motif above will represent this treasure.
          </p>
        )}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Celestial Linen Notebook"
        />

        <div className="relative pt-3 flex flex-col">
          <label className="text-[11px] font-semibold text-[#8F7BD1] mb-1">
            Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-[#E6DEF8] rounded-2xl text-sm text-[#4A3B5C] outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Description"
        multiline
        rows={3}
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the tactile paper, prompts, and feelings..."
      />

      {/* Pricing & Inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Selling Price (₹ INR)"
          type="number"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="Compare-At Price (₹ INR)"
          type="number"
          step="0.01"
          value={compareAtPrice}
          onChange={(e) => setCompareAtPrice(e.target.value)}
          placeholder="Optional strike-through"
        />
        <Input
          label="Stock Inventory"
          type="number"
          required
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      {/* Badges & Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Promotional Badge (Single Tag)"
          value={badgeText}
          onChange={(e) => setBadgeText(e.target.value)}
          placeholder="e.g. Bestseller, Limited Run"
        />
        <Input
          label="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. Stationery, Hardcover, Penpal"
        />
      </div>

      {/* Checkbox Toggles */}
      <div className="p-4 rounded-2xl bg-[#FFF9F4] border border-[#E6DEF8] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="flex items-center gap-2.5 text-xs font-semibold text-[#4A3B5C] cursor-pointer">
          <input
            type="checkbox"
            checked={isSubscription}
            onChange={(e) => setIsSubscription(e.target.checked)}
            className="accent-[#8F7BD1] rounded w-4 h-4"
          />
          <span>Monthly Subscription Item</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs font-semibold text-[#4A3B5C] cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="accent-[#8F7BD1] rounded w-4 h-4"
          />
          <span>Feature on Home Carousel</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs font-semibold text-[#4A3B5C] cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-[#8F7BD1] rounded w-4 h-4"
          />
          <span>Active in Catalogue</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 flex items-center justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="md" type="submit">
          {product ? 'Update Treasure' : 'Add to Catalogue ✿'}
        </Button>
      </div>
    </form>
  );
}
