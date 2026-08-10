import express from "express"
import cors from "cors"
import multer from 'multer'
import receiptRoutes from './routes/receipt.js'
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5003


app.get('/',(req,res)=>{
    res.send('Dont you dare giveup')
})


app.use(receiptRoutes);

app.listen(PORT , ()=>{
    console.log(`Server is running on Port ${PORT}`)
})