var express = require('express');
const moment = require('moment');
const { check, validationResult } = require('express-validator');
var router = express.Router();
let user = require("../model/UserModel");
let transaction = require("../model/TransactionModel");
let recurringpayment = require("../model/RecurringPaymentModel");


router.post('/user/transferInternal',
    [check("amount", "Amount is required.").not().isEmpty(),
    check("receiverAccountNumber", "Invalid Account Number.").isLength({ min: 12, max: 12 }),
    check("senderAccountNumber", "Invalid Account Number.").isLength({ min: 12, max: 12 })
    ],
    function (req, res, next) {
        let message = [];
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            user.findOne({ AccountNumber: req.body.senderAccountNumber, isOpen: true }).exec((err, sender) => {
                if (err) {
                    next();
                } else if (sender == null) {
                    let customError = [];
                    let errors = { msg: "Account Not available !" };
                    customError.push(errors);
                    next(customError);
                } else {
                    if (sender.AccountBalance < req.body.amount) {
                        let customError = [];
                        let errors = { msg: "Insufficient Balance !" };
                        customError.push(errors);
                        next(customError);
                    } else {

                        user.findOneAndUpdate({ AccountNumber: sender.AccountNumber }, { $inc: { AccountBalance: -req.body.amount } },{new : true}).exec((err, sender1) => {
                            if (err) {
                                next();
                            } else {

                                user.findOneAndUpdate({ AccountNumber: req.body.receiverAccountNumber }, { $inc: { AccountBalance: req.body.amount } }, { new: true }).exec((err, receiver) => {
                                    if (err) {
                                        next();
                                    } else {
                                        const ReceiverFirstName = receiver.FirstName;
                                        const ReceiverLastName = receiver.LastName;
                                        const ReceiverAccountNumber = req.body.receiverAccountNumber;
                                        const SenderFirstName = sender.FirstName;
                                        const SenderLastName = sender.LastName;
                                        const SenderAccountNumber = req.body.senderAccountNumber;
                                        let TransactionType = "Debit";
                                        let Amount = "-"+req.body.amount;
                                        const SenderAccountBalance = sender1.AccountBalance;
                                        const ReceiverAccountBalance = receiver.AccountBalance;
                                        const newTransaction = new transaction({
                                            ReceiverFirstName,
                                            ReceiverLastName,
                                            ReceiverAccountNumber,
                                            SenderFirstName,
                                            SenderLastName,
                                            SenderAccountNumber,
                                            TransactionType,
                                            Amount,
                                            SenderAccountBalance,
                                            ReceiverAccountBalance
                                        })
                                        newTransaction.save((err, result) => {
                                            if (err) {
                                                next(err);
                                            } else {
                                                TransactionType = "Credit";
                                                Amount = "+"+req.body.amount;
                                                const newTransaction1 = new transaction({
                                                    ReceiverFirstName,
                                                    ReceiverLastName,
                                                    ReceiverAccountNumber,
                                                    SenderFirstName,
                                                    SenderLastName,
                                                    SenderAccountNumber,
                                                    TransactionType,
                                                    Amount,
                                                    SenderAccountBalance,
                                                    ReceiverAccountBalance
                                                })

                                                newTransaction1.save((err, result) => {
                                                    if (err) {
                                                        next(err);
                                                    } else {
                                                        res.status(200).send("Transaction Succesful");
                                                    }
                                                })
                                            }
                                        })


                                    }
                                })
                            }
                        })
                    }


                }

            })
        }

    })
router.post('/user/externalTransfer',
    [check("amount", "Amount is required.").not().isEmpty(),
    check("receiverAccountNumber", "Invalid Account Number.").isLength({ min: 12, max: 12 }),
    check("senderAccountNumber", "Invalid Account Number.").isLength({ min: 12, max: 12 }),
    check("receiverFirstName", "First Name : Please enter alphabets.").not().isEmpty().isAlpha(),
    check("receiverLastName", "Last Name is required.").not().isEmpty()
    ],
    function (req, res, next) {
        let message = [];
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            user.findOne({ AccountNumber: req.body.senderAccountNumber, isOpen: true }).exec((err, sender) => {
                if (err) {
                    next();
                } else if (sender == null) {
                    let customError = [];
                    let errors = { msg: "Account Not available !" };
                    customError.push(errors);
                    next(customError);
                } else {
                    if (sender.AccountBalance < req.body.amount) {
                        let customError = [];
                        let errors = { msg: "Insufficient Balance !" };
                        customError.push(errors);
                        next(customError);
                    } else {

                        user.findOneAndUpdate({ AccountNumber: sender.AccountNumber }, { $inc: { AccountBalance: -req.body.amount } },{new:true}).exec((err, result) => {
                            if (err) {
                                next();
                            } else {
                                const ReceiverFirstName = req.body.receiverFirstName;
                                const ReceiverLastName = req.body.receiverLastName;
                                const ReceiverAccountNumber = req.body.receiverAccountNumber;
                                const SenderFirstName = sender.FirstName;
                                const SenderLastName = sender.LastName;
                                const SenderAccountNumber = req.body.senderAccountNumber;
                                const TransactionType = "Debit";
                                const Amount = "-"+req.body.amount;
                                const SenderAccountBalance=result.AccountBalance;
                                const newTransaction = new transaction({
                                    ReceiverFirstName,
                                    ReceiverLastName,
                                    ReceiverAccountNumber,
                                    SenderFirstName,
                                    SenderLastName,
                                    SenderAccountNumber,
                                    TransactionType,
                                    SenderAccountBalance,
                                    Amount
                                })
                                newTransaction.save((err, result) => {
                                    if (err) {
                                        next(err);
                                    } else {
                                        res.status(200).send("Transaction Succesful");
                                    }
                                })
                            }
                        })
                    }


                }

            })
        }

    })



router.post('/user/setupRecurringInternal',
    [check("amount","Amount is required").not().isEmpty(),
    check("senderAccountNumber","Invalid Account Number").isLength({min:12, max:12}),
    check("receiverAccountNumber","Invalid Account Number").isLength({min:12,max:12}),
    check("firstTransactionDate","First Transaction date required").not().isEmpty(),
    check("frequency","Frequency is required").isNumeric().not().isEmpty()
    ],
    function(req,res,next){
        let message=[];
        message=validationResult(req).errors;
        if(message.length>0){
            next(message);
        }else{
            user.findOne({AccountNumber:req.body.senderAccountNumber,isOpen:true}).exec((err,sender)=> {
                if(err) {
                  next();
                }else if(sender==null){
                    let customError=[];
                    let errors={msg:"Account not available !"};
                    customError.push(errors);
                    next(customError);
                }else{
                    user.findOne({AccountNumber:req.body.receiverAccountNumber,isOpen:true}).exec((err,receiver)=>{
                        if(err) {
                            next();
                        }
                        else{
                            const SenderFirstName=sender.FirstName;
                            const SenderLastName=sender.LastName;
                            const SenderAccountNumber=sender.AccountNumber;
                            const ReceiverFirstName=receiver.FirstName;
                            const ReceiverLastName=receiver.LastName;
                            const ReceiverAccountNumber=receiver.AccountNumber;
                            const FirstTransactionDate=req.body.firstTransactionDate;
                            const getDate=moment(req.body.firstTransactionDate);
                            const Frequency=req.body.frequency;
                            const NextTransactionDate=getDate.add(Frequency,"days");
                            const Amount=req.body.amount;
                            const newRecurringPayment=new recurringpayment({
                                SenderFirstName,
                                SenderLastName,
                                SenderAccountNumber,
                                ReceiverFirstName,
                                ReceiverLastName,
                                ReceiverAccountNumber,
                                FirstTransactionDate,
                                Frequency,
                                NextTransactionDate,
                                Amount

                            })
                            newRecurringPayment.save((err,result)=>{
                                if(err){
                                    next(err)
                                }else{
                                    res.status(200).send("Recurring payment setup was Successful");
                                }   

                            })
                        }

                    })
                }  
            })
        }
    })


    router.post('/user/setupRecurringExternal',
    [check("amount","Amount is required").not().isEmpty(),
    check("senderAccountNumber","Invalid Account Number").isLength({min:12, max:12}),
    check("receiverAccountNumber","Invalid Account Number").isLength({min:12,max:12}),
    check("firstTransactionDate","First Transaction date required").not().isEmpty(),
    check("frequency","Frequency is required").isNumeric().not().isEmpty(),
    check("receiverFirstName", "First Name : Please enter alphabets.").not().isEmpty().isAlpha(),
    check("receiverLastName", "Last Name is required.").not().isEmpty()
    ],
    function(req,res,next){
        let message=[];
        message=validationResult(req).errors;
        if(message.length>0){
            next(message);
        }else{
            user.findOne({AccountNumber:req.body.senderAccountNumber,isOpen:true}).exec((err,sender)=> {
                if(err) {
                  next();
                }else if(sender==null){
                    let customError=[];
                    let errors={msg:"Account not available !"};
                    customError.push(errors);
                    next(customError);
                }
                        else{
                            const SenderFirstName=sender.FirstName;
                            const SenderLastName=sender.LastName;
                            const SenderAccountNumber=sender.AccountNumber;
                            const ReceiverFirstName=req.body.receiverFirstName;
                            const ReceiverLastName=req.body.receiverLastName;
                            const ReceiverAccountNumber=req.body.receiverAccountNumber;
                            const FirstTransactionDate=req.body.firstTransactionDate;
                            const getDate=moment(req.body.firstTransactionDate);
                            const Frequency=req.body.frequency;
                            const NextTransactionDate=getDate.add(Frequency,"days");
                            const Amount=req.body.amount;
                            const newRecurringPayment=new recurringpayment({
                                SenderFirstName,
                                SenderLastName,
                                SenderAccountNumber,
                                ReceiverFirstName,
                                ReceiverLastName,
                                ReceiverAccountNumber,
                                FirstTransactionDate,
                                Frequency,
                                NextTransactionDate,
                                Amount

                            })
                            newRecurringPayment.save((err,result)=>{
                                if(err){
                                    next(err)
                                }else{
                                    res.status(200).send("Recurring payment setup was Successful");
                                }   

                            })
                        }

                    })
                  
            }
        })
  
router.use((error, req, res, next) => {
    res.writeHead(400, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(error));
})
router.use((req, res, next) => {
    var message = [];
    var errors = { msg: "Something went wrong!" }
    message.push(errors);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(message));
})
module.exports = router;
