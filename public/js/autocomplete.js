jQuery(function(){
    jQuery('#metatitle_mode').autocomplete({
        source: function( req, res ) {
            jQuery.ajax({
                url: "https://ayameapi.yukkuriikouze.com/get_metatitle_search?limit=10&metatitle=" + encodeURIComponent(req.term),
                dataType: "json",
                success: function( data ) {
                    res(data);
                }
            });
        },
        autoFocus: true,
        delay: 100,
    });
    jQuery('#fullname_mode').autocomplete({
        source: function( req, res ) {
            jQuery.ajax({
                url: "https://ayameapi.yukkuriikouze.com/get_fullname_search?limit=10&fullname=" + encodeURIComponent(req.term),
                dataType: "json",
                success: function( data ) {
                    res(data);
                }
            });
        },
        autoFocus: true,
        delay: 100,
    });
});