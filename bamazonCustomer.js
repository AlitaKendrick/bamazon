//dependencies 
var inquirer = require('inquirer');
var mysql = require('mysql');

//uses SQL database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'Bamazon'
});


//initial prompts to ask user id and quantity info
function introduction() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the ID of the item you would like',
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'Enter the quantity',
			filter: Number
		}
	]).then(function(input) {
		var item = input.item_id;
		var quantity = input.quantity;

		var queryQ = 'SELECT * FROM products WHERE ?';

		connection.query(queryQ, {item_id: item}, function(err, data) {
			if (err) throw err;
//ensures item id is correct 
			if (data.length === 0) {
				console.log('INVALID ITEM ID. Please try again.');
				inventoryData();

			} else {
				var productData = data[0];

				if (quantity <= productData.stock_quantity) {
					console.log('Product in stock. Placing your order!');

					var updatequeryQ = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
//updates inventory in SQL 
					connection.query(updatequeryQ, function(err, data) {
						if (err) throw err;

						console.log('Order placed! Your total is $' + productData.price * quantity);
						console.log('Thanks for shopping Bamazon');
						console.log("\n---------------------------------------------------------------------\n");

						connection.end();

					});
				} else if (quantity > productData.stock_quantity){
					console.log('Opps! We do not have that many. Please try again.');
					console.log("\n---------------------------------------------------------------------\n");

					inventoryData();
				}
			}
		})
	})
}

// loads all product information 
function inventoryData() {

	queryQ = 'SELECT * FROM products';

	connection.query(queryQ, function(err, data) {
		if (err) throw err;

		console.log('Current Inventory: ');

		var productinfo = '';
		for (var i = 0; i < data.length; i++) {
			productinfo = '';
			productinfo += 'Item ID: ' + data[i].item_id + ' | ';
			productinfo += 'Product Name: ' + data[i].product_name + ' | ';
			productinfo += 'Department: ' + data[i].department_name + ' | ';
			productinfo += 'Price: $' + data[i].price + '\n';

			console.log(productinfo);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	introduction();
	})
};

function runBamazon() {

	inventoryData();
};


runBamazon();

