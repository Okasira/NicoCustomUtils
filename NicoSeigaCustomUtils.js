/* vim:set foldmethod=marker: */
// ==UserScript==
// @name Futaba Original Image Preloader
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
		'地霊殿':			[ 'キスメ', '黒谷', 'パルスィ', '勇儀', '古明地', '燐', '霊烏路(?:|空)', 'お空', 'さとり', 'こいし' ],
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
function ByID(){ return( document.getElementById( arguments[0] ) ); }

function ByName()
{
	var par		= ( arguments.length === 1 ) ? document : arguments[0];
	var name	= ( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByName( name ) );
}

function ByTag()
{
	var par =	( arguments.length === 1 ) ? document : arguments[0];
	var tag	=	( arguments.length === 1 ) ? arguments[0] : arguments[1];
	return( par.getElementsByTagName( tag ) );
}

function ByClass()
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

function CreEle( tag ){	return( document.createElement( tag ) );	}
function CreEve( ev  ){	return( document.createEvent( ev )	);		}
function CreTNode(  txt ){	return( document.createTextNode( txt )	);	}
/*}}}*/

/**************************************************************************************************/
/* ニコニコ静画                                                                                   */
/**************************************************************************************************/
//========================================================================================================================={{{
/**************************************************************************************************/
/* ニコニコ静画-クリップページ                                                                    */
/**************************************************************************************************/
/* RemodelClipMenu() : クリップメニューの改造 {{{*/
function RemodelClipMenu()
{
	/* クリップの上位エレメントに公開クラスを付ける {{{*/
	( function()
	{
		var clipList = new QSelA( '.my_menu_clipgroup_list>ul>.clip_item' );
		for( var count = 0, len = clipList.length; count < len; count++ )
		{
			var privateClip = new ByClass( clipList[count], 'clip_item_private' );
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
		var newMenuList = {};

		/* メニュー生成関数 {{{*/
		function CreateNewMenu( title )
		{
			var newMenu = document.createDocumentFragment();

			/* メニュー枠追加 */
			var newElement				= new CreEle( 'div' );
			newElement.className		= 'NewMenuFrame';
			newElement.dataset.menuName = title;
			newMenu.appendChild( newElement );

			/* メニュータイトル追加 */
			newElement				= new CreEle( 'span' );
			newElement.className	= 'NewMenuTitle close';
			newElement.appendChild( document.createTextNode( title ) );
			newMenu.firstChild.appendChild( newElement );
	
			/* メニューリスト追加 */
			newElement				= new CreEle( 'ul' );
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
		newMenuList[noKindStr]	= new CreateNewMenu( noKindStr );

		/* クリップリスト全体を走査 {{{*/
		( function()
		{
			var clipRoot = ( new ByClass( 'my_menu_clipgroup_list' ))[0];
			var clipList = new ByClass( clipRoot, 'clip_item' );
			for( var count =  clipList.length - 1; count >= 0; count-- )
			{
				var kindText = noKindStr;
				var clipText = ( new ByClass( clipList[count], 'clip_item_title' ) )[0].textContent;
				var clipName = clipText;

				/* セパレータ有りかチェック */
				var SepCheck = new RegExp( kindSep );
				if( SepCheck.test( clipText ) )
				{
					/* カテゴリメニュー未作成の場合は新規作成 */
					var SplitText = clipText.split( kindSep, 2 );
					kindText = SplitText[0];
					clipName = SplitText[1];
					if( !( kindText in newMenuList ) )
					{
						newMenuList[kindText] = new CreateNewMenu( kindText );
					}
				}

				/* 新メニューに移し替え */
				var	newMenu = ( new ByClass( newMenuList[kindText].firstChild, 'NewMenuList' ) )[0];
				newMenu.insertBefore( clipList[count], newMenu.firstChild );
				( new ByClass( newMenu, 'clip_item_title' ) )[0].textContent = clipName;
			}
		} )();
		/*}}}*/
		/*}}}*/

		/* 新メニューに付け替え {{{*/
		( function()
		{
			var menuBase = ( new ByClass( 'my_menu_clipgroup_list' ) )[0];

			/* 旧メニューを削除 */
			menuBase.removeChild( ( new ByTag( menuBase, 'ul' ) )[0] );

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
		var clipItems = ( new ByClass( ( new ByClass( 'my_menu_clipgroup_list' ) )[0], 'clip_item' ) );
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
		var CreatePopup	= ( function()
		{
			var	cloneBase = new CreEle( 'div' );

			return(
			{
				create:	function( popText )
				{
					var popupDiv	= cloneBase.cloneNode( true );
					popupDiv.className	= 'IllustCountPop';
					popupDiv.appendChild( new CreTNode( popText ) );
					return( popupDiv );
				}
			} );

		} )();
		/*}}}*/

		/* 種別分回す {{{*/
		var ClipMenuList = new ByClass( 'NewMenuList' );
		for( var MenuCount = 0, MenuLen = ClipMenuList.length; MenuCount < MenuLen; MenuCount++ )
		{
			/* クリップ分回す {{{*/
			var ClipItemList = new ByClass( ClipMenuList[MenuCount], 'clip_item' );
			for( var ClipCount = 0, ClipLen = ClipItemList.length; ClipCount < ClipLen; ClipCount++ )
			{
				var ItemAnchor	= ( new ByTag( ClipItemList[ClipCount], 'a' ) )[0];
				var ItemTile	= ItemAnchor.title;
				var ViewText	= /^.+:(\d+)枚の画像$/.exec( ItemTile );
				ClipItemList[ClipCount].appendChild( CreatePopup.create( ViewText[1] + '/ 500枚' ) );

				if( Number( ViewText[1], 10 ) >= clipAlartNum )
				{
					ClipItemList[ClipCount].className += 'ClipAlert';
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

/* RemodelClipPage() : クリップページの改造 {{{*/
function RemodelClipPage()
{
	/* 削除されたイラスト全チェックボタン追加 {{{*/
	( function()
	{
		var DeleteIllustCheck = new CreEle( 'span' );
		DeleteIllustCheck.appendChild( new CreTNode( '削除されたイラストを全て' ) );
		var CheckButton = new CreEle( 'input' );
		CheckButton.id			= 'deleteIllustSelectButton';
		CheckButton.className	= 'delete';
		CheckButton.type		= 'button';
		CheckButton.value		= ' 選択 ';
		CheckButton.addEventListener(
			'click',
			function()
			{
				var IllustList = new ByClass( 'clip_thumb' );
				for( var count = 0, len = IllustList.length; count < len; count++ )
				{
					var Illust = IllustList[count];
					if( /deleted\.png$/.test( ( new ByTag( Illust, 'img') )[0].src )		||
						/pic_no_disp\.gif$/.test( ( new ByTag( Illust, 'img') )[0].src )	)
					{
						( new ByClass( Illust, 'image_check' ) )[0].checked = true;
					}
				}
			},
			false
			);

		DeleteIllustCheck.appendChild( CheckButton );
		DeleteIllustCheck.appendChild( new CreTNode( 'する' ) );
		( new ByID( 'clip_area' ) ).insertBefore( DeleteIllustCheck, ( new ByClass( 'mode_button_list' ) )[0] );
	} )();
	/*}}}*/

	/* ページタイトルからページ選択までを一つのdviに納める {{{*/
	( function()
	{
		var clipArea	= new ByID( 'clip_area' );
		var headerDiv	= clipArea.appendChild( new CreEle( 'div' ) );
		headerDiv.id	= 'HeaderDiv';
		var searchBase	= new ByClass( clipArea, 'list_body' )[0];
		while( searchBase.previousElementSibling != null )
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
		var AddThumbPrefetch = ( function()
		{
			var	cloneBase	= new CreEle( 'img' );

			return(
			{
				setPrefetch: function( center_img_inner )
				{
					var IllustThumb				= cloneBase.cloneNode( true );
					var IllustSmall				= ( new ByTag( center_img_inner, 'img' ) )[0].src;
					var IllustMedium			= /^(http:\/\/lohas\.nicoseiga\.jp\/thumb\/\d+)q\?/.exec( IllustSmall );
					if( IllustMedium !== null )
					{
						IllustThumb.src				= IllustMedium[1] + 'i?';
						IllustThumb.style.display	= 'none';
						IllustThumb.style.position	= 'absolute';
						center_img_inner.appendChild( IllustThumb );
					}
				}
			} );
		} )();
		/*}}}*/

		/* イラストにクリックハンドラを追加 {{{*/
		function AddClickHandler( illustList )
		{
			/* ハンドラ本体 */
			function handler( e )
			{
				/* クリップのイラストチェックボックストグル */
				if( ( e.target.className === 'clip_thumb' ) ||
					( e.target.className === 'illust_title' ) )
				{
					var checkbox = ( new ByClass( e.target, 'image_check' ) )[0];
					checkbox.checked = !checkbox.checked;
				}
			}

			/* イラストリストから該当する物を抽出 */
			var clip_thumbs = new ByClass( illustList, 'clip_thumb' );

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
		function AddPrefetchImage( illustList )
		{
			/* イラストリストから該当する物を抽出 */
			var clip_thumbs = new ByClass( illustList, 'clip_thumb' );

			/* クリップリスト内のイラスト分回す */
			for( var count = 0, len = clip_thumbs.length, illust, imgInner; count < len; count++ )
			{
				illust		= clip_thumbs[count];
				imgInner	= ( new ByClass( illust, 'center_img_inner' ) )[0];
				AddThumbPrefetch.setPrefetch( imgInner );
			}
		}
		/*}}}*/

		/* 表示されている画像の元画像リンクリストを生成 {{{*/
		function AddIllustAnchorCreate( illustList )
		{
			var documentFrag		= document.createDocumentFragment();
			var	cloneBase			= new CreEle( 'a' );
			var clipList			= new ByClass( illustList, 'clip_thumb' );
			var regExp				= new RegExp( 'clip_image_(\\d+)' );
			for( var count = 0, len = clipList.length, illustID, anchorElement; count < len; count++ )
			{
				illustID			= regExp.exec( clipList[count].id );
				anchorElement		= cloneBase.cloneNode( true );
				anchorElement.href	= 'http://seiga.nicovideo.jp/image/source?id=' + illustID[1];
				documentFrag.appendChild( anchorElement );
			}
			( new ByID( 'IllustCollection' ) ).appendChild( documentFrag );
		}
		/*}}}*/

		//--------------------------------------------------------------------------------
		// ここから実行
		//--------------------------------------------------------------------------------
		var	clipArea		= new ByID( 'clip_area' );
		var	listBody		= ( new ByClass( clipArea, 'list_body' ) )[0];
		var	clipImageList	= new ByID( 'clip_image_list' );

		/* イラストにクリックハンドラを追加 {{{*/
		new AddClickHandler( clipImageList );
		/*}}}*/

		/* イラストページ画像のプリフェッチ追加 {{{*/
		new AddPrefetchImage( clipImageList );
		/*}}}*/

		/* リンクリスト表示DIVを生成 {{{*/
		var illustCollection = new CreEle( 'div' );
		illustCollection.id	= 'IllustCollection';
		illustCollection.style.display	= 'none';
		illustCollection.style.position	= 'absolute';
		( new ByTag( 'body' ) )[0].appendChild( illustCollection );
		new AddIllustAnchorCreate( clipImageList );
		/*}}}*/

		/* AutoPatchWork追加検出 {{{*/
		listBody.addEventListener(
			'AutoPatchWork.DOMNodeInserted',
			function( e )
			{
				if( /autopagerize_page_element/.test( e.target.className ) )
				{
					/* 追加された要素にクリックハンドラを追加 */
					new AddClickHandler( e.target );
					/* 追加された要素にプリフェッチを追加 */
					new AddPrefetchImage( e.target );
					/* 追加された要素から元画像のリンクを抽出 */
					new AddIllustAnchorCreate( e.target );
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
/* RemodelIllustHeader() : イラストページのヘッダを改造 {{{*/
function RemodelIllustHeader()
{
	/* タイトルとinfoを上下入れ替え調整 {{{*/
	( function()
	{
		var titleBlock	= ( new ByClass( 'title_block' ) )[0];
		var exp_header	= titleBlock.parentNode;
		exp_header.insertBefore( titleBlock, exp_header.firstChild );
	} )();
	/*}}}*/
	
	/* タイトルクリックでイラスト説明文を開閉 {{{*/
	( function()
	{
		var title = ( new ByClass( 'title_block' ) )[0];
		title.addEventListener(
			'click',
			function()
			{
				var titleBlock	= ( new ByClass( 'title_block' ) )[0];
				titleBlock.classList.toggle( 'open' );
			},
			false
			);
	} )();
	/*}}}*/
}
/*}}}*/

/* RemodelAddClip() : 静画画像のクリップ追加を改造  {{{*/
function RemodelAddClip()
{
	/* クリックイベント発行関数{{{*/
	function SendClick( SendElement )
	{
		var ClickEvent = new CreEve( 'MouseEvents' );
		ClickEvent.initEvent( 'click', false, true );
		SendElement.dispatchEvent( ClickEvent );
	}
	/*}}}*/

	/* ラジオボックスリスト枠 {{{*/
	var RemodelFrame  = ( function()
	{
		/* 枠生成 {{{*/
		var RemodelFrag	= document.createDocumentFragment();

		/* ラジオボックスリスト枠を生成 {{{*/
		var RadioBoxListFrame			= RemodelFrag.appendChild( new CreEle( 'div' ) );
		RadioBoxListFrame.id			= 'RadioBoxListFrame';
		RadioBoxListFrame.style.left	= ( ( new ByID( 'illust_main' ) ).offsetWidth + 4 ) + 'px';
		/*}}}*/

		/* ラジオボックスリストアウターを生成 {{{*/
		var ListFrameOuter	= RadioBoxListFrame.appendChild( new CreEle( 'div' ) );
		ListFrameOuter.id	= 'RadioBoxListOuter';
		/*}}}*/

		/* クリップ追加ボタン */
		/* クリップ追加ボタン枠を生成 {{{*/
		var RadioBoxClipButtonOuter = ListFrameOuter.appendChild( new CreEle( 'div' ) );
		RadioBoxClipButtonOuter.id	= 'RadioBoxClipButtonOuter';
		/*}}}*/

		/* クリップ追加ボタンを生成 {{{*/
		var RadioBoxClipButton		= RadioBoxClipButtonOuter.appendChild( new CreEle( 'input' ) );
		RadioBoxClipButton.type		= 'button';
		RadioBoxClipButton.id		= 'RadioBoxClipButton';
		/*}}}*/

		/* まとめて追加 */
		( new ByID( 'illust_main' ) ).appendChild( RemodelFrag );
		/*}}}*/

		/* クリップ追加ボタンイベント {{{
		 * ラジオボックスを調べて既存のクリップボタンへイベントを飛ばす
		 * 追加ボタンはcreateDocumentFragmentを使っているので後付け */
		( new ByID( 'RadioBoxClipButton' ) ).addEventListener(
			'click',
			function()
			{
				/* チェックされているラジオボックス検索 {{{*/
				var CheckedRadio = ( function()
				{
					var ClipRadioList	= ( new QSelA( '#ClipKindsTabPageOuter .ClipRadio' ) );
					for( var count = 0, len = ClipRadioList.length; count < len; count++ )
					{
						if( ClipRadioList[count].checked )
						{
							return( ClipRadioList[count] );
						}
					}

					return( null );
				} )();
				/*}}}*/

				/* チェックされている場合 {{{*/
				if( CheckedRadio !== null )
				{
					/* オリジナルのプルダウンメニューから同じ値の物を検索 {{{*/
					var orgItemList	= ( new QSelA( '#clip_list>.clip_item' ) );
					var RadioId		= CheckedRadio.dataset.radioId;
					for( var count = 0, len = orgItemList.length; count < len; count++ )
					{
						if( orgItemList[count].value === RadioId )
						{
							/* オリジナルのプルダウンメニューを変更 */
							( new ByID( 'group_id' ) ).selectedIndex = orgItemList[count].index;
		
							/* オリジナルクリップボタンのイベント発行 */
							new SendClick( new ByID( 'clip_add_button' ) );

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

		return( new ByID( 'RadioBoxListOuter' ) );
	} )();
	/*}}}*/

	/* タブ枠＆ページ枠生成 {{{*/
	/* タブ表示枠生成 {{{*/
	var ClipKindsTabOuter	= new CreEle( 'div' );
	ClipKindsTabOuter.id	= 'ClipKindsTabOuter';
	RemodelFrame.appendChild( ClipKindsTabOuter );
	/*}}}*/

	/* ページ表示枠生成 {{{*/
	var ClipKindsTabPageOuter	= new CreEle( 'div' );
	ClipKindsTabPageOuter.id	= 'ClipKindsTabPageOuter';
	RemodelFrame.appendChild( ClipKindsTabPageOuter );
	/*}}}*/

	/* タブ生成 {{{*/
	var CreateTab = ( function()
	{
		var cloneBase	= new CreEle( 'div' );
		return(
		{
			/* タブ生成 {{{*/
			create: function( cName, tName, pName, textContent )
			{
				/* タブ生成 {{{*/
				var TabElement				= cloneBase.cloneNode( true );
				TabElement.className		= cName;
				TabElement.dataset.tabName	= tName;
				TabElement.dataset.pageName	= pName;
				TabElement.appendChild( new CreTNode( textContent ) );
				/*}}}*/

				/* タブクリックイベント {{{*/
				TabElement.addEventListener(
					'click',
					function( e )
					{
						/* 一旦タブを全て非選択 */
						var Tabs = new QSelA( '#ClipKindsTabOuter>.ClipKindsTab' );
						for( var TabCount = 0, len = Tabs.length; TabCount < len; TabCount++ )
						{
							Tabs[TabCount].style.fontWeight	=	'normal';
						}
						e.target.style.fontWeight		= 'bold';

						/* ページ表示切り替え */
						var Pages = new QSelA( '#ClipKindsTabPageOuter>.ClipKindsTabPage' );
						for( var PageCount = 0, PageLen = Pages.length; PageCount < PageLen; PageCount++ )
						{
							if( Pages[PageCount].dataset.tabName === e.target.dataset.tabName )
							{
								Pages[PageCount].style.display	= 'block';
							} else {
								Pages[PageCount].style.display	= 'none';
							}
						}
					},
					false );
				/*}}}*/
				return( TabElement );
			}
			/*}}}*/
		} );
	} )();
	/*}}}*/

	/* ページ生成 {{{*/
	var CreatePage = ( function()
	{
		var cloneBase	= new CreEle( 'div' );

		return(
		{
			create: function( cName, tName, pName )
			{
				var PageElement	= cloneBase.cloneNode( true );
				PageElement.className			= cName;
				PageElement.dataset.tabName		= tName;
				PageElement.dataset.pageName	= pName;
				return( PageElement );
			}
		} );
	} )();
	/*}}}*/

	/*}}}*/

	/* ラジオボタン生成 {{{{*/
	var CreateRadio = ( function()
	{
		var cloneBase = document.createDocumentFragment();

		cloneBase.appendChild( new CreEle( 'div' ) );
		cloneBase.firstChild.appendChild( new CreEle( 'input' ) );
		cloneBase.firstChild.appendChild( new CreEle( 'label' ) );

		return(
		{
			/* 内容生成 {{{*/
			create:	function( iName, cName, tName, pName, rName, rID, textContent )
			{
				var Frag = cloneBase.cloneNode( true );
				var ClipRadioOuter	= Frag.firstChild;
				var	ClipRadio		= ClipRadioOuter.childNodes[0];
				var ClipRadioLabel	= ClipRadioOuter.childNodes[1];

				/* ラジオボタンラッパーを生成 */
				ClipRadioOuter.className			= cName + 'Outer';
				ClipRadioOuter.dataset.tabName		= tName;
				ClipRadioOuter.dataset.pageName		= pName;
				ClipRadioOuter.dataset.radioName	= rName;
				ClipRadioOuter.dataset.radioId		= rID;

				/* ラジオボタンを生成 */
				ClipRadio.type				= 'radio';
				ClipRadio.id				= iName;
				ClipRadio.className			= cName;
				ClipRadio.name				= cName;
				ClipRadio.dataset.tabName	= tName;
				ClipRadio.dataset.pageName	= pName;
				ClipRadio.dataset.radioName	= rName;
				ClipRadio.dataset.radioId	= rID;

				/* ラジオボタンのラベルを生成 */
				ClipRadioLabel.className			= cName + 'Label';
				ClipRadioLabel.htmlFor				= iName;
				ClipRadioLabel.dataset.tabName		= tName;
				ClipRadioLabel.dataset.pageName		= pName;
				ClipRadioLabel.dataset.radioName	= rName;
				ClipRadioLabel.dataset.radioId		= rID;
				ClipRadioLabel.textContent			= textContent;

				return( Frag );
			}
			/*}}}*/
		} );
	} )();
	/*}}}*/

	/* 高さ調整用空ページ {{{*/
	var BlankPageElement = CreatePage.create( 'ClipKindsTabPage', '', '高さ調整ページ' );
	BlankPageElement.style.display		= 'block';
	BlankPageElement.style.position		= 'relative';
	BlankPageElement.style.height		= '578px';
	ClipKindsTabPageOuter.appendChild( BlankPageElement );
	/*}}}*/

	/* タブとページ生成 {{{*/
	var TabList	= {};

	/* 未分類タブ＆ページ生成 {{{*/
	TabList[noKindStr]						= {};
	TabList[noKindStr][tabElementAttr]		= CreateTab.create( 'ClipKindsTab', noKindStr, noKindStr, noKindStr );
	TabList[noKindStr][tabPageElementAttr]	= CreatePage.create( 'ClipKindsTabPage', noKindStr, noKindStr );
	/*}}}*/

	/* クリップ一覧からタブを生成 {{{*/
	var SelectedRadio = ( function()
	{
		var sRadio = null;
		var ClipList = new QSelA( '#clip_list>.clip_item' );
		for( var ClipCount= 0, len = ClipList.length; ClipCount < len; ClipCount++ )
		{
			var KindText = '';
			/* クリップ名にセパレータがある場合は新規カテゴリ追加 {{{*/
			var KindCheck = new RegExp( kindSep );
			if( KindCheck.test( ClipList[ClipCount].textContent ) )
			{
				/* カテゴリ名を取得 */
				KindText = ClipList[ClipCount].textContent.split( "：", 1 )[0];

				/* 新規カテゴリ追加 */
				if( !( KindText in TabList ) )
				{
					/* リストに追加 */
					TabList[KindText]						= {};
					TabList[KindText][tabElementAttr]		= CreateTab.create( 'ClipKindsTab', KindText, KindText, KindText );
					TabList[KindText][tabPageElementAttr]	= CreatePage.create( 'ClipKindsTabPage', KindText, KindText );
				}
			}
			/*}}}*/

			/* ラジオボタンのセットを生成 {{{*/
			var ClipRadio = CreateRadio.create(
								'ClipRadio_' + ClipList[ClipCount].value,
								'ClipRadio',
								KindText ? KindText : noKindStr,
								KindText ? KindText : noKindStr,
								ClipList[ClipCount].textContent,
								ClipList[ClipCount].value,
								KindText	?	ClipList[ClipCount].textContent.split( kindSep, 2 )[1]
											:	ClipList[ClipCount].textContent.split( kindSep, 2 )[0]
								);

			/* ページへ登録 */
			if( KindText !== '' )
			{
				TabList[KindText][tabPageElementAttr].appendChild( ClipRadio );
			} else {
				TabList[noKindStr][tabPageElementAttr].appendChild( ClipRadio );
			}
			/*}}}*/

			/* 選択されているアイテムをチェック */
			if( ClipList[ClipCount].selected )
			{
				sRadio = ClipRadio.childNodes[0];
			}
		}

		return( sRadio );
	})();
	/*}}}*/

	/* タブ表示 {{{*/
	for( var Tab in TabList )
	{
		/* 未分類以外タブを追加 */
		if( Tab !== noKindStr )
		{
			ClipKindsTabOuter.appendChild( TabList[Tab][tabElementAttr] );
		}

		/* ページを追加 */
		ClipKindsTabPageOuter.appendChild( TabList[Tab][tabPageElementAttr] );
	}
	/* 未分類タブを最後に追加 */
	ClipKindsTabOuter.appendChild( TabList[noKindStr][tabElementAttr]);
	/*}}}*/
	/*}}}*/

	/* タグから推定されるクリップを検索 {{{*/
	var PresumedClip = ( function SearchPresumedClip( CR )
	{
		/* タグリストを生成 */
		var TagList = [];
		var TagAnchor = new QSelA( '#tag_block .tag' );
		for( var TagCount = 0, len = TagAnchor.length; TagCount < len; TagCount++ )
		{
			TagList.push( TagAnchor[TagCount].textContent );
		}

		/* カテゴリ */
		for( var Cat in CR )
		{
			var Category = Cat.length ? Cat + kindSep : '';
			/* クリップ */
			for( var Clip in CR[Cat] )
			{
				/* 正規表現条件 */
				for( var CRCount = 0, CRLen = CR[Cat][Clip].length; CRCount < CRLen; CRCount++ )
				{
					/* 取得タグ */
					for( var TLCount = TagList.length - 1; TLCount >= 0; TLCount-- )
					{
						var ClassRegex	= new RegExp( CR[Cat][Clip][CRCount], 'i' );
						var ClipRegex	= new RegExp( Clip, 'i' );
						if( ( ClassRegex.test( TagList[TLCount] ) || ( ClipRegex.test( TagList[TLCount], 'i' ) ) ) )
						{
							var RadioList = new ByClass( 'ClipRadio' );
							for( var RadioCount = 0, RadioLen = RadioList.length; RadioCount < RadioLen; RadioCount++ )
							{
								if( RadioList[RadioCount].dataset.radioName === ( Category + Clip ) )
								{
									return( RadioList[RadioCount] );
								}
							}
						}
					}
				}
			}
		}
		return( '' );
	} )( classifyRule );

	/* 推定クリップがある場合は置き換え */
	if( PresumedClip !== '' )
	{
		SelectedRadio = PresumedClip;
	}
	/*}}}*/

	/* ラジオボタン初期チェック {{{*/
	( function( Radio )
	{
		if( Radio )
		{
			Radio.checked = true;

			/* ラジオボタンチェックイベント発行 */
			var RadioCheckEvent = new CreEve( 'MouseEvents' );
			RadioCheckEvent.initEvent( 'change', false, true );
			Radio.dispatchEvent( RadioCheckEvent );
		}
	})( SelectedRadio );
	/*}}}*/

	/* ラジオボタン所属先タブ検索 {{{*/
	( function()
	{
		var Tabs = new QSelA( '.ClipKindsTab' );
		for( var TabCount = 0, len = Tabs.length; TabCount < len; TabCount++ )
		{
			if( Tabs[TabCount].dataset.tabName === SelectedRadio.dataset.tabName )
			{
				/* タブクリックイベント発行 */
				var ClickEvent = new CreEve( 'MouseEvents' );
				ClickEvent.initEvent( 'click', false, true );
				Tabs[TabCount].dispatchEvent( ClickEvent );
				return;
			}
		}
	})();
	/*}}}*/

	/* クリップ完了で自動で閉じる {{{*/
	( new ByID( 'clip_message')).addEventListener(
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
			new RemodelAddClip();

			/* ヘッダに開閉を付ける */
			new RemodelIllustHeader();
		}
		/* クリップのハンドラ */
		else if( /\/my\/clip.*/.test( window.location.href ) )
		{
			/* クリップメニューの改造 */
			new RemodelClipMenu();
			/* クリップページの改造 */
			new RemodelClipPage();
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

