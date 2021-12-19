if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.ExpressionEvaluator = function() {
    // 定数
    const _SELECTOR = new Bg.EvaluatorSelector;

    /**
     * 評価
     * @param   {any} expression      式
     * @param   {any} executingFunc   実行中の関数
     * @param   {any} funcExecutor    関数の実行者
     * @returns 評価した値
     */
    function _evaluate( expression, executingFunc, funcExecutor ) {
        return _doEvaluate( this,  expression, executingFunc, funcExecutor );
    }

    /**
     * 文字列を評価
     * @param   {any} expressionString      式を表す文字列
     * @param   {any} statementOrExpression 文、または式
     * @param   {any} executingFunc         実行中の関数
     * @param   {any} funcExecutor          関数の実行者
     * @returns 評価した値
     */
    function _evaluateString( 
        expressionString, 
        statementOrExpression, 
        executingFunc, 
        funcExecutor 
    ) {
        const EXPRESSION = new Bg.Expression( 
            expressionString,
            statementOrExpression.getLineNumber()
        );

        return _doEvaluate( 
            this, 
            EXPRESSION, 
            executingFunc, 
            funcExecutor 
        );
    }

    /**
     * 評価( 実装部 )
     * @param   {any} self            自身を示すオブジェクト
     * @param   {any} expression      式
     * @param   {any} executingFunc   実行中の関数
     * @param   {any} funcExecutor    関数の実行者
     * @returns 値
     */
    function _doEvaluate( self, expression, executingFunc, funcExecutor ) {
        const EXISTS_EXECUTING_FUNC = executingFunc !== undefined;

        if ( EXISTS_EXECUTING_FUNC ) {
            expression = _expand( self, expression, executingFunc, funcExecutor );
        }

        const VARIABLE_MANAGER = EXISTS_EXECUTING_FUNC ?
            executingFunc.getVariableManager() :
            null
        ;

        const SYNTAX_TREE = new Bg.SyntaxTree( expression, VARIABLE_MANAGER );
        return SYNTAX_TREE.evaluate();
    }

    /**
     * 展開
     * @param   {any} self          自身を示すオブジェクト
     * @param   {any} expression    式
     * @param   {any} executingFunc 実行中の関数
     * @param   {any} funcExecutor  関数の実行者
     * @returns 展開後の式
     */
    function _expand( self, expression, executingFunc, funcExecutor ) {
        while ( true ) {
            let evaluator = _SELECTOR.select( expression );
            if ( evaluator === null ) break;

            expression = evaluator.evaluate( 
                expression,
                executingFunc,
                funcExecutor,
                self
            );
        }

        return expression;
    }

    return {
        evaluate        : _evaluate,
        evaluateString  : _evaluateString,
    };
};

Bg.MemoryEvaluator = function() {
    /**
     * 評価
     * @param   {any} expression            式
     * @param   {any} executingFunc         実行中の関数
     * @param   {any} funcExecutor          関数の実行者
     * @param   {any} expressionEvaluator   式の評価者
     * @returns 式
     */
    function _evaluate( 
        expression, 
        executingFunc,
        funcExecutor,
        expressionEvaluator
    ) {
        const FIRST_INDEX       = _getFirstIndex( expression );
        const LAST_INDEX        = _getLastIndex( expression, FIRST_INDEX );
        const INDEX_EXPRESSION  = _getIndexExpression( expression, FIRST_INDEX, LAST_INDEX );

        const INDEX = expressionEvaluator.evaluate( 
            INDEX_EXPRESSION, 
            executingFunc,
            funcExecutor
        );

        const MEMORY_MANAGER    = Bg.MemoryManager.getInstance();
        const VALUE             = MEMORY_MANAGER.exists( INDEX ) ? 
            Bg.toStringLiteralIfString( MEMORY_MANAGER.getValue( INDEX ) ) :
            Bg.INVALID_VALUE
        ;

        const EVALUATED_EXPRESSION = expression.replaceBetweenIndices( 
            VALUE, 
            FIRST_INDEX, 
            LAST_INDEX + 1
        );

        return EVALUATED_EXPRESSION;
    }
    
    /**
     * 最初のインデックスを取得
     * @param   {any} expression 式
     * @returns 最初のインデックス
     */
    function _getFirstIndex( expression ) {
        const OPEN_BRACKET_INDEX = expression.getOpenBracketIndex();
        if ( OPEN_BRACKET_INDEX === -1 ) return -1; 

        const IS_MATCHED = expression
            .get()
            .isMatchedLastToIndex( 'memory', OPEN_BRACKET_INDEX )
        ;

        if ( !IS_MATCHED ) {
            Bg.MessageList.NOT_FINDED_MEMORY_KEYWORD
                .throwErrorWithLineNumber( expression )
            ;
        }

        return OPEN_BRACKET_INDEX - 6;
    }

    /**
     * 最後のインデックスを取得
     * @param   {any} expression 式
     * @param   {any} firstIndex 最初のインデックス
     * @returns 最後のインデックス
     */
    function _getLastIndex( expression, firstIndex ) {
        const OPEN_BRACKET_INDEX    = expression.get().indexOf( '[', firstIndex );
        const CLOSE_BRACKET_INDEX   = expression.getCloseBracketIndex( OPEN_BRACKET_INDEX );

        if ( CLOSE_BRACKET_INDEX === -1 ) {
            Bg.MessageList.NOT_FINDED_MEMORY_CLOSE_BRACKET
                .throwErrorWithLineNumber( expression )
            ;
        }

        return CLOSE_BRACKET_INDEX;
    }

    /**
     * インデックスの式を取得
     * @param   {any} expression    式
     * @param   {any} firstIndex    最初のインデックス
     * @param   {any} lastIndex     最後のインデックス
     * @returns インデックスの式
     */
    function _getIndexExpression( expression, firstIndex, lastIndex ) {
        return expression.slice( firstIndex + 7, lastIndex );
    }

    return {
        evaluate        : _evaluate,
        getFirstIndex   : _getFirstIndex,
    }
};

Bg.FunctionCallEvaluator = function() {
    // 定数
    const _EXECUTOR = new Bg.FunctionCallExecutor;

    /**
     * 評価
     * @param   {any} expression            式
     * @param   {any} executingFunc         実行中の関数
     * @param   {any} funcExecutor          関数の実行者
     * @param   {any} expressionEvaluator   式の評価者
     * @returns 式
     */
    function _evaluate( 
        expression,
        executingFunc, 
        funcExecutor,
        expressionEvaluator
    ) {
        const FIRST_INDEX       = _getFirstIndex( expression );
        const SLICE_LAST_INDEX  = _getLastIndex( expression, FIRST_INDEX ) + 1;
        const FUNC_EXPRESSION   = expression.slice( FIRST_INDEX, SLICE_LAST_INDEX );

        const RETURN_VALUE      = _EXECUTOR.executeInExpression(
            FUNC_EXPRESSION,
            executingFunc, 
            funcExecutor
        );

        const EVALUATED_EXPRESSION = expression.replaceBetweenIndices( 
            Bg.toStringLiteralIfString( RETURN_VALUE ), 
            FIRST_INDEX, 
            SLICE_LAST_INDEX
        );

        return EVALUATED_EXPRESSION;
    }

    /**
     * 最初のインデックスを取得
     * @param   {any} expression 式
     * @returns 最初のインデックス
     */
    function _getFirstIndex( expression ) {
        const OPEN_PARENTHESIS_INDEX = expression.getOpenParenthesisIndex();
        if ( OPEN_PARENTHESIS_INDEX === -1 ) return -1;

        // マイナス演算子が付いている場合を考慮して、「-」の位置も確認
        const BLANK_INDEX = expression.getMatchedIndexFromBack( ' ', OPEN_PARENTHESIS_INDEX );
        const MINUS_INDEX = expression.getMatchedIndexFromBack( '-', OPEN_PARENTHESIS_INDEX );
        const FIRST_INDEX = BLANK_INDEX > MINUS_INDEX ? BLANK_INDEX : MINUS_INDEX;

        return FIRST_INDEX === -1 ? 0 : FIRST_INDEX + 1;
    }

    /**
     * 最後のインデックス
     * @param   {any} expression 式
     * @param   {any} firstIndex 最初のインデックス
     * @returns 
     */
    function _getLastIndex( expression, firstIndex ) {
        const OPEN_PARENTHESIS_INDEX    = expression.get().indexOf( '(', firstIndex );
        const CLOSE_PAREMTHESIS_INDEX   = expression.getCloseParenthesisIndex( OPEN_PARENTHESIS_INDEX );
        
        if ( CLOSE_PAREMTHESIS_INDEX === -1 ) {
            Bg.MessageList.NOT_FINDED_FUNCTION_CLOSE_PARENTHESIS
                .throwErrorWithLineNumber( expression )
            ;
        }

        return CLOSE_PAREMTHESIS_INDEX;
    }

    return {
        evaluate        : _evaluate,
        getFirstIndex   : _getFirstIndex,
    };
};