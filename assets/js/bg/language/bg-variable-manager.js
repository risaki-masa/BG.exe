if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.VariableManager = function() {
    // 定数
    const _LIST                     = {};
    const _RESERVED_WORD_CHECKER    = new Bg.ReservedWordChecker;
    const _MEMORY_MANAGER           = Bg.MemoryManager.getInstance();
    
    /**
     * 登録
     * @param {any} name                    名前
     * @param {any} index                   インデックス
     * @param {any} statementOrExpression   文、または式
     */
    function _register( name, index, statementOrExpression ) {
        if ( _exists( name ) ) {
            Bg.MessageList.DUPLICATED_VARIABLE_NAMES
                .format( name )
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        if ( _RESERVED_WORD_CHECKER.isMatchedAny( name ) ) {
            Bg.MessageList.DUPLICATED_VARIABLE_NAME_AND_RESERVED_WORD
                .format( name )
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        _LIST[name] = index;
    }

    /**
     * 更新
     * @param {any} name                    名前
     * @param {any} value                   値
     * @param {any} statementOrExpression   文、または式
     */
    function _update( name, value, statementOrExpression ) {
        if ( !_exists( name ) ) {
            Bg.MessageList.NOT_DEFINED_VARIABLE
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        _MEMORY_MANAGER.update( 
            _LIST[name], 
            value, 
            statementOrExpression 
        );
    }

    /**
     * 値を取得
     * @param   {any} name 名前
     * @returns 値
     */
    function _getValue( name ) {
        return _MEMORY_MANAGER.getValue( _LIST[name] );
    }

    /**
     * 自動で登録したメモリの登録を解除
     */
    function _unregisterAutoMemories() {
        for ( let key in _LIST ) {
            let index = _LIST[key];
            
            _MEMORY_MANAGER.unregisterIfAuto( index );
        }
    }

    /**
     * 変数が存在するか判断する値を取得
     * @param   {any} name 名前
     * @returns 変数が存在するか判断する値
     */
    function _exists( name ) {
        return _LIST.hasOwnProperty( name );
    }

    return {
        register                : _register,
        update                  : _update,
        getValue                : _getValue,
        unregisterAutoMemories  : _unregisterAutoMemories,
        exists                  : _exists,
    }
}