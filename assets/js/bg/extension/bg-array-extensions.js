/**
 * コメントか判断する値を取得
 * @returns 全てコメントか判断する値
 */
Array.prototype.areComments = function() {
    return this.every( function( value ) { return value.isComment(); } );
};

/**
 * 記号間のインデックスなしでインデックスを取得
 * @param   symbolIndexPairs 記号のインデックスのペア
 * @returns 記号間を除いたインデックス
 */
Array.prototype.getIndicesWithoutBetweenSymbols = function( symbolIndexPairs ) {
    const areNotBetweenAllSymbols = function( index ) {
        const isNotBetween = function( symbolIndexPair ) {
            const FRONT_INDEX   = symbolIndexPair[0];
            const BACK_INDEX    = symbolIndexPair[1];

            return index < FRONT_INDEX || index > BACK_INDEX;
        };

        return symbolIndexPairs.every( isNotBetween );
    };

    return this.filter( areNotBetweenAllSymbols );
};

/**
 * 最初に空白を持つか判断する値を取得
 * @returns 最初に空白を持つか判断する値
 */
Array.prototype.haveBlanksAtFirst = function() {
    return this.every( function( value ) { 
        return value.isMatchedFirst( ' ' );
    } );
};

/**
 * 開始と終了の装飾情報を追加
 * @param   startTag    開始タグ
 * @param   endTag      終了タグ
 * @param   startIndex  開始インデックス
 * @param   endIndex    終了インデックス
 */
Array.prototype.addStartAndEndDecorationInfos = function( 
    startTag, 
    endTag, 
    startIndex, 
    endIndex 
) {
    this.push( new Bg.DecorationInfo( startTag  , startIndex    ) );
    this.push( new Bg.DecorationInfo( endTag    , endIndex      ) );
};