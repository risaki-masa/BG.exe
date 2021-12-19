if ( typeof Bg === 'undefined' ) var Bg = {};

// 定数
Bg.QUOTE                = '"';
Bg.INVALID_VALUE        = 'invalid';
Bg.INDENT_STRING        = '    ';
Bg.INDENT_BLANK_COUNT   = 4;
Bg.ARGUMENT_SEPARATOR   = ',';
Bg.ENTRY_POINT_NAME     = 'main';
Bg.COMMENT_PREFIX       = '//';

/**
 * 文字列の場合、文字列リテラルに変換
 * @param   value 値
 * @returns 文字列リテラル
 */
Bg.toStringLiteralIfString = function( value ) {
    if ( !Bepro.isString( value ) ) return value;

    return value.toStringLiteralFromString();
};

/**
 * 文字列リテラルの場合、文字列に変換
 * @param   value 値
 * @returns 文字列
 */
Bg.toStringIfStringLiteral = function( value ) {
    if ( !Bepro.isString( value ) ) return value;

    return value.toStringFromStringLiteral();
};

/**
 * 自動インデックスか判断する値を取得
 * @param   index インデックス
 * @returns 自動インデックスか判断する値
 */
Bg.isAutoIndex = function( index ) {
    return index === ' auto ';
};

/**
 * 自動インデックスでかつ、名前を持たないか判断する値を取得
 * @param   index   インデックス
 * @param   name    名前
 * @returns 自動インデックスでかつ、名前を持たないか判断する値
 */
Bg.isAutoIndexAndHasNotName = function( index, name ) {
    if ( !Bg.isAutoIndex( index ) ) return false;

    return name === null;
};

/**
 * DOMを読み込み後( 構築した時 )の処理
 */
Bg.onLoadedDom = function() {
    const EDITOR_CREATOR = new Bg.EditorCreator;
    EDITOR_CREATOR.create();
};

document.addEventListener( 'DOMContentLoaded', Bg.onLoadedDom );