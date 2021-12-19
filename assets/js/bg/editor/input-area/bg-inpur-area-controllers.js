if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputAreaController = function( _revisionManager ) {
    /**
     * 字下げする
     * @param {*} inputArea         入力エリア
     * @param {*} lines             行
     * @param {*} selectingLineInfo 選択している行情報
     */
    function _indent( inputArea, lines, selectingLineInfo ) {
        let addedBlankCountAtFirst  = 0;
        let addedBlankCount         = 0;

        const onCalculateAddedBlankCount = function( index, blankCount ) {
            addedBlankCount += blankCount;

            if ( !selectingLineInfo.isStartIndex( index ) ) return;
            addedBlankCountAtFirst = blankCount;
        };

        const onIndent = function( line, index ) {
            if ( !selectingLineInfo.isSelectingLine( index ) ) return line;

            const BLANK_COUNT = line.getIndentingBlankCount();
            onCalculateAddedBlankCount( index, BLANK_COUNT );

            return ' '.repeatSelf( BLANK_COUNT ) + line;
        };

        const OLD_SELECTION_START   = inputArea.getSafeSelectionStart();
        const OLD_SELECTION_END     = inputArea.getSafeSelectionEnd();

        const INDENTED_LINES = lines.map( onIndent );
        inputArea.setValueByLines( INDENTED_LINES );

        inputArea.setSelectionRange( 
            OLD_SELECTION_START + addedBlankCountAtFirst,
            OLD_SELECTION_END   + addedBlankCount
        );
    }

    /**
     * 字上げする
     * @param {*} inputArea         入力エリア
     * @param {*} lines             行
     * @param {*} selectingLineInfo 選択している行情報
     */
    function _outdent( inputArea, lines, selectingLineInfo ) {
        let removedBlankCountAtFirst    = 0;
        let removedBlankCount           = 0;

        const onCalculateRemovedBlankCount = function( index, blankCount ) {
            const END_POSITION  = selectingLineInfo.end.position;
            removedBlankCount   += END_POSITION < blankCount ? END_POSITION : blankCount;

            if ( !selectingLineInfo.isStartIndex( index ) ) return;

            const START_POSITION        = selectingLineInfo.start.position;
            removedBlankCountAtFirst    = START_POSITION < blankCount ? START_POSITION : blankCount;
        };

        const onOutdent = function( line, index ) {
            if ( !selectingLineInfo.isSelectingLine( index ) ) return line;

            const BLANK_COUNT = line.getOutdentingBlankCount();
            if ( BLANK_COUNT === 0 ) return line;

            onCalculateRemovedBlankCount( index, BLANK_COUNT );

            return line.getToLast( BLANK_COUNT );
        };

        const OLD_SELECTION_START   = inputArea.getSafeSelectionStart();
        const OLD_SELECTION_END     = inputArea.getSafeSelectionEnd();

        const OUTDENTED_LINES = lines.map( onOutdent );
        inputArea.setValueByLines( OUTDENTED_LINES );

        inputArea.setSelectionRange( 
            OLD_SELECTION_START - removedBlankCountAtFirst,
            OLD_SELECTION_END   - removedBlankCount
        );
    }

    /**
     * コメント化
     * @param {*} inputArea         入力エリア
     * @param {*} lines             行
     * @param {*} selectingLineInfo 選択している行情報
     */
    function _commentOut( inputArea, lines, selectingLineInfo ) {
        let addedStringCountAtFirst = 0;
        let addedStringCount        = 0;

        const onCalculateAddedStringCount = function( index ) {
            const ADDING_COUNT = 3;
            addedStringCount += ADDING_COUNT;

            if ( !selectingLineInfo.isStartIndex( index ) ) return;
            addedStringCountAtFirst = ADDING_COUNT;
        };

        const onCommentOut = function( line, index ) {
            if ( !selectingLineInfo.isSelectingLine( index ) || line.isComment() ) return line;

            onCalculateAddedStringCount( index );

            const BLANK_COUNT           = line.getBlankCountOfFirst();
            const INDENT_BLANK_COUNT    = Bg.INDENT_BLANK_COUNT;
            const INSERTING_INDEX       = BLANK_COUNT.divideAndToInteger( INDENT_BLANK_COUNT ) * INDENT_BLANK_COUNT;

            return line.insertByIndex( Bg.COMMENT_PREFIX + ' ', INSERTING_INDEX );
        };

        const OLD_SELECTION_START   = inputArea.getSafeSelectionStart();
        const OLD_SELECTION_END     = inputArea.getSafeSelectionEnd();

        const COMMENT_OUTED_LINES = lines.map( onCommentOut );
        inputArea.setValueByLines( COMMENT_OUTED_LINES );

        inputArea.setSelectionRange( 
            OLD_SELECTION_START + addedStringCountAtFirst,
            OLD_SELECTION_END   + addedStringCount
        );
    }

    /**
     * 非コメント化
     * @param {*} inputArea         入力エリア
     * @param {*} lines             行
     * @param {*} selectingLineInfo 選択している行情報
     */
    function _uncomment( inputArea, lines, selectingLineInfo ) {
        let removedStringCountAtFirst   = 0;
        let removedStringCount          = 0;

        const onCalculateRemovedStringCount = function( index, stringCount ) {
            removedStringCount += stringCount;

            if ( !selectingLineInfo.isStartIndex( index ) )
            removedStringCountAtFirst = stringCount;
        };

        const onUncomment = function( line, index ) {
            if ( !selectingLineInfo.isSelectingLine( index ) ) return line;

            const PREFIX        = Bg.COMMENT_PREFIX;
            const PREFIX_INDEX  = line.indexOf( PREFIX );
            const HAS_BLANK     = line.isMatchedFirstFromIndex( ' ', PREFIX_INDEX + PREFIX.length );
            const STRING_COUNT  = HAS_BLANK ? 3 : 2;

            onCalculateRemovedStringCount( index, STRING_COUNT );

            const START_INDEX   = PREFIX_INDEX;
            const END_INDEX     = PREFIX_INDEX + STRING_COUNT;

            return line.replaceBetweenIndices( '', START_INDEX, END_INDEX );
        };

        const OLD_SELECTION_START   = inputArea.getSafeSelectionStart();
        const OLD_SELECTION_END     = inputArea.selectionEnd;

        const UNCOMMENTED_LINES = lines.map( onUncomment );
        inputArea.setValueByLines( UNCOMMENTED_LINES );

        inputArea.setSelectionRange( 
            OLD_SELECTION_START - removedStringCountAtFirst,
            OLD_SELECTION_END   - removedStringCount
        );
    }

    /**
     * 改行
     * @param inputArea 入力エリア
     */
    function _beginNewLine( inputArea ) {
        const LINES                 = inputArea.value.getLines();
        const SELECTING_LINE_INFO   = inputArea.getSelectingLineInfo( LINES );
        const START_INDEX           = SELECTING_LINE_INFO.start.index;
        const START_POSITION        = SELECTING_LINE_INFO.start.position;
        const BLANK_COUNT_OF_FIRST  = LINES[START_INDEX].getBlankCountOfFirst();
        const BLANK_COUNT           = START_POSITION < BLANK_COUNT_OF_FIRST ? START_POSITION : BLANK_COUNT_OF_FIRST;
        const OLD_SELECTION_START   = inputArea.getSafeSelectionStart();
        const OLD_SELECTION_END     = inputArea.getSafeSelectionEnd();
        const REPLACING_STRING      = '\n' + ' '.repeatSelf( BLANK_COUNT );
        const SELECTION_POSITION    = OLD_SELECTION_START + REPLACING_STRING.length;
        const REPLACED_VALUE        = inputArea.value.replaceBetweenIndices( 
            REPLACING_STRING,
            OLD_SELECTION_START,
            OLD_SELECTION_END
        );

        inputArea.value = REPLACED_VALUE;
        inputArea.setSelectionRange( SELECTION_POSITION, SELECTION_POSITION );
    }

    /**
     * 前の文字を削除
     * @param {*} inputArea 入力エリア
     */
    function _deletePreviousCharacter( inputArea ) {
        const OLD_SELECTION_START = inputArea.getSafeSelectionStart();
        if ( OLD_SELECTION_START === 0 ) return;

        const DELETING_CHARACTER_COUNT = 1;

        const SELECTION_POSITION    = OLD_SELECTION_START - DELETING_CHARACTER_COUNT;
        const REPLACED_VALUE        = inputArea.value.replaceBetweenIndices( 
            '',
            OLD_SELECTION_START - DELETING_CHARACTER_COUNT,
            OLD_SELECTION_START
        );

        inputArea.value = REPLACED_VALUE;
        inputArea.setSelectionRange( SELECTION_POSITION, SELECTION_POSITION );
    }

    /**
     * 選択範囲を削除
     * @param {*} inputArea 入力エリア
     */
    function _deleteSelectionRange( inputArea ) {
        const OLD_SELECTION_START   = inputArea.getSafeSelectionStart();
        const OLD_SELECTION_END     = inputArea.getSafeSelectionEnd();

        const REPLACED_VALUE = inputArea.value.replaceBetweenIndices( 
            '',
            OLD_SELECTION_START,
            OLD_SELECTION_END
        );

        inputArea.value = REPLACED_VALUE;
        inputArea.setSelectionRange( OLD_SELECTION_START, OLD_SELECTION_START );
    }

    /**
     * 元に戻す
     * @param inputArea 入力エリア
     */
    function _undo( inputArea ) {
        // keyイベントの他にinputイベントにてUndo情報を追加するため、
        // Undo情報の最後は常に現在のinputAreaの状態示す情報となる。
        // そのため、情報が1つ以下であれば、Undoしないように対応する。
        if ( _revisionManager.getUndoingInfoCount() <= 1 ) return;

        const REDOING_INFO = _revisionManager.popUndoingInfo();

        _revisionManager.pushRedoingInfo( REDOING_INFO );

        const UNDOING_INFO = _revisionManager.getLastUndoingInfo();
        inputArea.setRevisionInfo( UNDOING_INFO );
    }

    /**
     * やり直す
     * @param {*} inputArea 入力エリア
     */
    function _redo( inputArea ) {
        if ( _revisionManager.getRedoingInfoCount() === 0 ) return;

        const REDOING_INFO = _revisionManager.popRedoingInfo();
        _revisionManager.pushUndoingInfo( REDOING_INFO );

        inputArea.setRevisionInfo( REDOING_INFO );
    }

    /**
     * 選択範囲をコピー
     * @param {*} inputArea 入力エリア
     */
    function _copySelectionRange( inputArea ) {
        const SELECTION_START   = inputArea.getSafeSelectionStart();
        const SELECTION_END     = inputArea.getSafeSelectionEnd();
        const COPYING_VALUE     = inputArea.value.slice( SELECTION_START, SELECTION_END );

        Bepro.copyToClipboard( COPYING_VALUE );

        inputArea.focus();
        inputArea.setSelectionRange( SELECTION_START, SELECTION_END );
    }

    /**
     * 選択範囲をコピー
     * @param {*} inputArea 入力エリア
     */
    function _copyLine( inputArea ) {
        const LINES                 = inputArea.value.getLines();
        const SELECTING_LINE_INFO   = inputArea.getSelectingLineInfo( LINES );
        const INDEX                 = SELECTING_LINE_INFO.start.index;
        const LINE                  = LINES[INDEX];
        const SELECTION_POSITION    = inputArea.getSafeSelectionStart();
        const COPYING_VALUE         = LINE.getWithoutFrontBlanks();

        Bepro.copyToClipboard( COPYING_VALUE );

        inputArea.focus();
        inputArea.setSelectionRange( SELECTION_POSITION, SELECTION_POSITION );
    }

    /**
     * 選択範囲を切り取り
     * @param {*} inputArea 入力エリア
     */
    function _cutSelectionRange( inputArea ) {
        const SELECTION_START   = inputArea.getSafeSelectionStart();
        const SELECTION_END     = inputArea.getSafeSelectionEnd();
        const SCROLL_POSITION_X = inputArea.getScrollPositionX();
        const SCROLL_POSITION_Y = inputArea.getScrollPositionY();
        const COPYING_VALUE     = inputArea.value.slice( SELECTION_START, SELECTION_END );

        Bepro.copyToClipboard( COPYING_VALUE );

        const REPLACED_VALUE = inputArea.value.replaceBetweenIndices( '', SELECTION_START, SELECTION_END );
        inputArea.value = REPLACED_VALUE;

        inputArea.focus();
        inputArea.setSelectionRange( SELECTION_START, SELECTION_START );
        inputArea.setScrollPosition( SCROLL_POSITION_X, SCROLL_POSITION_Y );
    }

    /**
     * 選択範囲を切り取り
     * @param {*} inputArea 入力エリア
     */
    function _cutLine( inputArea ) {
        const LINES                 = inputArea.value.getLines();
        const SELECTING_LINE_INFO   = inputArea.getSelectingLineInfo( LINES );
        const INDEX                 = SELECTING_LINE_INFO.start.index;
        const LINE                  = LINES[INDEX];
        const SELECTION_POSITION    = inputArea.getSafeSelectionStart() - SELECTING_LINE_INFO.start.position;
        const SCROLL_POSITION_X     = inputArea.getScrollPositionX();
        const SCROLL_POSITION_Y     = inputArea.getScrollPositionY();

        const onCut = function( line, index ) {
            return index !== INDEX;
        };

        const CUTED_LINES   = LINES.filter( onCut );
        const COPYING_VALUE = LINE + '\n';

        inputArea.setValueByLines( CUTED_LINES );
        Bepro.copyToClipboard( COPYING_VALUE );

        inputArea.focus();
        inputArea.setSelectionRange( SELECTION_POSITION, SELECTION_POSITION );
        inputArea.setScrollPosition( SCROLL_POSITION_X, SCROLL_POSITION_Y );
    }

    return {
        indent                  : _indent,
        outdent                 : _outdent,
        commentOut              : _commentOut,
        uncomment               : _uncomment,
        beginNewLine            : _beginNewLine,
        deletePreviousCharacter : _deletePreviousCharacter,
        deleteSelectionRange    : _deleteSelectionRange,
        undo                    : _undo,
        redo                    : _redo,
        copySelectionRange      : _copySelectionRange,
        copyLine                : _copyLine,
        cutSelectionRange       : _cutSelectionRange,
        cutLine                 : _cutLine,
    };
};
