import React from 'react';
import { Sparkles, Calendar, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';

export default function SubscriptionToggle({
  isSubscriptionProduct = false,
  subscriptionPlans = [],
  purchaseType, // 'onetime' | 'subscription'
  onPurchaseTypeChange,
  selectedPlan,
  onSelectPlan,
  oneTimePrice = 0
}) {
  if (!isSubscriptionProduct) return null;

  return (
    <div className="bg-[#FAF5FE] p-4 rounded-2xl border border-[#E6DEF8] space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-[#4A3B5C]">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#8F7BD1]" />
          <span>Purchase Frequency</span>
        </span>
        <span className="text-[11px] text-[#8F7BD1] font-medium">Cancel anytime ✿</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* One-time option */}
        <button
          type="button"
          onClick={() => onPurchaseTypeChange('onetime')}
          className={`p-3 rounded-xl text-left border transition-all ${
            purchaseType === 'onetime'
              ? 'border-[#8F7BD1] bg-white shadow-sm'
              : 'border-[#E6DEF8] bg-white/60 hover:bg-white'
          }`}
        >
          <div className="text-xs font-semibold text-[#4A3B5C]">One-Time</div>
          <div className="text-sm font-bold text-[#4A3B5C] mt-0.5 tabular-nums">
            {formatPrice(oneTimePrice)}
          </div>
          <p className="text-[10px] text-[#8A7B9C] mt-1">Single trial parcel</p>
        </button>

        {/* Subscribe & Save option */}
        <button
          type="button"
          onClick={() => onPurchaseTypeChange('subscription')}
          className={`relative p-3 rounded-xl text-left border transition-all ${
            purchaseType === 'subscription'
              ? 'border-[#8F7BD1] bg-white shadow-sm ring-1 ring-[#8F7BD1]'
              : 'border-[#E6DEF8] bg-white/60 hover:bg-white'
          }`}
        >
          <div className="absolute -top-2 right-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-full bg-[#B9A7E8] text-[#4A3B5C]">
            Save up to 15%
          </div>
          <div className="text-xs font-semibold text-[#4A3B5C] flex items-center gap-1">
            <span>Subscribe</span>
            <Sparkles className="w-3 h-3 text-[#F4A6C4]" />
          </div>
          <div className="text-sm font-bold text-[#8F7BD1] mt-0.5 tabular-nums">
            From {formatPrice(subscriptionPlans?.[subscriptionPlans.length - 1]?.price || oneTimePrice)}
          </div>
          <p className="text-[10px] text-[#8A7B9C] mt-1">Delivered monthly</p>
        </button>
      </div>

      {/* Plan options if subscription is selected */}
      {purchaseType === 'subscription' && subscriptionPlans?.length > 0 && (
        <div className="pt-2 border-t border-[#E6DEF8]/60 space-y-1.5">
          <span className="text-[11px] font-semibold text-[#6B5B7D] block">
            Choose Delivery Plan:
          </span>
          <div className="space-y-1.5">
            {subscriptionPlans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                    isSelected
                      ? 'border-[#8F7BD1] bg-[#FFF9F4] font-medium'
                      : 'border-[#E6DEF8] bg-white hover:bg-[#FDE8F0]/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#8F7BD1] bg-[#8F7BD1] text-white' : 'border-[#D4C6F4]'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-[#4A3B5C] font-semibold">{plan.name}</span>
                      {plan.isPopular && (
                        <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded-full bg-[#F8C8DC] text-[#7A3654]">
                          Most Loved
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#4A3B5C] tabular-nums">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-[10px] text-[#8A7B9C] block">per parcel</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
