
const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    status:{
        type:String,
        required:true,
        enum:{
            values: [
                "ignored","intrested","accepted","rejected"
            ],
            message:`{VALUE}is incorrect status type`
        }
    }

},
{Timestamps:true}
)

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)
module.exports = ConnectionRequestModel;;