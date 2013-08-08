/* vim:set foldmethod=marker: */
// ==UserScript==
// @name Futaba Original Image Preloader
// @namespace 
// @description ニコニコのカスタマイズ。
// @include http://www.nicovideo.jp*
// @exclude 
// ==/UserScript==

'use strict';

( function()
{
//----------------------------------------------------------------------------------------------------------------------------
/**************************************************************************************************/
/* リテラル定義                                                                                   */
/**************************************************************************************************/

/**************************************************************************************************/
/* スタイル定義                                                                                   */
/**************************************************************************************************/

/**************************************************************************************************/
/* 汎用                                                                                           */
/**************************************************************************************************/
/* getElement系, queryselector系のラッパ {{{*/
function ByID()
{
	return( document.getElementById( arguments[0] ) );
}
function ByName()
{
	var par		=	( arguments.length === 1 ) ? document : arguments[0];
	var name	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByName( name ) );
}
function ByTag()
{
	var par =	(arguments.length === 1 ) ? document : arguments[0];
	var tag	=	(arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByTagName( tag ) );
}
function ByClass()
{
	var par		=	(arguments.length === 1 ) ? document : arguments[0];
	var cname	=	(arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByClassName( cname ) );
}
function QSel()
{
	var par	=	(arguments.length === 1 ) ? document : arguments[0];
	var sel	=	(arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.querySelector( sel ) );
}
function QSelA()
{
	var par	=	(arguments.length === 1 ) ? document : arguments[0];
	var sel	=	(arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.querySelectorAll( sel ) );
}
function CreEle(  tag  ){	return( document.createElement( tag ) );		}
function CreEve(  ev   ){	return( document.createEvent( ev )	);			}
function CreTNode( txt ){	return( document.createTextNode( txt )	);		}
/*}}}*/

/**************************************************************************************************/
/* 動画マイページ                                                                                 */
/**************************************************************************************************/
/* 動画マイページ - マイリスト {{{*/
function DougaMyPageMyList()
{
	/* 要素追加検知:マイリストは各項目を順次追加することで表示しているため */
	( new ByID( 'myContBody' ) ).addEventListener(
		'DOMNodeInserted',
		function( e )
		{
			/* 追加された要素にクリックイベントを追加 */
			if( e.target.className === 'SYS_box_item' )
			{
				e.target.addEventListener(
					'click',
					function()
					{
						if( this.className === 'SYS_box_item' )
						{
							var checkOuter	= ( new ByClass( this, 'checkBoxOuter' ) )[0];
							var checkBox	= ( new ByTag( checkOuter, 'input' ) )[0];
							checkBox.checked = !(checkBox.checked);
						}
					},
					false
					);

				/*　コメント入力欄では反応させない */
				( new QSel( e.target, '.commentInputContainer' ) ).addEventListener(
					'click',
					function()
					{
						event.stopPropagation();
					},
					false
					);
			}
		},
		false
		);
}
/*}}}*/

/**************************************************************************************************/
/* カスタマイズ登録                                                                               */
/**************************************************************************************************/
window.addEventListener(
	'DOMContentLoaded',
	function()
	{
		if( /\/my\/mylist/.test( window.location.href ) )
		{
			new DougaMyPageMyList();
		}
	},
	false
	);
//----------------------------------------------------------------------------------------------------------------------------
})();

