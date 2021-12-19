if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.InputDecorator = function() {
    /**
     * 装飾
     * @param   {*} value 値
     * @returns 装飾後の値
     */
    function _decorate( value ) {
        const LINES             = value.getLines();
        const LINE_DECORATOR    = new Bg.InputLineDecorator;

        const onDecorate = function( line ) {
            return LINE_DECORATOR.decorate( line );
        };

        return LINES
            .map( onDecorate )
            .join( '\n' ) + '\n'
        ;
    }

    return {
        decorate: _decorate,
    };
};

Bg.InputLineDecorator = function() {
    // 定数
    const _INFOS_CREATOR = new Bg.DecorationInfosCreator;

    /**
     * 装飾
     * @param   {*} line 行
     * @returns 装飾後の行
     */
    function _decorate( line ) {
        const INFOS = _INFOS_CREATOR.create( line );

        const onDecorate = function( decoratingLine, info, index ) {
            const TAG               = info.tag;
            const INSERTING_INDEX   = info.index;

            _updateInfos( INFOS, index, INSERTING_INDEX, TAG );
            return decoratingLine.insertByIndex( TAG, INSERTING_INDEX );
        };

        return INFOS.reduce( onDecorate, line )
    }

    /**
     * 情報を更新
     * @param {*} infos         情報
     * @param {*} currentIndex  現在のインデックス
     * @param {*} insertedIndex 挿入したインデックス
     * @param {*} tag           タグ
     */
    function _updateInfos( infos, currentIndex, insertedIndex, tag ) {
        const isTarget = function( info, index ) {
            return index > currentIndex && info.index > insertedIndex;
        };

        const onUpdate = function( info ) {
            info.index += tag.length;
        };

        infos
            .filter ( isTarget )
            .forEach( onUpdate )
        ;
    }

    return {
        decorate: _decorate,
    }
};

Bg.DecorationInfo = function( _tag, _index ) {
    return {
        tag     : _tag,
        index   : _index,
    };
};

Bg.DecorationInfosCreator = function() {
    // 定数
    const _COMMENT_ADDER        = new Bg.CommentDecorationInfoAdder;
    const _PATRIAL_ADDER_LIST   = [
        new Bg.FunctionNameDecorationInfoAdder,
        new Bg.StringDecorationInfoAdder,
        new Bg.FunctionDecorationInfoAdder,
        new Bg.MemoryDecorationInfoAdder,
        new Bg.ReturnDecorationInfoAdder,
        new Bg.AutoDecorationInfoAdder,
        new Bg.NameDecorationInfoAdder,
        new Bg.IfDecorationInfoAdder,
        new Bg.WhileDecorationInfoAdder,
        new Bg.TrueDecorationInfoAdder,
        new Bg.FalseDecorationInfoAdder,
        new Bg.AndDecorationInfoAdder,
        new Bg.OrDecorationInfoAdder,
    ];

    /**
     * 作成
     * @param   {*} line 行
     * @returns 情報
     */
    function _create( line ) {
        const INFOS = [];

        if ( line.isValidComment() ) {
            _COMMENT_ADDER.add( line, INFOS );
        }
        else {
            const QUOTE_INDEX_PAIRS = line.getQuoteIndexPairsWithoutUnpair();

            const onAdd = function( adder ) {
                adder.add( line, INFOS, QUOTE_INDEX_PAIRS );
            };

            _PATRIAL_ADDER_LIST.forEach( onAdd );
        }

        return INFOS;
    }

    return {
        create: _create,
    };
};