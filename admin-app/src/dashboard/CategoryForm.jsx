import React, { useState } from 'react';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

export default function CategoryForm({
  category = null,
  onSubmit,
  onCancel
}) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [color, setColor] = useState(category?.color || '#B9A7E8');
  const [icon, setIcon] = useState(category?.icon || 'sparkles');
  const [isActive, setIsActive] = useState(category?.isActive !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      isActive
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Collection Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Snail Mail Correspondence"
      />

      <Input
        label="Collection Description"
        multiline
        rows={3}
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what treasures belong in this avenue..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="space-y-1.5 text-left w-full">
          <label className="text-xs font-semibold text-[#8F7BD1] flex items-center justify-between select-none">
            <span>Theme Color Accent</span>
          </label>
          <div className="flex items-center gap-3 h-[42px] px-3 bg-white border border-[#E6DEF8] rounded-2xl">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer border border-[#E6DEF8] p-0 bg-transparent shrink-0"
            />
            <span className="text-xs font-mono text-[#4A3B5C]">{color}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-left w-full">
          <label className="text-xs font-semibold text-[#8F7BD1] flex items-center justify-between select-none">
            <span>Icon Symbol</span>
          </label>
          <div className="relative w-full">
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-9 text-sm bg-white border border-[#E6DEF8] rounded-2xl outline-none text-[#4A3B5C] cursor-pointer appearance-none hover:border-[#D4C6F4] focus:border-[#B9A7E8]"
            >
              <option value="mail">Mail Envelope ✉</option>
              <option value="sparkles">Sparkles ✧</option>
              <option value="book-open">Journal Book 📖</option>
              <option value="heart">Heart ♡</option>
              <option value="gift">Gift Box 🎁</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A7B9C]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-xs font-semibold text-[#4A3B5C] cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-[#8F7BD1] rounded w-4 h-4"
        />
        <span>Active & Visible on Storefront Navigation</span>
      </label>

      <div className="pt-3 flex items-center justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="md" type="submit">
          {category ? 'Save Changes' : 'Create Collection ✿'}
        </Button>
      </div>
    </form>
  );
}
