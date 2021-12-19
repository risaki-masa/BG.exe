if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.BlockCommandType = {
    IF      : 0,
    WHILE   : 1,
};

Object.freeze( Bg.BlockCommandType );

Bg.BlockInfoStack = function() {
    // 定数
    const _LIST = [];

    /**
     * 末尾に情報を追加
     * @param {any} commandType 命令の種類
     * @param {any} funcIndex   関数のインデックス
     */
    function _push( commandType, funcIndex ) {
        const INFO = { 
            commandType : commandType, 
            funcIndex   : funcIndex,
        };
        
        _LIST.push( INFO );
    }

    /**
     * 末尾の情報を取り出す
     * @returns 情報
     */
    function _pop() {
        return _LIST.length !== 0 ? _LIST.pop() : null;
    }

    return {
        push: _push,
        pop : _pop,
    };
}

Bg.BlockController = function() {
    /**
     * 制御
     * @param {any} func 関数
     * @param {any} info 情報
     */
    function _control( func, info ) {
        if ( info === null ) return;

        switch ( info.commandType ) {
            case Bg.BlockCommandType.WHILE:
                _controlAsWhile( func, info );
                break;
        }
    }

    /**
     * while文として、制御
     * @param {any} func 関数
     * @param {any} info 情報
     */
    function _controlAsWhile( func, info ) {
        func.toLine( info.funcIndex );
    }

    return {
        control: _control
    };
};

