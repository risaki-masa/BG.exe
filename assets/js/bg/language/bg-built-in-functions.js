if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.ShowFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER    = new Bg.ArgumentsChecker;
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;

    /**
     * 値を取得
     * @param   {any} args                  引数
     * @param   {any} statementOrExpression 文、または式
     * @param   {any} executingFunc         実行中の関数
     * @param   {any} funcExecutor          関数の実行者
     * @returns 値
     */
    function _getValue( 
        args, 
        statementOrExpression, 
        executingFunc, 
        funcExecutor 
    ) {
        const VALUE = _EXPRESSION_EVALUATOR.evaluateString( 
            args[0],
            statementOrExpression,
            executingFunc,
            funcExecutor
        );

        return VALUE;
    }
    
    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args, 
        statementOrExpression,
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 1, statementOrExpression );

        const VALUE = _getValue( 
            args, 
            statementOrExpression, 
            executingFunc, 
            funcExecutor 
        );

        const OUTPUT_CONTROLLER = Bg.OutputController.getInstance();
        OUTPUT_CONTROLLER.show( VALUE );

        return null;
    }
    
    return {
        execute: _execute,
    };
};

Bg.ClearFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args, 
        statementOrExpression,
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const OUTPUT_CONTROLLER = Bg.OutputController.getInstance();
        OUTPUT_CONTROLLER.clear();

        return null;
    }

    return {
        execute: _execute,
    };
};

Bg.WaitFunction = function() {
    // 定数
    const _EXPRESSION_EVALUATOR = new Bg.ExpressionEvaluator;
    const _ARGUMENTS_CHECKER    = new Bg.ArgumentsChecker;

    /**
     * 間隔を取得
     * @param   {any} args                  引数
     * @param   {any} statementOrExpression 文、または式
     * @param   {any} executingFunc         実行中の関数
     * @param   {any} funcExecutor          関数の実行者
     * @returns 間隔
     */
    function _getInterval( 
        args, 
        statementOrExpression, 
        executingFunc, 
        funcExecutor 
    ) {
        const INTERVAL = _EXPRESSION_EVALUATOR.evaluateString( 
            args[0], 
            statementOrExpression,
            executingFunc,
            funcExecutor
        );

        const IS_VALID = Number.isInteger( INTERVAL ) && INTERVAL >= 0;

        if ( !IS_VALID ) {
            Bg.MessageList.INTERVAL_OF_WAIT_FUNCTION_IS_INVALID
                .throwErrorWithLineNumber( statementOrExpression );
            ;
        }

        return INTERVAL;
    }

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 1, statementOrExpression );

        const FUNC_NAME = executingFunc.getName();

        if ( FUNC_NAME !== Bg.ENTRY_POINT_NAME ) {
            Bg.MessageList.WAITED_OUTSIDE_ENTRY_POINT_FUNCTION
                .format( Bg.ENTRY_POINT_NAME, FUNC_NAME )
                .throwErrorWithLineNumber( statementOrExpression );
            ;
        }

        const INTERVAL = _getInterval( 
            args, 
            statementOrExpression, 
            executingFunc, 
            funcExecutor
        );

        const WAIT_CONTROLLER = Bg.WaitController.getInstance();
        WAIT_CONTROLLER.wait( INTERVAL, executingFunc, funcExecutor );
        
        return null;
    }

    return {
        execute: _execute,
    };
};

Bg.IsPushingUpKeyFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const INPUT_MANAGER = Bg.InputManager.getInstance();
        return INPUT_MANAGER.isPushingUpKey();
    }

    return {
        execute: _execute,
    };
};

Bg.IsPushingDownKeyFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const INPUT_MANAGER = Bg.InputManager.getInstance();
        return INPUT_MANAGER.isPushingDownKey();
    }

    return {
        execute: _execute,
    };
};

Bg.IsPushingLeftKeyFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const INPUT_MANAGER = Bg.InputManager.getInstance();
        return INPUT_MANAGER.isPushingLeftKey();
    }

    return {
        execute: _execute,
    };
};

Bg.IsPushingRightKeyFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const INPUT_MANAGER = Bg.InputManager.getInstance();
        return INPUT_MANAGER.isPushingRightKey();
    }

    return {
        execute: _execute,
    };
};

Bg.IsClickingFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
     function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const INPUT_MANAGER = Bg.InputManager.getInstance();
        return INPUT_MANAGER.isClicking();
    }

    return {
        execute: _execute,
    };
};

Bg.IsTouchingFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute( 
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const INPUT_MANAGER = Bg.InputManager.getInstance();
        return INPUT_MANAGER.isTouching();
    }

    return {
        execute: _execute,
    };
};

Bg.GetHoursFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute(
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const DATE = new Date();
        return DATE.getHours();
    }

    return {
        execute: _execute,
    };
};

Bg.GetMinutesFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute(
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const DATE = new Date();
        return DATE.getMinutes();
    }

    return {
        execute: _execute,
    };
};

Bg.GetSecondsFunction = function() {
    // 定数
    const _ARGUMENTS_CHECKER = new Bg.ArgumentsChecker;

    /**
     * 実行
     * @param {any} args                    引数
     * @param {any} statementOrExpression   文、または式
     * @param {any} executingFunc           実行中の関数
     * @param {any} funcExecutor            関数の実行者
     */
    function _execute(
        args,
        statementOrExpression, 
        executingFunc,
        funcExecutor
    ) {
        _ARGUMENTS_CHECKER.check( args, 0, statementOrExpression );

        const DATE = new Date();
        return DATE.getSeconds();
    }

    return {
        execute: _execute,
    };
};