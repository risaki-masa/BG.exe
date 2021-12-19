if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.OperandCreator = function( _variableManager ) {
    // 定数
    const _TOKEN_CHECKER = new Bg.TokenChecker( _variableManager );

    /**
     * 作成
     * @param   {any} expression 式
     * @returns 被演算子
     */
    function _create( expression ) {
        const TOKEN = expression
            .get()
            .trim()
        ;

        const VALUE = _toValue( TOKEN );
        
        if ( VALUE === null ) {
            Bg.MessageList.READED_INVALID_VALUE_IN_MEMORY
                .throwErrorWithLineNumber( expression )
            ;
        }

        if ( VALUE === undefined ) {
            Bg.MessageList.NOT_EVALUATED_EXPRESSION
                .throwErrorWithLineNumber( expression )
            ;
        }

        return new Bg.Operand( VALUE );
    }

    /**
     * 値へ変換
     * @param   {any} token トークン
     * @returns 値
     */
    function _toValue( token ) {
        const CONSTANT_MANAGER  = Bg.ConstantManager.getInstance();
        const VALUE             = 
            _TOKEN_CHECKER.isString         ( token ) ? token.toStringFromStringLiteral() :
            _TOKEN_CHECKER.isInteger        ( token ) ? token.toInteger() :
            _TOKEN_CHECKER.isTrue           ( token ) ? true :
            _TOKEN_CHECKER.isFalse          ( token ) ? false :
            _TOKEN_CHECKER.isVariable       ( token ) ? _variableManager.getValue( token ) :
            _TOKEN_CHECKER.isConstant       ( token ) ? CONSTANT_MANAGER.getValue( token ) :
            _TOKEN_CHECKER.isInvalidValue   ( token ) ? null :
                                                        undefined
        ;

        return VALUE;
    }

    return {
        create: _create,
    };
};

Bg.Operand = function( _value ) {
    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        return _value;
    }
    
    return {
        evaluate: _evaluate,
    };
};