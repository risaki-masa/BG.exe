if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.OperatorType = {
    AND             : 0,    // and
    OR              : 1,    // or
    EQUAL           : 2,    // ==
    NOT_EQUAL       : 3,    // !=
    LESS            : 4,    // <
    LESS_OR_EQUAL   : 5,    // <=
    GREATER         : 6,    // >
    GREATER_OR_EQUAL: 7,    // >=
    ADDITION        : 8,    // +
    SUBTRACTION     : 9,    // -
    MULTIPLICATION  : 10,   // *
    DIVISION        : 11,   // /
    CONCATENATION   : 12,   // .
};

Bg.OperatorPositionType = {
    CENTER: 1,
};

Bg.OperatorInfo = function( _priority, _type, _pattern, _positionType ) {
    return {
        priority    : _priority,
        type        : _type,
        pattern     : _pattern,
        positionType: _positionType,
    };
};

Bg.OperatorInfoList = [
    // ※ 優先度0は被演算子( 値 )として処理するため、0以上の整数値を設定すること
    //   また、インデックス0の要素を利用し、最大の優先度を取得するため、
    //   0番目のインデックスの要素には最大の優先度の要素を設定すること
    new Bg.OperatorInfo( 5, Bg.OperatorType.AND             , ' and '   , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 5, Bg.OperatorType.OR              , ' or '    , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 4, Bg.OperatorType.EQUAL           , ' == '    , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 4, Bg.OperatorType.NOT_EQUAL       , ' != '    , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 4, Bg.OperatorType.LESS            , ' < '     , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 4, Bg.OperatorType.LESS_OR_EQUAL   , ' <= '    , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 4, Bg.OperatorType.GREATER         , ' > '     , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 4, Bg.OperatorType.GREATER_OR_EQUAL, ' >= '    , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 3, Bg.OperatorType.CONCATENATION   , ' . '     , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 2, Bg.OperatorType.ADDITION        , ' + '     , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 2, Bg.OperatorType.SUBTRACTION     , ' - '     , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 1, Bg.OperatorType.MULTIPLICATION  , ' * '     , Bg.OperatorPositionType.CENTER ),
    new Bg.OperatorInfo( 1, Bg.OperatorType.DIVISION        , ' / '     , Bg.OperatorPositionType.CENTER ),
];

Object.freeze( Bg.OperatorType );
Object.freeze( Bg.OperatorPositionType );
Object.freeze( Bg.OperatorInfoList );

Bg.OperatorCreator = function() {
    /**
     * 二項演算子を作成
     * @param   {any} type          種類
     * @param   {any} leftOperand   左被演算子
     * @param   {any} rightOperand  右被演算子
     * @param   {any} expression    式
     * @returns 二項演算子
     */
    function _createBinary( type, leftOperand, rightOperand, expression ) {
        switch( type ) {
            case Bg.OperatorType.AND: 
                return new Bg.AndOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.OR: 
                return new Bg.OrOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.EQUAL: 
                return new Bg.EqualOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.NOT_EQUAL: 
                return new Bg.NotEqualOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.LESS: 
                return new Bg.LessOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.LESS_OR_EQUAL: 
                return new Bg.LessOrEqualOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.GREATER: 
                return new Bg.GreaterOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.GREATER_OR_EQUAL: 
                return new Bg.GreaterOrEqualOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.ADDITION: 
                return new Bg.AdditionOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.SUBTRACTION: 
                return new Bg.SubtractionOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.MULTIPLICATION: 
                return new Bg.MultiplicationOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.DIVISION: 
                return new Bg.DivisionOperator( leftOperand, rightOperand, expression );
            case Bg.OperatorType.CONCATENATION: 
                return new Bg.ConcatenationOperator( leftOperand, rightOperand, expression );
        }

        return null;
    }

    return {
        createBinary: _createBinary,
    };
};

Bg.AndOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        return _leftOperand.evaluate() === true && _rightOperand.evaluate() === true;
    }

    return { 
        evaluate: _evaluate,
    };
};

Bg.OrOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        return _leftOperand.evaluate() === true || _rightOperand.evaluate() === true;
    }

    return { 
        evaluate: _evaluate,
    };
};

Bg.EqualOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        return _leftOperand.evaluate() === _rightOperand.evaluate();
    }

    return { 
        evaluate: _evaluate,
    };
};

Bg.NotEqualOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        return _leftOperand.evaluate() !== _rightOperand.evaluate();
    }

    return { 
        evaluate: _evaluate,
    };
};

Bg.LessOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.LESS_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE < RIGHT_VALUE;
    }

    return { 
        evaluate: _evaluate,
    };
};

Bg.LessOrEqualOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.LESS_OR_EQUAL_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE <= RIGHT_VALUE;
    }

    return { 
        evaluate: _evaluate,
    };
};

Bg.GreaterOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.GREATER_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE > RIGHT_VALUE;
    }

    return {
        evaluate: _evaluate,
    };
};

Bg.GreaterOrEqualOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 真偽値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.GREATER_OR_EQUAL_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE >= RIGHT_VALUE;
    }

    return {
        evaluate: _evaluate,
    };
};

Bg.AdditionOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) {
            Bg.MessageList.ADDITION_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }


        const IS_LEFT_BOOL      = Bepro.isBoolean( LEFT_VALUE );
        const IS_RIGHT_BOOL     = Bepro.isBoolean( RIGHT_VALUE );
        const CAN_NOT_EVALUTE   = 
            ( IS_LEFT_BOOL && IS_RIGHT_BOOL ) ||
            ( Bepro.isNumber( LEFT_VALUE ) && IS_RIGHT_BOOL ) ||
            ( IS_LEFT_BOOL && Bepro.isNumber( RIGHT_VALUE ) )
        ;

        if ( CAN_NOT_EVALUTE ) { 
            Bg.MessageList.ADDITION_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE + RIGHT_VALUE;
    }

    return {
        evaluate: _evaluate,
    };
};

Bg.SubtractionOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.SUBTRACTION_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return _leftOperand.evaluate() - _rightOperand.evaluate();
    }

    return {
        evaluate: _evaluate,
    };
};

Bg.MultiplicationOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.MULTIPLICATION_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE * RIGHT_VALUE;
    }

    return {
        evaluate: _evaluate,
    };
};

Bg.DivisionOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        const LEFT_VALUE    = _leftOperand.evaluate();
        const RIGHT_VALUE   = _rightOperand.evaluate();
        const VALUES        = [ LEFT_VALUE, RIGHT_VALUE ];

        if ( !VALUES.areNumbers() ) { 
            Bg.MessageList.DIVISION_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        if ( RIGHT_VALUE === 0 ) {
            Bg.MessageList.DIVISION_BY_ZERO_IS_NOT_POSSIBLE
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE.divideAndToInteger( RIGHT_VALUE );
    }

    return {
        evaluate: _evaluate,
    };
};

Bg.ConcatenationOperator = function( _leftOperand, _rightOperand, _expression ) {
    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        const LEFT_VALUE        = _leftOperand.evaluate();
        const RIGHT_VALUE       = _rightOperand.evaluate();
        const ARE_NOT_STRINGS   = !Bepro.isString( LEFT_VALUE ) && !Bepro.isString( RIGHT_VALUE );

        if ( ARE_NOT_STRINGS ) {
            Bg.MessageList.CONCATENATION_OPERATOR_CAN_NOT_EVALUATED
                .throwErrorWithLineNumber( _expression )
            ;
        }

        return LEFT_VALUE + RIGHT_VALUE;
    }

    return {
        evaluate: _evaluate,
    };
};
