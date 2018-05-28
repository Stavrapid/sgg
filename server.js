/*
================================================================================
	СТАВРОПОЛЬ ГЛАЗАМИ ГОРОЖАН
================================================================================
*/

var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var app = express();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.static( 'public' ) );

/* Функция рендера страницы таблицы заказов
--------------------------------------------------------------------------------
*/
function renderHome ( req, res ) {
	res.render( 'home.ejs', { total_count: 654, current_count: 23, solved_count: 631 } );
}

/* Функция компановки модального окна
--------------------------------------------------------------------------------
*/
function getModal( ejsName, ejsParams ) {
	var modal = '';
	app.render( 'modal/' + ejsName, ejsParams, function( err, html ) {
		//console.log( html );
		modal = html;
	} );
	return ( modal );
}

/* Обработчик нового обращения в модальном окне
--------------------------------------------------------------------------------
*/
app.get( "/new_claim_modal", function( req, res ) {

	/*db.query( 'SELECT `auto_increment` FROM INFORMATION_SCHEMA.TABLES WHERE table_name = "orders"', function ( error, result ) {
		if ( error ) {
			console.error( error + '\n' );
			return;
		}

		var order_id = result[ 0 ].auto_increment;
		db.query( 'SELECT `auto_increment` FROM INFORMATION_SCHEMA.TABLES WHERE table_name = "customers"', function ( error, result ) {
			if ( error ) {
				console.error( error + '\n' );
				return;
			}

			var customer_id = result[ 0 ].auto_increment;*/
			//res.render( 'new_order.ejs', { order_id: order_id, customer_id: customer_id } );
			res.send( getModal( 'new_claim_modal.ejs', { claim_id: 42, claimer_id: 42 } ) );
		/*} );
	} );*/

} );

/* Обработчик корня
--------------------------------------------------------------------------------
*/
app.get( "/", renderHome );

/* Обработчик редиректа в корень при запросе некорректного адреса
--------------------------------------------------------------------------------
*/
app.all( "*", function( req, res ) {
	res.redirect( "/" );
} );
