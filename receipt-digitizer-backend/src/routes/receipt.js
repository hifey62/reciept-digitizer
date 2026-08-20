import express from "express"
import multer from 'multer'
import { extractReceiptData } from '../services/extractReceiptData.js' 
import { prisma } from "../lib/prisma.js";
import { pushToSheet } from "../services/pushToSheet.js";   
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
router.post("/receipts/confirm", async (req, res) => {
  const { vendor, amount, date, category, items, notes } = req.body;

  try {
    // 1. Push to Sheets FIRST
    const sheetResult = await pushToSheet({ vendor, amount, date, category, items, notes });

    if (!sheetResult.success) {
      throw new Error("Sheets push did not confirm success");
    }

    // 2. Only now save to the DB — receipt first, then its items, linked by receiptId
    const receipt = await prisma.receipt.create({
      data: {
        vendor,
        amount,
        date: new Date(date),
        category,
        userId: 1, // placeholder until real auth exists
        items: {
          create: items.map((item) => ({
            name: item.name,
            price: item.price,
          })),
        },
      },
      include: { items: true }, // return the saved items along with the receipt
    });

    res.json({ success: true, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save expense — nothing was saved" });
  }
});
export default router   