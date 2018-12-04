$(function(){
    getListPhone();
    //全局加载信息
    var page = 1;
    var pageSize = 3;
    function getListPhone(){
      $.ajax({
          type:'get',
          url: '/phone/phoneList',
          data:{
              page:page,
              pageSize:pageSize
          },
          success:function(res){
            console.log(res)
              var arr = [];
              for (var i = 1; i < res.COUNT + 1; i++) {
                  arr.push(i);
              }
              let baseArray = arr;
              let len = baseArray.length;
              let n = pageSize; //假设每行显示3个
              let lineNum = len % pageSize === 0 ? len / pageSize : Math.floor((len / pageSize) + 1);
              let newArr = [];
              for (let i = 0; i < lineNum; i++) {
                  let temp = baseArray.slice(i * n, i * n + n);
                  newArr.push(temp);
              }
              console.log(newArr)
            var html = "";
            var list = "";
                for (var i = 0; i < res.shopingList.length;i++){
                    html += `
                        <tr>
                            <td class="OneTd">${res.shopingList[i]._id}</td>
                            <td> <img src = "phoneImg/${res.shopingList[i].url}"/></td>
                            <td>${res.shopingList[i].logo}</td>
                            <td>
                                <span class="typeUpdate">修改</span>
                                <span class="typeDelete">删除</span>
                            </td>
                            <td class="lastTd">${newArr[page-1][i]}</td>
                        </tr>`;
                }
              $('.tbody').html(html);
              for (var index = 0; index < res.totalPage; index++) {
                  list += `
                  <li>${index+1}</li>
                  `;
              }
              $('.ulmove').html(list);
              $('.ulmove').children().eq(page - 1).addClass('act');
          }
      })
    }
    //弹出框的设置
    $('#typeBtn').on('click',function(){
        $('.newlyshoping').hide();
    }); 
    $('.top p').on('click',function(){
        $('.newlyshoping').show();
    })
    //新增品牌信息 addType
    $('#addType').on('click', function () {
        $('.newlyshoping').hide();
        var newlyType = $('#TYPE').val();
        console.log(newlyType)
        var addfileObj = document.getElementById('addfile').files[0];
        var fileData = new FormData();
        fileData.append("newlyType", newlyType);
        fileData.append('addfile',addfileObj);
        var data = fileData;
        $.ajax({
            type:'post',
            url:'/phone/newlyShoping',
            data: data,
            cache:false,
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            success:function(res){
                console.log(res);
                getListPhone();
            }
        });
    }); 
    //index渲染页面
    $('.ulmove').on('click','li',function(){
        page = $(this).html();
        getListPhone();
    });
    //修改框数据获取
    $('.tbody').on('click','.typeUpdate',function(){
        $('#deleteUp').show();
        var num = $(this).parent().parent().find("td").eq(0).html();
        var typetext = $(this).parent().parent().find("td").eq(2).html();
        $('.idtype').val(num);
        $('#newlyType').val(typetext)
    });
    $('#typeDelete').on('click',function(){
        $('#deleteUp').hide();
    })
    $('#deleteType').on('click',function(){
        $('#deleteUp').hide();
        var idtype = $('.idtype').val();
        var deletenum = $('#newlyType').val();
        var deletefileObj = document.getElementById('deletefile').files[0];
        var deletfileData = new FormData();
        deletfileData.append("idtype", idtype);
        deletfileData.append("deldteType", deletenum);
        deletfileData.append('deletefile', deletefileObj);
        var data = deletfileData;
        $.ajax({
            type: 'post',
            url: '/phone/deleteUp',
            data: data,
            cache: false,
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            success: function (res) {
                console.log(res);
                getListPhone();
            }
        });
    });
    //删除品牌数据处理
    $('.tbody').on('click','.typeDelete',function(){
        var index = $(this).parent().parent().find("td").eq(0).html();
        $.ajax({
            type:'post',
            url: '/phone/cut',
            data:{
                _id:index
            },
            success:function(res){
                console.log(res)
                getListPhone();
            }
        })

    })

})