import express from "express"
import multer from 'multer'
import { extractReceiptData } from '../services/extractReceiptData.js'      
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

export default router   