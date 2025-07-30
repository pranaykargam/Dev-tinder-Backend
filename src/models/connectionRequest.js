
const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",

    },
    status:{
        type:String,
        required:true,
        enum:{
            values: [
                "ignored","interested","accepted","rejected"
            ],
            message:`{VALUE}is incorrect status type`
        }
    }

},
{timestamps:true}
)

connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true})



connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;

    //  check the from userId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself!!!!");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)
module.exports = ConnectionRequestModel;