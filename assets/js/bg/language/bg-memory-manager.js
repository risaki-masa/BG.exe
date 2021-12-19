if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.MemoryManager = Bepro.createSingleton( function() {
    // 定数
    const _ANY_MIN_INDEX    = 0;
    const _AUTO_MIN_INDEX   = 10000000;

    // 変数
    let _list = {};
    
    /**
     * 登録
     * @param   {any} index                   インデックス
     * @param   {any} value                   値
     * @param   {any} statementOrExpression   文、または式
     * @returns インデックス
     */
    function _register( index, value, statementOrExpression ) {
        return Bg.isAutoIndex( index ) ?
            _registerAuto( value, statementOrExpression ) : 
            _registerAny( index, value, statementOrExpression )
        ;
    }

    /**
     * 更新
     * @param   {any} index                 インデックス
     * @param   {any} value                 値
     * @param   {any} statementOrExpression 文、または式
     * @returns インデックス
     */
    function _update( index, value, statementOrExpression ) {
        if ( !_exists( index ) ) {
            Bg.MessageList
                .MEMORY_INDEX_IS_INVALID
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        _list[index] = value;
    }

    /**
     * 自動で登録
     * @param   {any} value                   値
     * @param   {any} statementOrExpression   文、または式
     * @returns インデックス
     */
    function _registerAuto( value, statementOrExpression ) {
        let index = _AUTO_MIN_INDEX;
        while ( _exists( index ) ) index++;

        _list[index] = value;
        return index;
    }

    /**
     * 任意で登録
     * @param   {any} index                   インデックス
     * @param   {any} value                   値
     * @param   {any} statementOrExpression   文、または式
     * @returns インデックス
     */
    function _registerAny( index, value, statementOrExpression ) {
        if ( !Number.isInteger( index )  ) {
            Bg.MessageList.MEMORY_INDEX_IS_NOT_INTEGER
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }
        
        const IS_NOT_IN_RANGE = index < _ANY_MIN_INDEX || index >= _AUTO_MIN_INDEX;

        if ( IS_NOT_IN_RANGE ) {
            Bg.MessageList.MEMORY_INDEX_IS_OUT_OF_RANGE
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        _list[index] = value;

        return index;
    }

    /**
     * 自動で登録したメモリの場合、登録を解除
     * @param {any} index インデックス
     */
    function _unregisterIfAuto( index ) {
        if ( index < _AUTO_MIN_INDEX ) return;
        delete _list[index];
    }

    /**
     * 全て登録解除
     */
    function _unregisterAll() {
        _list = {};
    }

    /**
     * 値を取得
     * @param   {any} index インデックス
     * @returns 値
     */
    function _getValue( index ) {
        return _list[index];
    }

    /**
     * メモリが存在するか判断する値を取得
     * @param   {any} index インデックス
     * @returns メモリが存在するか判断する値
     */
    function _exists( index ) {
        return _list.hasOwnProperty( index );
    }

    return {
        register        : _register,
        update          : _update,
        unregisterIfAuto: _unregisterIfAuto,
        unregisterAll   : _unregisterAll,
        getValue        : _getValue,
        exists          : _exists,
    };
} );