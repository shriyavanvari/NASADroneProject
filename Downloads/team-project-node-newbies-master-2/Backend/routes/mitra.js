var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var message = [];
let randomize = require('randomatic');
let user = require("../model/UserModel");

router.get('/(:data)', function (req, res, next) {
    user.find({ CustomerID: req.params.data }, { _id: 0, __v: 0, CustomerID: 0 }).exec((err, result) => {
        if (err) {
            next();
        } else {
            let results = { custId: req.params.data, result: result }
            res.status(200).send(JSON.stringify(results))
        }
    })
})
router.post('/user/createAccount',
    [check("firstName", "First Name : Please enter only alphabets.").not().isEmpty().isAlpha(),
    check("lastName", "Last Name is required.").not().isEmpty(),
    check("phoneNumber", "Invalid phone number.").isLength({ min: 10, max: 10 }),
    check("email", "Please feed a valid Email").isEmail(),
    check("address", "Address is needed.").not().isEmpty(),
    check("accountType", "User Type is needed").not().isEmpty(),
    ],
    function (req, res, next) {
        let message = [];
        message = validationResult(req).errors;
        if (message.length > 0) {
            next(message);
        } else {
            const FirstName = req.body.firstName;
            const LastName = req.body.lastName;
            const PhoneNumber = req.body.phoneNumber;
            const Email = req.body.email;
            const AccountNumber = randomize('0', 12);
            const Address = req.body.address;
            const AccountType = req.body.accountType;
            const AccountBalance = 1500;
            const isOpen = true;
            let CustomerID;
            if (!req.body.customerID) {
                CustomerID = randomize('0', 6);
            } else {
                CustomerID = req.body.customerID;
            }
            const newUser = new user({
                CustomerID,
                FirstName,
                LastName,
                PhoneNumber,
                Email,
                AccountNumber,
                Address,
                AccountType,
                AccountBalance,
                isOpen
            });
            newUser.save((err, result) => {
                if (err) {
                    next();
                } else {
                    res.status(200).send(JSON.stringify(result))

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
