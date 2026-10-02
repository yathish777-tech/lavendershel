import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Layers, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import CategoryForm from './CategoryForm.jsx';

export default function CategoriesManager() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    reorderCategories
  } = useProducts();

  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleSaveCategory = async (formData) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
      setEditingCategory(null);
    } else {
      await addCategory(formData);
      setIsCreating(false);
    }
  };

  const moveCategory = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const list = [...categories];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    // re-index order
    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    reorderCategories(updated);
  };

  const getProductCountForCat = (catId) => {
    return products.filter(p => p.categoryId === catId).length;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#4A3B5C]">
            Collections & Categories
          </h2>
          <p className="text-xs text-[#8A7B9C] mt-0.5">
            Organize store navigation and homepage collection avenues.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsCreating(true)}
        >
          Add New Collection
        </Button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        <AnimatePresence>
          {categories.map((cat, index) => {
            const count = getProductCountForCat(cat.id);
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FFFDFB] rounded-[20px] border border-[#E6DEF8] p-4 shadow-pastel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B9A7E8] transition-colors"
              >
                {/* Left: Reorder arrows & info */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 text-[#8A7B9C]">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveCategory(index, 'up')}
                      className="p-1 hover:text-[#4A3B5C] disabled:opacity-30 disabled:hover:text-[#8A7B9C] transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === categories.length - 1}
                      onClick={() => moveCategory(index, 'down')}
                      className="p-1 hover:text-[#4A3B5C] disabled:opacity-30 disabled:hover:text-[#8A7B9C] transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-black/10 shrink-0 text-white font-bold"
                    style={{ backgroundColor: cat.color || '#B9A7E8' }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#4A3B5C]">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5FE] text-[#8F7BD1] font-semibold border border-[#E6DEF8]">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5B7D] max-w-md line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Right: Active toggle & actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-[#F0E5F5]">
                  <button
                    type="button"
                    onClick={() => toggleCategoryActive(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                      cat.isActive !== false
                        ? 'bg-[#E8F8F5] text-[#117A65]'
                        : 'bg-[#F2F3F4] text-[#7F8C8D]'
                    }`}
                  >
                    {cat.isActive !== false ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-2 rounded-xl text-[#6B5B7D] hover:bg-[#FAF5FE] hover:text-[#4A3B5C] transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-2 rounded-xl text-[#8A7B9C] hover:bg-[#FDEDEC] hover:text-[#922B21] transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal for create/edit category */}
      <Modal
        isOpen={isCreating || !!editingCategory}
        onClose={() => {
          setIsCreating(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Collection" : "Create New Collection"}
        subtitle="Manage storefront avenues and navigation links"
        maxWidth="max-w-lg"
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSaveCategory}
          onCancel={() => {
            setIsCreating(false);
            setEditingCategory(null);
          }}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Collection?"
        subtitle="Associated products will remain in store."
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[#6B5B7D]">
            Are you sure you want to delete this collection avenue? Customers will no longer find it in navigation filters.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                deleteCategory(deletingId);
                setDeletingId(null);
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
