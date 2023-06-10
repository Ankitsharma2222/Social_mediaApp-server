const express =require("express")
const app=express()
const mongoose=require("mongoose")
const {MONGOURL}=require("./keys")
const PORT=  process.env.PORT || 5000

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