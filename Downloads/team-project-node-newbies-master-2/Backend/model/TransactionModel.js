const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    ReceiverFirstName: { type: String},
    ReceiverLastName: { type: String },
    ReceiverAccountNumber: { type: String},
    ReceiverAccountType: { type: String},
    SenderFirstName: { type: String },
    SenderLastName: { type: String },
    SenderAccountNumber: { type: String},
    SenderAccountType: { type: String},
    TransactionDate:{ type: Date,default:Date.now },
    TransactionType:{type:String, required:true},
    Amount:{type:String,required:true},
    SenderAccountBalance:{type:Number,required:true},
    ReceiverAccountBalance:{type:Number}

});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports=Transaction;