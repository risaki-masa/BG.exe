/**
 * 配列内の文字列を整形
 * @return 整形後の配列
 */
Array.prototype.trim = function() {
    const onTrim = function( string ) {
        return string.trim(); 
    };

    return this.map( onTrim );
};

/**
 * 2つ一組の配列にする
 * @param   other 他の配列
 * @return  2つ一組の配列
 */
Array.prototype.toPair = function( others ) {
    const COUNT = this.length;
    const PAIRS = [];

    for ( let i = 0; i < COUNT; i++ ) {
        PAIRS.push( [ this[i], others[i] ] );
    }

    return PAIRS;
};

/**
 * 最大値の要素を取得
 * @param   onGetValue 値を取得する時の処理
 * @return  最大値の要素
 */
Array.prototype.getMax = function( onGetValue ) {
    if ( onGetValue === undefined ) {
        onGetValue = function( value ) { return value };
    }

    const onCompare = function( previous, current ) {
        return current > previous;
    };

    return this.squeeze( onGetValue, onCompare );
};

/**
 * 絞る
 * @param   onGetValue  値を取得する時の処理
 * @param   onCompare   比較する時の処理
 * @return  絞った要素
 */
Array.prototype.squeeze = function( onGetValue, onCompare ) {
    const COUNT = this.length;
    if ( COUNT === 0 ) return null;

    let target      = this[0];
    let previous    = onGetValue( this[0] );

    for ( let i = 1; i < COUNT; i++ ) {
        let element = this[i];
        let value   = onGetValue( element );

        if ( !onCompare( previous, value ) ) continue;
        previous    = value;
        target      = element;
    }

    return target;
};

/**
 * 最初に一致した要素を取得
 * @param   onMatch 一致したか判断するときの処理
 * @return  一致した要素
 */
Array.prototype.getMatchedFirst = function( isMatched ) {
    const COUNT = this.length;

    for ( let i = 0; i < COUNT; i++ ) {
        let element = this[i];
        if ( isMatched( element, i ) ) return element;
    }

    return undefined;
};

/**
 * 最初の要素、またはデフォルト値を取得
 * @param   defaultValue デフォルト値
 * @return  最初の要素、またはデフォルト値
 */
Array.prototype.getFirstOrDefault = function( defaultValue ) {
    return this.length === 0 ? defaultValue : this[0];
};

/**
 * 最後の要素を取得
 * @return 最後の要素
 */
Array.prototype.getLast = function() {
    return this[this.length - 1];
};

/**
 * 最後の要素、またはデフォルト値を取得
 * @param   defaultValue デフォルト値
 * @return  最初の要素、またはデフォルト値
 */
Array.prototype.getLastOrDefault = function( defaultValue ) {
    return this.length === 0 ? defaultValue : this.getLast();
};

/**
 * 任意の数に分割
 * @param   count 数
 * @return  分割した配列
 */
Array.prototype.divide = function( count ) {
    const COUNT = this.length;
    if ( COUNT === 0 ) return [];

    let     index       = 0;
    let     nextIndex   = index + count;
    const   ELEMENTS    = [];

    while ( nextIndex < COUNT ) {
        let element  = this.slice( index, nextIndex );
        ELEMENTS.push( element );

        index       = nextIndex;
        nextIndex  += count; 
    }

    let element = this.slice( index, COUNT + 1 );
    ELEMENTS.push( element );

    return ELEMENTS;
};

/**
 * 呼び出す
 */
Array.prototype.call = function() {
    this.forEach( function( value ) { value(); } );
};

/**
 * 数値か判断する値を取得
 * @returns 全て数値か判断する値
 */
Array.prototype.areNumbers = function() {
    const isNumber = function( value ) {
        return Bepro.isNumber( value );
    };

    return this.every( isNumber )
};
