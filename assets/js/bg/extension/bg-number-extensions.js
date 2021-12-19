/**
 * インデントの空白数として有効か判断する値を取得
 * @returns インデントの空白数として有効か判断する値
 */
Number.prototype.isValidAsIndentBlankCount = function() {
    return this % Bg.INDENT_BLANK_COUNT === 0;
};

