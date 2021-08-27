const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const config = require('config');
const stripe = require('stripe')(config.get('StripeAPIKey'));

module.exports.get_orders = async (req,res) => {
    const userId = req.params.id;
    Order.find({userId}).sort({date:-1}).then(orders => res.json(orders));
}

module.exports.checkout = async (req,res) => {
    try{
        const userId = req.params.id;
        let cart = await Cart.findOne({userId});
        let orderFromDB = await Order.findOne({userId});

        if(orderFromDB){

            orderFromDB.bill = cart.bill + orderFromDB.bill;
            orderFromDB.items = getNewItems(orderFromDB.items,cart.items);
            orderFromDB = await orderFromDB.save();

            const data = await Cart.findByIdAndDelete({_id:cart.id});
            return res.status(201).send(orderFromDB);
        }else if(cart){

            const order = await Order.create({
                userId,
                items: cart.items,
                bill: cart.bill
            });
            const data = await Cart.findByIdAndDelete({_id:cart.id});
            return res.status(201).send(order);
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

function getNewItems(orderFromDBItems,cartItems){
    let newItems = orderFromDBItems;
    
    for(let i = 0; i <= cartItems.length-1; i++){
        for(let j = 0; j <= orderFromDBItems.length-1; j++){

            let cartProductId = cartItems[i].productId;
            let orderFromDbProductId = orderFromDBItems[j].productId;

            //Increase quantity if item exist among orders
            if(cartProductId === orderFromDbProductId){

                newItems[j].quantity = orderFromDBItems[j].quantity + cartItems[i].quantity;
                
            }else{
                
                if(orderFromDbProductId){
                    newItems.push(cartItems[i]);
                }
            }
        }
    }

    return newItems;
}
