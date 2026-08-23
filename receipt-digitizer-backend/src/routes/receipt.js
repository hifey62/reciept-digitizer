import express from "express"
import multer from 'multer'
import { extractReceiptData } from '../services/extractReceiptData.js' 
import { prisma } from "../lib/prisma.js";
import { pushToSheet } from "../services/pushToSheet.js";   
import { requireAuth, requireAdmin } from "../middleware/auth.js";
const router = express.Router()
const upload = multer({ dest: "uploads/" });

router.post('/receipts', upload.single("receipt") , async (req,res)=>{

    try{
         const extracted = await extractReceiptData(req.file.path);
   res.json(extracted)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "Failed to extract receipt data"})
    }
  
})
router.post("/receipts/confirm", requireAuth, async (req, res) => {
  const { vendor, amount, date, category, items, notes } = req.body; // no userId here anymore

  try {
    const receipt = await prisma.receipt.create({
      data: {
        vendor,
        amount,
        date: new Date(date),
        category,
        userId: req.user.userId, // from the verified token, not the client's word for it
        status: "pending",
        items: {
          create: items.map((item) => ({ name: item.name, price: item.price })),
        },
      },
      include: { items: true },
    });

    res.json({ success: true, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save expense" });
  }
});


router.post("/receipts/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // 1. Push to Sheets FIRST
    const sheetResult = await pushToSheet({
      vendor: receipt.vendor,
      amount: receipt.amount,
      date: receipt.date,
      category: receipt.category,
      items: receipt.items,
      notes: receipt.notes,
    });

    if (!sheetResult.success) {
      throw new Error("Sheets push did not confirm success");
    }

    // 2. Only now update status — approved, and by whom
    const updatedReceipt = await prisma.receipt.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        approvedBy: req.user.userId, // straight from the verified JWT, no DB lookup needed
      },
    });

    res.json({ success: true, receipt: updatedReceipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Approval failed — receipt was not marked as approved" });
  }
});

router.get("/receipts/pending", requireAuth, requireAdmin, async (req, res) => {
  try {
    const pendingReceipts = await prisma.receipt.findMany({
      where: { status: "pending" },
      include: { items: true, user: true },
      orderBy: { date: "desc" },
    });

    res.json(pendingReceipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending receipts" });
  }
});
export default router   