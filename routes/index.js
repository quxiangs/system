var express = require('express');
var router = express.Router();
var usersModel = require('../mongo/usersModel');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.cookies.username) {
    res.render('index', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '- (管理员)' : ''
    });
  } else {
    res.redirect('/login.html');
  }
});
//注册页面
router.get('/register.html', function (req, res, next) {
  res.render('register');
});
router.get('/login.html', function (req, res, next) {
  res.render('login');
});
//用户管理页面
router.get('/user-manager.html', function (req, res) {
  //同首页判断是否用户登录，用户是否是管理员
  if (req.cookies.username && parseInt(req.cookies.isAdmin)) {
    //需要查询数据库
    //从前端获得2个参数
    var page = req.query.page || 1;
    var pageSize = req.query.pageSize || 5;
    var nicknameurl = req.query.nickname;
    usersModel.getUserList({
      page: page,
      pageSize: pageSize,
    }, function (err, data) {
      if (err) {
        res.render('verror', { code: -101, msg: '数据获取失败' })
      } else {
        res.render('user-manager', {
          username: req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin: parseInt(req.cookies.isAdmin) ? '- (管理员)' : '',
          userList: data.userList,
          totalPage: data.totalPage,
          page: data.page,
          pageSize:pageSize,
          nicknameurl: nicknameurl,
          COUNT: data.COUNT
        });
      }
    });
  } else {
    res.redirect('/login.html');
  }
});

//查询用户数据处理
router.get('/search', function (req, res) {
  if (req.cookies.username && parseInt(req.cookies.isAdmin)) {
    var nickname = new RegExp(req.query.nickname);
    var nicknameurl = req.query.nickname;
    var page = req.query.page || 1;
    var pageSize = req.query.pageSize || 5;
    if (req.query.nickname == "") {
      res.redirect('/user-manager.html');
    } else {
      usersModel.getSearch({
        page: page,
        pageSize: pageSize,
        nickname: nickname,
      }, function (err, data) {
        if (err) {
          console.log('失败', err);
        } else {
          console.log('+++++++++++++++++')
          console.log(data)
          res.render('user-manager', {
            username: req.cookies.username,
            nickname: req.cookies.nickname,
            isAdmin: parseInt(req.cookies.isAdmin) ? '- (管理员)' : '',
            userList: data.results,
            totalPage: data.totalPage,
            page: data.page,
            pageSize:data.pageSize,
            nicknameurl: nicknameurl,
             COUNT: data.COUNT
          });
        }
      });
    }

  } else {
    res.redirect('/login.html');
  }
});
//删除用户数据数理
router.get('/delete', function (req, res) {
  var id = parseInt(req.query.delnum);
  var page = req.query.page || 1;
  var nicknameurl = req.query.nickname;
  usersModel.deleteUser(id, function (err, data) {
    if (err) {
      console.log('删除用户信息失败', err);
    } else {
      console.log("===============")
      if (nicknameurl) {
        res.redirect('search?nickname='+nicknameurl+'&'+'page='+page);
      } else {
        res.redirect('/user-manager.html?page='+page);
      }
    }
  });
});

//品牌管理页面
router.get('/phone-type.html', function (req, res) {
  //同首页 判断是否用户登录，用户是否是管理员
  if (req.cookies.username) {
    res.render('phone-type', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : ''
    });
  } else {
    res.redirect('/login.html');
  }
});
//手机管理页面
router.get('/moblie-manager.html', function (req, res) {
  //同首页 判断是否用户登录，用户是否是管理员
  if (req.cookies.username) {
    res.render('moblie-manager', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : ''
    });
  } else {
    res.redirect('/login.html');
  }
});
module.exports = router;
