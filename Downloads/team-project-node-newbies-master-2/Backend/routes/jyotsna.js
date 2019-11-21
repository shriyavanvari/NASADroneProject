var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
var message=[];

var customer={
    name:"Jyotsna",
    type:"Customer"
}
router.get('/', function (req, res, next) {

res.status(200).send(JSON.stringify(customer))
    
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
