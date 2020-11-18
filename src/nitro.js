function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// this function is called by apex plug-in
function apexNitroTestInit(pMyElementStaticID, pAjaxID) {
    var str = "Hello World!12345";
    //var str = "<script>alert('XSS')</script>";

    // get element from dom tree
    //var el = document.getElementById(pMyElementStaticID);
    // set str as html
    //el.innerHTML = str;
    // set string as escaped html
    //el.innerHTML = escapeHtml(str);
    // set string as escaped html with apex api function
    //el.innerHTML = apex.util.escapeHTML(str);

    // Build string for jQuerySelection
    var sel = "#" + pMyElementStaticID;
    // set text with jquery
    /*$(sel).text(str);*/

    str = '<br><br><b>' + str + '</b><br>';
    apex.server.plugin(pAjaxID, {
        //  Send single string max 32k to the database 
        x01: "String send as VARCHAR2 String: " + str,
        //apex.server.chunk splits long
        // strings into str array. This array can be 
        // concatenated again in the database 
        f01: apex.server.chunk("String send as VARCHAR2 Array: " + str),
        // !!!not official supported!!! 
        //Send CLOB string directly to the database
        p_clob_01: "String send as CLOB: " + str,
        // used to submit client side changed page items
        //pageItems: ""
    }, {
        // used to fire apexbeforerefresh and apexafterrefresh event 
        refreshObject: sel,
        // set element where loading icon is shown 
        loadingIndicator: sel,
        // do on success 
        success: function (pData) {
            $(sel).html(pData.str);
        },
        // do on error 
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Upload error.");
            console.error(jqXHR);
            console.error(textStatus);
            console.error(errorThrown);
        }
    });

}
