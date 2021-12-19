if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.OutputController = Bepro.createSingleton( function() {
    // 変数
    let _target = null;

    /**
     * 対象を設定
     * @param {any} element 要素
     */
    function _setTarget( element ) {
        _target = element;
    }

    /**
     * 表示
     * @param {any} value 値
     */
    function _show( value ) {
        const ESCAPED_VALUE = Bepro.escapeHtml( value );
        _target.insertAdjacentHTML( 'beforeend', ESCAPED_VALUE + '<br>' );
    }

    /**
     * 表示を消去
     */
    function _clear() {
        _target.textContent = '';
    }

    return {
        setTarget   : _setTarget,
        show        : _show,
        clear       : _clear,
    };
} );
