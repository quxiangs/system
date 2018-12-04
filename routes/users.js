var express = require('express');
var router = express.Router();
const usersModel = require('../mongo/usersModel');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', function (req, res) {
  // console.log(req.body); 
  //1.用户名必须5-10位 [A-Za-z0-9_]
  if (!/^\w{5,10}$/.test(req.body.username)) {
    // res.send('请输入正确的用户名,用户名必须是5到10位');
    res.render('verror', { code: -1, msg: '请输入正确的用户名,用户名必须是5到10位' });
    return;
  }
  //2.密码验证 /^[a-z0-9_]{6,10}$/
  if (!/^[A-Za-z0-9_]{6,18}$/.test(req.body.password)) {
    res.render('verror', { code: 0, msg: '密码为6到10位,由字母数字下划线组成' });
    return;
  }
  //3.密码一致验证
  if (req.body.password != req.body.repassword) {
    res.render('verror', { code: 1, msg: '密码必须一致' });
    return;
  }
  //4.nickname验证 /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,8}$/
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,8}$/.test(req.body.nickname)) {
    res.render('verror', { code: 2, msg: '请输入正确昵称2到8位' });
    return;
  }
  //5.手机号验证 /^1[34578]\d{9}$/
  if (!/^1[34578]\d{9}$/.test(req.body.phone)) {
    res.render('verror', { code: -2, msg: '请输入正确的手机号' });
    return;
  }
  //操作数据库写入信息
  usersModel.add(req.body, function (err) {
    if (err) {
      res.render('verror', { msg: err });
    } else {
      console.log("成功添加")
      res.redirect('/login.html');
    }
  });
});
router.get('/logout', function (req, res) {
  //清除cookie退出登录操作
  //跳转登录页面设置
  if (!req.cookies.username) {
    res.redirect('/login.html');
  }
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');
  res.send('<script>location.replace("/")</script>');
});
//登录处理
router.post('/login', function (req, res) {
  usersModel.login(req.body, function (err, data) {
    if (err) {
      console.log(err);
      res.render('verror', err);
    } else {
      //调到首页
      console.log('当前登录用户的信息', data);
      //写cookie
      res.cookie('username', data.username, {
        maxAge: 1000 * 60 * 100000,
      });
      res.cookie('nickname', data.nickname, {
        maxAge: 1000 * 60 * 100000,
      });
      res.cookie('isAdmin', data.isAdmin, {
        maxAge: 1000 * 60 * 100000
      });
      res.redirect('/');
    }
  });
});
//修改处理
router.post('/updata', function (req, res) {
  if (req.cookies.username && parseInt(req.cookies.isAdmin)) {
    var page = req.body.page;
    var nicknameurl = req.body.nicknameurl;
    console.log(page, nicknameurl);
    usersModel.updataUser(req.body, function (err, data) {
      if (err) {
        console.log('用户信息修改失败', err);
      } else {
        if (nicknameurl) {
          res.redirect('/search?nickname='+nicknameurl+'&'+'page='+page);
        } else {
          if (req.cookies.username == req.body.username) {
            res.cookie('nickname', req.body.nickname, {
              maxAge: 1000 * 60 * 100000,
            });
          }
          res.redirect('/user-manager.html?page=' + page);
        }
      }
    });
  } else {
    res.redirect('/login.html');
  }
});
module.exports = router;
