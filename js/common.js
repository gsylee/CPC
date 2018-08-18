// 命名空间
var Common = {
    // tab切换功能
    tab: function (parent,target,light) {
        // parent: 外层元素
        // target: 指定触发事件的元素
        // light: 指定的高亮类名
        var $parent = $('#'+ parent),
            $targets = $(target,$parent);
        // 给
        $parent.on('click',target,function () {
            $targets.removeClass(light);
            $(this).addClass(light);
        });
    },
    // 点击设置按钮，出现下拉详情
    showOrHide: function (toggleBtn,detail) {
        // 获取需要的元素
        // toggleBtn: 点击按钮
        // detail: 对应要显示和隐藏的内容
        var $tgBtn = $('#' + toggleBtn),
            $detail = $('#' + detail);
            $tgBtn.click(function () {
                if (! $detail.is(':animated')) {
                    // show:给有这个的元素，添加一个为元素样式
                    $detail.toggleClass('show');
                    $detail.slideToggle('slow');
                }
            });
    },

    // 点击显示店铺查询功能
    /* 
     * @param: find      搜索按钮
     * @param: wrap      要被隐藏的外层容器
     * @param: showPage  要显示的页面
     */
    storeSearch: function (find,wrap,showPage) {
        // 获取需要的元素
        var $find = $('#' + find),
            $wrap = $('#' + wrap),
            $showPage = $('#' + showPage),
            $input = $('input',$showPage),
            $span = $('span',$showPage);
           $find.click(function () {
                $wrap.hide();
                $showPage.show();
                $input.focus();
           });
         // 给取消按钮，添加点击事件
         $span.click(function () {
            $input.val('');
        });
    },
    
    // 搜索店铺的 返回按钮，
    showWrap: function (btn,wrap,cur) {
        //  btn: 显示主要内容按钮
        //  wrap: 包裹层元素的id值
        //  cur: 当前的搜索框
        var $btn = $('#' + btn),
            $wrap = $('#' + wrap),
            $cur = $('#' + cur);
            $btn.click(function () {
                $cur.hide();
                $wrap.show();
            });
    },         
    /* 
     * 实现左弹出层和右弹出层相同的交互效果
     * @param: btn(触发事件的按钮id)
     * @param: layer(弹出层id)
     * @param: wrap(外层容器id)
     * @param: mask(遮罩层id)
     * @param: direction(left,或者right)
     */
    sameLayerEffect: function (btn,layer,wrap,mask,direction) {
        // 获取需要的元素
        var $btn = $('#' + btn),
            $layer = $('#' + layer),
            $wrap = $('#' + wrap),
            $mask = $('#' + mask ),
            // 获取最外层容器
            $container = $('#container'),
            // 获取两个btn 
            $button = $('button:eq(1)',$layer),
            // 获取layer的宽度
            layerWidth = $layer.outerWidth();
            // console.log(layerWidth);
            // 相同代码，进行封装
            function toLeft(handle) {
                $layer.animate({
                    left: handle + layerWidth
                },200);

                $wrap.animate({
                    left: handle + layerWidth
                },200);
            }

            $btn.click(function () {
                //给遮罩层添加一个class
                $container.addClass('hdn');
                $mask.addClass('mask');
               if (direction == 'left') {
                 toLeft('+=');
               } else {
                   toLeft('-=');
               }
            });
            // 遮罩层，和确定按钮的功能相同
            function reMove () {
                $container.removeClass('hdn');                
                $mask.removeClass('mask');
                if (direction) {
                    toLeft('-=');
                  } else {
                      toLeft('+=');
                  }
            }
            // 点击遮罩层，恢复初始状态
            $mask.click(
                reMove
            );
            // 点击确定按钮，恢复初始状态
            $button.click(reMove);
    },
    
    // 给时间弹出层选中的li添加一个class
    leftDay: function () {
        var $leftDay = $('#left-day'),
            $inputs = $('input',$leftDay),
            $buttons = $('button',$leftDay),
            // 获取点击的按钮
            $p = $('#choose-day'),
            info, //用户保存用户选择的li的文本内容
            $lis = $('li',$leftDay);
        $leftDay.on('click','li',function () {
            if (!$(this).is('.one-date')) {
                $lis.removeClass();
                $(this).addClass('one-date');
            }
            if ($(this).index() == $lis.length - 1) {
                $inputs.focus();
            }
        });
        // 获取两个button，当用户点击其中任意一个的时候，就高亮
        // 自定义范围这个li
        $inputs.focus(function () {
            if (!($lis.last().is('.one-date'))) {
                $lis.removeClass();
                $lis.last().addClass('one-date');
            }
        });
        // 点击重置，清空输入框的内容
        $buttons.click(function () {
            if ($(this).text() == '重置') {
                $inputs.val('');
                // 让高亮的li回到默认的第一个
                $lis.removeClass();
                $lis.first().addClass('one-date');
            } else {
                // 
                if ($lis.filter('.one-date').index() == $lis.length - 1) {
                    info = $inputs.first().val() + '到' + $inputs.last().val();
                } else {
                    info = $lis.filter('.one-date').text();
                }
                $p.text(info);
            }
        });
    },

    // 右边的弹出层功能
    /* 
     * 功能说明： 
     *         用户可以同时点击多个li
     *         按重置： 清空用户的选择器
     *         按确定：
     *                 保存用户点击的li的个数和内容
     *                 生成对应个数的th和td，
     *                 吧内容填充到th中，
     *                 规定th和td的总宽度，
     *                  计算table的总宽度；
     */
    rightDay: function () {
        // 获取需要的元素 
        var len = 0, // 用来保存点击的li的个数
            $rtChoose = $('#right-choose'),
            $aboutTable = $('#about-table'),
            // 获取table元素和th元素
            tableWidth = 0,
            $lis = $('li',$rtChoose),
            $rnLIs,
            // 获取重置按钮
            $rbn = $('button',$rtChoose).filter(':first-child'),
            // 确定按钮
            $cmBtn = $('button',$rtChoose).filter(':last-child');

            $rtChoose.on('click','li',function () {
               $(this).toggleClass('one-date');
            });
            // 重置清空所有选择项
            $rbn.click(function () {
                if($lis.is('.one-date')) {
                    $lis.removeClass('one-date');
                    // 让列表项的顺序也回复原来的样子

                }
            });
            // 确定按钮功能
            $cmBtn.click(function () {
                var arr = []; // 保存被点击的li的内容
                var  tableData = '<table><thead><tr>';
                    // 获取被选中的li个数
                  $rnLis =  $.map($lis,function (n) {
                      if ($(n).is('.one-date')) {
                          arr.push($(n).text());
                          return $(n);
                      }
                  });
                  len = $rnLis.length;

                  for (var i=0; i < len; i++) {
                      if (arr[i].length <= 4) {
                        tableData += '<th>' + arr[i] + '</th>';                        
                      } else {
                          tableData += '<th>' + arr[i].substring(0,4) + '<br />' + arr[i].substring(4) + '</th>';
                      }
                  }
                  tableData += '</thead></table>';
                  $aboutTable.empty();
                  $aboutTable.html(tableData);    
                  $aboutTable.find('th').css('width','3rem');
                  $aboutTable.find('table').css('width',3 * len + 'rem');
            });

    },

    // 时间插件的使用
    timePlug: function (btn) {
        // btn: 弹出时间选择框的按钮
        var currYear = (new Date()).getFullYear();	
    	var opt={};
        opt.date = {preset : 'date'};
        opt.datetime = {preset : 'datetime'};
        opt.time = {preset : 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy-mm-dd',
            dateOrder:"yymmdd",
            lang: 'zh',
            startYear: currYear - 50, //开始年份
            endYear: currYear + 10 //结束年份
        };
        $("#" + btn).mobiscroll($.extend(opt['date'], opt['default']));
    },

    // 监听滚动条事件，让表格自动网上移动
    // 获取元素，距离  页面顶部的距离
    letTableUp: function (wrap,consult) {
        // consult: 参照点
        var $consult = $('#' + consult),
            topHeight = $consult.offset().top;

        $("#" + wrap).scroll(function () {
            if ($(this).scrollTop() >= topHeight) {

            }
        });
    },

    // table 里面点击dd的弹出框的开启和关闭按钮
    tabOpen: function (em) {
        var $open = $('#' + em),
            $span1 = $('span',$open).first(),
            $span2 = $('span',$open).last();
            $span2.click(function () {
                if ($(this).is('.open')) {
                    $span1.text('关闭');
                    $(this).removeClass('open');
                } else {
                    $span1.text('开启');
                    $(this).addClass('open');
                }
            });
    },
    // 同样是弹出框里面的 input
    // cleanInput: function () {
    //     var $clean = $('#clean'),
    //         $input = $('input',$clean),
    //         $i = $('i',$clean);
    //         $input.focus(function () {
    //             $i.css('display','block');
    //         });
    //         $i.click(function () {
    //             $input.val('').focus();
    //         });
    // }
    
    // 给首页 dl下面的每个dd添加一个点击事件
    ddBtnLayer: function (wrap) {
        // 获取触发按钮
        var wrap = arguments[0] ? arguments[0] : 'own-info';
        var $storeData = $('#store-data'),
            // 获取遮罩层
            $mask = $('#mask'),
            $ownInfo = $('#' + wrap),
            // 获取确定按钮
            $span = $('.operate',$ownInfo).children('span');
            $storeData.on('click','dd',function () {
                $ownInfo.css('display','block');
                $mask.addClass('mask');
                $mask.off('click');
            });
            function same() {
                $ownInfo.css('display','none');
               $mask.removeClass('mask');
            }
            // 
            if ($span.length === 2) {
                $span.first().click(same);
            }
           $span.last().click(same);
    },

    // 添加一个公共跳转方法
    clickLink: function (pageId,url) {
        // pageId: 每个页面的外层id
        // url: 点击每个页面的tr，要跳转到的新页面
        var $table = $('#' + pageId).find('tbody');
            // 事件委托
            $table.on('click','tr',function () {
                location.href = url;
            });
    },
    // 点击返回按钮，返回上一个页面
    returnPrevPage: function () {
        // 取得对象
        var $btn = $('#prevBtn');
        $btn.click(function (event) {
            event.preventDefault();
            history.go(-1);
        });
    },

    // 启动，取消，暂停，实现用户自由选择
    changeStatus: function () {
        // 获取需要的元素
        var $status = $('#status'),
        $ps = $('p',$status);
        $ps.click(function () {
            $ps.removeClass('light');
            $(this).addClass('light');
        });
    },
    // 点击每个下拉详情的取消和确认功能
    optionChoose: function () {
    },

    // 导航栏相关
    sameNavStyle: function () {
        // 获取每个li的宽度，然后给外层容器，添加适当的宽度
        var $topBar = $('#topBar'),
            $lis = $('li',$topBar),
            allWidth = 0; // 用来保存所有li+的最终值
        $lis.each(function (i) {
            allWidth += $(this).outerWidth();
        });
        $topBar.css('width',allWidth + 10 + 'px');
    },
    // 给导航栏右边的三个点，添加点击事件
    chooseNav: function (wrap) {
        var wrap = arguments[0] ? arguments[0] : 'container';
        var $csNav = $('#chooseNav'),
            $cpcAllNav = $('#cpc-all-nav'),
            // 获取container容器
            $container = $('#' + wrap),
            // 获取蒙层
            $mask2 = $('#mask2');

            $csNav.click(function () {
                $cpcAllNav.show();
                $mask2.addClass('mask');
                $container.addClass('hdn');
            });
            function reMove() {
                $cpcAllNav.hide();
                $mask2.removeClass('mask');
                $container.removeClass();
            }
            // 点击每个li和点击遮罩层代码一样，封装成函数
            $cpcAllNav.click(reMove);
            $mask2.click(reMove);
    },
    // 所有页面都会用到的jquery插件方法
    gridly: function () {
        $('.gridly').gridly({
            columns: 1
        });
    }
};