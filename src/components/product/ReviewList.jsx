import React, { useState } from 'react';
import Rating from '../ui/Rating.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { Heart } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Genevieve R.',
    date: '2 weeks ago',
    rating: 5,
    title: 'The highlight of my month',
    comment: 'The quality of the envelope paper and the gentle fragrance of dried lavender was breathtaking. The prompts helped me through a tough week.'
  },
  {
    id: 'rev-2',
    author: 'Cora L.',
    date: 'Last month',
    rating: 5,
    title: 'Truly therapeutic experience',
    comment: 'I look forward to writing on these pages. There is something profoundly restorative about slowing down with tactile stationery.'
  }
];

export default function ReviewList({ productName = '', initialRating = 4.9, count = 24 }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      date: 'Just now',
      rating: newRating,
      title: newTitle || 'A soft reflection',
      comment: newComment
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setNewAuthor('');
      setNewComment('');
      setNewTitle('');
    }, 1500);
  };

  return (
    <div className="pt-6 border-t border-[#F0E5F5] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#4A3B5C]">
            Gentle Customer Reflections
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Rating value={initialRating} size="sm" />
            <span className="text-xs font-semibold text-[#4A3B5C] tabular-nums">{initialRating} / 5</span>
            <span className="text-xs text-[#8A7B9C]">({count + reviews.length - 2} reviews)</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? 'Cancel' : 'Write a Review ✿'}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#FAF5FE] border border-[#E6DEF8] space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#4A3B5C]">
            <span>Your Rating:</span>
            <Rating value={newRating} interactive onChange={setNewRating} size="md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name / Pen Name"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              required
            />
            <Input
              label="Review Headline"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <Input
            label="Your Experience"
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            placeholder="Share how this stationery touched your day..."
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={submitted}
          >
            {submitted ? 'Thank you! ♡' : 'Share Reflection'}
          </Button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#F0E5F5] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#4A3B5C]">{rev.author}</span>
              <span className="text-[11px] text-[#8A7B9C]">{rev.date}</span>
            </div>
            <Rating value={rev.rating} size="xs" className="mb-2" />
            {rev.title && (
              <h5 className="text-xs font-semibold text-[#4A3B5C] mb-1">{rev.title}</h5>
            )}
            <p className="text-xs text-[#6B5B7D] leading-relaxed">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
