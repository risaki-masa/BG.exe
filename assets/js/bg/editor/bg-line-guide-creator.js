if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.LineGuideCreator = function() {
    // 変数
    let _lineGuide  = null;
    let _inner      = null;

    /**
     * 作成
     * @param {*} content   コンテンツ
     * @param {*} inputArea 入力エリア
     */
    function _create( content, inputArea ) {
        _lineGuide = content.querySelector( '.line-guide' );
        if ( _lineGuide === null ) return;
        
        _inner = _lineGuide.querySelector( '.inner' );
        if ( _inner === null ) return;

        _doCreate( inputArea );
    }

    /**
     * 再作成
     * @param {*} inputArea 入力エリア
     */
    function _recreate( inputArea ) {
        if ( _lineGuide === null || _inner === null ) return;

        _doCreate( inputArea );
    }

    /**
     * 作成( 実装部 )
     * @param {*} inputArea 入力エリア
     */
    function _doCreate( inputArea ) {
        const HEIGHT                = inputArea.getHeightOfStylesheetAsInteger();
        const LINE_HEIGHT           = inputArea.getStylesheetValueAsInteger( 'line-height' );
        const SHOWABLE_LINE_COUNT   =  HEIGHT.divideAndToInteger( LINE_HEIGHT ) + 1;
        const NUMBERS               = _createNumbers( SHOWABLE_LINE_COUNT );
        _inner.removeAllChilds();

        const onUpdate = function() {
            _updateNumbers( 
                inputArea,
                NUMBERS, 
                LINE_HEIGHT, 
                SHOWABLE_LINE_COUNT 
            );
        };

        _addNumbers( NUMBERS );
        onUpdate();
    }

    /**
     * 番号を作成
     * @param   {*} showingLineCount  表示する行数
     * @return  番号
     */
    function _createNumbers( showingLineCount ) {
        const NUMBERS = [];

        const onCreate = function( index ) {
            const NUMBER = Bepro.TagName.DIV.createElementAndAddClass( 'number' );
            NUMBERS.push( NUMBER );
        };

        showingLineCount.forEach( onCreate );

        return NUMBERS;
    }

    /**
     * 番号を追加
     * @param {*} numbers 番号
     */
    function _addNumbers( numbers ) {
        const onAdd = function( number ) {
            _inner.appendChild( number );
        };

        numbers.forEach( onAdd );
    }

    /**
     * 番号を更新
     * @param {*} inputArea         入力エリア
     * @param {*} numbers           番号
     * @param {*} lineHeight        行の高さ
     * @param {*} showableLineCount 表示できる行数
     */
    function _updateNumbers( inputArea, numbers, lineHeight, showableLineCount ) {
        const SCROLL_POSITION_Y = inputArea.getScrollPositionY();
        const FIRST_NUMBER      = SCROLL_POSITION_Y.divideAndToInteger( lineHeight ) + 1;
        const SCROLL_OFFSET_Y   = -( SCROLL_POSITION_Y % lineHeight );
        const LINE_COUNT        = inputArea.value.getLineCount();
        
        _inner.style.marginTop = SCROLL_OFFSET_Y + 'px';

        const onUpdate = function( index ) {
            const NUMBER        = numbers[index];
            NUMBER.textContent  = index < LINE_COUNT  ? index + FIRST_NUMBER : "";
        };

        showableLineCount.forEach( onUpdate );
    }

    return {
        create  : _create,
        recreate: _recreate,
    };
};
