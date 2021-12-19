/**
 * 選択している行情報を取得
 * @param   lines 行
 * @return  選択情報
 */
HTMLTextAreaElement.prototype.getSelectingLineInfo = function( lines ) {
    if ( lines === undefined ) {
        lines = this.value.getLines();
    }

    const getLineIndexAndPosition = function( position, isIncludingNewLine ) {
        const LINE_COUNT                = lines.length;
        const NEW_LINE_CHARACTER_COUNT  = 1;

        let indexAndPosition = null;

        for ( let i = 0; i < LINE_COUNT; i++ ) {
            let line        = lines[i];
            let length      = line.length;
            let maxLength   = isIncludingNewLine ? length + NEW_LINE_CHARACTER_COUNT : length;

            if ( position <= maxLength ) {
                indexAndPosition = [ i, position ];
                break; 
            }

            position -= length + NEW_LINE_CHARACTER_COUNT;
        }

        return indexAndPosition;
    };

    const START_INDEX_AND_POSITION  = getLineIndexAndPosition( this.getSafeSelectionStart(), false );
    const END_INDEX_AND_POSITION    = getLineIndexAndPosition( this.getSafeSelectionEnd(), true );

    const START_INDEX           = START_INDEX_AND_POSITION[0];
    const END_INDEX             = END_INDEX_AND_POSITION[0];
    const IS_END_INDEX_SMALLER  = END_INDEX < START_INDEX;

    return {
        start: {
            index       : START_INDEX,
            position    : START_INDEX_AND_POSITION[1],
        },
        // 行頭にカーソルを合わせた場合、
        // ( 計算上 )終了インデックスが開始インデックスより小さくなる。
        // そのため、その場合は終了情報を開始情報と同じ値とする。
        end: {
            index       : IS_END_INDEX_SMALLER ? START_INDEX : END_INDEX,
            position    : IS_END_INDEX_SMALLER ? 0: END_INDEX_AND_POSITION[1],
        },

        isSelectingLine : function( index ) { return index >= this.start.index && index <= this.end.index; },
        isStartIndex    : function( index ) { return index === this.start.index; },
        isEndIndex      : function( index ) { return index === this.end.index; },
    };
};

/**
 * 行で値を設定
 * @param lines 行
 */
HTMLTextAreaElement.prototype.setValueByLines = function( lines ) {
    this.value = lines.join( '\n' );
};

/**
 * 安全な選択の開始位置を取得
 * @return 選択の開始位置
 */
HTMLTextAreaElement.prototype.getSafeSelectionStart = function() {
    const LENGTH            = this.value.length;
    const SELECTION_START   = this.selectionStart;

    // IE9～11だと、カーソルが末尾の際にselectionStartがlengthを超過する値になる場合がある。
    // そのため、超過した場合、lengthを返すように対応する。
    return SELECTION_START <= LENGTH ? SELECTION_START : LENGTH;
};

/**
 * 安全な選択の終了位置を取得
 * @return 選択の終了位置
 */
HTMLTextAreaElement.prototype.getSafeSelectionEnd = function() {
    const LENGTH        = this.value.length;
    const SELECTION_END = this.selectionEnd;

    // IE9～11だと、カーソルが末尾の際にselectionEndがlengthを超過する値になる場合がある。
    // そのため、超過した場合、lengthを返すように対応する。
    return SELECTION_END <= LENGTH ? SELECTION_END : LENGTH;
};

/**
 * 範囲選択しているか判断する値を取得
 * @returns 範囲選択中か判断する値
 */
HTMLTextAreaElement.prototype.isSelectingRange = function() {
    return this.getSafeSelectionStart() !== this.getSafeSelectionEnd();
};
