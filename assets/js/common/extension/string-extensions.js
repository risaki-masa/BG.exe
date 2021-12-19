/**
 * 最初と一致したか判断する値を取得
 * @param   pattern パターン
 * @return  最初と一致したか判断する値
 */
String.prototype.isMatchedFirst = function( pattern ) {
    return this.lastIndexOf( pattern, 0 ) === 0;
};

/**
 * インデックスから最初と一致するか判断する値を取得
 * @param   pattern パターン
 * @param   index   インデックス
 * @return インデックスから最初と一致するか判断する値
 */
String.prototype.isMatchedFirstFromIndex = function( pattern, index ) {
    return this.getToLast( index )
        .isMatchedFirst( pattern )
    ;
};

/**
 * 最後と一致したか判断する値を取得
 * @param   pattern パターン
 * @return  最後と一致したか判断する値
 */
String.prototype.isMatchedLast = function( pattern ) {
    const INDEX = this.lastIndexOf( pattern );
    if ( INDEX === -1 ) return false;

    return INDEX + pattern.length === this.length;
};

/**
 * インデックスまで最後と一致するか判断する値を取得
 * @param   pattern パターン
 * @param   index   インデックス
 * @return インデックスから最後と一致するか判断する値
 */
String.prototype.isMatchedLastToIndex = function( pattern, index ) {
    return this.getFromFirst( index )
        .isMatchedLast( pattern )
    ;
};

/**
 * 最初からインデックスの前までの文字列を取得
 * @param   index   インデックス
 * @return  string  最初から、インデックスの前までの文字列
 */
String.prototype.getFromFirst = function( index ) {
    return this.slice( 0, index );
};

/**
 * インデックスから、最後までの文字列を取得
 * @param   index   インデックス
 * @return  string  インデックスから、最後までの文字列
 */
String.prototype.getToLast = function( index ) {
    return this.substr( index );
};

/**
 * インデックス間を置き換え
 * @param   value       値
 * @param   startIndex  開始インデックス
 * @param   endIndex    終了インデックス
 * @return  置き換えた文字列
 */
String.prototype.replaceBetweenIndices = function( value, startIndex, endIndex ) {
    return this.getFromFirst( startIndex ) + value + this.getToLast( endIndex );
};

/**
 * インデックスで挿入
 * @param   value   値
 * @param   index   インデックス
 * @return  挿入後の文字列
 */
String.prototype.insertByIndex = function( value, index ) {
    return this.getFromFirst( index ) + value + this.getToLast( index );
};

/**
 * インデックスを検索
 * @param   pattern パターン
 * @return  インデックス( の配列 )
 */
String.prototype.findIndices = function( pattern ) {
    let     index   = this.indexOf( pattern );
    const   INDICES = [];

    while ( index !== -1 ) {
        INDICES.push( index );
        index = this.indexOf( pattern, index + 1 );
    }

    return INDICES
};

/**
 * インデックスで分割
 * @param   indices インデックス
 * @return  分割した文字列( の配列 )
 */
String.prototype.splitByIndices = function( indices ) {
    const   STRINGS     = [];
    let     target      = this;
    let     indexOffset = 0;

    indices.forEach( function( index ) {
        index -= indexOffset;

        const SPLITED_STRING    = target.getFromFirst( index );
        const CONMMA_INDEX      = index + 1;

        target          = target.getToLast( CONMMA_INDEX );
        indexOffset    += CONMMA_INDEX;

        STRINGS.push( SPLITED_STRING );
    } );

    STRINGS.push( target );

    return STRINGS;
};

/**
 * 形式を整える
 * @return 整えた文字列
 */
String.prototype.format = function() {
    const DATAS     = Array.prototype.slice.call( arguments );
    const onReplace = function( matched, index ) { return DATAS[index]; };

    return this.replace( /\{([0-9]+)\}/g, onReplace );
};

/**
 * 行を取得
 * @return 行
 */
String.prototype.getLines = function() {
    return this.split( /\r\n|\r|\n/ );
};

/**
 * 行数を取得
 * @return 行数
 */
String.prototype.getLineCount = function() {
    return this.getLines().length;
};

/**
 * 拡張子を取得
 * @return 拡張子
 */
String.prototype.getExtension = function() {
    const DOT_INDEX = this.lastIndexOf( '.' );
    return this.getToLast( DOT_INDEX );
};

/**
 * 先頭の空白数を取得
 * @return 拡張子
 */
String.prototype.getBlankCountOfFirst = function() {
    let pattern = ' ';
    while ( this.isMatchedFirst( pattern ) ) pattern += ' ';

    return pattern.length - 1;
};

/**
 * 自身を繰り返す
 * @param  count インデックス
 * @return 繰り返した文字列
 */
String.prototype.repeatSelf = function( count ) {
    let string = '';
    for ( let i = 0; i < count; i++ ) string += this;

    return string;
}

/**
 * 前方の空白なしで取得
 * @return 空白を除いた文字列
 */
String.prototype.getWithoutFrontBlanks = function() {
    const BLANK_COUNT = this.getBlankCountOfFirst();
    return this.getToLast( BLANK_COUNT );
};

/**
 * 要素を作成
 * @param   classeNames クラス名
 * @return  要素
 */
String.prototype.createElement = function() {
    return document.createElement( this );
};

/**
 * 要素を作成
 * @param   className クラス名
 * @return  要素
 */
String.prototype.createElementAndAddClass = function( className ) {
    const ELEMENT = document.createElement( this );
    ELEMENT.classList.add( className );

    return ELEMENT;
}

/**
 * 要素を作成し、クラスを追加
 * @param   classeNames クラス名
 * @return  要素
 */
String.prototype.createElementAndAddClasses = function( classNames ) {
    const ELEMENT       = document.createElement( this );
    const CLASS_LIST    = ELEMENT.classList;

    classNames.forEach( function( name ) { CLASS_LIST.add( name ); } );

    return ELEMENT;
};

/**
 * 整数に変換
 * @return 整数
 */
String.prototype.toInteger = function() {
    return parseInt( this );
};