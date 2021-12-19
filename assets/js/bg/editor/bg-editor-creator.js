if ( typeof Bg === 'undefined' ) var Bg = {};

Bg.EditorCreator = function() {
    /**
     * 作成
     */
    function _create() {
        const CONTENT = document.querySelector( '#bg .content' );
        if ( CONTENT === null ) return;

        const INPUT_AREA = CONTENT.querySelector( '.input-area' );
        if ( INPUT_AREA === null ) return;

        const INPUT_VIEW = CONTENT.querySelector( '.input-view' );
        if ( INPUT_VIEW === null ) return;

        const LINE_GUIDE_CREATOR    = new Bg.LineGuideCreator;
        const INPUT_DECORATOR       = new Bg.InputDecorator;

        let isFirstUpdating = true;

        const onUpdate =  function() {
            INPUT_VIEW.innerHTML = INPUT_DECORATOR.decorate( INPUT_AREA.value );

            isFirstUpdating ? 
                LINE_GUIDE_CREATOR.create( CONTENT, INPUT_AREA ) :
                LINE_GUIDE_CREATOR.recreate( INPUT_AREA )
            ;

            if ( isFirstUpdating ) isFirstUpdating = false;
        };

        const INPUT_AREA_EVENT_REGISTERER = new Bg.InputAreaEventRegisterer;
        INPUT_AREA_EVENT_REGISTERER.register( INPUT_AREA, INPUT_VIEW, onUpdate );

        const MENU_EVENT_REGISTERER = new Bg.MenuEventRegisterer;
        MENU_EVENT_REGISTERER.register( CONTENT, INPUT_AREA, onUpdate );

        onUpdate();
        disableSearch();
    }

    /**
     * 検索を無効化
     * ※ 現状は ctrl + f を反応させないための暫定対応のみ
     *   そのため、ブラウザのメニューから検索を開いて使用すれば、スクロール位置がずれるバグは起こる
     *   ( 原因は、検索対象の文字がinputAreaとinputViewに存在するから )
     */
    function disableSearch() {
        const onPressed = function( event ) {
            if ( event.key !== 'f' ) return;
            if ( !event.isPressingControlOrCommandKey() ) return;

            event.preventDefault();
        };

        document.addEventListener( 'keydown', onPressed );
    }

    return {
        create: _create,
    };
};
