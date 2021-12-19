if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.FunctionDefinitionParser = function() {
    // 定数
    const _NAME_PATTERN         = /^function ([a-z_]+)\(.*\)/;
    const _ARGUMENTS_PATTERN    = /^function [a-z_]+\(\)|^function [a-z_]+\(( .+ )\)/;

    /**
     * 関数名を取得
     * @param   {any} statement 文
     * @returns 関数名
     */
    function _getName( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _NAME_PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.FUNCTION_NAME_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return MATCHED_STRINGS[1];
    }

    /**
     * 引数を取得
     * @param   {any} statement 文
     * @returns 引数
     */
    function _getArguments( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _ARGUMENTS_PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.ARGUMENTS_ARE_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        if ( MATCHED_STRINGS[1] === undefined ) return [];
        
        const ARGUMENTS = MATCHED_STRINGS[1].split( Bg.ARGUMENT_SEPARATOR );

        if ( !ARGUMENTS.haveBlanksAtFirst() ) {
            Bg.MessageList.THERE_ARE_NOT_BLANKS_BEFORE_ARGUMENTS
                .throwErrorWithLineNumber( statement )
            ;
        }

        return ARGUMENTS.trim();
    }

    return {
        getName     : _getName,
        getArguments: _getArguments,
    };
};

Bg.FunctionArgumentsParser = function() {
    // 定数
    const _INDEX_PATTERN    = /^memory\[( [0-9]+ )\]|^memory\[( auto )\]/;
    const _NAME_PATTERN     = /^memory\[ [0-9a-z]+ \] name +([a-z_]+)/;

    /**
     * 情報を取得
     * @param   {any} args      引数
     * @param   {any} statement 文
     * @returns 情報
     */
    function _getInfos( args, statement ) {
        if ( args.length === 0 ) return [];

        const INDICES   = _getIndices   ( args, statement );
        const NAMES     = _getNames     ( args, statement );
        const INFOS     = INDICES
            .toPair( NAMES )
            .map( function( datas ) {
                return { index: datas[0], name: datas[1] };
            } )
        ;

        return INFOS;
    }

    /**
     * インデックスを取得
     * @param   {any} args        引数
     * @param   {any} statement   文
     * @returns インデックス
     */
    function _getIndices( args, statement ) {
        const INDICES = args.map( function( argument ) {
            const MATCHED_STRINGS = argument.match( _INDEX_PATTERN );

            if ( MATCHED_STRINGS === null ) {
                Bg.MessageList.MEMORY_INDEX_IS_INVALID_IN_ARGUMENT
                    .throwErrorWithLineNumber( statement )
                ;
            }

             const INDEX = MATCHED_STRINGS[1] !== undefined ? 
                MATCHED_STRINGS[1] : 
                MATCHED_STRINGS[2]
            ;

            return Bg.isAutoIndex( INDEX ) ? INDEX : parseInt( INDEX );
        } );

        return INDICES;
    }

    /**
     * 名前を取得
     * @param   {any} args      引数
     * @param   {any} statement 文
     * @returns 名前
     */
    function _getNames( args, statement ) {
        const NAMES = args.map( function( arg ) {
            const MATCHED_STRINGS = arg.match( _NAME_PATTERN );
            if ( MATCHED_STRINGS === null ) return null;

            return MATCHED_STRINGS[1];
        } );

        return NAMES;
    }

    return {
        getInfos: _getInfos,
    };
};

Bg.FunctionCallParser = function() {
    // 定数
    const _NAME_PATTERN         = /^([a-z_]+)\(.*\)/;
    const _ARGUMENTS_PATTERN    = /^[a-z_]+\(\)|^[a-z_]+\(( .+ )\)/;

    /**
     * 関数名を取得
     * @param   {any} statementOrExpression 文、または式
     * @returns 関数名
     */
    function _getName( statementOrExpression ) {
        const MATCHED_STRINGS = statementOrExpression.getMatchedRegex( _NAME_PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.NAME_OF_CALLED_FUNCTION_IS_INVALID
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        return MATCHED_STRINGS[1];
    }

    /**
     * 引数を取得
     * @param   {any} statementOrExpression 文、または式
     * @returns 引数
     */
    function _getArguments( statementOrExpression ) {
        const MATCHED_STRINGS = statementOrExpression.getMatchedRegex( _ARGUMENTS_PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.ARGUMENTS_OF_CALLED_FUNCTION_IS_INVALID
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        if ( MATCHED_STRINGS[1] === undefined ) return [];

        const ARGUMENTS_STRING  = MATCHED_STRINGS[1];
        const INDICES           = _getSeparatorIndices( 
            ARGUMENTS_STRING, 
            statementOrExpression 
        );

        const ARGUMENTS = ARGUMENTS_STRING.splitByIndices( INDICES );

        if ( !ARGUMENTS.haveBlanksAtFirst() ) {
            Bg.MessageList.THERE_ARE_NOT_BLANKS_BEFORE_ARGUMENTS
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        // 構文木の処理と整合性をあわせるため、引数の先頭に空白を追加
        return ARGUMENTS
            .trim()
            .map( function( argument ) { return ' ' + argument; } 
        );
    }


    /**
     * 区切り文字のインデックスを取得
     * @param   {any} argumentsString       引数の文字列
     * @param   {any} statementOrExpression 文、または式
     * @returns 区切り文字のインデックス
     */
    function _getSeparatorIndices( argumentsString, statementOrExpression ) {
        const SEPARATOR_INDICES = argumentsString.findIndices( Bg.ARGUMENT_SEPARATOR );
        const QUOTE_INDICES     = argumentsString.getQuoteIndexPairs( statementOrExpression );

        const PARENTHESIS_INDICES   = argumentsString
            .getParenthesisIndexPairs( statementOrExpression )
            .getIndicesWithoutBetweenSymbols( QUOTE_INDICES )
        ;

        return SEPARATOR_INDICES
            .getIndicesWithoutBetweenSymbols( QUOTE_INDICES )
            .getIndicesWithoutBetweenSymbols( PARENTHESIS_INDICES )
        ;
    }

    return {
        getName     : _getName,
        getArguments: _getArguments,
    }
};

Bg.MemoryParser = function() {
    // 定数
    const _INDEX_PATTERN    = /^memory\[( .+ )\] += .+|^memory\[( .+ )\] name .+ += .+/;
    const _NAME_PATTERN     = /^memory\[ .+ \] name ([a-zA-Z_]+) += .+/;
    const _VALUE_PATTERN    = /^memory\[ .+ \] +=( .+)|^memory\[ .+ \] name .+ +=( .+)/;

    /**
     * インデックスを取得
     * @param   {any} statement 文 
     * @returns インデックス
     */
    function _getIndex( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _INDEX_PATTERN );
        
        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.MEMORY_INDEX_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        const INDEX = MATCHED_STRINGS[1] !== undefined ? 
            MATCHED_STRINGS[1] : 
            MATCHED_STRINGS[2]
        ;

        return INDEX;
    }

    /**
     * 名前を取得
     * @param   {any} statement 文
     * @returns 名前
     */
    function _getName( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _NAME_PATTERN );
        if ( MATCHED_STRINGS === null ) return null;
        
        return MATCHED_STRINGS[1];
    }

    /**
     * 値を取得
     * @param   {any} statement 文
     * @returns 値
     */
    function _getValue( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _VALUE_PATTERN );
        
        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.MEMORY_VALUE_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        const VALUE = MATCHED_STRINGS[1] !== undefined ? 
            MATCHED_STRINGS[1] : 
            MATCHED_STRINGS[2]
        ;

        return VALUE;
    }

    return {
        getIndex: _getIndex,
        getName : _getName,
        getValue: _getValue,
    };
};

Bg.IfParser = function() {
    // 定数
    const _PATTERN = /^if( .+)/;

    /**
     * 条件を取得
     * @param   {any} statement 文
     * @returns 条件
     */
    function _getCondition( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.IF_CONDITION_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return MATCHED_STRINGS[1];
    }
    
    return {
        getCondition: _getCondition,
    };
};

Bg.WhileParser = function() {
    // 定数
    const _PATTERN = /^while( .+)/;

    /**
     * 条件を取得
     * @param   {any} statement 文
     * @returns 条件
     */
    function _getCondition( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.WHILE_CONDITION_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return MATCHED_STRINGS[1];
    }

    return {
        getCondition: _getCondition,
    };
};

Bg.ReturnParser = function() {
    // 定数
    const _PATTERN = /^return$|^return( .+)/;

    /**
     * 値を取得
     * @param   {any} statement 文
     * @returns 値
     */
    function _getValue( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.RETURN_VALUE_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return MATCHED_STRINGS[1] === undefined ? null : MATCHED_STRINGS[1];
    }

    return {
        getValue: _getValue,
    };
};

Bg.VariableAssignmentParser = function() {
    // 定数
    const _NAME_PATTERN     = /^([a-z_]+) += .+/;
    const _VALUE_PATTERN    = /^[a-z_]+ +=( .+)/;

    function _getName( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _NAME_PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.VARIABLE_NAME_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return MATCHED_STRINGS[1];
    }

    /**
     * 値を取得
     * @param   {any} statement 文
     * @returns 値
     */
    function _getValue( statement ) {
        const MATCHED_STRINGS = statement.getMatchedRegex( _VALUE_PATTERN );

        if ( MATCHED_STRINGS === null ) {
            Bg.MessageList.ASSIGNMENT_VALUE_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return MATCHED_STRINGS[1];
    }

    return {
        getName : _getName,
        getValue: _getValue,
    };
};