/*
================================================================================
	СКРИПТЫ
================================================================================
*/


function killModalWin() {
	document.getElementsByClassName( 'modal-window' )[ 0 ].style.animationName = 'modal-popup-kill';
	document.getElementById( 'modal' ).style.animationName = 'modal-popup-shadow-kill';
	//document.getElementsByClassName( 'modal-window' )[ 0 ].style.animationIterationCount = 'infinite';
	setTimeout( function() {
		var victim = document.getElementById( 'modal' );
		victim.parentNode.removeChild( victim ); // удаляем затемнение
		document.body.style.overflow = 'auto'; // возвращаем скролл сайта
		// stopBodyScrolling( false );
	}, 100 )
}

function createModalWin() {

}

function showModalWin( ajaxPath ) {

	var modal = document.createElement( 'div' );
	modal.id = 'modal';
	modal.className = 'modal';
	modal.setAttribute( 'tabindex', '-1' );
	document.body.appendChild( modal ); // включаем затемнение

	var modalWrap = document.createElement( 'div' );
	modalWrap.id = 'modal_wrap';
	modalWrap.className = 'modal-wrap';
	modal.appendChild( modalWrap ); // включаем затемнение

	var darkLayer = document.createElement( 'div' ); // слой затемнения
	darkLayer.id = 'shadow'; // id чтобы подхватить стиль
	document.body.style.overflow = 'hidden'; // блокируем скролл сайта

	// var freezeVp = function(e) {
	//     e.preventDefault();
	// };
	// function stopBodyScrolling ( bool ) {
	//     if (bool === true) {
	//         document.body.addEventListener("touchmove", freezeVp, false);
	//     } else {
	//         document.body.removeEventListener("touchmove", freezeVp, false);
	//     }
	// }
	// stopBodyScrolling( true );

	darkLayer.onclick = function () {  // при клике на слой затемнения все исчезнет
		killModalWin();
	};

	modal.focus();

	modal.onkeydown = function( evt ) {
		evt = evt || window.event;
		if ( evt.keyCode == 27 ) {
			killModalWin();
		}
	};

	// устанавливаем запрос
	var request = new XMLHttpRequest();
	// отслеживаем запрос
	request.onreadystatechange = function() {
		// проверяем вернулись запрошенные данные
		if(request.readyState === 4) {
			// проверяем успешен ли запрос
			if(request.status === 200) {
				// обнавляем элемент HTML
				modalWrap.innerHTML = request.responseText;
				modalWrap.appendChild( darkLayer );
			} else {
				// иначе выводим сообщение об ошибке
				modalWrap.innerHTML = 'Произошла ошибка при запросе: ' +  request.status + ' ' + request.statusText;
				modalWrap.appendChild( darkLayer );
			}
		}
	}

	// определяем тип запроса
	request.open( 'Get', '/' + ajaxPath );

	request.send();

}

function isEnter ( e ) {
	if ( e.keyCode == 13 ) {
		return( true );
	}
}

function isEsc ( e ) {
	if ( e.keyCode == 27 ) {
		return( true );
	}
}

/* Функция сортировки столбцов таблицы
--------------------------------------------------------------------------------
*/

// сортировка таблицы
// использовать делегирование!
// должно быть масштабируемо:
// код работает без изменений при добавлении новых столбцов и строк

function sortGrid( colNum, type, method ) {
	var tbody = grid.getElementsByTagName( 'tbody' )[ 0 ];
	// Составить массив из TR
	var rowsArray = [].slice.call( tbody.rows );
	// определить функцию сравнения, в зависимости от типа
	var compare;
	switch ( type ) {
		case 'number':
			compare = function( rowA, rowB ) {
				if ( method == 'ascend' ) {
					return rowA.cells[ colNum ].innerHTML.replace(/&nbsp;+/g,'') - rowB.cells[ colNum ].innerHTML.replace(/&nbsp;+/g,'');
					// console.log( rowA.cells[ colNum ].innerHTML.replace(/&nbsp;+/g,'') + ' ' + rowB.cells[ colNum ].innerHTML.replace(/&nbsp;+/g,'') );
				};
				if ( method == 'descend' ) {
					return rowB.cells[ colNum ].innerHTML.replace(/&nbsp;+/g,'') - rowA.cells[ colNum ].innerHTML.replace(/&nbsp;+/g,'');
				};
			};
			break;
		case 'string':
			compare = function( rowA, rowB ) {
				if ( method == 'ascend' ) {
					return rowA.cells[ colNum ].innerHTML > rowB.cells[ colNum ].innerHTML ? 1 : -1;
				}
				if ( method == 'descend' ) {
					return rowB.cells[ colNum ].innerHTML > rowA.cells[ colNum ].innerHTML ? 1 : -1;
				}
			};
			break;
	}
	// сортировать
	rowsArray.sort( compare );
	// Убрать tbody из большого DOM документа для лучшей производительности
	grid.removeChild( tbody );
	// добавить результат в нужном порядке в TBODY
	// они автоматически будут убраны со старых мест и вставлены в правильном порядке
	for ( var i = 0; i < rowsArray.length; i++ ) {
		tbody.appendChild( rowsArray[ i ] );
	}
	grid.appendChild( tbody );

	setOdds( grid );
}

/*	Функция показа шлавного меню
--------------------------------------------------------------------------------
*/

function toggleMenu( menuButton ) {
	var bodyRect = document.body.getBoundingClientRect();
  var elemRect = menuButton.getBoundingClientRect();
  var offsetX   = elemRect.left - bodyRect.left;
	var offsetY   = elemRect.top - bodyRect.top;
	console.log( 'Element is ' + offsetY + ' and ' + offsetX + ' pixels from <body>' );
	var menuDisplay = document.getElementById( 'menu' ).className
	switch ( menuDisplay ) {
		case 'shown':
			hideMenu();
			break;
		case 'hidden':
			showMenu( offsetY, offsetX );
			break;
		default:
			showMenu( offsetY, offsetX );
			break;
	}
}

function showMenu( top, left ) {
	document.getElementById( 'menu' ).className = 'shown';
	document.getElementById( 'menu' ).style.top = top + 'px';
	document.getElementById( 'menu' ).style.left = left + 'px';
	document.getElementById( 'menu_button' ).style.background = '#000';
}

function hideMenu() {
	document.getElementById( 'menu' ).className = 'hidden';
	document.getElementById( 'menu_button' ).style.background = '';
}

if (!String.prototype.trim) {
  ( function() {
    // Вырезаем BOM и неразрывный пробел
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  } )();
}

String.prototype.supress = function() {
	return this.replace(/\s+/g,' ');
};

/*	Функция фильтрации таблицы
--------------------------------------------------------------------------------
*/
function filterTable( filter, tableId ) {
	filter = filter.trim();
	filter = filter.supress();
	var cancelButton = 	document.getElementById( 'search-cancel' );
	if ( filter == '' || filter == undefined ) {
		cancelButton.style.display = 'none';
	} else {
		cancelButton.style.display = 'block';
	}
	var table = document.getElementById( tableId );
	var tr = table.getElementsByClassName( 'table-row' );
	var gotit = false;
	for ( i = 0; i < tr.length; i++ ) {
		gotit = false;
		var td = tr[ i ].getElementsByTagName( 'td' );
		for ( var j = 0; j < td.length; j++ ) {
			if ( td[ j ] ) {
				if ( td[ j ].textContent.replace(/\u00A0+/g,'').toUpperCase().indexOf( filter.toUpperCase() ) > -1 ) {
					gotit = true;
					// console.log( filter + ' ' + td[ j ].textContent.toUpperCase() );
					break;
				} else {
					gotit = false;
				}
			}
		}
		if ( gotit ) {
			tr[ i ].style.display = '';
			tr[ i ].classList.remove( 'filter-row-hidden' );
		} else {
			tr[ i ].style.display = 'none';
			tr[ i ].classList.add( 'filter-row-hidden' );
		}
	}
	setOdds( table );
	if ( table.getElementsByTagName( 'tbody' )[ 0 ].querySelectorAll( 'tr:not(.filter-row-hidden)' ).length == 0 ) {
		document.getElementById( 'table_messager' ).innerHTML = 'По запросу <span>' + filter.toUpperCase() + '</span> ничего не найдено';
	} else {
		document.getElementById( 'table_messager' ).innerHTML = '';
	}
}

function setOdds( tab ) {
	var rows = tab.getElementsByTagName( 'tbody' )[ 0 ].querySelectorAll( 'tr:not(.filter-row-hidden)' );
	for ( var i = 0; i < rows.length; i++ ) {
		if ( i % 2 == 0 ) {
			rows[ i ].classList.add( 'odd' );
		} else {
			rows[ i ].classList.remove( 'odd' );
		}
	}
}

function resetFilter( tab ) {
	document.getElementById( 'search-field' ).value = '';
	document.getElementById( 'search-field' ).blur();
	filterTable( '', tab );
}

window.onload = function() {
	document.getElementById( 'search-field' ).value = '';
}

/* Login
--------------------------------------------------------------------------------
*/
function hashCredentials( form, md5_form ) {
	console.log( md5_form );
	md5_form.elements.md5_username.value = md5( form.elements.username.value );
	md5_form.elements.md5_password.value = md5( form.elements.password.value );
	md5_form.submit();
}

/* Изменение шапки во время скролла
--------------------------------------------------------------------------------
*/
var y = 0, 
	scrollLimit = 0;

window.onload = function() {
	scrollLimit = document.getElementsByClassName('banner-container')[0].clientHeight - document.getElementsByClassName('header')[0].clientHeight * 1.5;
}
	
window.onscroll = function() {
	var scrolled = window.pageYOffset || document.documentElement.scrollTop;
	console.log(scrolled);
	if ( scrolled >= scrollLimit ) {
		document.getElementsByClassName('header')[0].classList.remove('header--transparent');
	} else {
		document.getElementsByClassName('header')[0].classList.add('header--transparent');
	}
}

	

// window.onscroll = function() {
// 	var scrolled = window.pageYOffset || document.documentElement.scrollTop;
// 	if ( window.y < scrolled ) {
// 		 window.y = scrolled;
// 		hideMenu();
// 	} else {
// 		showMenu();
// 	}
// 	window.y = scrolled;
// }

// 	function hideMenu() {
// 	if ( window.y >= scrollLimit ) {
// 		document.getElementsByClassName('header')[0].classList.remove('header--transparent');
// 	}
// }

// 	function showMenu() {
// 	if ( window.y >= scrollLimit ) {
// 		document.getElementsByClassName('header')[0].classList.add('header--transparent');
// 	}
// }

/*
================================================================================
	КОНЕЦ
================================================================================
*/
