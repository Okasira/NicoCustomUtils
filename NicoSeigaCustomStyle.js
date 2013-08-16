/* vim:set foldmethod=marker: */
// ==UserScript==
// @name NicoNicoSeiga Custom Style
// @namespace 
// @description ニコニコ静画のスタイルカスタマイズ。
// @include http://seiga.nicovideo.jp*
// @exclude 
// ==/UserScript==

'use strict';

( function()
{
//----------------------------------------------------------------------------------------------------------------------------
/**************************************************************************************************/
/* 汎用関数                                                                                       */
/**************************************************************************************************/
/* getElement系, queryselector系のラッパ {{{*/
function byID(){ return( document.getElementById( arguments[0] ) ); }

function byName()
{
	var par		= ( arguments.length === 1 ) ? document : arguments[0];
	var name	= ( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByName( name ) );
}

function byTag()
{
	var par =	( arguments.length === 1 ) ? document : arguments[0];
	var tag	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByTagName( tag ) );
}

function byClass()
{
	var par		=	( arguments.length === 1 ) ? document : arguments[0];
	var cname	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByClassName( cname ) );
}

function QSel()
{
	var par	=	( arguments.length === 1 ) ? document : arguments[0];
	var sel	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.querySelector( sel ) );
}

function QSelA()
{
	var par	=	( arguments.length === 1 ) ? document : arguments[0];
	var sel	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.querySelectorAll( sel ) );
}

function creEle( tag ){	return( document.createElement( tag ) );	}
function creEve( ev  ){	return( document.createEvent( ev )	);		}
function creTNode(  txt ){	return( document.createTextNode( txt )	);	}
/*}}}*/

/**************************************************************************************************/
/* スタイル登録                                                                                   */
/**************************************************************************************************/
//========================================================================================================================={{{
/* RemodelIllustHeaderStyle() : イラストページのヘッダを改造 {{{*/
function RemodelIllustHeaderStyle()
{
	/* スタイル定義 {{{*/
	var RemodelStyle = ''		+
	// タイトル
	'.title_block'									+
	'{'												+
	'	margin:			4px 0px 4px 28px;'			+
	'	cursor:			pointer;'					+
	'}'												+
	'.title_block::before'							+
	'{'												+
	'	display:			inline-block;'			+
	'	position:			absolute;'				+
	'	top:				-2px;'					+
	'	right:				100%;'					+
	'	padding:			0px 4px;'				+
	'	color:				black;'					+
	'	line-height:		25px;'					+
	'	font-size:			20px;'					+
	'	text-decoration:	none;'					+
	'	text-shadow:		4px 4px 4px silver;'	+
	'	transform:			scale( 1.4, 1 );'		+
	'	content:			"▼";'					+
	'}'												+
	// トグル動作
	'.title_block.open::before'						+
	'{'												+
	'	content:			"▲";'					+
	'}'												+
	// 情報
	'.title_block~.info'							+
	'{'												+
	'	display:		inline-block;'				+
	'	height:			0px;'						+
	'	margin:			0px:'						+
	'	padding:		0px;'						+
	'	padding-top:	0px;'						+
	'	border:			0px;'						+
	'	overflow-y:		hidden;'					+
	'	transition:		0.3s linear 0s;'			+
	'}'												+
	'.title_block.open~.info'						+
	'{'												+
	'	height:			100%;'						+
	'	margin:			2px 0px 0px 0px;'			+
	'	border-bottom:	1px dashed dimgray;'		+
	'}'												+
	// 説明
	'.title_block~.illust_user_exp'					+
	'{'												+
	'	height:			0px;'						+
	'	margin:			0px:'						+
	'	padding:		0px;'						+
	'	overflow-y:		hidden;'					+
	'	transition:		0.3s linear 0s;'			+
	'}'												+
	'.title_block.open~.illust_user_exp'			+
	'{'												+
	'	height:			100%;'						+
	'	margin:			4px 0px 0px 0px;'			+
	'	padding:		0px;'						+
	'}'												+
	// 投稿者
	'.title_block~.illust_watch_list_box'			+
	'{'												+
	'	height:			0px;'						+
	'	transition:		0.3s linear 0s;'			+
	'}'												+
	'.title_block.open~.illust_watch_list_box'		+
	'{'												+
	'	height:			100%;'						+
	'}'												+
	'';
	/*}}}*/

	/* スタイル追加 {{{*/
	var	StyleElement		= creEle( 'style' );
	StyleElement.type		= 'text/css';
	StyleElement.id			= 'RemodelIllustHeaderStyle';
	StyleElement.appendChild( creTNode( RemodelStyle ) );
	byTag( 'head' )[0].appendChild( StyleElement );
	/*}}}*/
}
/*}}}*/

/* RemodealIllustAddClipStyle() : クリップ追加スタイルシート追加関数 {{{*/
function RemodelIllustAddClipStyle()
{
	/* スタイル定義 {{{*/
	var RemodelStyle = ''	+
	/* 元画面改造 {{{*/
	'#illust_main'				+
	'{'							+
	'	position:	relative;'	+
	'}'							+

	// クリップ時のメッセージ枠移動
/*
	'#clip_message'								+
	'{'											+
	'	left:			0px		!important;'	+
	'	right:			auto	!important;'	+
	'	margin-left:	354px	!important;'	+
	'}'											+
*/

	// 元のクリップボタンを非表示
	'#add_clip'									+
	'{'											+
	'	display:	none;'						+
	'}'											+

	// クリップボタンの非表示に対するコメントの高さ調整
	'#comment_list'								+
	'{'											+
	'	height:		577px !important;'			+
	'}'											+
	/*}}}*/

	/* クリップリストのフレームスタイル {{{*/
	'#RadioBoxListFrame'						+
	'{'											+
	'	display:		block;'					+
	'	position:		absolute;'				+
	'	top:			5px;'					+
	'	right:			6px;'					+
	'	width:			335px;'					+
	'	height:			642px;'					+
	'	padding:		3px;'					+
	'	border:			1px solid silver;'		+
	'	margin-left:	10px;'					+
	'	border-radius:	6px;'					+
	'	background:		linear-gradient( to bottom, aliceblue, lavender );'	+
	'	transition:		right 0.5s ease-out 0s;'							+
	'}'											+
	'#RadioBoxListFrame.open'				+
	'{'										+
	'	right:	-343px;'					+
	'}'										+
	/*}}}*/

	/* クリップリストフレーム内のアウタースタイル {{{*/
	'#RadioBoxListOuter'					+
	'{'										+
	'	display:		block;'				+
	'	position:		relative;'			+
	'	height:			634px;'				+
	'	background:		mintcream;'			+
	'}'										+
	/*}}}*/

	/* クリップボタン枠 {{{*/
	// クリップ追加ボタン外枠
	'#RadioBoxClipButtonOuter'				+
	'{'										+
	'	height:			20px;'				+
	'	margin:			3px 3px 6px 3px;'	+
	'	border-bottom:	1px dashed black;'	+
	'	padding:		0px 0px 4px 0px;'	+
	'}'										+

	// クリップ追加ボタン
	'#RadioBoxClipButton'					+
	'{'										+
	'	display:		block;'				+
	'	position:		relative;'			+
	'	width:			79px;'				+
	'	height:			20px;'				+
	'	border:			none;'				+
	'	vertical-align:	middle;'			+
	'	cursor:			pointer;'			+
	'	background:		url("http://seiga.nicovideo.jp/img/illust/clip.png") no-repeat;'	+
	'}'										+

	'#RadioBoxClipButton:hover'				+
	'{'										+
	'	background:		url("http://seiga.nicovideo.jp/img/illust/clip_on.png") no-repeat;'	+
	'}'										+
	/*}}}*/

	// クリップスライドボタン
	'#RadioBoxSlideButton'					+
	'{'										+
	'	display:		block;'				+
	'	position:		absolute;'			+
	'	top:			0px;'				+
	'	right:			4px;'				+
	'	width:			auto;'				+
	'	height:			14px;'				+
	'	padding:		2px;'				+
	'	border:			1px solid #E68268;'	+
	'	border-radius:	6px;'								+
	'	box-shadow:		2px 2px 2px rgba(0, 0, 0, 0.3);'	+
	'	font-size:		12px;'				+
	'	font-weight:	600;'				+
	'	cursor:			pointer;'			+
	'	background:		#FFD6C6;'			+
	'}'										+
	'#RadioBoxSlideButton:hover'			+
	'{'										+
	'	border:			1px solid #E2A144;'	+
	'	background:		#FFF5C2;'			+
	'}'										+

	/* ラジオボタン＋ラベル {{{*/
	// クリップ選択枠
	'.ClipRadioOuter'					+
	'{'									+
	'	height:			20px;'			+
	'	padding:		2px 0px;'		+
	'	background:		none;'			+
	'}'									+
	'.ClipRadioOuter:nth-of-type(2n)'	+
	'{'									+
	'	background:	honeydew;'			+
	'}'									+
	'.ClipRadioOuter:nth-of-type(2n+1)'	+
	'{'									+
	'	background:	mistyrose;'			+
	'}'									+
	'.ClipRadioOuter:hover'				+
	'{'									+
	'	color:		white;'				+
	'	background:	dimgray;'			+
	'}'									+

	// クリップ選択ラジオボタン
	'.ClipRadio'						+
	'{'									+
	'	display:		inline-block;'	+
	'	margin-left:	2px;'			+
	'	vertical-align:	middle;'		+
	'}'									+

	// クリップ選択ラジオボタンのラベル 
	'.ClipRadioLabel'					+
	'{'									+
	'	display:		inline-block;'	+
	'	width:			316px;'			+
	'	margin-left:	4px;'			+
	'	line-height:	20px;'			+
	'	font-size:		15px;'			+
	'	font-weight:	normal;'		+
	'	vertical-align:	middle;'		+
	'}'									+
	'.ClipRadio:checked+.ClipRadioLabel'	+
	'{'										+
	'	font-weight:	bold;'				+
	'}'										+
	/*}}}*/

	/* 振り分けタブ枠 {{{*/
	// 分類タブ外枠
	'#ClipKindsTabOuter'						+
	'{'											+
	'	display:		block;'					+
	'	width:			auto;'					+
	'	height:			auto;'					+
	'	border-bottom:	1px solid dimgray;'		+
	'	border-raddius:	4px 4px 0px 0px;'		+
	'}'											+

	// 分類タブ
	'.ClipKindsTab'								+
	'{'											+
	'	display:		inline-block;'			+
	'	width:			24%;'					+
	'	height:			20px;'					+
	'	margin-right:	1px;'					+
	'	line-height:	20px;'					+
	'	font-size:		15px;'					+
	'	text-align:		center;'				+
	'	border:			1px solid dimgray;'		+
	'	border-bottom:	none;'					+
	'	border-radius:	4px 4px 0px 0px;'		+
	'	background:		ivory;'					+
	'	cursor:			pointer;'				+
	'}'											+

	// 分類タブページ外枠
	'#ClipKindsTabPageOuter'		+
	'{'								+
	'	display:		block;'		+
	'	position:		relative;'	+
	'	width:			auto;'		+
	'	height:			auto;'		+
	'	background:		mintcream;'	+
	'}'								+

	// 分類タブページ
	'.ClipKindsTabPage'				+
	'{'								+
	'	display:		none;'		+
	'	position:		absolute;'	+
	'	top:			0px;'		+
	'	left:			0px;'		+
	'	width:			auto;'		+
	'	height:			auto;'		+
	'	z-index:		100;'		+
	'}'								+
	/*}}}*/
	'';
	/*}}}*/

	/* スタイル追加 {{{*/
	var	StyleElement		= creEle( 'style' );
	StyleElement.type		= 'text/css';
	StyleElement.id			= 'RemodelIllustAddClipStyle';
	StyleElement.appendChild( creTNode( RemodelStyle ) );
	byTag( 'head' )[0].appendChild( StyleElement );
	/*}}}*/
}
/*}}}*/

/* RemodelClipMenuStyle() : クリップページメニュースタイルシート追加関数 {{{*/
function RemodelClipMenuStyle()
{
	/* スタイル定義 {{{*/
	var RemodelStyle = ''	+
	/* クリップメニューグループの変更 {{{*/
	'.my_menu_clipgroup>.my_menu_clipgroup_list'	+
	'{'												+
	'	margin:		0px;'							+
	'	padding:	4px 0px;'						+
	'	background: linear-gradient( to bottom, aliceblue, lavender );'	+
	'}'												+
	/*}}}*/

	/* 新規作成のボタン化 {{{*/
	'#create_clip'													+
	'{'																+
	'		padding:		2px 4px;'								+
	'		border:			1px solid silver;'						+
	'		border-radius:	4px;'									+
	'		box-shadow:		2px 2px 2px rgba(255, 255, 255, 0.2);'	+
	'		color:			black;'									+
	'		font-size:		10px;'									+
	'		margin:			0px 2px 0px 0px;'						+
	'		background:		linear-gradient( to bottom, aliceblue, lightslategray );'	+
	'}'																+
	'#create_clip::before'			+
	'{'								+
	'		margin-right:	4px;'	+
	'		content:		url( "http://seiga.nicovideo.jp/img/my/clip/icon_create.png" );'	+
	'}'								+
	/*}}}*/

	/* 新クリップメニューのスタイル {{{*/
	'.NewMenuFrame'			+
	'{'						+
	'	padding:	0px;'	+
	'	background: none;'	+
	'}'						+
	/*}}}*/

	/* 新クリップメニューのタイトル {{{*/
	'.NewMenuTitle'								+
	'{'											+
	'	display:		block;'					+
	'	color:			black;'					+
	'	margin-bottom:	2px;'					+
	'	padding:		2px 0px 0px 4px;'		+
	'	border-bottom:	1px solid royalblue;'	+
	'	font-size:		15px;'					+
	'	line-height:	20px;'					+
	'	font-weight:	normal;'				+
	'	text-align:		left;'					+
	'	text-shadow:	1px 1px 1px gray;'		+
	'	background:		lightblue;'				+
	'}'											+
	'.NewMenuTitle::before'						+
	'{'											+
	'	position:		relative;'				+
	'	top:			0px;'					+
	'	transform:		scale( 1.2, 1 );'		+
	'	text-shadow:	4px 4px 4px silver;'	+
	'	content:		"▲";'					+
	'}'											+
	'.NewMenuTitle.close::before'	+
	'{'								+
	'	content:		"▼";'		+
	'}'								+
	'.NewMenuTitle+.NewMenuList'		+
	'{'									+
	'	display:	block;'				+
	'}'									+
	'.NewMenuTitle.close+.NewMenuList'	+
	'{'									+
	'	display:	none;'				+
	'}'									+
	/*}}}*/

	/* クリップの調整(全体) {{{*/
	'.NewMenuList>.clip_item'		+
	'{'								+
	'	position:		relative;'	+
	'	margin-left:	0px;'		+
	'	padding-left:	0px;'		+
	'	transition: background-color 0.5s ease-out 0s;'	+
	'}'								+
	'.NewMenuList>.clip_item:hover'	+
	'{'								+
	'	background:	coral;'			+
	'}'								+
	'.NewMenuList>.clip_item>a'			+
	'{'									+
	'	display:	inline-block;'		+
	'	width:		166px;'				+
	'	height:		100%;'				+
	'}'									+
	'.NewMenuList>.clip_item::before'	+
	'{'									+
	'	display:	inline-block;'		+
	'	width:		12px;'				+
	'	content:	"";'				+
	'}'									+
	/*}}}*/

	/* 非公開クリップの色を変更 {{{*/
	'.NewMenuList>.clip_item .clip_item_title'	+
	'{'											+
	'	color: dimgray;'						+
	'}'											+
	/* [非公開]を消去 */
	'.NewMenuList .clip_item_private'	+
	'{'									+
	'	display: none;'					+
	'}'									+
	/*}}}*/

	/* 公開クリップの文字変更 {{{*/
	'.NewMenuList .clip_item.public .clip_item_title'	+
	'{'													+
	'	color:	royalblue;'								+
	'}'													+
	/*}}}*/

	/* 選択クリップの調整 {{{*/
	'.NewMenuList>.clip_item.clip_item_selected'		+
	'{'													+
	'	background:		peachpuff;'						+
	'}'													+
	'.NewMenuList>.clip_item_selected::before'			+
	'{'													+
	'	content:	url( "http://seiga.nicovideo.jp/img/my/clip/icon_selected.png" );'	+
	'}'													+
	/*}}}*/

	/* 選択クリップの文字修飾変更 {{{*/
	'.NewMenuList>.clip_item_selected .clip_item_title'	+
	'{'													+
	'	color:			black;'							+
	'	font-weight:	500;'							+
	'	text-shadow:	1px 1px 1px gray;'				+
	'}'													+
	/*}}}*/

	/* クリップのイラスト枚数ポップアップ {{{*/
	'.IllustCountPop'						+
	'{'										+
	'	position:		absolute;'			+
	'	top:			0px;'				+
	'	left:			220px;'				+
	'	width:			100px;'				+
	'	height:			17px;'				+
	'	border:			1px solid silver;'	+
	'	background:		peachpuff;'			+
	'	color:			dimgray;'			+
	'	line-height:	17px;'				+
	'	font-size:		12px;'				+
	'	text-align:		center;'			+
	'	z-index:		100;'				+
	'	opacity:		0;'					+
	'	transition:		opacity 0.5s ease-in 0s;'	+
	'}'										+
	'#my_menu_illust .clip_item:hover .IllustCountPop'	+
	'{'										+
	'	opacity:		1;'					+
	'}'										+
	'.IllustCountPop::before,'				+
	'.IllustCountPop::after'				+
	'{'										+
	'	content:		" ";'				+
	'	position:		absolute;'			+
	'	width:			0px;'				+
	'	height:			0px;'				+
	'	right:			100%;'				+
	'	border:			solid transparent;'	+
	'	pointer-events: none;'				+
	'}'										+
	'.IllustCountPop::before'					+
	'{'											+
	'	top:				50%;'				+
	'	margin-top:			-6px;'				+
	'	border-color:		rgba(0, 0, 0, 0);'	+
	'	border-right-color: silver;'			+
	'	border-width:		6px;'				+
	'}'											+
	'.IllustCountPop::after'					+
	'{'											+
	'	top:				50%;'				+
	'	margin-top:			-5px;'				+
	'	border-color:		rgba(0, 0, 0, 0);'	+
	'	border-right-color:	peachpuff;'			+
	'	border-width:		5px;'				+
	'}'											+
	/*}}}*/

	/* クリップのイラスト枚数警告{{{*/
	'.NewMenuList>.clip_item.ClipAlert'									+
	'{'																	+
	'	animation:		clipalert 1s linear -0.5s infinite alternate;'	+
	'}'																	+
	'@keyframes	clipalert'						+
	'{'											+
	'	0%		{ background: gold;			}'	+
	'	100%	{ background: salmon;		}'	+
	'}'											+
	/*}}}*/
	'';
	/*}}}*/

	/* スタイル追加 {{{*/
	var	StyleElement		=  creEle( 'style' );
	StyleElement.type		= 'text/css';
	StyleElement.id			= 'RemodelClipMenuStyle';
	StyleElement.appendChild( creTNode( RemodelStyle ) );
	byTag( 'head' )[0].appendChild( StyleElement );
	/*}}}*/
}
/*}}}*/

/* RemodelClipHeaderStyle() : クリップページメニューヘッダスタイルシート追加関数 {{{*/
function RemodelClipHeaderStyle()
{
	/* スタイル定義 {{{*/
	var RemodelStyle = ''	+
	/* クリップメニューグループの変更 {{{*/
	'#HeaderDiv'									+
	'{'												+
	'	display:		block;'						+
	'	position:		relative;'					+
	'	height:			auto;'						+
	'	padding:		2px;'						+
	'	border:			1px solid silver;'			+
	'	border-radius:	4px;'						+
	'	box-shadow:		2px 2px 2px rgba(0, 0, 0, 0.2);'					+
	'	background:		linear-gradient( to bottom, aliceblue, lavender );'	+
	'}'												+
	/*}}}*/
	'';
	/*}}}*/

	/* スタイル追加 {{{*/
	var	StyleElement		=  creEle( 'style' );
	StyleElement.type		= 'text/css';
	StyleElement.id			= 'RemodelClipMenuStyle';
	StyleElement.appendChild( creTNode( RemodelStyle ) );
	byTag( 'head' )[0].appendChild( StyleElement );
	/*}}}*/
}
/*}}}*/

/* RemodelPersonalizeStyle() : イラスト定点観測スタイルシート追加関数 {{{*/
function RemodelPersonalizeStyle()
{
	/* スタイル定義 {{{*/
	var RemodelStyle = ''			+
	// タイトル
	'.title_block'					+
	'{'								+
	'	margin-left:	23px;'		+
	'	cursor:			pointer;'	+
	'}'								+
	'.title_block::before'							+
	'{'												+
	'	display:			inline-block;'			+
	'	position:			absolute;'				+
	'	top:				-2px;'					+
	'	right:				100%;'					+
	'	padding:			0px 4px;'				+
	'	color:				black;'					+
	'	line-height:		25px;'					+
	'	font-size:			20px;'					+
	'	text-decoration:	none;'					+
	'	text-shadow:		4px 4px 4px silver;'	+
	'	transform:			scale( 1.4, 1 );'		+
	'	content:			"▲";'					+
	'}'												+
	'.title_block.close::before'					+
	'{'												+
	'	content:			"▼";'					+
	'}'												+
	// 説明
	'.title_block+.illust_user_exp'					+
	'{'												+
	'	height:			100%;'						+
	'	transition:		height 1s linear 0s;'		+
	'}'												+
	'.title_block.close+.illust_user_exp'			+
	'{'												+
	'	height:			0px;'						+
	'}'												+
	'';
	/*}}}*/

	/* スタイル追加 {{{*/
	var	StyleElement		= creEle( 'style' );
	StyleElement.type		= 'text/css';
	StyleElement.id			= 'RemodelPersonalizeStyle';
	StyleElement.appendChild( creTNode( RemodelStyle ) );
	byTag( 'head' )[0].appendChild( StyleElement );
	/*}}}*/
}
/*}}}*/

/**************************************************************************************************/
/* カスタマイズスタイル登録                                                                       */
/**************************************************************************************************/
/* BeforeEvent.DOMContentLoadedで追加 {{{*/
window.opera.addEventListener(
	'BeforeEvent.DOMContentLoaded',
	function()
	{
		/* イラストページのスタイル追加*/
		if( /\/seiga\/im\d+/.test( window.location.href ) )
		{
			/* クリップ操作パネルのスタイル */
			RemodelIllustAddClipStyle();
			/* ヘッダの改造 */
			RemodelIllustHeaderStyle();
		}
		/* クリップのハンドラ */
		else if( /\/my\/clip/.test( window.location.href ) )
		{
			RemodelClipMenuStyle();

			RemodelClipHeaderStyle();
		}
		/* イラスト定点観測のハンドラ */
		else if( /\/my\/personalize/.test( window.location.href ) )
		{
			RemodelPersonalizeStyle();
		}
	},
	false
	);
/*}}}*/

//=========================================================================================================================}}}
//----------------------------------------------------------------------------------------------------------------------------
})();

