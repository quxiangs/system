$(function () {
    var page = 1;
    var pageSize = 3;
    getList();
    typePhone();
    UP();
    function UP() {
        if (parseInt($('tbody').css('height')) < 95) {
            $('.listdiv').hide();
            $('thead').hide();
            $('#defind').show()
        } else {
            $('.listdiv').show();
            $('thead').show();
            $('#defind').hide()
        }
    }
    //全局加载手机信息
    function getList() {
        $.ajax({
            type: 'get',
            url: '/moblie/load',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (res) {
                var arr =[];
                for(var i = 1;i<res.COUNT+1;i++){
                    arr.push(i);
                }
                let baseArray = arr;
                let len = baseArray.length;
                let n = pageSize; //假设每行显示pageSize个
                let lineNum = len % pageSize === 0 ? len / pageSize : Math.floor((len / pageSize) + 1);
                let newArr = [];
                for (let i = 0; i < lineNum; i++) {
                    let temp = baseArray.slice(i * n, i * n + n);
                    newArr.push(temp);
                }
               
                var str = '';
                var strList = '';
                //商品
                for (var i = 0; i < res.shopingList.length; i++) {
                    var imgUrl = res.shopingList[i].url.split("\\public\\")[1];
                    str += `
                    <tr>
                        <td class='oneTd'>${res.shopingList[i]._id}</td>
                        <td>
                        <img src="${imgUrl}" alt="">
                        </td>
                        <td>${res.shopingList[i].model}</td>
                        <td>${res.shopingList[i].type}</td>
                        <td>￥<span>${res.shopingList[i].price}</span></td>
                        <td>￥<span>${res.shopingList[i].usedprice}</span></td>
                        <td>
                            <span class="upData">修改</span>
                            <span class="noData">删除</span>
                         </td>
                         <td class="numlist">
                           ${newArr[page - 1][i]}
                         </td>
                    </tr>
                `;
                }
                $('tbody').html(str);
                //条数
                for (var i = 0; i < res.totalPage; i++) {
                    strList += `
                <li>${i + 1}</li>
                `;
                }
                $('.ulmove').html(strList);
                $('.ulmove').children().eq(page - 1).addClass('active');
            }
        });
    }
    //全局加载手机品牌
    function typePhone() {
        $.ajax({
            type:'get',
            url:'/moblie/Type',
            success:function(res){
                var newString = '<label>品牌</label>' + '<select name="uptype" class="uptype">';
                for (var i = 0; i < res.length; i++) {
                    newString += `
                        <option value="${res[i].logo}">${res[i].logo}</option>
                    `;
                }
                newString += '</select>';
                $('#TypePhone').html(newString)
                var htmlStr = '<label>品牌</label>'+'<select name="type" class="type">';
                for (var i = 0; i < res.length; i++) {
                    htmlStr += `
                        <option value="${res[i].logo}">${res[i].logo}</option>
                    `;
                }
                htmlStr += '</select>';
                $('.typephone').html(htmlStr);
            }
        });
    }
    //各类show与hide的操作
    $("#cancel").on('click', function () {
        $('.addShoping').css("display", "none");
        $('.box').css("display", "none");
    });
    $('.top p').on('click', function () {
        $('.addShoping').css("display", "block");
        $('.box').css("display", "block");
    })
    //手机新增数据
    $('#sub').on('click', function () {
        $('.box').css("display", "none");
        $('.addShoping').css("display", "none");
        var model = $('.model').val();
        var type = $('.type').val();
        var price = $('.price').val();
        var usedprice = $('.usedprice').val();
        var fileObj = document.getElementById('papers').files[0];
        var newData = new FormData();
        newData.append("model", model);
        newData.append("type", type);
        newData.append("price", price);
        newData.append("usedprice", usedprice);
        newData.append("file", fileObj);
        $.ajax({
            type: "post",
            url: "/moblie/add",
            data: newData,
            cache: false,//上传文件无需缓存
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            success: function (res) {
                if (parseInt($('tbody').css('height')) < 95) {
                    console.log('+++++++++555   +++++++++')
                    $('thead').show()
                    $('listdiv').show()
                    $('#defind').hide()
                } else {
                    console.log('+++++++++444+++++++++')
                    $('#defind').hide()
                }
                getList();
            }
        });
    });
    //index加载手机信息
    $('.ulmove').on('click', 'li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        page = parseInt($(this).html());
        getList();

    });
    //updata 修改商品区域
    $('tbody').on('click', '.upData', function () {
        $('.updatashoping').css('display', 'block');
        $('.box').css("display", "block");
        var id = $(this).parent().parent().find('td').eq(0).html();
        var model = $(this).parent().parent().find('td').eq(2).html();
        var type = $(this).parent().parent().find('td').eq(3).html();
        var price = $(this).parent().parent().find('td').eq(4).find('span').html();
        var usedprice = $(this).parent().parent().find('td').eq(5).find('span').html();
        var id = $(this).parent().parent().find('td').eq(0).html();
        $('.upnum').val(id)
        $('.upmodel').val(model);
        $('.uptype').val(type);
        $('.upprice').val(price);
        $('.upusedprice').val(usedprice);
    })
    $('#noBtn').on('click', function () {
        $('.updatashoping').css('display', 'none');
        $('.box').css("display", "none");
    })
    //删除手机信息
    $('tbody').on('click', '.noData', function () {
        var id = $(this).parent().parent().find('td').eq(0).html();
        console.log(id)
        // console.log( )

        $.ajax({
            type: 'post',
            url: '/moblie/deleteshoping',
            data: {
                _id: id
            },
            success: function (res) {
    var heightNum = parseInt($('tbody').css('height'))
                console.log(heightNum)
                if ( heightNum < 96){
                    if(page<=1){
                        page=1;
                        $('#defind').show()
                        $('thead').hide()
                        $('listdiv').hide()
                        getList();
                    }else {
                        $('#defind').hide()
                        $('thead').show()
                        $('listdiv').show()
                        page = page -1;
                    }
                }else {
                    $('#defind').hide()
                    $('thead').show()
                    $('listdiv').show()
                    page = page;
                }
                console.log(page)
                getList();
            }
        });
    });
    // var heightNum = parseInt($('tbody').css('height'))
    //提交修改信息
    $('#updataShoping').on('click', function () {
        $('.updatashoping').css('display', 'none');
        $('.box').css("display", "none");
        var upnum = $('.upnum').val();
        var upmodel = $('.upmodel').val();
        var uptype = $('.uptype').val();
        var upprice = $('.upprice').val();
        var upusedprice = $('.upusedprice').val();
        var upfileObj = document.getElementById('uppapers').files[0];
        var upnewData = new FormData();
        upnewData.append("upmodel", upmodel);
        upnewData.append("uptype", uptype);
        upnewData.append("upprice", upprice);
        upnewData.append("upusedprice", upusedprice);
        upnewData.append("upnum", upnum);
        upnewData.append("upfile", upfileObj);
        $.ajax({
            type: 'post',
            url: '/moblie/updatashoping',
            data: upnewData,
            cache: false,//上传文件无需缓存
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            success: function (res) {
                console.log(res);
                getList();
            }
        });
    })
    console.log(parseInt($('tbody').css('height')))
    if (parseInt($('tbody').css('height'))<95){
        $('#defind').show()
    }else {
        $('#defind').hide()
    }
    
});
