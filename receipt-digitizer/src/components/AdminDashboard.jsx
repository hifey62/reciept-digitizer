import { useEffect, useState } from "react";
import { ShieldCheck, User, X } from "lucide-react";

const AdminDashboard = ({ onLogout }) => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        const token = localStorage.getItem("token");
        const result = await fetch(`${import.meta.env.VITE_API_URL}/receipts/pending`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await result.json();
        setReceipts(data);
        setLoading(false);
    };

    const handleApprove = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_API_URL}/receipts/${id}/approve`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        setReceipts((prev) => prev.filter((r) => r.id !== id));
        setSelectedReceipt(null); // close detail view if it was open
    };

    if (loading) return <p className="text-center py-10">Loading...</p>;

    // Detail view — shown when a receipt card is clicked
    if (selectedReceipt) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <button onClick={() => setSelectedReceipt(null)} className="text-gray-500 mb-4 flex items-center gap-1">
                    <X className="w-4 h-4" /> Back to list
                </button>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="text-center border-b border-dashed border-gray-200 pb-4 mb-4">
                        <h2 className="text-xl font-bold">{selectedReceipt.vendor}</h2>
                        <p className="text-sm text-gray-500">{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                        {selectedReceipt.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-800">₦{item.price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>₦{selectedReceipt.amount}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-1">
                        <p><span className="font-medium">Category:</span> {selectedReceipt.category}</p>
                        <p className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" /> Submitted by {selectedReceipt.user.email}
                        </p>
                        {selectedReceipt.notes && <p><span className="font-medium">Notes:</span> {selectedReceipt.notes}</p>}
                    </div>

                    <button
                        onClick={() => handleApprove(selectedReceipt.id)}
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mt-6"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Approve
                    </button>
                </div>
            </div>
        );
    }

    // List view — unchanged, just adds onClick to open detail
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Pending Approvals</h2>
                <button
                    onClick={onLogout}
                    className="fixed right-4 top-4 shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                    Log out
                </button>            </div>

            {receipts.length === 0 && (
                <p className="text-gray-500 text-center">No receipts waiting for approval.</p>
            )}

            <div className="space-y-4">
                {receipts.map((receipt) => (
                    <div
                        key={receipt.id}
                        onClick={() => setSelectedReceipt(receipt)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-green-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-800">{receipt.vendor}</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <User className="w-3 h-3" /> {receipt.user.email}
                                </p>
                            </div>
                            <span className="font-semibold text-gray-800">₦{receipt.amount}</span>
                        </div>
                        <p className="text-xs text-gray-500">{receipt.category} · {new Date(receipt.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;