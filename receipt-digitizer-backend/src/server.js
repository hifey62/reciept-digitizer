import express from "express"
import cors from "cors"
import multer from 'multer'

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" }); 
const PORT = process.env.PORT || 5003


app.get('/',(req,res)=>{
    res.send('Dont you dare giveup')
})

app.post('/receipts', upload.single("receipt"), (req,res)=>{
    console.log(req.file);
    console.log(req.body);
    res.sendStatus(200);
})


app.listen(PORT , ()=>{
    console.log(`Server is running on Port ${PORT}`)
})