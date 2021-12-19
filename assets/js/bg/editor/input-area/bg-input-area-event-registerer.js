if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputAreaEventRegisterer = function() {
    // 定数
    const _REVISION_MANAGER     = new Bg.InputAreaRevisionManager;
    const _SCROLL_ADJUSTER      = new Bg.InputAreaScrollAdjuster;
    const _KEY_EVENT_REGISTERER = new Bg.InputAreaKeyEventRegisterer( 
        _REVISION_MANAGER, 
        _SCROLL_ADJUSTER 
    );

    /**
     * 登録
     * @param inputArea 入力エリア
     * @param inputView 入力ビュー
     * @param onUpdate  更新する時の処理
     */
    function _register( inputArea, inputView, onUpdate ) {
        _registerInputEvent ( inputArea, onUpdate );
        _registerScrollEvent( inputArea, inputView, onUpdate );

        _KEY_EVENT_REGISTERER.register( inputArea, inputView, onUpdate );
        _REVISION_MANAGER.pushUndoingInfoByInputArea( inputArea ); 
    }

    /**
     * 入力イベントを登録
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _registerInputEvent( inputArea, onUpdate ) {
        const onInput = function() {
            _REVISION_MANAGER.pushUndoingInfoByInputArea( inputArea );
            onUpdate();
        };

        inputArea.addEventListener( 'input', onInput );
    }

    /**
     * スクロール時のイベントを登録
     * @param {*} inputArea 入力エリア
     * @param {*} inputView 入力ビュー
     */
    function _registerScrollEvent( inputArea, inputView, onUpdate ) {
        const onScroll = function() {
            onUpdate();

            const SCROLL_POSITION_X = inputArea.getScrollPositionX();
            const SCROLL_POSITION_Y = inputArea.getScrollPositionY();

            // Firefoxだとスクロールが末尾の場合にinputAreaと3px程ずれが発生するが、そのまま許容する。
            inputView.setScrollPosition( SCROLL_POSITION_X, SCROLL_POSITION_Y );
        };

        const OPTION = Bepro.getPassiveOption();
        inputArea.addEventListener( 'scroll', onScroll, OPTION );
    }

    return {
        register: _register,
    };
};