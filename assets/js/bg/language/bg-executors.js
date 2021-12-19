if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.Executor = function() {
    // 定数
    const _USER_DEFINED_FUNC_EXECUTOR = new Bg.UserDefinedFunctionExecutor;

    /**
     * 実行
     * @param {any} code コード
     */
    function _execute( code ) {
        const PROGRAM_REGISTERER = new Bg.ProgramRegisterer( code );
        PROGRAM_REGISTERER.register();

        const FUNC_MANAGER = Bg.FunctionManager.getInstance();

        if ( !FUNC_MANAGER.exists( Bg.ENTRY_POINT_NAME ) ) {
            Bg.MessageList.NOT_FINDED_MAIN_FUNCTION.throwError();
        }

        const MAIN_FUNC = FUNC_MANAGER.getInfo( Bg.ENTRY_POINT_NAME ).func;
        _USER_DEFINED_FUNC_EXECUTOR.execute( MAIN_FUNC );
    }

    return {
        execute: _execute,
    };
};

Bg.UserDefinedFunctionExecutor = function() {
    // 定数
    const _STATEMENT_EXECUTOR   = new Bg.StatementExecutor;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;
    const _VARIABLE_CHECKER     = new Bg.VariableChecker;

    /**
     * 実行
     * @param {any} func 関数
     */
    function _execute( func ) {
        _doExecute( this, func );

        if ( func.getReturnValue() !== null ) {
            Bg.MessageList.RETURN_VALUE_IS_UNNECESSARY_IN_MAIN_FUNCTION.throwError();
        }

        // この関数( execute )はmain関数の実行のみで使用されているため、、
        // 関数名の確認は行っていない( つまり、main関数を引数としている前提の処理 )
        if ( !func.isCompleted() ) return;

        Bg.OutputController
            .getInstance()
            .show( Bg.MessageList.ENTRY_POINT_FUNCTION_IS_COMPLETED )
        ;
    }

    /**
     * 引数有りで実行
     * @param {any} func                    関数
     * @param {any} args                    引数
     * @param {any} callingFunc             呼び出し元関数
     * @param {any} statementOrExpression   文、または式
     * @returns 戻り値
     */
    function _executeWithArguments( func, args, callingFunc, statementOrExpression ) {
        _registerIfHaveArguments( 
            this, 
            func, 
            args, 
            callingFunc, 
            statementOrExpression 
        );

        _doExecute( this, func );
        const VARIABLE_MANAGER  = func.getVariableManager();
        VARIABLE_MANAGER.unregisterAutoMemories();

        return func.getReturnValue();
    }

    /**
     * 実行( 実装部 )
     * @param   {any} self  自身を示すオブジェクト
     * @param   {any} func  関数
     */
    function _doExecute( self, func ) {
        while ( func.canExecute() ) {
            _STATEMENT_EXECUTOR.execute( func.getStatement(), func, self );
        }
    }

    /**
     * 引数を持つ場合、登録
     * @param {any} self                    自身を示すオブジェクト
     * @param {any} func                    関数
     * @param {any} args                    引数
     * @param {any} callingFunc             呼び出し元関数
     * @param {any} statementOrExpression   文、または式
     */
    function _registerIfHaveArguments( 
        self, 
        func, 
        args, 
        callingFunc, 
        statementOrExpression
    ) {
        const ARGUMENT_COUNT    = args.length;
        const INFOS             = func.getArgumentInfos();

        if ( ARGUMENT_COUNT !== INFOS.length ) {
            Bg.MessageList.ARGUMENT_COUNT_IS_NOT_MATCH
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        ARGUMENT_COUNT.forEach( function( index ) {
            const VALUE = _EXPRESSION_EVALUATOR.evaluateString( 
                args[index],
                statementOrExpression,
                callingFunc,
                self
            );
            const INFO      = INFOS[index];
            const INDEX     = INFO.index;
            const NAME      = INFO.name;

            if ( Bg.isAutoIndexAndHasNotName( INDEX, NAME ) ) {
                Bg.MessageList.NEED_TO_NAME_VARIABLE_IF_AUTO_INDEX
                    .throwErrorWithLineNumber( statementOrExpression )
                ;
            }

            const REGISTERD_INDEX = Bg.MemoryManager
                .getInstance()
                .register( INDEX, VALUE, statementOrExpression )
            ;

            if ( NAME === null ) return;
            _VARIABLE_CHECKER.check( NAME, VALUE, statementOrExpression );

            const VARIABLE_MANAGER = func.getVariableManager();
            VARIABLE_MANAGER.register( 
                NAME, 
                REGISTERD_INDEX, 
                statementOrExpression 
            );
        } );
    }

    return {
        execute             : _execute,
        executeWithArguments: _executeWithArguments,
    };
};

Bg.StatementExecutor = function() {
    // 定数
    const _SELECTOR = new Bg.ExecuterSelector;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        _SELECTOR
            .select ( statement )
            .execute( statement, executingFunc, funcExecutor )
        ;
    }

    return {
        execute: _execute,
    };
};

Bg.FunctionCallExecutor = function() {
    // 定数
    const _PARSER = new Bg.FunctionCallParser;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        _doExecute( statement, executingFunc, funcExecutor, true );
    }

    /**
     * 式内で実行
     * @param {any} expression      式
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _executeInExpression( expression, executingFunc, funcExecutor ) {
        return _doExecute( expression, executingFunc, funcExecutor, false );
    }

    /**
     * 実行( 実装部 )
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     * @param {any} shouldToNext            次の行へ進めるべきか判断する値
     */
    function _doExecute( 
        statementOrExpression, 
        executingFunc, 
        funcExecutor, 
        shouldToNext
    ) {
        const NAME          = _PARSER.getName( statementOrExpression );
        const FUNC_MANAGER  = Bg.FunctionManager.getInstance();

        if ( !FUNC_MANAGER.exists( NAME ) ) {
            Bg.MessageList.NOT_CREATED_FUNCTION
                .throwErrorWithLineNumber( statementOrExpression )
            ;
        }

        const   ARGUMENTS   = _PARSER.getArguments( statementOrExpression );
        const   INFO        = FUNC_MANAGER.getInfo( NAME );
        const   FUNC        = INFO.func;
        let     returnValue = null;

        if ( INFO.isBuiltIn ) {
            returnValue = FUNC.execute( 
                ARGUMENTS, 
                statementOrExpression,
                executingFunc, 
                funcExecutor
            );
        }
        else {
            returnValue = funcExecutor.executeWithArguments( 
                FUNC, 
                ARGUMENTS,
                executingFunc,
                statementOrExpression
            );
        }

        if ( !shouldToNext ) return returnValue;
        executingFunc.toNextLine( false );

        return returnValue;
    }

    return {
        execute             : _execute,
        executeInExpression : _executeInExpression,
    };
};

Bg.MemoryExecutor = function() {
    // 定数
    const _PARSER               = new Bg.MemoryParser;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;
    const _VARIABLE_CHECKER     = new Bg.VariableChecker;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        const INDEX             = _PARSER.getIndex ( statement );
        const NAME              = _PARSER.getName  ( statement );
        const VALUE             = _PARSER.getValue ( statement );
        const EVALUATED_INDEX   = _evaluateIndexIfNotAuto( 
            INDEX, 
            statement,
            executingFunc, 
            funcExecutor
        );

        if ( Bg.isAutoIndexAndHasNotName( INDEX, NAME ) ) {
            Bg.MessageList.NEED_TO_NAME_VARIABLE_IF_AUTO_INDEX
                .throwErrorWithLineNumber( statement )
            ;
        }

        const EVALUATED_VALUE   = _EXPRESSION_EVALUATOR.evaluateString( 
            VALUE, 
            statement,
            executingFunc,
            funcExecutor
        );

        const REGISTERED_INDEX  = Bg.MemoryManager
            .getInstance()
            .register( EVALUATED_INDEX, EVALUATED_VALUE, statement )
        ;

        if ( NAME !== null ) {
            _VARIABLE_CHECKER.check( NAME, EVALUATED_VALUE, statement );

            executingFunc
                .getVariableManager()
                .register( NAME, REGISTERED_INDEX, statement )
            ;
        }

        executingFunc.toNextLine( false );
    }

    /**
     * 自動インデックスでない場合、インデックスを評価
     * @param   {any} index         インデックス
     * @param   {any} statement     文
     * @param   {any} executingFunc 実行中の関数
     * @param   {any} funcExecutor  関数の実行者
     * @returns 評価後のインデックス
     */
    function _evaluateIndexIfNotAuto( 
        index, 
        statement, 
        executingFunc, 
        funcExecutor 
    ) {
        if ( Bg.isAutoIndex( index ) ) return index;

        const EVALUATED_INDEX = _EXPRESSION_EVALUATOR.evaluateString( 
            index, 
            statement,
            executingFunc,
            funcExecutor
        );

        return EVALUATED_INDEX;
    }

    return {
        execute: _execute,
    };
};

Bg.IfExecutor = function() {
    // 定数
    const _PARSER               = new Bg.IfParser;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        const CONDITION         = _PARSER.getCondition( statement );
        const EVALUTED_VALUE    = _EXPRESSION_EVALUATOR.evaluateString( 
            CONDITION,
            statement,
            executingFunc,
            funcExecutor
        );

        if ( !Bepro.isBoolean( EVALUTED_VALUE ) ) {
            Bg.MessageList.CONDITION_IS_NOT_BOOLEAN_VALUE
                .throwErrorWithLineNumber( statement )
            ;
        }

        if ( EVALUTED_VALUE === true ) {
            _toBlock( statement, executingFunc );
        }
        else {
            executingFunc.toNextOfBlock();
        }
    }

    /**
     * ブロックへ移動
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     */
    function _toBlock( statement, executingFunc ) {
        if ( !executingFunc.isBlockAtNext() ) {
            Bg.MessageList.THERE_IS_NOT_BLOCK_OF_IF
                .throwErrorWithLineNumber( statement )
            ;
        }

        executingFunc.addBlockInfo( Bg.BlockCommandType.IF, null );
        executingFunc.toNextLine( true );
    }

    return {
        execute: _execute,
    };
};

Bg.WhileExecutor = function() {
    // 定数
    const _PARSER               = new Bg.WhileParser;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        const CONDITION         = _PARSER.getCondition( statement );
        const EVALUTED_VALUE    = _EXPRESSION_EVALUATOR.evaluateString( 
            CONDITION,
            statement,
            executingFunc,
            funcExecutor
        );

        if ( !Bepro.isBoolean( EVALUTED_VALUE ) ) {
            Bg.MessageList.CONDITION_IS_NOT_BOOLEAN_VALUE
                .throwErrorWithLineNumber( statement )
            ;
        }

        if ( EVALUTED_VALUE === true ) {
            _toBlock( statement, executingFunc );
        }
        else {
            executingFunc.toNextOfBlock();
        }
    }

    /**
     * ブロックへ移動
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     */
    function _toBlock( statement, executingFunc ) {
        if ( !executingFunc.isBlockAtNext() ) {
            Bg.MessageList.THERE_IS_NOT_BLOCK_OF_WHILE
                .throwErrorWithLineNumber( statement )
            ;
        }

        const INDEX = executingFunc.getCurrentIndex();
        executingFunc.addBlockInfo( Bg.BlockCommandType.WHILE, INDEX );
        executingFunc.toNextLine( true );
    }

    return {
        execute: _execute,
    };
};

Bg.IgnoringLineExecutor = function() {
    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        executingFunc.toNextLine( false );
    }

    return {
        execute: _execute,
    };
};

Bg.ReturnExecutor = function() {
    // 定数
    const _PARSER               = new Bg.ReturnParser;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        const VALUE = _PARSER.getValue( statement );

        if ( VALUE !== null ) {
            const EVALUTED_VALUE = _EXPRESSION_EVALUATOR.evaluateString( 
                VALUE,
                statement,
                executingFunc,
                funcExecutor
            );

            executingFunc.setReturnValue( EVALUTED_VALUE );
        }
        
        executingFunc.toEndLine();
    }

    return {
        execute: _execute,
    };
};

Bg.VariableAssignmentExecutor = function() {
    // 定数
    const _PARSER               = new Bg.VariableAssignmentParser;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;
    const _VARIABLE_CHECKER     = new Bg.VariableChecker;

    /**
     * 実行
     * @param {any} statement       文
     * @param {any} executingFunc   実行中の関数
     * @param {any} funcExecutor    関数の実行者
     */
    function _execute( statement, executingFunc, funcExecutor ) {
        const NAME              = _PARSER.getName( statement );
        const VARIABLE_MANAGER  = executingFunc.getVariableManager();

        if ( !VARIABLE_MANAGER.exists( NAME ) ) {
            Bg.MessageList.NOT_CREATED_VARIABLE
                .throwErrorWithLineNumber( statement )
            ;
        }

        const VALUE             = _PARSER.getValue( statement );
        const EVALUTED_VALUE    = _EXPRESSION_EVALUATOR.evaluateString(
            VALUE,
            statement,
            executingFunc,
            funcExecutor
        );

        _VARIABLE_CHECKER.check( NAME, EVALUTED_VALUE, statement );

        VARIABLE_MANAGER.update( NAME, EVALUTED_VALUE, statement );
        executingFunc.toNextLine( false );
    }

    return {
        execute: _execute,
    };
};