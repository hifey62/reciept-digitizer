import { Store, StickyNote, Calendar, ChevronDown, ShieldCheck, Pencil, X } from "lucide-react";

const Review = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-gray-500">
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">Review & Confirm</h2>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secure
        </div>
      </div>
      <p className="text-gray-500 text-center -mt-4 mb-6">
        Please review the details extracted by AI and make any corrections.
      </p>

      {/* Receipt image card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Receipt Image</span>
          <button className="text-xs text-green-600 font-medium">View Fullscreen</button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=1200&q=80"
          alt="Receipt"
          className="w-full rounded-xl object-cover"
        />

       
      </div>

      {/* Extracted details card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Extracted Details</h3>

        <Field icon={<Store className="w-4 h-4" />} label="Vendor / Merchant" defaultValue="Green Mart" />
        <Field icon={<i className="fa-solid fa-naira-sign text-sm" />} label="Amount" defaultValue="17,450.00" />
        <Field icon={<Calendar className="w-4 h-4" />} label="Date" defaultValue="27/06/2026" />

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100">
              <option>Groceries</option>
              <option>Utilities</option>
              <option>Transport</option>
              <option>Supplies</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
            <StickyNote className="w-3.5 h-3.5" /> Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="Add a note..."
            className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Itemized list card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>

        <div className="space-y-2">
          <ItemRow name="Rice 10kg" price="4,180.00" />
          <ItemRow name="Veg Oil 5L" price="4,200.00" />
          <ItemRow name="Tomatoes 5kg" price="1,200.00" />
          <ItemRow name="Milk 400g" price="950.00" />
        </div>

        <button className="mt-3 text-sm text-green-600 font-medium flex items-center gap-1">
          + Add item
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Confirm & Save Expense
        </button>
        <button className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl">
          Cancel
        </button>
      </div>
    </div>
  );
};

const Field = ({ icon, label, defaultValue }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
        {icon}
      </span>
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
      <Pencil className="w-3.5 h-3.5 text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  </div>
);

const ItemRow = ({ name, price }) => (
  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
    <span className="text-sm text-gray-700">{name}</span>
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-800">₦{price}</span>
      <button className="text-gray-300 hover:text-red-500">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export default Review;