if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.Expression = function( _expression, _lineNumber ) {
    /**
     * 行番号を取得
     * @returns 行番号
     */
    function _getLineNumber() {
        return _lineNumber;
    }

    /**
     * 含まれているか判断する値を取得
     * @param   {any} pattern   パターン
     * @returns 含まれているか判断する値
     */
    function _isContaining( pattern ) {
        return _expression.indexOf( pattern ) !== -1;
    }

    /**
     * 正規表現に一致した文字列を取得
     * @param   {any} regex 正規表現
     * @returns 正規表現に一致した文字列
     */
    function _getMatchedRegex( regex ) {
        return _expression.match( regex );
    }

    /**
     * 前から一致したインデックスを取得
     * @param   {any} pattern   パターン
     * @param   {any} index     インデックス
     * @returns 一致したインデックス
     */
    function _getMatchedIndexFromFront( pattern, index ) {
        return _expression.indexOf( pattern, index );
    }

    /**
     * 最初から一致したインデックスを取得
     * @param   {any} pattern   パターン
     * @param   {any} index     インデックス
     * @returns 一致したインデックス
     */
    function _getMatchedIndexFromFirst( pattern ) {
        return _expression.indexOf( pattern );
    }

    /**
     * 後ろから一致したインデックスを取得
     * @param   {any} pattern   パターン
     * @param   {any} index     インデックス
     * @returns 一致したインデックス
     */
    function _getMatchedIndexFromBack( pattern, index ) {
        return _expression.lastIndexOf( pattern, index );
    }

    /**
     * 最後から一致したインデックスを取得
     * @param   {any} pattern   パターン
     * @returns 一致したインデックス
     */
    function _getMatchedIndexFromLast( pattern ) {
        return _expression.lastIndexOf( pattern );
    }

    /**
     * インデックス間を置き換え
     * @param   value       値
     * @param   startIndex  開始インデックス
     * @param   endIndex    終了インデックス
     * @return  置き換えた文字列
     */
    function _replaceBetweenIndices( value, startIndex, endIndex ) {
        const EXPRESSION = _expression.replaceBetweenIndices( 
            value, 
            startIndex, 
            endIndex
        );

        return _create( EXPRESSION );
    }

    /**
     * 開始インデックスから、終了インデックスの前までで切り取り
     * @param   {any} startIndex  開始インデックス
     * @param   {any} endIndex    終了インデックス
     * @returns 式
     */
    function _slice( startIndex, endIndex ) {
        const EXPRESSION = _expression.slice( startIndex, endIndex );
        return _create( EXPRESSION );
    }

    /**
     * 最初から、インデックスの前までの式を取得
     * @param   {any} index インデックス
     * @returns 式
     */
    function _getFromFirst( index ) {
        const EXPRESSION = _expression.getFromFirst( index );
        return _create( EXPRESSION );
    }

    /**
     * インデックスから、最後までの式を取得
     * @param   {any} index インデックス
     * @returns 式
     */
    function _getToLast( index ) {
        const EXPRESSION = _expression.getToLast( index );
        return _create( EXPRESSION );
    }

    /**
     * 開く( 丸 )括弧のインデックスを取得
     * @returns 開き( 丸 )括弧のインデックス
     */
    function _getOpenParenthesisIndex() {
        return _expression.getOpenParenthesisIndex( this );
    }

    /**
     * 閉じ( 丸 )括弧のインデックスを取得
     * @param   openIndex 開く( 丸 )括弧のインデックス
     * @returns 閉じ( 丸 )括弧のインデックス
     */
    function _getCloseParenthesisIndex( openIndex ) {
        return _expression.getCloseParenthesisIndex( openIndex, this );
    }

    /**
     * 開く( 角 )括弧のインデックスを取得
     * @returns 開き( 角 )括弧のインデックス
     */
    function _getOpenBracketIndex() {
        return _expression.getOpenBracketIndex( this );
    }

    /**
     * 閉じ( 角 )括弧のインデックスを取得
     * @param   openIndex 開く( 角 )括弧のインデックス
     * @returns 閉じ( 角 )括弧のインデックス
     */
    function _getCloseBracketIndex( openIndex ) {
        return _expression.getCloseBracketIndex( openIndex, this );
    }


    /**
     * クォートのインデックスのペアを取得
     *
     * @returns
     */
    function _getQuoteIndexPairs() {
        return _expression.getQuoteIndexPairs();
    }

    /**
     * 作成
     * @param   {any} expression 式を表す文字列
     * @returns 式
     */
    function _create( expression ) {
        return new Bg.Expression( expression, _lineNumber );
    }

    /**
     * 式を取得
     * @returns 式
     */
    function _get() {
        return _expression;
    }

    return {
        getLineNumber           : _getLineNumber,
        isContaining            : _isContaining,
        getMatchedRegex         : _getMatchedRegex,
        replaceBetweenIndices   : _replaceBetweenIndices,
        getMatchedIndexFromFront: _getMatchedIndexFromFront,
        getMatchedIndexFromFirst: _getMatchedIndexFromFirst,
        getMatchedIndexFromBack : _getMatchedIndexFromBack,
        getMatchedIndexFromLast : _getMatchedIndexFromLast,
        slice                   : _slice,
        getFromFirst            : _getFromFirst,
        getToLast               : _getToLast,
        getOpenParenthesisIndex : _getOpenParenthesisIndex,
        getCloseParenthesisIndex: _getCloseParenthesisIndex,
        getOpenBracketIndex     : _getOpenBracketIndex,
        getCloseBracketIndex    : _getCloseBracketIndex,
        getQuoteIndexPairs      : _getQuoteIndexPairs,
        get                     : _get,
    };
};