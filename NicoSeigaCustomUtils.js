/* vim:set foldmethod=marker: */
// ==UserScript==
// @name NicoNicoSeiga Custom Utils
// @namespace 
// @description ニコニコのカスタマイズ。
// @include http://seiga.nicovideo.jp*
// @exclude 
// ==/UserScript==

'use strict';

( function()
{
//----------------------------------------------------------------------------------------------------------------------------

/**************************************************************************************************/
/* リテラル定義                                                                                   */
/**************************************************************************************************/
var noKindStr			= '未分類';
var tabElementAttr		= 'TabElement';
var tabPageElementAttr	= 'TabPageElement';
var kindSep				= '：';
var closeTime			= 100;
var clipAlartNum		= 480;

/* 分類ルール {{{*/
var classifyRule	=
{
	/* 上の方が先に判定 */
	'東方':
	{
		'もみじもみもみ':	[ '犬走', '椛', 'もみじもみもみ', 'もみじ' ],
		'妖精':				[ 'チルノ', '大妖精', 'リリー', 'サニーミルク', 'ルナチャイルド', 'スターサファイア', '大ちゃん', '^⑨$' ],
		'華扇ちゃん':		[ '華扇', '華仙' ],
		'守矢神社':			[ '(?:|[^片桐])早苗', '神奈子', '諏訪子' ],
		'天狗':				[ '射命丸', 'はたて' ],
		'神霊廟':			[ '幽谷', '芳香', '青娥', '屠自古', '布都', '神子', 'マミゾウ' ],
		'非想天則':			[ '永江', '天子', '萃香' ],
		'星蓮船':			[ 'ナズ', '小傘', '一輪', '雲山', '村紗', '寅丸', '聖', 'ぬえ' ],
		'地霊殿':			[ 'キスメ', '黒谷', 'パルスィ', '勇儀', '古明地', '燐', '霊烏路', '(?:|お)空', 'さとり', 'こいし' ],
		'風神録':			[ '静葉', '穣子', '鍵山雛', 'にとり', '秋姉妹', 'ニトアリ' ],
		'花映塚':			[ '幽香', 'メディスン', '(?:|小野塚)小町', '(?:|四季)映姫' ],
		'永夜抄':			[ 'リグル', 'ミスティア', '慧音', 'てゐ', '鈴仙', '永琳', '輝夜', '妹紅', 'うどんげ', '八意', '白沢' ],
		'妖々夢':			[ 'レティ', '橙', 'アリス', 'プリズムリバー', '八雲', '妖夢', '幽々子', '西行寺', '魂魄', '妖忌', 'マリアリ' ],
		'紅魔郷':			[ 'ルーミア', '美鈴', '小悪魔', 'パチュリー', '咲夜', 'レミリア', 'フラン', 'スカーレット' ],
		'霊夢・魔理沙':		[ '霊夢', '魔理沙' ],
		'いろいろ':			[ '東方' ],
	},
	'アイマス':
	{
		'モバマス':			[ 'モバマス', 'モゲマス', 'デレマス', 'シンデレラガールズ' ],
		'アイマス':			[
								'春香', '伊織', 'あずさ', '千早', 'やよい', '真', '雪歩',
								'律子', '亜美', '真美',	'高木社長', '小鳥', '美希', '響', '貴音', '黒井社長',
								'日高舞', '日高愛', '水谷絵理', '秋月涼',
								'アイマス', 'アイドルマスター'
							],
	},
	'':
	{
		'ちちしりふともも':	[ 'おっぱい', '尻', 'ふともも', '境界線上のホライゾン', 'ちちましい' ],
		'とある':			[ 'とある科学の超電磁砲', 'とある魔術の禁書目録' ],
		'TypeMoon':			[ 'Fate', '月姫' ],
		'その他':			[ '.*' ],
	}
};
/*}}}*/

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

function qSel()
{
	var par	=	( arguments.length === 1 ) ? document : arguments[0];
	var sel	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.querySelector( sel ) );
}

function qSelA()
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
/* ニコニコ静画                                                                                   */
/**************************************************************************************************/
//========================================================================================================================={{{
/**************************************************************************************************/
/* ニコニコ静画-クリップページ                                                                    */
/**************************************************************************************************/
/* remodelClipMenu() : クリップメニューの改造 {{{*/
function remodelClipMenu()
{
	/* クリップの上位エレメントに公開クラスを付ける {{{*/
	( function()
	{
		var clipList = qSelA( '.my_menu_clipgroup_list>ul>.clip_item' );
		for( var count = 0, len = clipList.length; count < len; count++ )
		{
			var privateClip = byClass( clipList[count], 'clip_item_private' );
			if( privateClip.length === 0 )
			{
				clipList[count].classList.add( 'public' );
			}
		}
	} )();
	/*}}}*/

	/* メニューの付け替え {{{*/
	( function()
	{
		/* 新規メニューを生成 {{{*/
		var newMenuList = new Object;

		/* メニュー生成関数 {{{*/
		function createNewMenu( title )
		{
			var newMenu = document.createDocumentFragment();

			/* メニュー枠追加 */
			var newElement				= creEle( 'div' );
			newElement.className		= 'NewMenuFrame';
			newElement.dataset.menuName = title;
			newMenu.appendChild( newElement );

			/* メニュータイトル追加 */
			newElement				= creEle( 'span' );
			newElement.className	= 'NewMenuTitle close';
			newElement.appendChild( document.createTextNode( title ) );
			newMenu.firstChild.appendChild( newElement );
	
			/* メニューリスト追加 */
			newElement				= creEle( 'ul' );
			newElement.className	= 'NewMenuList';
			newMenu.firstChild.appendChild( newElement );

			return( newMenu );
		}
		/*}}}*/

		/* メニュートグル関数 {{{*/
		function MenuToggle( e )
		{
			e.target.classList.toggle( 'close' );
		}
		/*}}}*/

		/* 未分類メニュー生成 */
		newMenuList[noKindStr]	= createNewMenu( noKindStr );

		/* クリップリスト全体を走査 {{{*/
		( function()
		{
			var clipRoot = byClass( 'my_menu_clipgroup_list' )[0];
			var clipList = byClass( clipRoot, 'clip_item' );
			for( var count =  clipList.length - 1; count >= 0; count-- )
			{
				var kindText = noKindStr;
				var clipText = byClass( clipList[count], 'clip_item_title' )[0].textContent;
				var clipName = clipText;

				/* セパレータ有りかチェック */
				var sepCheck	= new RegExp( kindSep );
				if( sepCheck.test( clipText ) )
				{
					/* カテゴリメニュー未作成の場合は新規作成 */
					var splitText = clipText.split( kindSep, 2 );
					kindText = splitText[0];
					clipName = splitText[1];
					if( !( kindText in newMenuList ) )
					{
						newMenuList[kindText] = createNewMenu( kindText );
					}
				}
				sepCheck = void 0;

				/* 新メニューに移し替え */
				var	newMenu = byClass( newMenuList[kindText].firstChild, 'NewMenuList' )[0];
				newMenu.insertBefore( clipList[count], newMenu.firstChild );
				byClass( newMenu, 'clip_item_title' )[0].textContent = clipName;
			}
		} )();
		/*}}}*/
		/*}}}*/

		/* 新メニューに付け替え {{{*/
		( function()
		{
			var menuBase = byClass( 'my_menu_clipgroup_list' )[0];

			/* 旧メニューを削除 */
			menuBase.removeChild( byTag( menuBase, 'ul' )[0] );

			/* 未分類が新規作成の前に来るように先頭に追加する */
			menuBase.insertBefore( newMenuList[noKindStr], menuBase.firstChild );
			menuBase.firstChild.firstChild.addEventListener(
				'click',
				MenuToggle,
				false
				);
			/* 分類済みのメニューを先頭から追加 */
			for( var newMenuItem in newMenuList )
			{
				if( newMenuItem !== noKindStr )
				{
					menuBase.insertBefore( newMenuList[newMenuItem], menuBase.firstChild );
					menuBase.firstChild.firstChild.addEventListener(
						'click',
						MenuToggle,
						false
						);
				}
			}
		} )();
		/*}}}*/

		/* 選択しているクリップのメニューは開いておく {{{*/
		var clipItems = byClass( byClass( 'my_menu_clipgroup_list' )[0], 'clip_item' );
		for( var count = 0, len = clipItems.length; count < len; count++ )
		{
			if( clipItems[count].classList.contains( 'clip_item_selected' ) )
			{
				clipItems[count].parentNode.previousSibling.classList.toggle( 'close' );
			}
		}
		/*}}}*/
	} )();
	/*}}}*/

	/* ポップアップを追加 {{{*/
	( function()
	{
		/* ポップアップを生成 {{{*/
		var CreatePopup	= function()
		{
			this.cloneBase = creEle( 'div' );
		};
		CreatePopup.prototype.create = function( popText )
		{
			var popupDiv		= this.cloneBase.cloneNode( true );
			popupDiv.className	= 'IllustCountPop';
			popupDiv.appendChild( creTNode( popText ) );
			return( popupDiv );
		};
		var createPopup	= new CreatePopup();
		/*}}}*/

		/* 種別分回す {{{*/
		var clipMenuList = byClass( 'NewMenuList' );
		for( var menuCount = 0, menuLen = clipMenuList.length; menuCount < menuLen; menuCount++ )
		{
			/* クリップ分回す {{{*/
			var clipItemList = byClass( clipMenuList[menuCount], 'clip_item' );
			for( var clipCount = 0, clipLen = clipItemList.length; clipCount < clipLen; clipCount++ )
			{
				var ItemAnchor	= byTag( clipItemList[clipCount], 'a' )[0];
				var ItemTile	= ItemAnchor.title;
				var ViewText	= /^.+:(\d+)枚の画像$/.exec( ItemTile );
				clipItemList[clipCount].appendChild( createPopup.create( ViewText[1] + '/ 500枚' ) );

				if( Number( ViewText[1], 10 ) >= clipAlartNum )
				{
					clipItemList[clipCount].className += 'ClipAlert';
				}

				ItemAnchor.title	= '';
			}
			/*}}}*/
		}
		/*}}}*/

	} )();
	/*}}}*/
}
/*}}}*/

/* remodelClipPage() : クリップページの改造 {{{*/
function remodelClipPage()
{
	/* 削除されたイラスト全チェックボタン追加 {{{*/
	( function()
	{
		var deleteIllustCheck	= creEle( 'span' );
		deleteIllustCheck.appendChild( creTNode( '削除されたイラストを全て' ) );

		var checkButton			= creEle( 'input' );
		checkButton.id			= 'deleteIllustSelectButton';
		checkButton.className	= 'delete';
		checkButton.type		= 'button';
		checkButton.value		= ' 選択 ';
		checkButton.addEventListener(
			'click',
			function()
			{
				var illustList = byClass( 'clip_thumb' );
				for( var count = 0, len = illustList.length; count < len; count++ )
				{
					var illust = illustList[count];
					if( /deleted\.png$/.test( byTag( illust, 'img' ) [0].src )		||
						/pic_no_disp\.gif$/.test( byTag( illust, 'img' )[0].src )	)
					{
						byClass( illust, 'image_check' )[0].checked = true;
					}
				}
			},
			false
			);

		deleteIllustCheck.appendChild( checkButton );
		deleteIllustCheck.appendChild( creTNode( 'する' ) );
		byID( 'clip_area' ).insertBefore( deleteIllustCheck, byClass( 'mode_button_list'  )[0] );
	} )();
	/*}}}*/

	/* ページタイトルからページ選択までを一つのdviに納める {{{*/
	( function()
	{
		var clipArea	= byID( 'clip_area' );
		var headerDiv	= clipArea.appendChild( creEle( 'div' ) );
		headerDiv.id	= 'HeaderDiv';
		var searchBase	= byClass( clipArea, 'list_body' )[0];
		while( searchBase.previousElementSibling !== null )
		{
			headerDiv.insertBefore( searchBase.previousSibling, headerDiv.firstChild );
		}
		searchBase.parentElement.insertBefore( headerDiv, searchBase );
	} )();
	/*}}}*/

	/* クリップページのイラスト機能拡張 {{{*/
	( function()
	{
		/* イラストページ画像のプリフェッチクロージャ {{{*/
		var addThumbPrefetch = ( function()
		{
			this.cloneBase	= creEle( 'img' );

			return(
			{
				setPrefetch: function( center_img_inner )
				{
					var illustThumb				= this.cloneBase.cloneNode( true );
					var illustSmall				= byTag( center_img_inner, 'img' )[0].src;
					var illustMedium			= /^(http:\/\/lohas\.nicoseiga\.jp\/thumb\/\d+)q\?/.exec( illustSmall );
					if( illustMedium !== null )
					{
						illustThumb.src				= illustMedium[1] + 'i?';
						illustThumb.style.display	= 'none';
						illustThumb.style.position	= 'absolute';
						center_img_inner.appendChild( illustThumb );
					}
				}
			} );
		} )();
		/*}}}*/

		/* イラストにクリックハンドラを追加 {{{*/
		function addClickHandler( illustList )
		{
			/* ハンドラ本体 */
			function handler( e )
			{
				/* クリップのイラストチェックボックストグル */
				if( ( e.target.className === 'clip_thumb' ) ||
					( e.target.className === 'illust_title' ) )
				{
					var checkbox = byClass( e.target, 'image_check' )[0];
					checkbox.checked = !checkbox.checked;
				}
			}

			/* イラストリストから該当する物を抽出 */
			var clip_thumbs = byClass( illustList, 'clip_thumb' );

			/* クリップリスト内のイラスト分回す */
			for( var count = 0, len = clip_thumbs.length, illust; count < len; count++ )
			{
				/* クリップの画像クリックハンドラ */
				illust = clip_thumbs[count];
				illust.addEventListener(
					'click',
					handler,
					false
				);
			}
		}
		/*}}}*/

		/* イメージプリフェッチを追加 {{{ */
		function addPrefetchImage( illustList )
		{
			/* イラストリストから該当する物を抽出 */
			var clip_thumbs = byClass( illustList, 'clip_thumb' );

			/* クリップリスト内のイラスト分回す */
			for( var count = 0, len = clip_thumbs.length, illust, imgInner; count < len; count++ )
			{
				illust		= clip_thumbs[count];
				imgInner	= byClass( illust, 'center_img_inner' )[0];
				addThumbPrefetch.setPrefetch( imgInner );
			}
		}
		/*}}}*/

		/* 表示されている画像の元画像リンクリストを生成 {{{*/
		function addIllustAnchorCreate( illustList )
		{
			var documentFrag		= document.createDocumentFragment();
			var cloneBase			= creEle( 'a' );
			var clipList			= byClass( illustList, 'clip_thumb' );
			var regExp				= new RegExp( 'clip_image_(\\d+)' );
			for( var count = 0, len = clipList.length, illustID, anchorElement; count < len; count++ )
			{
				illustID			= regExp.exec( clipList[count].id );
				anchorElement		= cloneBase.cloneNode( true );
				anchorElement.href	= 'http://seiga.nicovideo.jp/image/source?id=' + illustID[1];
				documentFrag.appendChild( anchorElement );
			}
			byID( 'IllustCollection' ).appendChild( documentFrag );
		}
		/*}}}*/

		//--------------------------------------------------------------------------------
		// ここから実行
		//--------------------------------------------------------------------------------
		var	clipArea		= byID( 'clip_area' );
		var	listBody		= byClass( clipArea, 'list_body' )[0];
		var	clipImageList	= byID( 'clip_image_list' );

		/* イラストにクリックハンドラを追加 {{{*/
		addClickHandler( clipImageList );
		/*}}}*/

		/* イラストページ画像のプリフェッチ追加 {{{*/
		addPrefetchImage( clipImageList );
		/*}}}*/

		/* リンクリスト表示DIVを生成 {{{*/
		var illustCollection = creEle( 'div' );
		illustCollection.id	= 'IllustCollection';
		illustCollection.style.display	= 'none';
		illustCollection.style.position	= 'absolute';
		byTag( 'body' )[0].appendChild( illustCollection );
		addIllustAnchorCreate( clipImageList );
		/*}}}*/

		/* AutoPatchWork追加検出 {{{*/
		listBody.addEventListener(
			'AutoPatchWork.DOMNodeInserted',
			function( e )
			{
				if( /autopagerize_page_element/.test( e.target.className ) )
				{
					/* 追加された要素にクリックハンドラを追加 */
					addClickHandler( e.target );
					/* 追加された要素にプリフェッチを追加 */
					addPrefetchImage( e.target );
					/* 追加された要素から元画像のリンクを抽出 */
					addIllustAnchorCreate( e.target );
				}
			},
			false
			);
		/*}}}*/
	} )();
	/*}}}*/

}
/*}}}*/

/**************************************************************************************************/
/* ニコニコ静画-イラストページ                                                                    */
/**************************************************************************************************/
/* remodelIllustHeader() : イラストページのヘッダを改造 {{{*/
function remodelIllustHeader()
{
	/* タイトルとinfoを上下入れ替え調整 {{{*/
	( function()
	{
		var titleBlock	= byClass( 'title_block' )[0];
		var exp_header	= titleBlock.parentNode;
		exp_header.insertBefore( titleBlock, exp_header.firstChild );
	} )();
	/*}}}*/
	
	/* タイトルクリックでイラスト説明文を開閉 {{{*/
	( function()
	{
		var title = byClass( 'title_block' )[0];
		title.addEventListener(
			'click',
			function()
			{
				var titleBlock	= byClass( 'title_block' )[0];
				titleBlock.classList.toggle( 'open' );
			},
			false
			);
	} )();
	/*}}}*/
}
/*}}}*/

/* remodelAddClip() : 静画画像のクリップ追加を改造  {{{*/
function remodelAddClip()
{
	/* クリックイベント発行関数{{{*/
	function sendClick( SendElement )
	{
		var ClickEvent = creEve( 'MouseEvents' );
		ClickEvent.initEvent( 'click', false, true );
		SendElement.dispatchEvent( ClickEvent );
	}
	/*}}}*/

	/* ラジオボックスリスト枠 {{{*/
	var remodelFrame  = ( function()
	{
		/* 枠生成 {{{*/
		var remodelFrag	= document.createDocumentFragment();

		/* ラジオボックスリスト枠を生成 {{{*/
		var radioBoxListFrame	= remodelFrag.appendChild( creEle( 'div' ) );
		radioBoxListFrame.id	= 'RadioBoxListFrame';
		/*}}}*/

		/* ラジオボックスリストアウターを生成 {{{*/
		var listFrameOuter	= radioBoxListFrame.appendChild( creEle( 'div' ) );
		listFrameOuter.id	= 'RadioBoxListOuter';
		radioBoxListFrame.style.left  = ( byID( 'illust_main' ).offsetWidth + 4 ) + 'px';
		/*}}}*/

		/* クリップ追加ボタン */
		/* クリップ追加ボタン枠を生成 {{{*/
		var radioBoxClipButtonOuter = listFrameOuter.appendChild( creEle( 'div' ) );
		radioBoxClipButtonOuter.id	= 'RadioBoxClipButtonOuter';
		/*}}}*/

		/* クリップ追加ボタンを生成 {{{*/
		var radioBoxClipButton		= radioBoxClipButtonOuter.appendChild( creEle( 'input' ) );
		radioBoxClipButton.type		= 'button';
		radioBoxClipButton.id		= 'RadioBoxClipButton';
		/*}}}*/

		/* まとめて追加 */
		byID( 'illust_main' ).appendChild( remodelFrag );
		/*}}}*/

		/* クリップ追加ボタンイベント {{{
		 * ラジオボックスを調べて既存のクリップボタンへイベントを飛ばす
		 * 追加ボタンはcreateDocumentFragmentを使っているので後付け */
		byID( 'RadioBoxClipButton' ).addEventListener(
			'click',
			function()
			{
				/* チェックされているラジオボックス検索 {{{*/
				var checkedRadio = ( function()
				{
					var clipRadioList	=  qSelA( '#ClipKindsTabPageOuter .ClipRadio' );
					for( var count = 0, len = clipRadioList.length; count < len; count++ )
					{
						if( clipRadioList[count].checked )
						{
							return( clipRadioList[count] );
						}
					}

					return( null );
				} )();
				/*}}}*/

				/* チェックされている場合 {{{*/
				if( checkedRadio !== null )
				{
					/* オリジナルのプルダウンメニューから同じ値の物を検索 {{{*/
					var orgItemList	= qSelA( '#clip_list>.clip_item' );
					var RadioId		= checkedRadio.dataset.radioId;
					for( var count = 0, len = orgItemList.length; count < len; count++ )
					{
						if( orgItemList[count].value === RadioId )
						{
							/* オリジナルのプルダウンメニューを変更 */
							byID( 'group_id' ).selectedIndex = orgItemList[count].index;
		
							/* オリジナルクリップボタンのイベント発行 */
							sendClick( byID( 'clip_add_button' ) );

							return;
						}
					}
					/*}}}*/
				}
				/*}}}*/
			},
			false
			);
		/*}}}*/

		return( byID( 'RadioBoxListOuter' ) );
	} )();
	/*}}}*/

	/* タブ枠＆ページ枠生成 {{{*/
	/* タブ表示枠生成 {{{*/
	var clipKindsTabOuter	= creEle( 'div' );
	clipKindsTabOuter.id	= 'ClipKindsTabOuter';
	remodelFrame.appendChild( clipKindsTabOuter );
	/*}}}*/

	/* ページ表示枠生成 {{{*/
	var clipKindsTabPageOuter	= creEle( 'div' );
	clipKindsTabPageOuter.id	= 'ClipKindsTabPageOuter';
	remodelFrame.appendChild( clipKindsTabPageOuter );
	/*}}}*/

	/* タブ生成 {{{*/
	var CreateTab = function()
	{
		this.cloneBase	= creEle( 'div' );
	};
	CreateTab.prototype.create	= function( cName, tName, pName, textContent )
	{
		/* タブ生成 {{{*/
		var tabElement				= this.cloneBase.cloneNode( true );
		tabElement.className		= cName;
		tabElement.dataset.tabName	= tName;
		tabElement.dataset.pageName	= pName;
		tabElement.appendChild( creTNode( textContent ) );
		/*}}}*/

		/* タブクリックイベント {{{*/
		tabElement.addEventListener(
			'click',
			function( e )
			{
				/* 一旦タブを全て非選択 */
				var tabs = qSelA( '#ClipKindsTabOuter>.ClipKindsTab' );
				for( var tabCount = 0, len = tabs.length; tabCount < len; tabCount++ )
				{
					tabs[tabCount].style.fontWeight	=	'normal';
				}
				e.target.style.fontWeight		= 'bold';

				/* ページ表示切り替え */
				var pages = qSelA( '#ClipKindsTabPageOuter>.ClipKindsTabPage' );
				for( var pageCount = 0, pageLen = pages.length; pageCount < pageLen; pageCount++ )
				{
					if( pages[pageCount].dataset.tabName === e.target.dataset.tabName )
					{
						pages[pageCount].style.display	= 'block';
					} else {
						pages[pageCount].style.display	= 'none';
					}
				}
			},
			false );
		/*}}}*/
		return( tabElement );
	};
	var createTab = new CreateTab();
	/*}}}*/

	/* ページ生成 {{{*/
	var CreatePage = function()
	{
		this.cloneBase	= creEle( 'div' );
	};
	CreatePage.prototype.create = function( cName, tName, pName )
	{
		var pageElement	= this.cloneBase.cloneNode( true );
		pageElement.className			= cName;
		pageElement.dataset.tabName		= tName;
		pageElement.dataset.pageName	= pName;
		return( pageElement );
	};
	var createPage = new CreatePage();
	/*}}}*/

	/* ラジオボタン生成 {{{*/
	var CreateRadio = function()
	{
		this.cloneBase = document.createDocumentFragment();

		this.cloneBase.appendChild( creEle( 'div' ) );
		this.cloneBase.firstChild.appendChild( creEle( 'input' ) );
		this.cloneBase.firstChild.appendChild( creEle( 'label' ) );
	};
	CreateRadio.prototype.create	= function( iName, cName, tName, pName, rName, rID, textContent )
	{
		var Frag = this.cloneBase.cloneNode( true );
		var clipRadioOuter	= Frag.firstChild;
		var	clipRadio		= clipRadioOuter.childNodes[0];
		var clipRadioLabel	= clipRadioOuter.childNodes[1];

		/* ラジオボタンラッパーを生成 */
		clipRadioOuter.className			= cName + 'Outer';
		clipRadioOuter.dataset.tabName		= tName;
		clipRadioOuter.dataset.pageName		= pName;
		clipRadioOuter.dataset.radioName	= rName;
		clipRadioOuter.dataset.radioId		= rID;

		/* ラジオボタンを生成 */
		clipRadio.type				= 'radio';
		clipRadio.id				= iName;
		clipRadio.className			= cName;
		clipRadio.name				= cName;
		clipRadio.dataset.tabName	= tName;
		clipRadio.dataset.pageName	= pName;
		clipRadio.dataset.radioName	= rName;
		clipRadio.dataset.radioId	= rID;

		/* ラジオボタンのラベルを生成 */
		clipRadioLabel.className			= cName + 'Label';
		clipRadioLabel.htmlFor				= iName;
		clipRadioLabel.dataset.tabName		= tName;
		clipRadioLabel.dataset.pageName		= pName;
		clipRadioLabel.dataset.radioName	= rName;
		clipRadioLabel.dataset.radioId		= rID;
		clipRadioLabel.textContent			= textContent;

		return( Frag );
	};
	var createRadio = new CreateRadio();
	/*}}}*/

	/* 高さ調整用空ページ {{{*/
	var blankPageElement = createPage.create( 'ClipKindsTabPage', '', '高さ調整ページ' );
	blankPageElement.style.display		= 'block';
	blankPageElement.style.position		= 'relative';
	blankPageElement.style.height		= '578px';
	clipKindsTabPageOuter.appendChild( blankPageElement );
	/*}}}*/

	/* タブとページ生成 {{{*/
	var tabList	= new Object;

	/* 未分類タブ＆ページ生成 {{{*/
	tabList[noKindStr]						= new Object;
	tabList[noKindStr][tabElementAttr]		= createTab.create( 'ClipKindsTab', noKindStr, noKindStr, noKindStr );
	tabList[noKindStr][tabPageElementAttr]	= createPage.create( 'ClipKindsTabPage', noKindStr, noKindStr );
	/*}}}*/

	/* クリップ一覧からタブを生成 {{{*/
	var selectedRadio = ( function()
	{
		var sRadio = null;
		var clipList = qSelA( '#clip_list>.clip_item' );
		for( var clipCount= 0, len = clipList.length; clipCount < len; clipCount++ )
		{
			var kindText = '';
			/* クリップ名にセパレータがある場合は新規カテゴリ追加 {{{*/
			var kindCheck	= new RegExp( kindSep );
			if( kindCheck.test( clipList[clipCount].textContent ) )
			{
				/* カテゴリ名を取得 */
				kindText = clipList[clipCount].textContent.split( "：", 1 )[0];

				/* 新規カテゴリ追加 */
				if( !( kindText in tabList ) )
				{
					/* リストに追加 */
					tabList[kindText]	= new Object;
					tabList[kindText][tabElementAttr]		=
						createTab.create( 'ClipKindsTab', kindText, kindText, kindText );
					tabList[kindText][tabPageElementAttr]	=
						createPage.create( 'ClipKindsTabPage', kindText, kindText );
				}
			}
			kindCheck	= void 0;
			/*}}}*/

			/* ラジオボタンのセットを生成 {{{*/
			var clipRadio = createRadio.create(
								'ClipRadio_' + clipList[clipCount].value,
								'ClipRadio',
								kindText ? kindText : noKindStr,
								kindText ? kindText : noKindStr,
								clipList[clipCount].textContent,
								clipList[clipCount].value,
								kindText	?	clipList[clipCount].textContent.split( kindSep, 2 )[1]
											:	clipList[clipCount].textContent.split( kindSep, 2 )[0]
								);

			/* ページへ登録 */
			if( kindText !== '' )
			{
				tabList[kindText][tabPageElementAttr].appendChild( clipRadio );
			} else {
				tabList[noKindStr][tabPageElementAttr].appendChild( clipRadio );
			}
			/*}}}*/

			/* 選択されているアイテムをチェック */
			if( clipList[clipCount].selected )
			{
				sRadio = clipRadio.childNodes[0];
			}
		}

		return( sRadio );
	})();
	/*}}}*/

	/* タブ表示 {{{*/
	for( var tab in tabList )
	{
		/* 未分類以外タブを追加 */
		if( tab !== noKindStr )
		{
			clipKindsTabOuter.appendChild( tabList[tab][tabElementAttr] );
		}

		/* ページを追加 */
		clipKindsTabPageOuter.appendChild( tabList[tab][tabPageElementAttr] );
	}
	/* 未分類タブを最後に追加 */
	clipKindsTabOuter.appendChild( tabList[noKindStr][tabElementAttr]);
	/*}}}*/
	/*}}}*/

	/* タグから推定されるクリップを検索 {{{*/
	var presumedClip = ( function ( ruleList )
	{
		/* タグリストを生成 */
		var tagList = new Array;
		var TagAnchor = qSelA( '#tag_block .tag' );
		for( var TagCount = 0, len = TagAnchor.length; TagCount < len; TagCount++ )
		{
			tagList.push( TagAnchor[TagCount].textContent );
		}

		/* ラジオボックスすべてを取得 */
		var radioList = byClass( 'ClipRadio' );

		/* カテゴリ */
		for( var ruleCat in ruleList )
		{
			/* カテゴリ名生成 */
			var category = ruleCat.length ? ruleCat + kindSep : '';

			/* クリップ */
			for( var ruleClip in ruleList[ruleCat] )
			{
				/* 正規表現条件 */
				for(	var ruleListCount = 0, ruleListLen = ruleList[ruleCat][ruleClip].length;
						ruleListCount < ruleListLen; ruleListCount++ )
				{
					/* 正規表現オブジェクト生成 */
					var classRegex	= new RegExp( ruleList[ruleCat][ruleClip][ruleListCount], 'i' );
					var clipRegex	= new RegExp( ruleClip, 'i' );

					/* 取得タグ */
					for( var tagListCount = tagList.length - 1; tagListCount >= 0; tagListCount-- )
					{
						/* タグがルールにマッチするかチェック */
						if(	classRegex.test( tagList[tagListCount] ) || clipRegex.test( tagList[tagListCount], 'i' ) )
						{
							for( var radioCount = 0, radioLen = radioList.length; radioCount < radioLen; radioCount++ )
							{
								if( radioList[radioCount].dataset.radioName === ( category + ruleClip ) )
								{
									return( radioList[radioCount] );
								}
							}
						}
					}
					classRegex	= void 0;
					clipRegex	= void 0;
				}
			}
		}
		return( '' );
	} )( classifyRule );

	/* 推定クリップがある場合は置き換え */
	if( presumedClip !== '' )
	{
		selectedRadio = presumedClip;
	}
	/*}}}*/

	/* ラジオボタン初期チェック {{{*/
	( function( radio )
	{
		if( radio )
		{
			radio.checked = true;

			/* ラジオボタンチェックイベント発行 */
			var radioCheckEvent = creEve( 'MouseEvents' );
			radioCheckEvent.initEvent( 'change', false, true );
			radio.dispatchEvent( radioCheckEvent );
		}
	})( selectedRadio );
	/*}}}*/

	/* ラジオボタン所属先タブ検索 {{{*/
	( function()
	{
		var tabs = qSelA( '.ClipKindsTab' );
		for( var tabCount = 0, len = tabs.length; tabCount < len; tabCount++ )
		{
			if( tabs[tabCount].dataset.tabName === selectedRadio.dataset.tabName )
			{
				/* タブクリックイベント発行 */
				var clickEvent = creEve( 'MouseEvents' );
				clickEvent.initEvent( 'click', false, true );
				tabs[tabCount].dispatchEvent( clickEvent );
				return;
			}
		}
	})();
	/*}}}*/

	/* クリップ完了で自動で閉じる {{{*/
	byID( 'clip_message').addEventListener(
							'DOMAttrModified',
							function( e )
							{
								if( /にクリップをしました$/.test( e.target.textContent ) )
								{
									setTimeout( window.close(), closeTime );
								}
							},
							false
							);
	/*}}}*/
}
/*}}}*/

/**************************************************************************************************/
/* カスタマイズ登録                                                                               */
/**************************************************************************************************/
/* DOMContentLoadedで追加 {{{*/
window.addEventListener(
	'DOMContentLoaded',
	function()
	{
		/* イラストページのハンドラ*/
		if( /\/seiga\/im\d+/.test( window.location.href ) )
		{
			/* 静画画像のクリップ追加を改造 */
			remodelAddClip();

			/* ヘッダに開閉を付ける */
			remodelIllustHeader();
		}
		/* クリップのハンドラ */
		else if( /\/my\/clip.*/.test( window.location.href ) )
		{
			/* クリップメニューの改造 */
			remodelClipMenu();
			/* クリップページの改造 */
			remodelClipPage();
		}
		/* イラスト定点観測のハンドラ */
		else if( /\/my\/personalize/.test( window.location.href ) )
		{
		}
	},
	false
	);
/*}}}*/
//=========================================================================================================================}}}

//----------------------------------------------------------------------------------------------------------------------------
})();

