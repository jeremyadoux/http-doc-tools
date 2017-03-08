/**
 * Created by jadoux on 07/03/2017.
 */
$(document).ready(function() {
    if ($("#tab-toc").length) {
        $("#tab-toc").dynatree({
            clickFolderMode: 1,
            debugLevel: 0,
            imagePath: 'img/',
            onActivate: function(node){
                if ($("#tab-keywords").length && $("#tab-keywords").dynatree && $("#tab-keywords").dynatree("getTree") && $("#tab-keywords").dynatree("getTree").activateKey)
                    $("#tab-keywords").dynatree("getTree").activateKey(null);
                if(node.data.href && node.data.href != '#'){
                    window.location(node.data.href, node.data.target);
                }
            }
        });
        // Expand all nodes if required
        $("#tab-toc").dynatree("getRoot").visit(function(node){
            node.expand(true);
        });
        // Select the active help id
        if (sHelpIdToActivate != '') $("#tab-toc").dynatree("getTree").activateKey(sHelpIdToActivate);
    }
});