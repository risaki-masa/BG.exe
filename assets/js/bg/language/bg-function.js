if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.Function = function( _name, _argumentInfos, _statements ) {
    // 定数
    const _STATEMENT_COUNT  = _statements.length;
    const _BLOCK_INFO_STACK = new Bg.BlockInfoStack;
    const _BLOCK_CONTROLLER = new Bg.BlockController;
    const _VARIABLE_MANAGER = new Bg.VariableManager;

    // 変数
    let _index          = 0;
    let _previousIndex  = 0;
    let _returnValue    = null;
    let _isWaiting      = false;

    /**
     * 文を取得
     * @returns 文
     */
    function _getStatement() {
        if ( _index >= _STATEMENT_COUNT ) {
            Bg.MessageList.STATEMENT_INDEX_IS_OUT_OF_RANGE.throwError();
        }

        return _statements[_index];
    }

    /**
     * 現在のインデックスを取得
     * @returns 現在のインデックス
     */
    function _getCurrentIndex() {
        return _index;
    }

    /**
     * 次の行へ移動
     * @param isMakedBlock ブロックを作ったか判断する値
     */
    function _toNextLine( isMakedBlock ) {
        _previousIndex = _index;
        _index++;

        if ( isMakedBlock ) return;

        const IS_INCREASED_INDENT = _getIndentCountOfCurrent() > _getIndentCountOfPrevious();

        if ( IS_INCREASED_INDENT ) {
            Bg.MessageList.INDENT_COUNT_IS_INAPPROPRIATE
                .throwErrorWithLineNumber( _getStatement() )
            ;
        }

        _controlBlockIfNextOfBlock( this );
    }

    /**
     * ブロックの次へ移動
     */
    function _toNextOfBlock() {
        _previousIndex = _index;
        _index++;

        const PREVIOUS_INDENT_COUNT = _getIndentCountOfPrevious();

        while ( !_isEndLine() ) {
            let isInBlock = PREVIOUS_INDENT_COUNT < _getIndentCountOfCurrent();
            if ( !isInBlock ) break;

            _index++;
        }

        _controlBlockIfNextOfBlock( this );
    }

    /**
     * ブロックの次か判断する値を取得
     * @returns ブロックの次か判断する値
     */
    function _isNextOfBlock() {
        return _getIndentCountOfCurrent() < _getIndentCountOfPrevious();
    }

    /**
     * ブロックの次の場合、ブロックを制御
     */
    function _controlBlockIfNextOfBlock( self ) {
        if ( !_isNextOfBlock() ) return;
        const POP_COUNT = _getIndentCountOfPrevious() - _getIndentCountOfCurrent();

        POP_COUNT.forEach( function( index ) {
            _BLOCK_CONTROLLER.control( self, _BLOCK_INFO_STACK.pop() );
        } );
    }

    /**
     * 行へ移動
     * @param {any} index インデックス
     */
    function _toLine( index ) {
        _previousIndex  = index;
        _index          = index;
    }

    /**
     * 最後の行へ移動
     */
    function _toEndLine() {
        _previousIndex  = _STATEMENT_COUNT;
        _index          = _STATEMENT_COUNT;
    }

    /**
     * 最後の行か判断する値を取得
     * @returns 最後の行か判断する値
     */
    function _isEndLine() {
        return _index === _STATEMENT_COUNT;
    }

    /**
     * 待機を設定
     * @param {any} isWait 待機するか判断する値
     */
    function _setWait( isWait ) {
        _isWaiting = isWait;
    }

    /**
     * 戻り値を設定
     * @param {any} value 戻り値
     */
    function _setReturnValue( value ) {
        _returnValue = value;
    }

    /**
     * 戻り値を取得
     * @returns 戻り値
     */
    function _getReturnValue() {
        return _returnValue;
    }

    /**
     * 名前を取得
     * @returns 名前
     */
    function _getName() {
        return _name;
    }

    /**
     * 引数情報を取得
     * @returns 引数情報
     */
    function _getArgumentInfos() {
        return _argumentInfos;
    }

    /**
     * 実行できるか判断する値を取得
     * @returns 実行できるか判断する値
     */
    function _canExecute() {
        return !_isEndLine() && !_isWaiting;
    }

    /**
     * 完了したか判断する値を取得
     * @returns 完了したか判断する値
     */
    function _isCompleted() {
        return _isEndLine && !_isWaiting;
    }

    /**
     * ブロック情報を追加
     * @param {any} commandType コマンドの種類
     * @param {any} funcIndex   関数のインデックス
     */
    function _addBlockInfo( commandType, funcIndex ) {
        _BLOCK_INFO_STACK.push( commandType, funcIndex );
    }

    /**
     * 現在のインデント数を取得
     * @returns 現在のインデント数
     */
    function _getIndentCountOfCurrent() {
        return _isEndLine() ? 1 : _statements[_index].getIndentCount();
    }

    /**
     * 次のインデント数を取得
     * @returns 次のインデント数
     */
    function _getIndentCountOfNext() {
        const NEXT_INDEX    = _index + 1;
        const IS_END        = NEXT_INDEX === _STATEMENT_COUNT;

        return IS_END ? 1 : _statements[NEXT_INDEX].getIndentCount();
    }

    /**
     * 前のインデント数を取得
     * @returns 前のインデント数
     */
    function _getIndentCountOfPrevious() {
        if ( _index === 0 ) return 1;
        return _statements[_previousIndex].getIndentCount();
    }

    /**
     * 次がブロックか判断する値を取得
     * @returns 次がブロックか判断する値
     */
    function _isBlockAtNext() {
        const INDENT_COUNT_OF_CURRENT   = _getIndentCountOfCurrent();
        const INDENT_COUNT_OF_NEXT      = _getIndentCountOfNext();

        return INDENT_COUNT_OF_CURRENT + 1 === INDENT_COUNT_OF_NEXT;
    }

    /**
     * 変数の管理者を取得
     * @returns 変数の管理者
     */
    function _getVariableManager() {
        return _VARIABLE_MANAGER;
    };
    
    /**
     * 複製
     * @returns 関数
     */
    function _clone() {
        return new Bg.Function( _name, _argumentInfos, _statements );
    }

    return {
        getStatement            : _getStatement,
        toNextLine              : _toNextLine,
        toNextOfBlock           : _toNextOfBlock,
        toLine                  : _toLine,
        toEndLine               : _toEndLine,
        setReturnValue          : _setReturnValue,
        getReturnValue          : _getReturnValue,
        setWait                 : _setWait,
        getName                 : _getName,
        canExecute              : _canExecute,
        isCompleted             : _isCompleted,
        getArgumentInfos        : _getArgumentInfos,
        addBlockInfo            : _addBlockInfo,
        isBlockAtNext           : _isBlockAtNext,
        getCurrentIndex         : _getCurrentIndex,
        getVariableManager      : _getVariableManager,
        clone                   : _clone,
    };
};