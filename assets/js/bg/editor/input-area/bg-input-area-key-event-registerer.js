if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputAreaKeyEventRegisterer = function( _revisionManager, _scrollAdjuster ) {
    // 定数
    const _CONTROLLER = new Bg.InputAreaController( _revisionManager );

    /**
     * キーイベントを登録
     * @param {*} inputArea 入力エリア
     * @param {*} inputView 入力ビュー
     * @param {*} onUpdate  更新する時の処理
     */
    function _register( inputArea, inputView, onUpdate ) {
        const onPressed = function( event ) {
            switch ( event.key ) {
                case 'Tab':
                    _onTab( event, inputArea, onUpdate );
                    break;
                case '/':
                    _onSlash( event, inputArea, onUpdate );
                    break;
                case 'Enter':
                    _onEnter( event, inputArea, inputView, onUpdate );
                    break;
                case 'Backspace':
                    _onBackspace( event, inputArea, inputView, onUpdate );
                    break;
                case 'z':
                    _onZ( event, inputArea, onUpdate );
                    break;
                case 'q':
                    _onQ( event, inputArea, onUpdate );
                    break;
                case 'c':
                    _onC( event, inputArea );
                    break;
                case 'x':
                    _onX( event, inputArea, inputView, onUpdate );
                    break;
                case 's':
                    _onS( event );
                    break;
                }
        };

        inputArea.addEventListener( 'keydown' , onPressed );
    }

    /**
     * タブキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _onTab( event, inputArea, onUpdate ) {
        event.preventDefault();
        _pushUndoingInfoIfNotSameAsLastInfo( inputArea );

        const LINES                 = inputArea.value.getLines();
        const SELECTING_LINE_INFO   = inputArea.getSelectingLineInfo( LINES );

        event.shiftKey ? 
            _CONTROLLER.outdent  ( inputArea, LINES, SELECTING_LINE_INFO ) : 
            _CONTROLLER.indent   ( inputArea, LINES, SELECTING_LINE_INFO )
        ;

        _pushUndoingInfoAndUpdate( inputArea, onUpdate );
    }

    /**
     * スラッシュキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _onSlash( event, inputArea, onUpdate ) {
        if ( !event.isPressingControlOrCommandKey() ) return;

        event.preventDefault();
        _pushUndoingInfoIfNotSameAsLastInfo( inputArea );

        const LINES                 = inputArea.value.getLines();
        const SELECTING_LINE_INFO   = inputArea.getSelectingLineInfo( LINES );

        const isSelecting = function( line, index ) {
            return SELECTING_LINE_INFO.isSelectingLine( index );
        };

        const ARE_COMMENTS = LINES
            .filter( isSelecting )
            .areComments()
        ;

        ARE_COMMENTS ? 
            _CONTROLLER.uncomment   ( inputArea, LINES, SELECTING_LINE_INFO ) :
            _CONTROLLER.commentOut  ( inputArea, LINES, SELECTING_LINE_INFO )
        ;

        _pushUndoingInfoAndUpdate( inputArea, onUpdate );
    }

    /**
     * エンターキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} inputView 入力ビュー
     * @param {*} onUpdate  更新する時の処理
     */
    function _onEnter( event, inputArea, inputView, onUpdate ) {
        // IEの場合、日本語入力中でもキープロパティを取得してしまうため、デフォルト挙動とする。
        if ( Bepro.isIE() ) return;
        
        event.preventDefault();
        _pushUndoingInfoIfNotSameAsLastInfo( inputArea );

        _CONTROLLER.beginNewLine( inputArea );

        _scrollAdjuster.adjust( inputArea, inputView );
        _pushUndoingInfoAndUpdate( inputArea, onUpdate );
    }

    /**
     * バックスペースキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} inputView 入力ビュー
     * @param {*} onUpdate  更新する時の処理
     */
    function _onBackspace( event, inputArea, inputView, onUpdate ) {
        // IEの場合、日本語入力中でもキープロパティを取得してしまうため、デフォルト挙動とする。
        if ( Bepro.isIE() ) return;

        event.preventDefault();
        _pushUndoingInfoIfNotSameAsLastInfo( inputArea );

        inputArea.isSelectingRange() ?
            _CONTROLLER.deleteSelectionRange( inputArea ) :
            _CONTROLLER.deletePreviousCharacter( inputArea )
        ;

        _scrollAdjuster.adjust( inputArea, inputView );
        _pushUndoingInfoAndUpdate( inputArea, onUpdate );
    }

    /**
     * Zキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _onZ( event, inputArea, onUpdate ) {
        if ( !event.isPressingControlOrCommandKey() ) return;

        event.preventDefault();

        _CONTROLLER.undo( inputArea );
        onUpdate();
    }

    /**
     * Qキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _onQ( event, inputArea, onUpdate ) {
        if ( !event.isPressingControlOrCommandKey() ) return;

        event.preventDefault();

        _CONTROLLER.redo( inputArea );
        onUpdate();
    }

    /**
     * Cキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     */
    function _onC( event, inputArea ) {
        // IEはコピー時にクリップボードの確認ダイアログが出てしまう、
        // かつスクロール位置が変化してしまうため、デフォルト挙動のままとする。
        if ( Bepro.isIE() ) return;

        if ( !event.isPressingControlOrCommandKey() ) return;

        event.preventDefault();
        _pushUndoingInfoIfNotSameAsLastInfo( inputArea );

        inputArea.isSelectingRange() ? 
            _CONTROLLER.copySelectionRange( inputArea ) :
            _CONTROLLER.copyLine( inputArea )
        ;
    }

    /**
     * Cキーの処理
     * @param {*} event     イベント
     * @param {*} inputArea 入力エリア
     * @param {*} inputView 入力ビュー
     * @param {*} onUpdate  更新する時の処理
     */
    function _onX( event, inputArea, inputView, onUpdate ) {
        // IEはコピー時にクリップボードの確認ダイアログが出てしまう、
        // かつスクロール位置が変化してしまうため、デフォルト挙動のままとする。
        if ( Bepro.isIE() ) return;

        if ( !event.isPressingControlOrCommandKey() ) return;

        event.preventDefault();
        _pushUndoingInfoIfNotSameAsLastInfo( inputArea );

        if ( inputArea.isSelectingRange() ) {
            _CONTROLLER.cutSelectionRange( inputArea );
            _scrollAdjuster.adjust( inputArea, inputView );
        }
        else {
            _CONTROLLER.cutLine( inputArea );
        }

        _pushUndoingInfoAndUpdate( inputArea, onUpdate );
    }

    /**
     * Sキーの処理
     * @param {*} event     イベント
     */
    function _onS( event ) {
        if ( !event.isPressingControlOrCommandKey() ) return;
        event.preventDefault();
    }

    /**
     * 最後と同じでない場合、元に戻す情報を追加
     * @param {*} inputArea 入力エリア
     */
    function _pushUndoingInfoIfNotSameAsLastInfo( inputArea ) {
        if ( _isSameSelectionAsLastUndoingInfo( inputArea ) ) return;

        _revisionManager.pushUndoingInfoByInputArea( inputArea );
    }

    /**
     * 最後の元に戻す情報と同じ選択か判断する値を取得
     * @param   {*} inputArea 入力エリア
     * @returns 最後の元に戻す情報と同じ選択か判断する値
     */
    function _isSameSelectionAsLastUndoingInfo( inputArea ) {
        const INFO              = _revisionManager.getLastUndoingInfo();
        const IS_SAME_SELECTION = 
            inputArea.getSafeSelectionStart()   === INFO.selectionStart &&
            inputArea.getSafeSelectionEnd()     === INFO.selectionEnd
        ;

        return IS_SAME_SELECTION;
    }

    /**
     * 元に戻す情報を追加し、更新
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _pushUndoingInfoAndUpdate( inputArea, onUpdate ) {
        _revisionManager.pushUndoingInfoByInputArea( inputArea );
        onUpdate();
    }

    return {
        register: _register,
    };
};