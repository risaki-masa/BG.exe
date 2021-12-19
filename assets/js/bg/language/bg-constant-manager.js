if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.ConstantManager = Bepro.createSingleton( function() {
    // 定数
    const _MEMORY_MANAGER = Bg.MemoryManager.getInstance();

    // 変数
    let  _list = {};

    /**
     * 登録
     * @param {any} name        名前
     * @param {any} index       インデックス
     * @param {any} value       値
     * @param {any} statement   文
     */
    function _register( name, index, value, statement ) {
        if ( _exists( name ) ) {
            Bg.MessageList.DUPLICATED_CONSTANT_NAME
                .format( name )
                .throwErrorWithLineNumber( statement )
            ;
        }

        const INDEX = _MEMORY_MANAGER.register( index, value, statement );
        _list[name] = INDEX;
    }

    /**
     * 全て登録を解除
     */
    function _unregisterAll() {
        _list = {};
    }

    /**
     * 値を取得
     * @param {any} name 名前
     * @returns 値
     */
    function _getValue( name ) {
        return _MEMORY_MANAGER.getValue( _list[name] );
    }

    /**
     * 定数が存在するか判断する値を取得
     * @param {any} name 名前
     * @returns 定数が存在するか判断する値
     */
    function _exists( name ) {
        return _list.hasOwnProperty( name );
    }

    return {
        register            : _register,
        unregisterAll       : _unregisterAll,
        getValue            : _getValue,
        exists              : _exists,
    };
} );