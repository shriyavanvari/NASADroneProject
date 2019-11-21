const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    CustomerID: { type: String, required: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    PhoneNumber: { type: String, required: true},
    Email: { type: String, required: true },
    AccountNumber: { type: String,required: true },
    Address: { type: String,required: true },
    AccountType:{ type: String, required: true },
    AccountBalance: { type: Number, required: true },
    DateOfOpening:{ type: Date,default:Date.now },
    isOpen:{type:Boolean,required:true}

});
const User = mongoose.model('User', userSchema);

module.exports=User;