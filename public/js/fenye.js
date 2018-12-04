function pageGroup(pageNum, pageCount) { switch (pageNum) { case 1: page_icon(1, 5, 0); break; case 2: page_icon(1, 5, 1); break; case pageCount - 1: page_icon(pageCount - 4, pageCount, 3); break; case pageCount: page_icon(pageCount - 4, pageCount, 4); break; default: page_icon(pageNum - 2, pageNum + 2, 2); break; } }
function page_icon(page, count, eq) {
    var ul_html = ""; for (var i = page; i <= count; i++) { ul_html += "<li>" + i + "</li>"; }
    $("#pageGro ul").html(ul_html); $("#pageGro ul li").eq(eq).addClass("on");
}
function pageUp(pageNum, pageCount) { switch (pageNum) { case 1: break; case 2: page_icon(1, 5, 0); break; case pageCount - 1: page_icon(pageCount - 4, pageCount, 2); break; case pageCount: page_icon(pageCount - 4, pageCount, 3); break; default: page_icon(pageNum - 2, pageNum + 2, 1); break; } }
function pageDown(pageNum, pageCount) { switch (pageNum) { case 1: page_icon(1, 5, 1); break; case 2: page_icon(1, 5, 2); break; case pageCount - 1: page_icon(pageCount - 4, pageCount, 4); break; case pageCount: break; default: page_icon(pageNum - 2, pageNum + 2, 3); break; } }
function pageDown_click(pageCount, pageNum, index) {
    if (pageCount > 5) { pageDown(pageNum, pageCount); } else { var index = $("#pageGro ul li.on").index(); if (index + 1 < pageCount) { $("#pageGro li").removeClass("on"); $("#pageGro ul li").eq(index + 1).addClass("on"); } }
    isPage(pageNum + 1);
}
function pageUp_click(pageCount, pageNum, index) {
    if (pageCount > 5) { pageUp(pageNum, pageCount); } else { var index = $("#pageGro ul li.on").index(); if (index > 0) { $("#pageGro li").removeClass("on"); $("#pageGro ul li").eq(index - 1).addClass("on"); } } +
        isPage(pageNum - 1);
}
function num_click(pageCount, pageNum, selector) {
    if (pageCount > 5) { pageGroup(pageNum, pageCount); } else { selector.addClass("on"); selector.siblings("li").removeClass("on"); }
    isPage(pageNum);
}
function icon_load(pageCount) {
    if (pageCount > 5) { page_icon(1, 5, 0); } else { page_icon(1, pageCount, 0); }
    isPage(1);
}
function isPage(pageNum) {
    if (pageNum >= pageCount) { $('#pageGro .pageDown').hide(); } else { $('#pageGro .pageDown').show(); }
    if (pageNum <= 1) { $('#pageGro .pageUp').hide(); } else { $('#pageGro .pageUp').show(); }
}