/**
 * コントロールキー、またはコマンドキーを押しているか判断する値を取得
 * @return コントロールキー、またはコマンドキーを押しているか判断する値
 */
Event.prototype.isPressingControlOrCommandKey = function() {
    return Bepro.isMacOS() ? event.metaKey : event.ctrlKey;
};