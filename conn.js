const mongoose = require("mongoose")

const connection = mongoose.connect(`mongodb+srv://akashdesai3105:akash3105@cluster0.mksequa.mongodb.net/MockEvaluation3`);
if(connection){
    console.log("connected");
}

module.exports ={connection}