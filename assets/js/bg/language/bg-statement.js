if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.Statement = function( _line, _lineNumber ) {
    // 定数
    const _INDENT_COUNT = _line.getIndentCount();
    const _STATEMENT    = _line.getToLast( Bg.INDENT_BLANK_COUNT * _INDENT_COUNT );

    /**
     * インデント数を取得
     * @returns インデント数
     */
    function _getIndentCount() {
        return _INDENT_COUNT;
    }

    /**
     * 行番号を取得
     * @returns 行番号
     */
    function _getLineNumber() {
        return _lineNumber;
    }

    /**
     * 最初が一致するか判断する値を取得
     * @param   {any} pattern パターン
     * @returns 最初が一致するか判断する値
     */
    function _isMatchedFirst( pattern ) {
        return _STATEMENT.isMatchedFirst( pattern );
    }

    /**
     * 正規表現に一致した文字列を取得
     * @param   {any} regex 正規表現
     * @returns 正規表現に一致した文字列
     */
    function _getMatchedRegex( regex ) {
        return _STATEMENT.match( regex );
    }

    /**
     * 正規表現と一致したか判断する値を取得
     * @param   {any} regex 正規表現
     * @returns 正規表現と一致したか判断する値
     */
    function _isMatchedRegex( regex ) {
        return regex.test( _STATEMENT );
    }

    /**
     * 文を取得
     * @returns 文
     */
    function _get() {
        return _STATEMENT;
    }

    return {
        getIndentCount  : _getIndentCount,
        getLineNumber   : _getLineNumber,
        isMatchedFirst  : _isMatchedFirst,
        getMatchedRegex : _getMatchedRegex,
        isMatchedRegex  : _isMatchedRegex,
        get             : _get,
    };
};