import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, Star, Check, X, Package } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductImage from '../components/product/ProductImage.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProductForm from './ProductForm.jsx';

export default function ProductsManager() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    toggleProductFeatured
  } = useProducts();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.badges?.some(b => b.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, search, filterCategory]);

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      await addProduct(formData);
      setIsCreating(false);
    }
  };

  const confirmDelete = async (id) => {
    await deleteProduct(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#4A3B5C]">
            Stationery Catalogue Manager
          </h2>
          <p className="text-xs text-[#8A7B9C] mt-0.5">
            {products.length} total products in catalogue. Edits reflect across storefront immediately.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsCreating(true)}
        >
          Add New Product
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#FFFDFB] rounded-2xl border border-[#E6DEF8] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8A7B9C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, badge, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6DEF8] rounded-xl text-xs text-[#4A3B5C] outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-[#E6DEF8] rounded-xl text-xs text-[#4A3B5C] outline-none font-medium"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#FFFDFB] rounded-[24px] border border-[#E6DEF8] shadow-pastel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#6B5B7D]">
            <thead className="bg-[#FAF5FE] text-[#4A3B5C] font-serif uppercase tracking-wider text-[11px] border-b border-[#E6DEF8]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Stock</th>
                <th className="py-3.5 px-3 text-center">Featured</th>
                <th className="py-3.5 px-3 text-center">Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EDF8]">
              <AnimatePresence>
                {filteredProducts.map((p) => {
                  const catName = categories.find(c => c.id === p.categoryId)?.name || 'General';
                  return (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-[#FAF6FE]/50 transition-colors"
                    >
                      {/* Product with image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl border border-[#E6DEF8] shrink-0 overflow-hidden">
                            <ProductImage
                              product={p}
                              images={p.images}
                              alt={p.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#4A3B5C] max-w-[200px] truncate">
                              {p.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#8A7B9C] mt-0.5">
                              {p.badges?.[0] && (
                                <span className="bg-[#E6DEF8] text-[#4A3B5C] px-1.5 py-0.2 rounded font-medium">
                                  {p.badges[0]}
                                </span>
                              )}
                              {p.isSubscription && (
                                <span className="text-[#8F7BD1] font-bold">● Sub</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-[#4A3B5C] max-w-[130px] truncate">
                        {catName}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-semibold text-[#4A3B5C] tabular-nums">
                        ₹{p.price.toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3 tabular-nums">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          p.stock <= 5 ? 'bg-[#FDEDEC] text-[#922B21]' : 'bg-[#E8F8F5] text-[#117A65]'
                        }`}>
                          {p.stock} in stock
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductFeatured(p.id)}
                          className={`p-1.5 rounded-full transition-colors ${
                            p.isFeatured ? 'text-[#F4A6C4] bg-[#FDE8F0]' : 'text-[#D4C6F4] hover:text-[#4A3B5C]'
                          }`}
                          title="Toggle featured status"
                        >
                          <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Active Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductActive(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors ${
                            p.isActive !== false
                              ? 'bg-[#E8F8F5] text-[#117A65]'
                              : 'bg-[#F2F3F4] text-[#7F8C8D]'
                          }`}
                        >
                          {p.isActive !== false ? 'Live' : 'Hidden'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 rounded-lg text-[#6B5B7D] hover:bg-[#E6DEF8] hover:text-[#4A3B5C] transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(p.id)}
                            className="p-1.5 rounded-lg text-[#8A7B9C] hover:bg-[#FDEDEC] hover:text-[#922B21] transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Form */}
      <Modal
        isOpen={isCreating || !!editingProduct}
        onClose={() => {
          setIsCreating(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Sanctuary Treasure" : "Add New Stationery Piece"}
        subtitle="Changes are reflected live in the customer storefront catalogue"
        maxWidth="max-w-2xl"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleSaveProduct}
          onCancel={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Remove From Catalogue?"
        subtitle="This action will delete this treasure from current session."
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[#6B5B7D]">
            Are you sure you want to permanently remove this product? Customers will no longer be able to purchase or view it.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={() => confirmDelete(deletingId)}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
