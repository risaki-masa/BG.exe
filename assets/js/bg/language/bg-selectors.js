if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.ExecuterSelector = function() {
    // 定数
    const _INFO_LIST = [
        { 
            checker : new Bg.FunctionCallChecker, 
            executer: new Bg.FunctionCallExecutor,
        },
        { 
            checker : new Bg.MemoryChecker, 
            executer: new Bg.MemoryExecutor,
        },
        { 
            checker : new Bg.IfChecker,
            executer: new Bg.IfExecutor,
        },
        {
            checker : new Bg.WhileChecker,
            executer: new Bg.WhileExecutor,
        },
        {
            checker : new Bg.IgnoringLineChecker,
            executer: new Bg.IgnoringLineExecutor,
        },
        {
            checker : new Bg.ReturnChecker,
            executer: new Bg.ReturnExecutor,
        },
        {
            checker : new Bg.VariableAssignmentChecker,
            executer: new Bg.VariableAssignmentExecutor,
        },
    ];

    /**
     * 選択
     * @param   {any} statement 文
     * @returns 実行者
     */
    function _select( statement ) {
        const isMatched = function( info ) {
            return info.checker.isMatched( statement );
        };

        const INFO = _INFO_LIST.getMatchedFirst( isMatched );

        if ( INFO === undefined ) {
            Bg.MessageList.STATEMENT_IS_INVALID
                .throwErrorWithLineNumber( statement )
            ;
        }

        return INFO.executer;
    }

    return {
        select: _select,
    };
};

Bg.EvaluatorSelector = function() {
    // 定数
    const _MEMORY_EVALUATOR         = new Bg.MemoryEvaluator;
    const _FUNCTION_CALL_EVALUATOR  = new Bg.FunctionCallEvaluator;

    /**
     * 選択
     * @param   {any} expression 式
     * @returns 評価者
     */
    function _select( expression ) {
        const MEMORY_FIRST_INDEX        = _MEMORY_EVALUATOR         .getFirstIndex( expression );
        const FUNCTION_CALL_FIRST_INDEX = _FUNCTION_CALL_EVALUATOR  .getFirstIndex( expression );
        const EXISTS_MEMORY             = MEMORY_FIRST_INDEX        !== -1;
        const EXISTS_FUNCTION           = FUNCTION_CALL_FIRST_INDEX !== -1;

        const CAN_EVALUATE_MEMORY   = 
            EXISTS_MEMORY &&
            ( !EXISTS_FUNCTION || MEMORY_FIRST_INDEX < FUNCTION_CALL_FIRST_INDEX )
        ;
        const CAN_EVALUATE_FUNCTION = EXISTS_FUNCTION && !CAN_EVALUATE_MEMORY;

        if ( CAN_EVALUATE_MEMORY ) {
            return _MEMORY_EVALUATOR;
        }
        else if ( CAN_EVALUATE_FUNCTION ) {
            return _FUNCTION_CALL_EVALUATOR;
        }

        return null;
    }

    return {
        select: _select,
    };
};
