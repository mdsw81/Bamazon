var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "MbJl_2017",
    database: "bamazon"
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("connection successful");
    makeProductsTable();
});

var makeProductsTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].item_id+" || "+res[i].product_name+" || "+
                res[i].department_name+" || "+res[i].price+" || "+
                res[i].stock_quantity+"\n");
        }    
        askCustomerForItemID(res);
    });
}

function askCustomerForItemID(inventory){
    inquirer
        .prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the item ID of the product you would like to buy?"
        }
    ])
        .then(function(validate) {
            var choiceID = parseInt(validate.choice);
            var itemID = checkInventory(choiceID, inventory);
            if (itemID) {
                askCustomerForQuantity(itemID);
            }
            else {
                console.log("\nThat item is not available.")
            }
    });
}
    
function askCustomerForQuantity(product) {
    inquirer
        .prompt([
            {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?"
            }
        ])
        .then(function(validate) {
            var quantity = parseInt(validate.quantity);

            if (quantity > product.stock_quantity) {
                console.log("\nNot enough in stock.");
            }
            else {
                completePurchase(product, quantity);
            }
        });
}

function completePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function (err, res) {
            console.log("\nPurchased " + quantity + " " + product.product_name + "'s.");
        }
    );
}

function checkInventory(choiceID, inventory) {
    for (var i=0; i , inventory.length; i++) {
        if (inventory[i].item_id === choiceID) {
            return inventory [i];
        }
    }
        return null;
}