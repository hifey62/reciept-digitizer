import { Store, StickyNote, Calendar, ChevronDown, ShieldCheck, Pencil, X } from "lucide-react";
import { useState } from "react";

const Review = ({ data, image ,setTake, setReview}) => {
  // Local editable copies — so the user can correct AI mistakes before saving
  const [vendor, setVendor] = useState(data.vendor);
  const [amount, setAmount] = useState(data.amount);
  const [date, setDate] = useState(data.date);
  const [category, setCategory] = useState(data.category);
  const [items, setItems] = useState(data.items);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  function handleRender(){
    setTake(true)
    setReview(false)
  }

 const handleConfirm = async () => {
  const payload = {
    vendor,
    amount: Number(amount), // the input is text, but the backend expects a number
    date,
    category,
    items,
    notes,
  };

  try {
    const result = await fetch(`http://localhost:5003/receipts/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      throw new Error("Save failed");
    }

    const data = await result.json();
    console.log("Saved:", data);
    setSuccess(true);
    // next: navigate back to upload screen, or show a success state
  } catch (err) {
    console.error(err);
    // next: show an error message to the user
  }
};
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button className="text-gray-500" onClick={ handleRender}>
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Receipt Image</span>
        </div>
        <img src={image} alt="Receipt" className="w-full rounded-xl object-cover" />
       
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Extracted Details</h3>

        <Field icon={<Store className="w-4 h-4" />} label="Vendor / Merchant" value={vendor} onChange={setVendor} />
        <Field icon={<i className="fa-solid fa-naira-sign text-sm" />} label="Amount" value={amount} onChange={setAmount} />
        <Field icon={<Calendar className="w-4 h-4" />} label="Date" value={date} onChange={setDate} />

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="Groceries">Groceries</option>
              <option value="Repair">Repair</option>
              <option value="Utilities">Utilities</option>
              <option value="Transport">Transport</option>
              <option value="Supplies">Supplies</option>
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note..."
            className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
        <div className="space-y-2">
          {items.map((item, i) => (
            <ItemRow key={i} name={item.name} price={item.price} onRemove={() => removeItem(i)} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full cursor-pointer bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2" onClick={handleConfirm}>
          <ShieldCheck className="w-4 h-4" />
          Confirm & Save Expense
        </button>
        <button className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl">
          Cancel
        </button>
      </div>
      
      {success && (
        <div className="success-message text-green-600 text-sm font-medium mt-4">
          <ShieldCheck className="w-4 h-4 inline-block mr-1" />
          Receipt saved successfully!
        </div>
      )}
    </div>
  );
};

const Field = ({ icon, label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">{icon}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
      <Pencil className="w-3.5 h-3.5 text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  </div>
);

const ItemRow = ({ name, price, onRemove }) => (
  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
    <span className="text-sm text-gray-700">{name}</span>
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-800">₦{price}</span>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-500">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export default Review;