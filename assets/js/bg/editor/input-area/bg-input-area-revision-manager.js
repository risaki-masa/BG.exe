if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputAreaRevisionManager = function() {
    // 定数
    const _UNDOING_INFO_LIST    = [];
    const _REDOING_INFO_LIST    = [];
    const _INFO_MAX_COUNT       = 100;

    /**
     * 元に戻す情報を追加
     * @param {*} info 情報
     */
    function _pushUndoingInfo( info ) {
        _UNDOING_INFO_LIST.push( info );
        _removeFirstUndoingInfoIfOverMaxCount();
    }

    /**
     * 入力エリアで元に戻す情報を追加
     * @param {*} inputArea 入力エリア
     */
    function _pushUndoingInfoByInputArea( inputArea ) {
        const INFO = {
            value           : inputArea.value,
            selectionStart  : inputArea.getSafeSelectionStart(),
            selectionEnd    : inputArea.getSafeSelectionEnd(),
            scrollPositionX : inputArea.getScrollPositionX(),
            scrollPositionY : inputArea.getScrollPositionY(),
        };

        _pushUndoingInfo( INFO );
    }

    /**
     * 元に戻す情報を取り出す
     */
    function _popUndoingInfo() {
        return _UNDOING_INFO_LIST.length > 0 ? _UNDOING_INFO_LIST.pop() : null;
    }

    /**
     * 最大数を超えている場合、最初の元に戻す情報を除去
     */
    function _removeFirstUndoingInfoIfOverMaxCount() {
        if ( _UNDOING_INFO_LIST.length <= _INFO_MAX_COUNT ) return;

        _UNDOING_INFO_LIST.shift();
    }

    /**
     * 最後の元に戻す情報を取得
     * @returns 最後の元に戻す情報
     */
    function _getLastUndoingInfo() {
        return _UNDOING_INFO_LIST.getLast();
    }

    /**
     * 元に戻す情報の数を取得
     * @returns 元に戻す情報の数
     */
    function _getUndoingInfoCount() {
        return _UNDOING_INFO_LIST.length;
    }

    /**
     * 取り消し情報を追加
     * @param {*} info 情報
     */
    function _pushRedoingInfo( info ) {
        _REDOING_INFO_LIST.push( info );
        _removeFirstRedoingInfoIfOverMaxCount();
    }

    /**
     * 取り消し情報を取り出す
     */
    function _popRedoingInfo() {
        return _REDOING_INFO_LIST.length > 0 ? _REDOING_INFO_LIST.pop() : null;
    }

    /**
     * 最大数を超えている場合、最初の取り消し情報を除去
     */
    function _removeFirstRedoingInfoIfOverMaxCount() {
        if ( _REDOING_INFO_LIST.length <= _INFO_MAX_COUNT ) return;

        _REDOING_INFO_LIST.shift();
    }

    /**
     * 取り消し情報の数を取得
     * @returns 取り消し情報の数
     */
    function _getRedoingInfoCount() {
        return _REDOING_INFO_LIST.length;
    }

    return {
        pushUndoingInfo             : _pushUndoingInfo,
        pushUndoingInfoByInputArea  : _pushUndoingInfoByInputArea,
        popUndoingInfo              : _popUndoingInfo,
        getLastUndoingInfo          : _getLastUndoingInfo,
        getUndoingInfoCount         : _getUndoingInfoCount,
        pushRedoingInfo             : _pushRedoingInfo,
        popRedoingInfo              : _popRedoingInfo,
        getRedoingInfoCount         : _getRedoingInfoCount,
    };
};