if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.ProgramRegisterer = function( _code ) {
    // 定数
    const _LINES                        = _code.getLines();
    const _LINE_COUNT                   = _LINES.length;
    const _INDENT_CHECKER               = new Bg.IndentChecker;
    const _FUNCTION_DEFINITION_CHECKER  = new Bg.FunctionDefinitionChecker;
    const _FUNCTION_DEFINITION_PARSER   = new Bg.FunctionDefinitionParser;
    const _FUNCTION_ARGUMENTS_PARSER    = new Bg.FunctionArgumentsParser;
    const _MEMORY_CHECKER               = new Bg.MemoryChecker;
    const _MEMORY_PARSER                = new Bg.MemoryParser;
    const _CONSTANT_CHECKER             = new Bg.ConstantChecker;
    const _IGNORING_LINE_CHECKER        = new Bg.IgnoringLineChecker;
    const _EXPRESSION_EVALUATOR         = new Bg.ExpressionEvaluator;

    /**
     * 登録
     */
    function _register() {
        _INDENT_CHECKER.check( _LINES );

        let index = 0;

        while ( index < _LINE_COUNT ) {
            let statement = _createStatementByIndex( index );

            if ( _MEMORY_CHECKER.isMatched( statement ) ) {
                _registerConstant( statement );
                index++;
            }
            else if ( _FUNCTION_DEFINITION_CHECKER.isMatched( statement ) ) {
                index = _registerFunctionAndGetNextIndex( index, statement );
            }
            else if ( _IGNORING_LINE_CHECKER.isMatched( statement ) ) {
                index++;
            }
            else {
                Bg.MessageList.STATEMENT_IS_INVALID
                    .throwErrorWithLineNumber( statement )
                ;
            }
        }
    }

    /**
     * 定数を登録
     * @param {any} statement 文
     */
    function _registerConstant( statement ) {
        if ( statement.getIndentCount() > 0 ) {
            Bg.MessageList.INDENT_COUNT_IS_INAPPROPRIATE
                .throwErrorWithLineNumber( statement )
            ;
        }

        const INDEX = _MEMORY_PARSER.getIndex( statement );

        if ( !Bg.isAutoIndex( INDEX ) ) {
            Bg.MessageList.CONSTANT_INDEX_IS_NOT_AUTO
                .throwErrorWithLineNumber( statement )
            ;
        }

        const NAME              = _MEMORY_PARSER.getName( statement );
        const VALUE             = _MEMORY_PARSER.getValue( statement );
        const EVALUTED_VALUE    = _EXPRESSION_EVALUATOR.evaluateString( VALUE, statement );
        _CONSTANT_CHECKER.check( NAME, EVALUTED_VALUE, statement );

        Bg.ConstantManager
            .getInstance()
            .register( NAME, INDEX, EVALUTED_VALUE, statement );
        ;
    }

     /**
     * 関数を登録して、次のインデックスを取得
     * @param {any} index       インデックス
     * @param {any} statement   文
     * @returns 次のインデックス
     */
    function _registerFunctionAndGetNextIndex( index, statement ) {
        if ( statement.getIndentCount() > 0 ) {
            Bg.MessageList.INDENT_COUNT_IS_INAPPROPRIATE
                .throwErrorWithLineNumber( statement )
            ;
        }

        const NAME              = _FUNCTION_DEFINITION_PARSER.getName( statement );
        const ARGUMENTS         = _FUNCTION_DEFINITION_PARSER.getArguments( statement );
        const ARGUMENT_INFOS    = _FUNCTION_ARGUMENTS_PARSER.getInfos( ARGUMENTS, statement );
        const STATEMENTS        = [];

        while ( true ) {
            index++;
            if ( index === _LINE_COUNT ) break;

            statement = _createStatementByIndex( index );
            let isNotTarget = statement.getIndentCount() === 0;
            if ( isNotTarget ) break;

            STATEMENTS.push( statement );
        }

        if ( STATEMENTS.length === 0 ) {
            Bg.MessageList.NOT_EXIST_STATEMENTS_IN_FUNCTION
                .format( NAME )
                .throwErrorWithLineNumber( statement )
            ;
        }

        const FIRST_STATEMENT_IN_BLOCK = STATEMENTS[0];

        if ( FIRST_STATEMENT_IN_BLOCK.getIndentCount() > 1 ) {
            Bg.MessageList.INDENT_COUNT_IS_INAPPROPRIATE
                .throwErrorWithLineNumber( FIRST_STATEMENT_IN_BLOCK )
            ;
        }

        const FUNCTION = new Bg.Function( NAME, ARGUMENT_INFOS, STATEMENTS );

        Bg.FunctionManager
            .getInstance()
            .register( FUNCTION )
        ;

        return index;
    }

    /**
     * インデックスで文を作成
     * @param   {*} index インデックス
     * @returns 文
     */
    function _createStatementByIndex( index ) {
        return new Bg.Statement( _LINES[index], index + 1 );
    }

    return {
        register: _register,
    }
};