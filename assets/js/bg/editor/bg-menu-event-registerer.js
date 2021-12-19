if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.MenuEventRegisterer = function() {
    /**
     * 登録
     * @param {*} content   コンテンツ
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _register( content, inputArea, onUpdate ) {
        const MENU = document.querySelector( '#bg .menu' );
        if ( MENU === null ) return;

        _registerExecutingEvent         ( MENU, inputArea );
        _registerLoadingEvent           ( MENU, inputArea, onUpdate );
        _registerSavingEvent            ( MENU, inputArea );
        _registerSwitchingLayoutEvent   ( MENU, inputArea, content, onUpdate );
    }

    /**
     * 実行イベントを登録
     * @param {*} menu      メニュー
     * @param {*} inputArea 入力エリア
     */
    function _registerExecutingEvent( menu, inputArea ) {
        const EXECUTE = menu.querySelector( '.execute' );
        if ( EXECUTE === null ) return;

        const OUTPUT_AREA = document.querySelector( '#bg .output-area' );
        if ( OUTPUT_AREA === null ) return;

        const onExecute = function() {
            OUTPUT_AREA.removeAllChilds();

            const WAIT_CONTROLLER   = Bg.WaitController     .getInstance();
            const OUTPUT_CONTROLLER = Bg.OutputController   .getInstance();

            WAIT_CONTROLLER.resetIfWaiting();
            OUTPUT_CONTROLLER.setTarget( OUTPUT_AREA );

            const FUNCTION_MANAGER  = Bg.FunctionManager.getInstance();
            const MEMORY_MANAGER    = Bg.MemoryManager  .getInstance();
            const CONSTANT_MANAGER  = Bg.ConstantManager.getInstance();

            FUNCTION_MANAGER.unregisterAll();
            MEMORY_MANAGER  .unregisterAll();
            CONSTANT_MANAGER.unregisterAll();

            try {
                const EXECUTOR = new Bg.Executor;
                EXECUTOR.execute( inputArea.value );
            }
            catch ( error ) {
                error.show();

                Bg.InputManager
                    .getInstance()
                    .resetAll()
                ;
            }
        };

        EXECUTE.registerOnPushed( onExecute );
    }

    /**
     * 読み込みイベントを登録
     * @param {*} menu      メニュー
     * @param {*} inputArea 入力エリア
     * @param {*} onUpdate  更新する時の処理
     */
    function _registerLoadingEvent( menu, inputArea, onUpdate ) {
        const LOAD = menu.querySelector( '#bg-load' );
        if ( LOAD === null ) return;

        const onLoad = function( event ) {
            const TARGET = event.target;

            if ( TARGET === null ) return;
            if ( TARGET.files.length === 0 ) return;

            const FILE_BLOB = TARGET.files[0];
            const FILE_NAME = FILE_BLOB.name;
            const EXTENSION = FILE_NAME.getExtension();

            if ( EXTENSION !== '.bg' ) {
                alert( '「.bg」の拡張子のファイルを選択してください。' );
                return;
            }

            const READER    = new FileReader();
            const onLoaded  = function() {
                inputArea.value = READER.result;

                onUpdate();
            };

            READER.addEventListener( 'load', onLoaded );
            READER.readAsText( FILE_BLOB );
        };

        LOAD.addEventListener( 'change', onLoad );
    }

    /**
     * 保存イベントを登録
     * @param {*} menu      メニュー
     * @param {*} inputArea 入力エリア
     */
    function _registerSavingEvent( menu, inputArea ) {
        const SAVE = menu.querySelector( '.save' );
        if ( SAVE === null ) return;

        const onSave = function() {
            Bepro.downloadAsTextFile( 'program.bg', inputArea.value );
        };

        SAVE.registerOnPushed( onSave );
    }

    /**
     * レイアウトの切り替えイベントを登録
     * @param {*} menu      メニュー
     * @param {*} inputArea 入力エリア
     * @param {*} content   コンテンツ
     */
    function _registerSwitchingLayoutEvent( menu, inputArea, content, onUpdate ) {
        const LAYOUT = menu.querySelector( '.layout' );
        if ( LAYOUT === null ) return;

        const LAYOUT_AREA = document.querySelector( '#bg .layout-area' )
        if ( LAYOUT_AREA === null ) return;

        let isHorizontal = false;

        const onSwitch = function() {
            LAYOUT.title = isHorizontal ? '横並び' : '縦並び';
            LAYOUT.toggleClass( 'fa-rotate-270' );

            LAYOUT_AREA.toggleClass( 'horizontal' );
            isHorizontal = !isHorizontal;

            onUpdate();
        };

        LAYOUT.registerOnPushed( onSwitch );
    }

    return {
        register: _register,
    };
};