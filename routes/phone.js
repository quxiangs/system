var express = require('express');
var router = express.Router();
var addPhone = require('../mongo/addPhone');
const multer = require('multer')({
    dest: 'd:/pic/'
});
const fs = require('fs');
const path = require('path');
router.post('/newlyShoping', multer.single('addfile'),function(req,res){
    fs.readFile(req.file.path,function(err,data){
        if (err) {
            console.log('读文件失败',err)
        } else {
            var filename = new Date().getTime() + '_' + req.file.originalname;
            var des_file = path.resolve(__dirname, '../public/phoneImg', filename);
            fs.writeFile(des_file,data,function(err){
                if(err) {
                    console.log('写文件失败',err);
                }else {
                    console.log('文件写入成功');
                    let dataShoping = {
                        logo: req.body.newlyType,
                        url: filename
                    }
                    addPhone.newlyShoping(dataShoping,function(err){
                        if(err) {
                            console.log('品牌信息添加失败',err);
                        }else {
                            console.log('品牌信息添加成功');
                            res.send()
                        }
                    })
                }
            })
        }
    })
});
//全局加载信息
router.get('/phoneList',function(req,res){
    var page = parseInt(req.query.page) || 1;
    var pageSize = parseInt(req.query.pageSize) || 3;
    addPhone.loadPhone ({
        page:page,
        pageSize:pageSize
    }, function(err,data){
            if(err) {
                console.log('加载商品信息出错', err);
                res.render('verror', { code: -101, msg: '加载商品信息出错' })
            } else {
                console.log('加载商品信息成功');
                res.send(data);
            }
        });
});
//修改品牌信息
router.post('/deleteUp', multer.single('deletefile'),function(req,res){
    fs.readFile(req.file.path, function (err, data) {
        if (err) {
            console.log('读文件失败', err)
        } else {
            var deltefilename = new Date().getTime() + '_' + req.file.originalname;
            var delte_des_file = path.resolve(__dirname, '../public/phoneImg', deltefilename);
            fs.writeFile(delte_des_file, data, function (err) {
                if (err) {
                    console.log('写文件失败', err);
                } else {
                    console.log('文件写入成功');
                    let deleteShoping = {
                        _id: req.body.idtype,
                        logo: req.body.deldteType,
                        url: deltefilename
                    }
                    addPhone.deleteUp(deleteShoping, function (err) {
                        if (err) {
                            console.log('品牌信息修改失败', err);
                        } else {
                            console.log('品牌信息修改成功');
                            res.send()
                        }
                    })
                }
            })
        }
    })
});
//删除品牌信息
router.post('/cut',function(req,res){
    addPhone.cutShoping(req.body._id,function(err){
        if(err) {
            console.log('删除品牌信息出错');
            res.render('verror', { code: -101, msg: '加载商品信息出错' })
        }else {
            console.log('加载商品信息成功');
            res.send();
        }
    })
})
module.exports = router;