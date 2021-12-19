if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.WaitController = Bepro.createSingleton( function() {
    // 変数
    let _waitId = null;

    /**
     * 待機
     * @param {any} interval        間隔
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _wait( interval, executingFunc, funcExecutor ) {
        const onWaited  = function() {
            _waitId = null;
            executingFunc.setWait( false );

            try {
                funcExecutor.execute( executingFunc );
            }
            catch ( error ) {
                error.show();

                Bg.InputManager
                    .getInstance()
                    .resetAll()
                ;
            }
        };

        executingFunc.setWait( true );
        _waitId = setTimeout( onWaited, interval );
    }

    /**
     * 待機中の場合、取り消す
     */
    function _resetIfWaiting() { 
        if ( _waitId === null ) return;

        clearTimeout( _waitId );
        _waitId = null;
    };

    return {
        wait            : _wait,
        resetIfWaiting  : _resetIfWaiting,
    };
} );