const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recurringPaymentsSchema = new Schema({
    
    SenderFirstName: {type:String},
    SenderLastName: {type:String},
    SenderAccountNumber: { type: String,required: true },
    ReceiverFirstName : {type:String},
    ReceiverLastName: {type:String},
    ReceiverAccountNumber: {type:String,required:true},
    FirstTransactionDate:{ type: Date,required:true},
    Frequency:{type:Number,required:true},
    NextTransactionDate:{type:Date},
    Amount:{type:Number,required:true}

});
const recurringPayments = mongoose.model('RecurringPayments', recurringPaymentsSchema);

module.exports=recurringPayments;