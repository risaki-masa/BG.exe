if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputAreaScrollAdjuster = function( _onSkipNextScrollEvent ) {
    /**
     * 調整
     * @param {*} inputArea 入力エリア
     * @param {*} inputView 入力ビュー
     */
    function _adjust( inputArea, inputView ) {
        const HEIGHT                = inputArea.getHeightOfStylesheetAsInteger();
        const LINE_HEIGHT           = inputArea.getStylesheetValueAsInteger( 'line-height' );
        const SHOWING_LINE_COUNT    = HEIGHT.divideAndToInteger( LINE_HEIGHT );
        const SELECTING_LINE_INFO   = inputArea.getSelectingLineInfo();
        const SELECTING_LINE_NUMBER = SELECTING_LINE_INFO.start.index + 1;
        const LINE_OFFSET_OF_SCROLL = inputArea.getScrollPositionY().divideAndCeil( LINE_HEIGHT );
        const LINE_NUMBER_IN_SCREEN = SELECTING_LINE_NUMBER - LINE_OFFSET_OF_SCROLL;
        const IS_OVER_SHOWING_LINE  = LINE_NUMBER_IN_SCREEN >= SHOWING_LINE_COUNT;
        const IS_UNDER_SHOWING_LINE = LINE_NUMBER_IN_SCREEN <= 0;

        const IS_IN_SHOWING_LINE = !IS_OVER_SHOWING_LINE && !IS_UNDER_SHOWING_LINE;
        if ( IS_IN_SHOWING_LINE ) return;

        const ADJUSTING_VALUE           = IS_OVER_SHOWING_LINE ? 7 : 0;
        const NEW_LINE_NUMBER_IN_SCREEN = IS_OVER_SHOWING_LINE ? 
            SELECTING_LINE_NUMBER - SHOWING_LINE_COUNT :
            SELECTING_LINE_NUMBER - 1
        ;

        const SCROLL_POSITION_Y = NEW_LINE_NUMBER_IN_SCREEN * LINE_HEIGHT + ADJUSTING_VALUE;

        inputView.textContent = inputArea.value;
        inputArea.setScrollPositionY( SCROLL_POSITION_Y );
        inputView.setScrollPositionY( SCROLL_POSITION_Y );
    }

    return {
        adjust: _adjust,
    };
};
