if ( typeof Bepro === 'undefined' ) var Bepro = {};

Bepro.HoverEventRegisterer = function() {
    /**
     * 登録
     */
    function _register() {
        const ELEMENT_DATAS = {
            'hover-part'        : 'hover-part-color',
            'hover-text'        : 'hover-text-color',
            'hover-text-line'   : 'hover-text-underline',
            'hover-border'      : 'hover-border-color',
        };

        for ( let key in ELEMENT_DATAS ) {
            let elements    = document.getElementsByClassName( key );
            let className   = ELEMENT_DATAS[key];

            elements.forEach( function( element ) {
                const onStarted   = function() { element.addClass( className ); };
                const onEnded     = function() { element.removeClass( className ); };

                element.registerOnHover( onStarted, onEnded );
            } );
        }
    }

    return {
        register: _register,
    };
};