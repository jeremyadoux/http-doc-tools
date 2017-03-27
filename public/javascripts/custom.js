/**
 * JS pour gerer l'arbre de la frame de gauche (les éléments déroulés, selectionnés etc
 */

window.bSearchDataLoaded = false;
var sHelpIdToActivate = '';

$(document).ready(function() {
    $( "#tabs" ).tabs();

    var sAnchorName = '';
    try { sAnchorName = top.location.href.substring(top.location.href.lastIndexOf("#") + 1, top.location.href.length); }
    catch(err) { sAnchorName = ''; }
    var nSelectedTab = 0;
    if (sAnchorName == '_index') nSelectedTab = 1
    else if (sAnchorName == '_search') nSelectedTab = 2;
    $("#tabs").tabs({
        selected: nSelectedTab,
        select: function(event, ui) { HideKwPopup(); }
    });

    // Toc
    if ($("#tab-toc").length) {
        $("#tab-toc").dynatree({
            clickFolderMode: 1,
            debugLevel: 0,
            imagePath: '../img/',
            onActivate: function(node){
                if ($("#tab-keywords").length && $("#tab-keywords").dynatree && $("#tab-keywords").dynatree("getTree") && $("#tab-keywords").dynatree("getTree").activateKey)
                    $("#tab-keywords").dynatree("getTree").activateKey(null);
                if(node.data.href && node.data.href != '#'){
                    window.open(node.data.href, node.data.target);
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

    // Keywords

    if ($("#tab-keywords").length) {
        $("#tab-keywords").dynatree({
            clickFolderMode: 1,
            debugLevel: 0,
            imagePath: '../img/',
            onClick: function(node, event){
                HideKwPopup();
                if (node.data && node.data.click)
                {
                    var aRefList = null;
                    eval('aRefList=' + node.data.click);
                    if (ShowKwPopup(node.li, aRefList))
                    {
                        if ($("#tab-toc") && $("#tab-toc").dynatree && $("#tab-toc").dynatree("getTree") && $("#tab-toc").dynatree("getTree").activateKey)
                            $("#tab-toc").dynatree("getTree").activateKey(null);
                        if(node.data.href && node.data.href != '#'){
                            window.open(node.data.href, node.data.target);
                        }
                    }
                }
            }
        });
        // Expand all nodes if required
        $("#tab-keywords").dynatree("getRoot").visit(function(node){
            node.expand(true);
        });
    }

    // Load search data
    (function() {
        var se = document.createElement('script'); se.type = 'text/javascript'; se.async = true;
        se.src = 'javascripts/hndsd.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s);
    })();

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

$('body').click(function() {
    HideKwPopup();
});

function SelectTocItem(sHelpId)
{
    if ($("#tab-toc").length && $("#tab-toc").dynatree && $("#tab-toc").dynatree("getTree") && $("#tab-toc").dynatree("getTree").getNodeByKey) {
        $("#tab-toc").dynatree("getTree").getNodeByKey(sHelpId).activateSilently();
    }
    else {
        sHelpIdToActivate = sHelpId;
    }
}

function HideKwPopup()
{
    if($("#popupMenu")) $("#popupMenu").remove();
}

function ShowKwPopup(oSender, aLinks)
{
    HideKwPopup();
    if (!aLinks || !aLinks.length || aLinks.length == 0) return false
    else if (aLinks.length == 1) return true
    else
    {
        var oParentDiv = document.createElement("DIV");
        oParentDiv.id = "popupMenu";
        var oLink = null;
        // Close button
        oLink = document.createElement("SPAN");
        oLink.className = "close-button";
        oLink.innerHTML = "X";
        oLink.href = "#";
        oLink.onclick = HideKwPopup;
        oParentDiv.appendChild(oLink);
        // Items
        for (var nCnt=0; nCnt<aLinks.length; nCnt++)
        {
            oLink = document.createElement("A");
            oLink.innerHTML = aLinks[nCnt][0];
            oLink.href = aLinks[nCnt][1];
            oLink.target = "FrameMain";
            oLink.onclick = HideKwPopup;
            oParentDiv.appendChild(oLink);
        }
        document.body.appendChild(oParentDiv);
        var pos = $(oSender).offset();
        var height = $(oSender).height();
        $(oParentDiv).css({
            "left": (pos.left+20) + "px",
            "top": (pos.top + height + 5) + "px"
        });
        $(oParentDiv).show();
        return false;
    }
}

function PerformSearch()
{
    if (!window.bSearchDataLoaded) {
        $("#search_results").html("Search engine data hasn't been fully loaded yet or an error occurred while loading it. This usually happens when documentation is browsed locally.");
        return;
    }
    sValue = $("#search_value").val();
    $("#search_results").html('Searching...');
    var oSearchEngine = new HndJsSe;
    oSearchEngine.ParseInput(sValue);
    oSearchEngine.PerformSearch();
    if (!oSearchEngine.aResults || !oSearchEngine.aResults.length)
    {
        $("#search_results").html('No results found.');
    }
    else
    {
        $("#search_results").html('<div id="search_results_content"></div>');
        var oUl = $("#search_results_content").append("<ul id='lr'></ul>").find("ul");
        for (var nCnt = 0; nCnt < oSearchEngine.aResults.length; nCnt++)
        {
            if (oSearchEngine.aResults[nCnt][0] < aTl.length)
            {
                oUl.append("<li><a href='" + aTl[oSearchEngine.aResults[nCnt][0]][0] + "?search=" + escape(sValue) + "' target='FrameMain'>" + unescape(aTl[oSearchEngine.aResults[nCnt][0]][1]) + "</a></li>");
            }
        }
        // Tree
        $("#search_results_content").dynatree({
            clickFolderMode: 1,
            debugLevel: 0,
            imagePath: '../img/',
            onActivate: function(node){
                if ($("#search_results_content") && $("#search_results_content").dynatree && $("#search_results_content").dynatree("getTree") && $("#search_results_content").dynatree("getTree").activateKey)
                    $("#search_results_content").dynatree("getTree").activateKey(null);
                if(node.data.href && node.data.href != '#'){
                    window.open(node.data.href, node.data.target);
                }
            }
        });
    }
}

