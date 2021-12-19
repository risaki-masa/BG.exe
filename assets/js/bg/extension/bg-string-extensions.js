/**
 * 字下げする空白数を取得
 * @return 字下げの空白数
 */
String.prototype.getIndentingBlankCount = function() {
    const BLANK_COUNT           = this.getBlankCountOfFirst();
    const INDENT_BLANK_COUNT    = Bg.INDENT_BLANK_COUNT;

    return INDENT_BLANK_COUNT - ( BLANK_COUNT % INDENT_BLANK_COUNT );
};

/**
 * 字上げする空白数を取得
 * @return 字上げの空白数
 */
String.prototype.getOutdentingBlankCount = function() {
    const BLANK_COUNT = this.getBlankCountOfFirst();
    if ( BLANK_COUNT === 0 ) return BLANK_COUNT;

    const INDENT_BLANK_COUNT = Bg.INDENT_BLANK_COUNT;

    return BLANK_COUNT.isValidAsIndentBlankCount() ? 
        INDENT_BLANK_COUNT : 
        BLANK_COUNT % INDENT_BLANK_COUNT
    ;
};

/**
 * コメントか判断する値を取得
 * @returns コメントか判断する値
 */
String.prototype.isComment = function() {
    return this
        .getWithoutFrontBlanks()
        .isMatchedFirst( Bg.COMMENT_PREFIX )
    ;
};

/**
 * 有効なコメントか判断する値を取得
 * @returns コメントか判断する値
 */
String.prototype.isValidComment = function() {
    const BLANK_COUNT = this.getBlankCountOfFirst();
    return BLANK_COUNT.isValidAsIndentBlankCount() && this.isComment();
};

/**
 * 文字列から文字列リテラルに変換
 * @returns 文字列リテラル
 */
String.prototype.toStringLiteralFromString = function() {
    return Bg.QUOTE + this + Bg.QUOTE;
};

/**
 * 文字列リテラルから文字列に変換
 * @returns 文字列
 */
String.prototype.toStringFromStringLiteral = function() {
    return this.slice( 1, -1 );
};

/**
 * 開き( 角 )括弧のインデックスを取得
 * @param   statementOrExpression 文、または式
 * @returns 開き( 角 )括弧のインデックス
 */
String.prototype.getOpenBracketIndex = function( statementOrExpression ) {
    const QUOTE_INDEX_PAIRS = this.getQuoteIndexPairs( statementOrExpression );
    const INDEX             = this.getOpenBracketIndices()
        .getIndicesWithoutBetweenSymbols( QUOTE_INDEX_PAIRS )
        .getFirstOrDefault( -1 )
    ;

    return INDEX;
};

/**
 * 閉じ( 角 )括弧のインデックスを取得
 * @param   openIndex               開き( 角 )括弧のインデックス
 * @param   statementOrExpression   文、または式
 * @returns 閉じ( 角 )括弧のインデックス
 */
String.prototype.getCloseBracketIndex = function( openIndex, statementOrExpression ) {
    const QUOTE_INDEX_PAIRS = this.getQuoteIndexPairs( statementOrExpression );
    const isAfterOpenIndex  = function( index ) { return index > openIndex; };

    const OPEN_INDICES = this.getOpenBracketIndices()
        .getIndicesWithoutBetweenSymbols( QUOTE_INDEX_PAIRS )
        .filter( isAfterOpenIndex )
    ;

    const CLOSE_INDICES = this.getCloseBracketIndices()
        .getIndicesWithoutBetweenSymbols( QUOTE_INDEX_PAIRS )
        .filter( isAfterOpenIndex )
    ;

    const OPEN_INDEX_COUNT = OPEN_INDICES.length;

    const isMatched = function( closeIndex, index ) {
        return index === OPEN_INDEX_COUNT || closeIndex < OPEN_INDICES[index];
    };

    const CLOSE_INDEX = CLOSE_INDICES.getMatchedFirst( isMatched );
    return CLOSE_INDEX === null ? -1 : CLOSE_INDEX;
};

/**
 * 開き( 角 )括弧のインデックスを取得
 * @returns 開き( 角 )括弧のインデックス
 */
String.prototype.getOpenBracketIndices = function() {
    return this.findIndices( '[' );
};

/**
 * 閉じ( 角 )括弧のインデックスを取得
 * @returns 閉じ( 角 )括弧のインデックス
 */
String.prototype.getCloseBracketIndices = function() {
    return this.findIndices( ']' );
};

/**
 * 開き( 丸 )括弧のインデックスを取得
 * @param   statementOrExpression 文、または式
 * @returns 開き( 丸 )括弧のインデックス
 */
String.prototype.getOpenParenthesisIndex = function( statementOrExpression ) {
    const QUOTE_INDEX_PAIRS = this.getQuoteIndexPairs( statementOrExpression );
    const INDEX             = this.getOpenParenthesisIndices()
        .getIndicesWithoutBetweenSymbols( QUOTE_INDEX_PAIRS )
        .getFirstOrDefault( -1 )
    ;

    return INDEX;
};

/**
 * 閉じ( 丸 )括弧のインデックスを取得
 * @param   openIndex               開き( 丸 )括弧のインデックス
 * @param   statementOrExpression   文、または式
 * @returns 閉じ( 丸 )括弧のインデックス
 */
String.prototype.getCloseParenthesisIndex = function( openIndex, statementOrExpression ) {
    const QUOTE_INDEX_PAIRS = this.getQuoteIndexPairs( statementOrExpression );
    const isAfterOpenIndex  = function( index ) { return index > openIndex; };

    const OPEN_INDICES = this.getOpenParenthesisIndices()
        .getIndicesWithoutBetweenSymbols( QUOTE_INDEX_PAIRS )
        .filter( isAfterOpenIndex )
    ;

    const CLOSE_INDICES = this.getCloseParenthesisIndices()
        .getIndicesWithoutBetweenSymbols( QUOTE_INDEX_PAIRS )
        .filter( isAfterOpenIndex )
    ;

    const OPEN_INDEX_COUNT = OPEN_INDICES.length;

    const isMatched = function( closeIndex, index ) {
        return index === OPEN_INDEX_COUNT || closeIndex < OPEN_INDICES[index];
    };

    const CLOSE_INDEX = CLOSE_INDICES.getMatchedFirst( isMatched );
    return CLOSE_INDEX === null ? -1 : CLOSE_INDEX;
}

/**
 * 開く( 丸 )括弧のインデックスを取得
 * @returns 開く( 丸 )括弧のインデックス
 */
String.prototype.getOpenParenthesisIndices = function() {
    return this.findIndices( '(' );
};

/**
 * 開く( 丸 )括弧のインデックスを取得
 * @returns 開く( 丸 )括弧のインデックス
 */
String.prototype.getCloseParenthesisIndices = function() {
    return this.findIndices( ')' );
};

/**
 * ( 丸 )括弧のインデックスのペアを取得
 * @param   statementOrExpression 文、または式
 * @returns ( 丸 )括弧のインデックスのペア
 */
String.prototype.getParenthesisIndexPairs = function( statementOrExpression ) {
    let openIndices     = this.getOpenParenthesisIndices();
    let closeIndices    = this.getCloseParenthesisIndices();

    if ( openIndices.length !== closeIndices.length ) {
        Bg.MessageList.PARENTHESIS_COUNT_IS_INVALID
            .throwErrorWithLineNumber( statementOrExpression )
        ;
    }

    const INDEX_PAIRS  = [];

    while ( closeIndices.length > 0 ) {
        let closeIndex  = closeIndices.shift();
        let openIndex   = openIndices
            .filter ( function( index ) { return index < closeIndex; } )
            .getLast()
        ;

        openIndices = openIndices.filter( function( index ) { return index !== openIndex; } );
        INDEX_PAIRS.push( [ openIndex, closeIndex ] );
    }

    return INDEX_PAIRS;
};


/**
 * クォートのインデックスを取得
 * @returns クォートのインデックス
 */
String.prototype.getQuoteIndices = function() {
    return this.findIndices( Bg.QUOTE );
};

/**
 * クォートのインデックスのペアを取得
 * @param   statementOrExpression 文、または式
 * @returns クォートのインデックスのペア
 */
String.prototype.getQuoteIndexPairs = function( statementOrExpression ) {
    const QUOTE_INDICES = this.getQuoteIndices();
    const QUOTE_COUNT   = QUOTE_INDICES.length;

    if ( QUOTE_COUNT.isOdd() ) {
        Bg.MessageList.QUOTE_OF_STRING_LITERAL_IS_MISSING
            .throwErrorWithLineNumber( statementOrExpression )
        ;
    }

    return QUOTE_INDICES.divide( 2 );
};

/**
 * ペアでないインデックスなしでクォートのインデックスのペアを取得
 * @returns クォートのインデックスのペア
 */
String.prototype.getQuoteIndexPairsWithoutUnpair = function() {
    const QUOTE_INDICES = this.getQuoteIndices();
    const QUOTE_COUNT   = QUOTE_INDICES.length;

    if ( QUOTE_COUNT.isOdd() ) QUOTE_INDICES.pop();

    return QUOTE_INDICES.divide( 2 );
};

/**
 * インデント数を取得
 * @returns インデント数
 */
String.prototype.getIndentCount = function() {
    let pattern = Bg.INDENT_STRING;
    let count   = 0;

    while ( this.isMatchedFirst( pattern ) ) {
        pattern += Bg.INDENT_STRING;
        count++;
    }

    return count;
};

/**
 * エラーを投げる
 */
String.prototype.throwError = function() {
    throw new Error( this );
};

/**
 * エラーを投げる
 * @param statementOrExpression 文、または式
 */
String.prototype.throwErrorWithLineNumber = function( statementOrExpression ) {
    const LINE_NUMBER   = statementOrExpression.getLineNumber();
    const MESSAGE       = '{0}\n行番号: {1}'.format( this, LINE_NUMBER );

    throw new Error( MESSAGE );
};

/**
 * 記号間のインデックスなしでインデックスを検索
 * @param pattern           文、または式
 * @param symbolIndexPairs  記号のインデックスのペア
 */
String.prototype.findIndicesWithoutBetweenSymbols = function( pattern, symbolIndexPairs ) {
    return this.findIndices( pattern )
        .getIndicesWithoutBetweenSymbols( symbolIndexPairs )
    ;
};
