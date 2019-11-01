var tab = '<a href="javascript:void(0)">主页aa主页aa主页a<i class="fa fa-times page-tab-close" aria-hidden="true"></i></a>';
$(function() {
    //箭头向下，导航菜单显示
    $('.nav-top-down').hover(function() {
        // over
        $(this).children().show();

    }, function() {
        // out
        $(this).children().hide();
    });
    $('.nav-block').hover(function() {
        // over
        $(this).show();
    }, function() {
        // out
        $(this).hide();
    });

    $('.page-tree a').click(function() {
        $tab = $(this);
        var $more = $tab.find('.page-tree-more').eq(0);
        if ($more.hasClass(treeMoreActiveClass)) {
            $more.removeClass(treeMoreActiveClass);
            $tab.siblings().hide();
        } else {
            $more.addClass(treeMoreActiveClass);
            $tab.siblings().show();
        }
        addTab($(this).attr(pageIdField));
        return false;

    });

    tabBindClick();
});
//  #####################################   标签操作    #####################################

var pageIdField = 'pageid'; //Boss
var titleField = 'title';
var keyField = 'sn';

var tabElement = '.page-tab a'; //.page-tab>a
var tabCloseElement = '.page-tab .page-tab-close';
var tabActiveClass = 'page-tab-active';

var pageElement = '.page-iframe';
var pageActiveClass = 'page-iframe-active';


var treeElement = '.page-tree a';
var treeActiveClass = 'page-tree-active';
var treeMoreActiveClass = 'page-tree-more-active';
/**
 * 标签点击事件绑定
 */
function tabBindClick() {
    $(tabElement).unbind('click').bind('click', function() {
        activeTab($(this).attr(pageIdField));
    });
    $(tabCloseElement).unbind('click').bind('click', function() {
        closeTab($(this).parent().attr(pageIdField));
    });
}
/**
 * 添加标签
 * @param {*} element 点击菜单时的a标签对象
 */
function addTab(pageId) {
    if (!pageId) { return false; }

    if (findTab(pageId) === null) {
        var $tree = findTree(pageId);
        var frameHeight = $(window).outerHeight() - $('#head').outerHeight() - $('#nav-top').outerHeight();

        var tab = '<a pageid="' + pageId + '">' + $tree.attr(titleField) +
            '<i class="fa fa-times page-tab-close" aria-hidden="true"></i></a>';
        var $panel = $('<div class="page-iframe"></div>').attr(pageIdField, pageId);
        var $iframe = $('<iframe></iframe>')
            .attr('src', pageId)
            .attr('frameborder', 'no')
            .attr('id', 'iframe_' + $tree.attr(keyField))
            .css({ 'width': '100%', 'height': frameHeight });
        $iframe.on('load', function() {
            // $(this).css({ 'width': '100%', 'height': frameHeight });
        });
        $panel.append($iframe);
        $('#content').append($panel);
        $('.page-tab').append(tab);
        tabBindClick();
    }
    activeTab(pageId);

}
/**
 * 关闭标签
 * @param {*} element 点击关闭时父节点a标签
 */
function closeTab(pageId) {
    var $tab = findTab(pageId);
    var $page = findPage(pageId);
    if ($tab.hasClass(tabActiveClass)) {
        var nextPageId;
        if ($tab.next().length > 0) {
            nextPageId = $tab.next().attr(pageIdField);
        } else {
            nextPageId = $tab.prev().attr(pageIdField);
        }
        //等待删除后显示
        setTimeout(() => {
            activeTab(nextPageId);
        }, 100);
    }
    $tab.remove();
    $page.remove();
}
/**
 * 寻找标签
 * @param {string} pageId 标签主键
 */
function findTab(pageId) {
    var $ele = null;
    $(tabElement).each(function() {
        var $this = $(this);
        if ($this.attr(pageIdField) == pageId) {
            $ele = $this;
            return false; //退出循环
        }
    });
    return $ele;
}
/**
 * 寻找页面
 * @param {string} pageId 标签主键
 */
function findPage(pageId) {
    var $ele = null;
    $(pageElement).each(function() {
        var $this = $(this);
        if ($this.attr(pageIdField) == pageId) {
            $ele = $this;
            return false; //退出循环
        }
    });
    return $ele;
}
/**
 * 寻找树标签
 * @param {string} pageId 标签主键
 */
function findTree(pageId) {
    var $ele = null;
    $(treeElement).each(function() {
        var $this = $(this);
        if ($this.attr(pageIdField) == pageId) {
            $ele = $this;
            return false; //退出循环
        }
    });
    return $ele;
}

/**
 * 激活标签页
 * @param {string} pageId 标签主键
 */
function activeTab(pageId) {
    var $tab = findTab(pageId);
    if ($tab != null) {
        scrollToTab($tab);
        $tab.siblings().removeClass(tabActiveClass);
        $tab.addClass(tabActiveClass);
        activeIframe(pageId);
        activeTree(pageId);
    }

}
/**
 * 激活iframe
 * @param {string} pageId 标签主键
 */
function activeIframe(pageId) {
    $(pageElement).removeClass(pageActiveClass);
    $(pageElement).each(function() {
        var $this = $(this);
        if ($this.attr(pageIdField) == pageId) {
            $this.addClass(pageActiveClass);
            return false;
        }
    });
}
/**
 * 激活左侧菜单
 * @param {string} pageId 标签主键
 */
function activeTree(pageId) {
    var $tab = findTree(pageId);
    $(treeElement).removeClass(treeActiveClass);
    $(treeElement).each(function() {
        var $this = $(this);
        if ($this.attr(pageIdField) == pageId) {
            $this.addClass(treeActiveClass);
            return false;
        }
    });
}
//  #####################################   顶部导航按钮操作    #####################################

/**
 * 计算jquery对象的宽度和
 * @param {*} element jquery 对象
 */
function calcSumWidth(element) {
    var width = 0;
    $(element).each(function() {
        width += $(this).outerWidth(true);
    });
    return width;
}
/**
 * 滚动到指定标签
 * @param {object} element 指定标签
 */
function scrollToTab(element) {
    var $tab = $(element);
    var marginLeftVal = Math.abs(parseFloat($('.page-tab').css('margin-left'))); //标签偏移宽度
    var leftWidth = calcSumWidth($tab.prevAll()); //标签左侧宽度
    var selfWidth = $tab.outerWidth(true); //标签自身宽度
    var totalWidth = calcSumWidth(tabElement); //标签总宽度
    var visibleWidth = $('.nav-top-tab').outerWidth(true); //视窗宽度
    var scrollWidth = 0; //偏移宽度
    if (totalWidth > visibleWidth) {
        var leftTotaleWidth = marginLeftVal + visibleWidth;
        if (leftWidth < marginLeftVal) {
            //左侧宽度 < 偏移，则这个标签处于左侧中间位置，向右移动
            scrollWidth = leftWidth;
        } else if (leftWidth < leftTotaleWidth && (leftWidth + selfWidth) > leftTotaleWidth) {
            //左侧宽度+自身宽度 > 偏移+视窗，并且，左侧距离<偏移+视窗，则这个标签处于右侧中间位置，向左移动
            scrollWidth = leftWidth + selfWidth - visibleWidth;
        } else if (leftTotaleWidth < leftWidth) {
            //左侧远  > 偏移+视窗
            scrollWidth = leftWidth + selfWidth - visibleWidth;
        } else {
            scrollWidth = marginLeftVal;
        }
    }
    $('.page-tab').animate({ marginLeft: 0 - scrollWidth + 'px' }, 'fast');
}
/**
 * 左右滚动标签
 * @param {string} direction 滚动方向 
 */
function scrollTab(direction) {
    var marginLeftVal = Math.abs(parseFloat($('.page-tab').css('margin-left')));
    var visibleWidth = $('.nav-top-tab').outerWidth(true);
    var totalWidth = calcSumWidth(tabElement);
    var scrollWidth = 0;
    if (totalWidth > visibleWidth) {
        var $tab = $('.page-tab>a:first');
        //确定现在排在第一位的标签
        var offsetWidth = 0;
        while ((offsetWidth + $tab.outerWidth(true)) <= marginLeftVal) {
            offsetWidth += $tab.outerWidth(true);
            $tab = $tab.next();
        }
        offsetWidth = 0;
        //寻找滚动后排在第一的标签
        if (direction == "right") {
            //如果排在第一位和后面的宽度和大于可视区域，既可向右→滚动
            if (($tab.outerWidth(true) + calcSumWidth($tab.nextAll())) > visibleWidth) {
                //确定之后要排在第一位的标签,一移动即移动<=可视区域的宽度
                while ((offsetWidth + $tab.outerWidth(true)) < visibleWidth && $tab.length > 0) {
                    offsetWidth += $tab.outerWidth(true);
                    tabElement = $tab.next();
                }
            }
        } else {
            //如果前面有节点，最大移动一个可视区域的距离
            while ($tab.prev().length > 0 && offsetWidth < visibleWidth) {
                $tab = $tab.prev();
                offsetWidth += $tab.outerWidth(true);

            }
        }
        scrollWidth = calcSumWidth($tab.prevAll());
    }
    $('.page-tab').animate({ marginLeft: 0 - scrollWidth + 'px' }, 'fast');
}
/**
 * 标签向右滚动
 */
function scrollTabRight() {
    var marginLeftVal = Math.abs(parseFloat($('.page-tab').css('margin-left')));
    var visibleWidth = $('.nav-top-tab').outerWidth(true);
    var totalWidth = calcSumWidth(tabElement);
    var scrollWidth = 0;
    if (totalWidth > visibleWidth) {
        var $tab = $('.page-tab>a:first');
        //确定现在排在第一位的标签
        var offsetWidth = 0;
        while ((offsetWidth + $tab.outerWidth(true)) <= marginLeftVal) {
            offsetWidth += $tab.outerWidth(true);
            $tab = $tab.next();
        }
        offsetWidth = 0;
        //如果排在第一位和后面的宽度和大于可视区域，既可向右滚动
        if (($tab.outerWidth(true) + calcSumWidth($tab.nextAll())) > visibleWidth) {
            //确定之后要排在第一位的标签,一移动即移动<=可视区域的宽度
            while ((offsetWidth + $tab.outerWidth(true)) < visibleWidth && $tab.length > 0) {
                offsetWidth += $tab.outerWidth(true);
                $tab = $tab.next();
            }
        }
        scrollWidth = calcSumWidth($tab.prevAll());
    }
    $('.page-tab').animate({ marginLeft: 0 - scrollWidth + 'px' }, 'fast');
}
/**
 * 标签向左滚动
 */
function scrollTabLeft() {
    var marginLeftVal = Math.abs(parseFloat($('.page-tab').css('margin-left')));
    var visibleWidth = $('.nav-top-tab').outerWidth(true);
    var totalWidth = calcSumWidth(tabElement);
    var scrollWidth = 0;
    if (totalWidth > visibleWidth) {
        var $tab = $('.page-tab>a:first');
        //确定现在排在第一位的标签
        var offsetWidth = 0;
        while ((offsetWidth + $tab.outerWidth(true)) <= marginLeftVal) {
            offsetWidth += $tab.outerWidth(true);
            $tab = $tab.next();
        }
        offsetWidth = 0;
        while (tabElement.prev().length > 0 && offsetWidth < visibleWidth) {
            $tab = $tab.prev();
            offsetWidth += $tab.outerWidth(true);

        }
        scrollWidth = calcSumWidth($tab.prevAll());
    }
    $('.page-tab').animate({ marginLeft: 0 - scrollWidth + 'px' }, 'fast');
}
/**
 * 关闭当前页
 */
function closeSelfTab() {
    $(tabElement).each(function() {
        var $this = $(this);
        var pageId = $this.attr(pageIdField);
        if ($this.hasClass(tabActiveClass) && pageId != 'home') {
            closeTab(pageId);
            return;
        }
    });
}
/**
 * 关闭其他页
 */
function closeOtherTab() {
    $(tabElement).each(function() {
        var $this = $(this);
        var pageId = $this.attr(pageIdField);
        if (!$this.hasClass(tabActiveClass) && pageId != 'home') {
            closeTab(pageId);
        }
    });
}
/**
 * 关闭全部页
 */
function closeAllTab() {
    $(tabElement).each(function() {
        var $this = $(this);
        var pageId = $this.attr(pageIdField);
        if (pageId != 'home') {
            closeTab(pageId);
        }
    });
}