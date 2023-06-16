const express =require("express")
const app=express()
const mongoose=require("mongoose")
const {MONGOURL}=require("./keys")
const PORT=  process.env.PORT || 5000
const cors=require("cors")
// const bodyParser=require("body-parser")
// app.use(bodyParser.json({extended:true }))
// app.use(bodyParser.urlencoded({ extended:true }))
app.use(cors())
app.use(express.json())               //we are sendin form data as json
app.use("/",require("./routes"))
require("./models/user")

mongoose.connect(MONGOURL)
mongoose.connection.on('connected', ()=>{
    console.log("Connected to db")
})
mongoose.connection.on('error', (err)=>{
    console.log("Error in connecting  to db" ,err)
})
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
})    