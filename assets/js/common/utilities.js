if ( typeof Bepro === 'undefined' ) var Bepro = {};

// 定数
Bepro.TagName = {
    DIV : 'div',
    LI  : 'li',
    OL  : 'ol',
};

Bepro.EscapeList = {
    '&': '&amp;',
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
};

Object.freeze( Bepro.TagName );
Object.freeze( Bepro.EscapeList );

// 変数
Bepro._leftSide             = null;
Bepro._canUsePassive        = null;
Bepro._isIE                 = null;
Bepro._isMacOS              = null;
Bepro._onResizedWindowList  = [];

/**
 * クッキーを設定
 * @param name  名前
 * @param value 値
 */
Bepro.setCookie = function( name, value ) {
    document.cookie = name + '=' + value + ';path=/';
};

/** 
 * 左側を取得
 * @return 左側
 */
Bepro.getLeftSide = function() {
    if ( Bepro._leftSide !== null ) return Bepro._leftSide;

    const LEFT_SIDE         = document.getElementById( 'left-side' );
    const onScrollingList   = [];

    LEFT_SIDE.registerOnScrolling = function( onScrolling ) {
        onScrollingList.push( onScrolling );
        if ( onScrollingList.length > 1 ) return;

        const INTERVAL  = 100;
        const LEFT_SIDE = Bepro.getLeftSide();
        const OPTION    = Bepro.getPassiveOption();
        
        const onCall            = function() { onScrollingList.call(); };
        const observingEvent    = Bepro.createObservingEvent( INTERVAL, onCall, onCall, null );
        
        LEFT_SIDE.addEventListener( 'scroll', observingEvent, OPTION );
    };

    let scrollTimeoutId = null;

    LEFT_SIDE.scrollByPosition = function( position ) {
        if ( scrollTimeoutId !== null ) return;

        const LEFT_SIDE     = Bepro.getLeftSide();
        const MAX_POSITION  = LEFT_SIDE.getScrollMaxPositionY();

        let currentPosition = LEFT_SIDE.getScrollPositionY();
        if ( position > MAX_POSITION ) position = MAX_POSITION;
        
        const   DIRECTION   = position < currentPosition ? -1 : 1;
        const   SPEED       = 70;
        const   MOVEMENT    = SPEED * DIRECTION;
        const   INTERVAL    = 15;

        const onScroll = function() {
            currentPosition += MOVEMENT;

            const IS_COMPLETED =
                ( DIRECTION ===  1 && currentPosition >= position ) ||
                ( DIRECTION === -1 && currentPosition <= position )
            ;

            if ( IS_COMPLETED ) {
                LEFT_SIDE.setScrollPositionY( position );
                scrollTimeoutId = null;

                return;
            }

            LEFT_SIDE.setScrollPositionY( currentPosition );
            scrollTimeoutId = setTimeout( onScroll, INTERVAL );
        };

        onScroll();
    };

    LEFT_SIDE.scrollByElement = function( element ) {
        const POSITION = element.offsetTop;
        LEFT_SIDE.scrollByPosition( POSITION );
    };

    Bepro._leftSide = LEFT_SIDE;
    return Bepro._leftSide;
};

/**
 * 監視するイベントを作成
 * @param interval      間隔
 * @param onStarted     開始した時の処理
 * @param onExecuting   実行している時の処理
 * @param onEnded       終了した時の処理
 */
Bepro.createObservingEvent = function( interval, onStarted, onExecuting, onEnded ) {
    let intervalID  = null;
    let isExecuting = false;

    const onElapsed = function() {
        if ( !isExecuting ) {
            clearInterval( intervalID );
            intervalID = null;

            if ( onEnded !== null ) onEnded();
            return;
        }

        if ( onExecuting !== null ) onExecuting();
        isExecuting = false;
    };

    const onExecute = function() {
        isExecuting = true;

        if ( intervalID !== null ) return;

        if ( onStarted !== null ) onStarted();
        intervalID = setInterval( onElapsed, interval );
    };

    return onExecute;
};

/**
 * パッシブ( イベントリスナー )が使用できるか判断する値を取得
 * @return パッシブ( イベントリスナー )が使用できるか判断する値
 */
Bepro.canUsePassive = function() {
    const IS_NOT_FIRST_CALL = Bepro._canUsePassive !== null;
    if ( IS_NOT_FIRST_CALL ) return;

    Bepro._canUsePassive  = false;
    
    const PROPERTY  = { get: function() { Bepro._canUsePassive = true; } };
    const OPTIONS   = Object.defineProperty( {}, 'passive', PROPERTY );

    window.addEventListener( 'dummy', null, OPTIONS );

    return Bepro._canUsePassive;
};

/**
 * パッシブ( イベントリスナー )のオプションを取得
 * @return パッシブ( イベントリスナー )のオプション
 */
Bepro.getPassiveOption = function() {
    return Bepro.canUsePassive() ? { passive: true } : false;
};

/**
 * HTMLをエスケープ
 * @param   value 値
 * @return  エスケープした文字列
 */
 Bepro.escapeHtml = function( value ) {
    if( !Bepro.isString( value ) ) return value;

    const onEscape = function( character ) { 
        return Bepro.EscapeList[character];
    };
    
    return value.replace( /[&'`"<>]/g, onEscape );
};

/**
 * 文字列か判断する値を取得
 * @param   value 値
 * @returns 文字列か判断する値
 */
Bepro.isString = function( value ) {
    return typeof value === 'string';
};

/**
 * 数値か判断する値を取得
 * @param   value 値
 * @returns 数値か判断する値
 */
Bepro.isNumber = function( value ) {
    return typeof value === 'number';
};

/**
 * ブール値か判断する値を取得
 * @param   value 値
 * @returns ブール値か判断する値
 */
Bepro.isBoolean = function( value ) {
    return typeof value === 'boolean';
};

/**
 * シングルトンを作成
 * @param   onCreate 作成する時の処理
 * @returns シングルトンオブジェクト
 */
Bepro.createSingleton = function( onCreate ) {
    let instance = null;

    return {
        getInstance: function() {
            if ( instance === null ) instance = onCreate();
            return instance;
        },
    };
};

/**
 * Internet Explorerか判断する値を取得
 * @returns Internet Explorerか判断する値
 */
Bepro.isIE = function() {
    if ( Bepro._isIE === null ) {
        const USER_AGENT    = window.navigator.userAgent.toLowerCase();
        Bepro._isIE         = 
            USER_AGENT.indexOf( 'msie' )    !== -1 || 
            USER_AGENT.indexOf( 'trident' ) !== -1
        ;
    }

    return Bepro._isIE;
};

/**
 * MacOSか判断する値を取得
 * @returns MacOSか判断する値
 */
Bepro.isMacOS = function() {
    if ( Bepro._isMacOS === null ) {
        const USER_AGENT    = window.navigator.userAgent;
        Bepro._isMacOS      = USER_AGENT.indexOf( 'Mac' ) !== -1;
    }

    return Bepro._isMacOS;
};

/**
 * クリップボードへコピー
 * @param text テキスト
 */
Bepro.copyToClipboard = function( text ) {
    const BODY              = document.body;
    const TEMP_TEXT_AREA    = document.createElement( 'textarea' );
    TEMP_TEXT_AREA.value    = text;

    BODY.appendChild( TEMP_TEXT_AREA );
    TEMP_TEXT_AREA.select();

    document.execCommand( 'copy' );
    BODY.removeChild( TEMP_TEXT_AREA )
};

/**
 * テキストファイルとしてダウンロード
 * @param fileName  ファイル名
 * @param content   コンテンツ
 */
Bepro.downloadAsTextFile = function( fileName, content ) {
    const BLOB              = new Blob( [ content ], { 'type': 'text/plain' } );
    const CAN_USE_SAVE_BLOB = window.navigator.msSaveBlob !== undefined;

    if ( CAN_USE_SAVE_BLOB ) {
        window.navigator.msSaveBlob( BLOB, fileName );
        return;
    }

    const TEMP_ANCHOR   = document.createElement( 'a' );
    TEMP_ANCHOR.href    = URL.createObjectURL( BLOB );
    TEMP_ANCHOR.setAttribute( 'download', fileName );

    TEMP_ANCHOR.dispatchEvent( new MouseEvent( 'click' ) );
};

/**
 * DOMを読み込み後( 構築した時 )の処理
 */
Bepro.onLoadedDom = function() {
    const REGISTERER_LIST = [
        new Bepro.HoverEventRegisterer,
    ];

    REGISTERER_LIST.forEach( function( registerer ) {
        registerer.register();
    } );
};

document.addEventListener( 'DOMContentLoaded', Bepro.onLoadedDom );
