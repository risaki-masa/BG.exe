if ( typeof Bg === 'undefined' ) var Bg = {};

// 定数
Bg.DecorationTag = {
    COMMENT_START       : '<span class="comment-font">',
    COMMENT_END         : '</span>',
    FUNCTION_NAME_START : '<span class="function-name-font">',
    FUNCTION_NAME_END   : '</span>',
    STRING_START        : '<span class="string-font">',
    STRING_END          : '</span>',
    KEYWORD_START       : '<span class="keyword-font">',
    KEYWORD_END         : '</span>',
};

Object.freeze( Bg.DecorationTag );

Bg.CommentDecorationInfoAdder = function() {
    /**
     * 追加
     * @param {*} line  行
     * @param {*} infos 情報
     */
    function _add( line, infos ) {
        const START_INDEX   = 0;
        const END_INDEX     = line.length;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.COMMENT_START,
            Bg.DecorationTag.COMMENT_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.FunctionNameDecorationInfoAdder = function() {
    // 定数
    const _PATTERN = /[a-z_]+\(/g;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        const MATCHED_STRINGS = line.match( _PATTERN );
        if ( MATCHED_STRINGS === null ) return;

        let searchStartIndex = 0;

        const onAdd = function( string ) {
            const START_INDEX   = line.indexOf( string, searchStartIndex );
            const END_INDEX     = START_INDEX + string.length - 1;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.FUNCTION_NAME_START,
                Bg.DecorationTag.FUNCTION_NAME_END,
                START_INDEX,
                END_INDEX
            );

            searchStartIndex = END_INDEX;
        };

        MATCHED_STRINGS.forEach( onAdd );
    }

    return {
        add: _add,
    };
};

Bg.StringDecorationInfoAdder = function() {
    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        const onAdd = function( indexPair ) {
            const START_INDEX   = indexPair[0];
            const END_INDEX     = indexPair[1] + 1;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.STRING_START,
                Bg.DecorationTag.STRING_END,
                START_INDEX,
                END_INDEX
            );
        };

        quoteIndexPairs.forEach( onAdd );
    }

    return {
        add: _add,
    };
};

Bg.FunctionDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = 'function ';
    const _KEYWORD_LENGTH   = 8;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        if( !line.isMatchedFirst( _PATTERN ) ) return;

        const START_INDEX = 0;
        const END_INDEX   = _KEYWORD_LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.MemoryDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = 'memory[';
    const _KEYWORD_LENGTH   = 6;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );

        const onAdd = function( index ) {
            const START_INDEX   = index;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };

        INDICES.forEach( onAdd );
    }

    return {
        add: _add,
    };
};

Bg.ReturnDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = /^ +return /;
    const _LAST_PATTERN     = ' return';
    const _KEYWORD_LENGTH   = 6;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        const BLANK_COUNT = line.getBlankCountOfFirst();
        if ( !BLANK_COUNT.isValidAsIndentBlankCount() ) return;

        _addIfNormalPattern ( line, infos, quoteIndexPairs, BLANK_COUNT );
        _addIfLastPattern   ( line, infos, quoteIndexPairs );
    }

    /**
     * 通常のパターンの場合、追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     * @param {*} blankCount        空白数
     */
    function _addIfNormalPattern( line, infos, quoteIndexPairs, blankCount ) {
        if ( !_PATTERN.test( line ) ) return;

        const START_INDEX   = blankCount;
        const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    /**
     * 別のパターンの場合、追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _addIfLastPattern( line, infos, quoteIndexPairs ) {
        if ( !line.isMatchedLast( _LAST_PATTERN ) ) return;

        const LENGTH        = line.length;
        const START_INDEX   = LENGTH - _KEYWORD_LENGTH;
        const END_INDEX     = LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.AutoDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = '[ auto ]';
    const _KEYWORD_LENGTH   = 4;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
     function _add( line, infos, quoteIndexPairs ) {
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );

        const onAdd = function( index ) {
            const START_INDEX   = index + 2;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };
        
        INDICES.forEach( onAdd );
     }

     return {
         add: _add,
     }
};

Bg.NameDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = ' ] name ';
    const _KEYWORD_LENGTH   = 4;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );

        const onAdd = function( index ) {
            const START_INDEX   = index + 3;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };
        
        INDICES.forEach( onAdd );
    }

    return {
        add: _add,
    };
};

Bg.IfDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = /^ +if /;
    const _KEYWORD_LENGTH   = 2;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        if ( !_PATTERN.test( line ) ) return;

        const BLANK_COUNT = line.getBlankCountOfFirst();
        if ( !BLANK_COUNT.isValidAsIndentBlankCount() ) return;

        const START_INDEX       = BLANK_COUNT;
        const END_INDEX         = START_INDEX + _KEYWORD_LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.WhileDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = /^ +while /;
    const _KEYWORD_LENGTH   = 5;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        if ( !_PATTERN.test( line ) ) return;

        const BLANK_COUNT = line.getBlankCountOfFirst();
        if ( !BLANK_COUNT.isValidAsIndentBlankCount() ) return;
        
        const START_INDEX       = BLANK_COUNT;
        const END_INDEX         = START_INDEX + _KEYWORD_LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.TrueDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = ' true ';
    const _LAST_PATTERN     = ' true';
    const _KEYWORD_LENGTH   = 4;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) { 
        _addIfNormalPattern ( line, infos, quoteIndexPairs );
        _addIfLastPattern   ( line, infos, quoteIndexPairs );
    }

    /**
     * 通常のパターンの場合、追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _addIfNormalPattern( line, infos, quoteIndexPairs ) {
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );

        const onAdd = function( index ) {
            const START_INDEX   = index + 1;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };
        
        INDICES.forEach( onAdd );
    }

    /**
     * 別のパターンの場合、追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _addIfLastPattern( line, infos, quoteIndexPairs ) {
        if ( !line.isMatchedLast( _LAST_PATTERN ) ) return;

        const LENGTH        = line.length;
        const START_INDEX   = LENGTH - _KEYWORD_LENGTH;
        const END_INDEX     = LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.FalseDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = ' false ';
    const _LAST_PATTERN     = ' false';
    const _KEYWORD_LENGTH   = 5;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) {
        _addIfNormalPattern ( line, infos, quoteIndexPairs );
        _addIfLastPattern   ( line, infos, quoteIndexPairs );
    }

    /**
     * 通常のパターンの場合、追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _addIfNormalPattern( line, infos, quoteIndexPairs ) {
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );

        const onAdd = function( index ) {
            const START_INDEX   = index + 1;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };
        
        INDICES.forEach( onAdd );
    }

    /**
     * 別のパターンの場合、追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _addIfLastPattern( line, infos, quoteIndexPairs ) {
        if ( !line.isMatchedLast( _LAST_PATTERN ) ) return;

        const LENGTH        = line.length;
        const START_INDEX   = LENGTH - _KEYWORD_LENGTH;
        const END_INDEX     = LENGTH;

        infos.addStartAndEndDecorationInfos( 
            Bg.DecorationTag.KEYWORD_START,
            Bg.DecorationTag.KEYWORD_END,
            START_INDEX,
            END_INDEX
        );
    }

    return {
        add: _add,
    };
};

Bg.AndDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = ' and ';
    const _KEYWORD_LENGTH   = 3;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} infos             情報
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     */
    function _add( line, infos, quoteIndexPairs ) { 
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );

        const onAdd = function( index ) {
            const START_INDEX   = index + 1;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };
        
        INDICES.forEach( onAdd );
    }

    return {
        add: _add,
    };
};

Bg.OrDecorationInfoAdder = function() {
    // 定数
    const _PATTERN          = ' or ';
    const _KEYWORD_LENGTH   = 2;

    /**
     * 追加
     * @param {*} line              行
     * @param {*} quoteIndexPairs   クォートのインデックスのペア
     * @param {*} infos          情報
     */
    function _add( line, infos, quoteIndexPairs ) { 
        const INDICES = line.findIndicesWithoutBetweenSymbols( 
            _PATTERN,
            quoteIndexPairs
        );
        
        const onAdd = function( index ) {
            const START_INDEX   = index + 1;
            const END_INDEX     = START_INDEX + _KEYWORD_LENGTH;

            infos.addStartAndEndDecorationInfos( 
                Bg.DecorationTag.KEYWORD_START,
                Bg.DecorationTag.KEYWORD_END,
                START_INDEX,
                END_INDEX
            );
        };

        INDICES.forEach( onAdd );
    }

    return {
        add: _add,
    };
};