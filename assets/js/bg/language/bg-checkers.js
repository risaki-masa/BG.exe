if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.IndentChecker = function() {
    /**
     * 確認
     * @param {any} lines 行
     */
    function _check( lines ) {
        lines.forEach( function( line, index ) {
            const IS_VALID = line
                .getBlankCountOfFirst()
                .isValidAsIndentBlankCount()
            ;

            if ( IS_VALID ) return;

            Bg.MessageList.INDENT_IS_INVALID
                .format( index + 1 )
                .throwError()
            ;
        } );
    }

    return {
        check: _check,
    }
};

Bg.FunctionDefinitionChecker = function() {
    // 定数
    const _PATTERN = /(^function .+\(.*\) *$)/;

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedRegex( _PATTERN );
    }

    return {
        isMatched : _isMatched,
    };
};

Bg.FunctionCallChecker = function() {
    // 定数
    const _PATTERN = /(^[a-z_]+\(.*\) *$)/;

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedRegex( _PATTERN );
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.MemoryChecker = function() {
    // 定数
    const _PATTERN = /^memory\[.+\] += .+|^memory\[.+\] name .+ += .+$/;

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedRegex( _PATTERN );
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.IfChecker = function() {
    // 定数
    const _PATTERN = /^if .+$/;

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedRegex( _PATTERN );
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.WhileChecker = function() {
    // 定数
    const _PATTERN = /(^while .+$)/;

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedRegex( _PATTERN );
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.IgnoringLineChecker = function() {
    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        const TRIMED_STATEMENT  = statement.get().trim();
        const IS_BLANK          = TRIMED_STATEMENT === '';
        const IS_COMMENT        = TRIMED_STATEMENT.isMatchedFirst( '//' );

        return IS_BLANK || IS_COMMENT;
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.ReturnChecker = function() {
    // 定数
    const _PATTERN = "return";

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedFirst( _PATTERN );
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.VariableAssignmentChecker = function() {
    // 定数
    const _PATTERN = /^[a-z_]+ += .+/;

    /**
     * 一致したか判断する値を取得
     * @param   {any} statement 文
     * @returns 一致したか判断する値
     */
    function _isMatched( statement ) {
        return statement.isMatchedRegex( _PATTERN );
    }

    return {
        isMatched: _isMatched,
    };
};

Bg.ReservedWordChecker = function() {
    // 定数
    const _LIST = [
        'or',
        'and',
        'function',
        'memory',
        'if',
        'while',
        'return',
        'else',
        'auto',
    ];

    /**
     * いずれかと一致したか判断する値を取得
     * @param   {any} string 文字列
     * @returns いずれかと一致したか判断する値
     */
    function _isMatchedAny( string ) {
        return _LIST.some( function( word ) { return word === string;  } );
    }

    return {
        isMatchedAny: _isMatchedAny,
    };
};

Bg.ArgumentsChecker = function() {
    /**
     * 確認
     * @param {any} args                    引数
     * @param {any} count                   数
     * @param {any} statementOrExpression   文、または式
     * @returns 
     */
    function _check( args, count, statementOrExpression ) {
        if ( args.length === count ) return;

        Bg.MessageList.ARGUMENT_COUNT_IS_NOT_MATCH
            .throwErrorWithLineNumber( statementOrExpression )
        ;
    }

    return {
        check: _check,
    };
};

Bg.TokenChecker = function( _variableManager ) {
    // 定数
    const _INTEGER_PATTERN = /^[0-9]+$/;

    /**
     * 文字列か判断する値を取得
     * @param   トークン
     * @returns 文字列か判断する値
     */
    function _isString( token ) {
        const EXIST_FIRST   = token.isMatchedFirst( Bg.QUOTE );

        // 複数文字列を並べた場合にエラーを出せるように前方から検索をかける
        // ( """"みたいな場合にエラーとするため )
        const EXIST_LAST    = token.indexOf( Bg.QUOTE, 1 ) === token.length - 1;

        return EXIST_FIRST && EXIST_LAST;
    }

    /**
     * 整数か判断する値を取得
     * @param   トークン
     * @returns 整数か判断する値
     */
    function _isInteger( token ) {
        if ( token.isMatchedFirst( '-' ) ) {
            token = token.getToLast( 1 );
        }

        if ( token !== '0' && token.isMatchedFirst( '0' ) ) return false;

        return _INTEGER_PATTERN.test( token );
    }

    /**
     * 変数か判断する値を取得
     * @param   トークン
     * @returns 変数か判断する値
     */
    function _isVariable( token ) {
        if ( _variableManager === null ) return false;
        return _variableManager.exists( token );
    }

    /**
     * 定数か判断する値を取得
     * @param   トークン
     * @returns 定数か判断する値
     */
    function _isConstant( token ) {
        const CONSTANT_MANAGER = Bg.ConstantManager.getInstance()
        return CONSTANT_MANAGER.exists( token );
    }

    /**
     * trueか判断する値を取得
     * @param   トークン
     * @returns Trueか判断する値
     */
    function _isTrue( token ) {
        return token === 'true';
    }

    /**
     * falseか判断する値を取得
     * @param   トークン
     * @returns falseか判断する値
     */
    function _isFalse( token ) {
        return token === 'false';
    }

    /**
     * 不正値か判断する値を取得
     * @param   トークン
     * @returns 不正値か判断する値
     */
    function _isInvalidValue( token ) {
        return token === Bg.INVALID_VALUE;
    }

    return {
        isString        : _isString,
        isInteger       : _isInteger,
        isTrue          : _isTrue,
        isFalse         : _isFalse,
        isVariable      : _isVariable,
        isConstant      : _isConstant,
        isInvalidValue  : _isInvalidValue,
    };
};

Bg.VariableChecker = function() {
    // 定数
    const _NAME_PATTERN         = /^[a-z_]+$/;
    const _BOOLEAN_PREFIX_LIST  = [
        'is_',
        'are_',
        'can_',
        'has_',
        'have_',
        'exist_',
        'exists_',
        'should_',
    ];

    /**
     * 確認
     * @param {any} name        名前
     * @param {any} value       値
     * @param {any} statement   文
     */
    function _check( name, value, statement ) {
        if ( !_NAME_PATTERN.test( name ) ) {
            Bg.MessageList.VARIABLE_NAME_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        _checkPrefix( name, value, statement );
    }

    /**
     * 接頭辞を確認
     * @param {any} name        名前
     * @param {any} value       値
     * @param {any} statement   文
     */
    function _checkPrefix( name, value, statement ) {
        const HAS_BOOLEAN_PREFIX = _BOOLEAN_PREFIX_LIST.some( function( prefix ) {
            return name.isMatchedFirst( prefix );
        } );

        if ( Bepro.isBoolean( value ) ) {
            if ( HAS_BOOLEAN_PREFIX ) return;

            Bg.MessageList.MISSING_VARIABLE_BOOLEAN_PREFIX
                .throwErrorWithLineNumber( statement )
            ;
        }
        else {
            if ( !HAS_BOOLEAN_PREFIX ) return;
            
            Bg.MessageList.VARIABLE_HAS_BOOLEAN_PREFIX
                .throwErrorWithLineNumber( statement )
            ;
        }
    }

    return {
        check: _check,
    };
};

Bg.ConstantChecker = function() {
    // 定数
    const _NAME_PATTERN         = /^[A-Z][A-Z_]*$/;
    const _BOOLEAN_PREFIX_LIST  = [
        'IS_',
        'ARE_',
        'CAN_',
        'HAS_',
        'HAVE_',
        'EXIST_',
        'EXISTS_',
        'SHOULD_',
    ];

    /**
     * 確認
     * @param {any} name        名前
     * @param {any} value       値
     * @param {any} statement   文
     */
    function _check( name, value, statement ) {
        if ( !_NAME_PATTERN.test( name ) ) {
            Bg.MessageList.CONSTANT_NAME_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        _checkPrefix( name, value, statement );
    }

    /**
     * 接頭辞を確認
     * @param {any} name        名前
     * @param {any} value       値
     * @param {any} statement   文
     */
    function _checkPrefix( name, value, statement ) {
        const HAS_BOOLEAN_PREFIX = _BOOLEAN_PREFIX_LIST.some( function( prefix ) {
            return name.isMatchedFirst( prefix );
        } );

        if ( Bepro.isBoolean( value ) ) {
            if ( HAS_BOOLEAN_PREFIX ) return;

            Bg.MessageList.MISSING_CONSTANT_BOOLEAN_PREFIX
                .throwErrorWithLineNumber( statement )
            ;
        }
        else {
            if ( !HAS_BOOLEAN_PREFIX ) return;
            
            Bg.MessageList.CONSTANT_HAS_BOOLEAN_PREFIX
                .throwErrorWithLineNumber( statement )
            ;
        }
    }

    return {
        check: _check,
    };
};
