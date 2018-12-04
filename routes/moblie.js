var express = require('express');
var router = express.Router();
const shopingModel = require('../mongo/shopingModel');
const multer = require('multer')({
    dest: 'd:/pic/'
});
const fs = require('fs');
const path = require('path');
//商品信息添加
router.post('/add', multer.single('file'), function (req, res) {
    // req.file是一个对象，就是上传不的文件的属性
    // console.log(req.body,req.file);
    //需要将临时目录下的文件，移动到public
    // 1.1读文件
    fs.readFile(req.file.path, function (err, data) {
        if (err) {
            console.log('读文件失败', err)
        } else {
            // 1.2写文件
            var fileName = new Date().getTime() + '_' + req.file.originalname;
            var des_file = path.resolve(__dirname, '../public/phoneImg', fileName);
            // console.log(des_file)
            fs.writeFile(des_file, data, function (err) {
                if (err) {
                    console.log('文件写入失败', err);
                } else {
                    console.log('文件写入成功');
                    // 最终写入到数据库的时候，我们的图片信息就可以直接写一个路径进去，那么页面渲染的时候就用这个地址就行。
                    // /public/mobiles/ + fileName
                    // fileName
                    let dataShoping = {
                        model: req.body.model,
                        type: req.body.type,
                        price: req.body.price,
                        usedprice: req.body.usedprice,
                        url: des_file
                    }
                    shopingModel.addShoping(dataShoping,function(err,data){
                        if(err){
                            console.log('商品添加失败',err);
                        } else {
                            console.log('商品添加成功');
                            res.send({ code: 0, msg:'商品添加成功'});
                        }
                    })
                }
            })
        }
    })
});
//商品信息加载
router.get('/load',function(req,res){
    var page = parseInt(req.query.page) ||1;
    var pageSize = parseInt(req.query.pageSize) ||3;
    shopingModel.loadShoping({
        page:page,
        pageSize:pageSize
    },function(err,data){
        if(err) {
            console.log('加载商品信息出错',err);
            res.render('verror', { code: -101, msg: '加载商品信息出错' })
        } else {
            console.log('加载商品信息成功');
            res.send(data);
        }
    });
});
//商品信息删除
router.post('/deleteshoping',function(req,res){
    const _id= parseInt(req.body._id);
    shopingModel.deleteShopin(_id,function(err){
        if (err) {
            console.log('删除信息出错',err);
        } else {
            console.log('删除信息成功')
            res.send();
        }
    });

})
//商品信息修改
router.post('/updatashoping', multer.single('upfile'),function(req,res){
    //1.1读取文件
    fs.readFile(req.file.path,function(err,data){
        if(err) {
            console.log('读取文件失败',err);
        }else {
            // 1.2写文件
            var upfileName = new Date().getTime()+'_'+req.file.originalname;
            var up_des_file = path.resolve(__dirname,'../public/phoneImg',upfileName);
            fs.writeFile(up_des_file,data,function(err){
                if (err) {
                    console.log('读取文件失败',err);
                }else {
                    console.log('文件写入成功');
                    let dataShopingUp = {
                        model: req.body.upmodel,
                        type: req.body.uptype,
                        price: req.body.upprice,
                        usedprice: req.body.upusedprice,
                        url: up_des_file,
                        _id: req.body.upnum
                    }
                    shopingModel.updataShoping(dataShopingUp,function(err){
                        if(err) {
                            console.log('商品信息修改失败',err);
                        } else {
                            console.log('商品信息修改成功');
                            res.send({ code: 100 });
                        }
                    })
                }
            })
        }
    })
})
//品牌信息的获取
router.get('/Type',function(req,res){
    console.log("+++++++品牌++++++++")
    shopingModel.Type(req.query,function(err,data){
        if(err){
            res.send({code:-1,msg:'品牌数据加载失败'});
        } else {
            res.send(data);
        }
    });
})
module.exports = router;