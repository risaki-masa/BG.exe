if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.SyntaxTreeCreator = function( _expression, _variableManager ) {
    // 定数
    const _OPERATOR_CREATOR = new Bg.OperatorCreator;
    const _OPERAND_CREATOR  = new Bg.OperandCreator( _variableManager );

    /**
     * 作成
     * @returns ルートノード
     */
    function _create() {
        const MAX_PRIORITY      = Bg.OperatorInfoList[0].priority;
        const QUOTE_INDEX_PAIRS = _expression.getQuoteIndexPairs();
        const SYNTAX_TREE       = _createOperatorOrOperand( 
            _expression, 
            MAX_PRIORITY, 
            null,
            QUOTE_INDEX_PAIRS
        );

        return SYNTAX_TREE;
    }

    /**
     * 演算子、または被演算子を作成
     * @param   {any} expression        式
     * @param   {any} priority          優先度
     * @param   {any} infos             演算子情報
     * @param   {any} quoteIndexPairs   クォートのインデックスのペア
     * @returns 演算子、または被演算子
     */
    function _createOperatorOrOperand( expression, priority, infos, quoteIndexPairs ) {
        if ( priority <= 0 ) {
            return _OPERAND_CREATOR.create( expression );
        }

        if ( infos === null ) {
            infos = _getOperatorInfosByPriority( priority );
        }

        if ( !_ExistOperatorsInInfos( expression, infos, quoteIndexPairs ) ) {
            return _createOperatorOrOperand( 
                expression, 
                priority - 1, 
                null, 
                quoteIndexPairs
            );
        }

        const INFO_AND_INDEX = _getTargetInfoAndIndex( expression, infos, quoteIndexPairs );
        return _createOperator( expression, INFO_AND_INDEX, priority, infos );
    }

    /**
     * 優先度で演算子情報を取得
     * @param   {any} priority 優先度
     * @returns 演算子情報
     */
    function _getOperatorInfosByPriority( priority ) {
        const isMatched = function( info ) {
            return info.priority === priority;
        };

        return Bg.OperatorInfoList.filter( isMatched );
    }

    /**
     * 情報内に演算子が存在するか判断する値を取得
     * @param   {any} expression        式
     * @param   {any} infos             情報
     * @param   {any} quoteIndexPairs   クォートのインデックスのペア
     * @returns 演算子が存在するか判断する値
     */
    function _ExistOperatorsInInfos( expression, infos, quoteIndexPairs ) {
        const exists = function( info ) {
            const INDICES = _getTargetIndices( expression, info, quoteIndexPairs );
            return INDICES.length > 0;
        };

        return infos.some( exists );
    }

    /**
     * 対象の情報とインデックスを取得
     * @param   {any} expression        式
     * @param   {any} infos             情報
     * @param   {any} quoteIndexPairs   クォートのインデックスのペア
     * @returns 対象の情報とインデックス
     */
    function _getTargetInfoAndIndex( expression, infos, quoteIndexPairs ) {
        const onGetValue = function( info ) {
            const INDICES = _getTargetIndices( expression, info, quoteIndexPairs );
            return INDICES.getLastOrDefault( -1 );
        };

        const INFO          = infos.getMax( onGetValue );
        const BLANK_COUNT   = INFO.pattern.getBlankCountOfFirst();
        const INDICES       = _getTargetIndices( expression, INFO, quoteIndexPairs );
        const INDEX         = INDICES.getLast() + BLANK_COUNT;

        return [ INFO, INDEX ];
    }

    /**
     * 対象インデックスを取得
     * @param   {any} expression        式
     * @param   {any} info              情報
     * @param   {any} quoteIndexPairs   クォートのインデックスのペア
     * @returns 対象のインデックス
     */
    function _getTargetIndices( expression, info, quoteIndexPairs ) {
        return expression.get()
            .findIndices( info.pattern )
            .getIndicesWithoutBetweenSymbols( quoteIndexPairs )
        ;
    }

    /**
     * 演算子を作成
     * @param   {any} expression            式
     * @param   {any} targetInfoAndIndex    対象の情報とインデックス
     * @param   {any} priority              優先度
     * @param   {any} infos                 演算子情報
     * @returns 演算子
     */
    function _createOperator( expression, targetInfoAndIndex, priority, infos ) {
        const   TARGET_INFO     = targetInfoAndIndex[0];
        const   TARGET_INDEX    = targetInfoAndIndex[1];
        const   POSITION_TYPE   = TARGET_INFO.positionType;
        const   TYPE            = TARGET_INFO.type;
        const   LENGTH          = TARGET_INFO.pattern.trim().length;

        if ( POSITION_TYPE === Bg.OperatorPositionType.CENTER ) {
            return _createBinaryOperator( 
                expression, 
                priority, 
                infos, 
                TYPE, 
                TARGET_INDEX, 
                LENGTH
            );
        }

        Bg.MessageList.NOT_IMPLEMENT_UNARY_OPERATOR
            throwErrorWithLineNumber( expression )
        ;
    }

    /**
     * 二項演算子を作成
     * @param   {any} expression    式
     * @param   {any} priority      優先度
     * @param   {any} infos         演算子情報
     * @param   {any} type          種類
     * @param   {any} index         インデックス
     * @param   {any} length        長さ
     * @returns 二項演算子
     */
    function _createBinaryOperator( 
        expression, 
        priority, 
        infos, 
        type, 
        index, 
        length 
    ) {
        const LEFT_OPERAND  = _createLeftOperand( 
            expression, 
            priority, 
            infos, 
            index 
        );

        const RIGHT_OPERAND = _createRightOperand( 
            expression, 
            priority, 
            index, 
            length 
        );

        return _OPERATOR_CREATOR.createBinary( 
            type, 
            LEFT_OPERAND, 
            RIGHT_OPERAND,
            expression
        );
    }

    /**
     * 左被演算子を作成
     * @param   {any} expression    式
     * @param   {any} priority      優先度
     * @param   {any} infos         演算子情報
     * @param   {any} index         インデックス
     * @returns 左被演算子
     */
    function _createLeftOperand( expression, priority, infos, index ) {
        const LEFT_EXPRESSION   = expression.getFromFirst( index );
        const QUOTE_INDEX_PAIRS = LEFT_EXPRESSION.getQuoteIndexPairs();

        return _createOperatorOrOperand( 
            LEFT_EXPRESSION, 
            priority, 
            infos,
            QUOTE_INDEX_PAIRS
        );
    }

    /**
     * 右被演算子を作成
     * @param   {any} expression    式
     * @param   {any} priority      優先度
     * @param   {any} index         インデックス
     * @param   {any} length        長さ
     * @returns 右被演算子
     */
    function _createRightOperand( expression, priority, index, length ) {
        const RIGHT_EXPRESSION  = expression.getToLast( index + length );
        const QUOTE_INDEX_PAIRS = RIGHT_EXPRESSION.getQuoteIndexPairs();

        return _createOperatorOrOperand( 
            RIGHT_EXPRESSION,
            priority - 1,
            null,
            QUOTE_INDEX_PAIRS
        );
    }

    return {
        create: _create,
    };
};

Bg.SyntaxTree = function( _expression, _variableManager ) {
    // 定数
    const _CREATOR      = new Bg.SyntaxTreeCreator( _expression, _variableManager );
    const _SYNTAX_TREE  = _CREATOR.create();

    /**
     * 評価
     * @returns 値
     */
    function _evaluate() {
        return _SYNTAX_TREE.evaluate();
    }

    return {
        evaluate: _evaluate,
    };
};
