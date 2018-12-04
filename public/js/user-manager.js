$(function () {

    if (!document.cookie) {
        location.reload();
    }
    
    $(".Previous").on('click', function () {
        // alert(8)
    });
    $(".Next").on('click', function () {
        // alert(8)
    });
    //点击取消修改框
    $("#btn").on('click', function () {
        $(".update_form").css("display", "none");
        $(".box").css("display", "none");
    });
    $("#sub").on("click", function () {
        $(".box").css("display", "none");
        $(".update_form").css("display", "none");
    });
    $(".updeta").on('click', function () {
        $(".update_form").css("display", "block");
        $(".box").css("display", "block");
        $(".number").val($(this).parent().parent().eq(0).find('td').eq(0).html());
        $(".username").val($(this).parent().parent().eq(0).find('td').eq(1).html());
        $(".nickname").val($(this).parent().parent().eq(0).find('td').eq(2).html());
        $(".phone").val($(this).parent().parent().eq(0).find('td').eq(3).html());
        var userNmae = $(this).parent().parent().eq(0).find('td').eq(1).html();
        if (userNmae == document.cookie.split(";")[0].split("=")[1]){
            console.log('5555555555555')
            $('#isadmin').css('display','none');
        }
    });
    //判断信息内容是否为空
    if ($('.tbody').css('height') <= "0px") {
        $('.pagination').css("display", "none");
        $('.Img').css("display", "block");
    } else {
        $('.pagination').css("display", "block");
        $('.Img').css("display", "none");
    }
















});