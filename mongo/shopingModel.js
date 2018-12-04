const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';

const shopingModel = {
    /**
     *增加数据
     *
     * @param {Object} data 需要增加的信息
     * @param {cd} cd   回调函数
     */
    addShoping(data, cd) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
                cb({ code: -100, msg: '连接数据库失败' });
            } else {
                const db = client.db('zwpan');
                console.log(data)
                let saveData = {
                    model: data.model,
                    type: data.type,
                    price: data.price,
                    usedprice: data.usedprice,
                    url: data.url,
                }
                    var  Num = 0;
                async.series([
                    function (callback) {
                        //查询表的所有数据
                        db.collection('shoping').find().count(function (err, num) {
                            
                            if (err) {
                                callback({ code: -101, msg: '查询表数据失败' });
                            } else {
                                Num = num;
                                callback(null);
                            }
                        })
                    },
                    function (callback) {
                        if(Num < 1 ) {
                            saveData._id=1;
                            callback(null);
                        }else{
                            db.collection('shoping').find().skip(Num - 1).toArray(function (err, data) {
                                if (err) {
                                    console.log('查询最后一条数据失败', err);
                                    callback({ code: -101, msg: '查询最后一条数据失败' });
                                } else {
                                    saveData._id = data[0]._id + 1;
                                    console.log(saveData._id)
                                    callback(null);
                                }
                            })
                        }
                    },
                    function (callback) {
                        //写入数据库
                        console.log(saveData)
                        db.collection('shoping').insertOne(saveData, function (err) {
                            if (err) {
                                console.log(err);
                                callback({ code: -101, msg: '写入数据失败' });
                            } else {
                                callback(null);
                            }
                        });
                    }
                ], function (err, results) {
                    if (err) {
                        console.log('上面的操作,可能出错了');
                        cd(err);
                    } else {
                        console.log('添加成功');
                        cd(null);
                    }
                    client.close();
                });
            }
        })
    },
    /**
     *
     * @param {Object} data 页面信息
     * @param {cd} cd 回调函数
     * 
     */
    loadShoping(data,cd){
        MongoClient.connect(url,function(err,client){
            if(err) {
                console.log('数据库连接失败');
                cd({code:-101,msg:'加载中请稍后'});
            }else {
                var db = client.db('zwpan');
                var skipnum = parseInt(data.page) * parseInt(data.pageSize) - parseInt(data.pageSize);
                var pageSize = parseInt(data.pageSize);
                async.parallel([
                    function(callback){
                        db.collection('shoping').find().count(function(err,num){
                            if (err) {
                                console.log('查询数据库条数失败');
                                callback({ code: -101, msg:'查询数据库条数失败'});
                            } else {
                                callback(null,num);
                            }
                        })
                    },
                    function(callback){
                        //显示分页数据
                        db.collection('shoping').find().limit(pageSize).skip(skipnum).toArray(function(err,data){
                            if(err) {
                                console.log('数据查询失败');
                                callback({ code: -100, msg:'数据查询失败'});
                            } else {
                                callback(null,data);
                            }
                        })
                    }
                ],function(err,results){
                    if(err) {
                        console.log('以上操作可能出错');
                        cd({ code: -101, msg:'以上操作可能出错'});
                    } else {
                        cd (null,{
                            shopingList: results[1],
                            totalPage:Math.ceil(results[0] / data.pageSize ),
                            page:data.page,
                            COUNT:results[0]
                        });
                    }
                    client.close();
                })
            }
        })
    },
    /**
     *
     * @param {Object} data 需要修改的信息
     * @param {*} cd 回调函数
     */
    updataShoping(data,cd){
        console.log('*********修改信息*********')
        console.log(data);
        console.log('*********修改信息*********')
        data._id  = parseInt(data._id);

        MongoClient.connect(url,function(err,client){
            if(err) {
                console.log('数据库连接失败',err);
                cd({code:-101,msg:'加载中请稍后'});
            }else {
                var db = client.db('zwpan');
                db.collection('shoping').updateOne({ _id: data._id},{$set:data},function(err){
                    if(err){
                        console.log('修改信息失败',err);
                        cd({ code: -101, msg: "信息修改失败" });
                    } else {
                        console.log('信息修改成功');
                        cd(null);
                    }
                })
            }
        });
    },
    /**
     *
     *
     * @param {Object} data 接受删除的数据id
     * @param {cb} cd 回调函数
     */
    deleteShopin(data,cd){

        MongoClient.connect(url,function(err,client){
            if(err) {
                cd({code:-101,msg:'数据库连接失败'});
            }else {
                var db = client.db('zwpan');
                db.collection('shoping').deleteOne({_id:data},function(err){
                    if(err){
                        console.log('删除信息失败',err);
                        cd({code:-101,msg:'删除信息失败'})
                    }else {
                        console.log('信息修改成功');
                        cd(null);
                    }
                    client.close()
                })
            }
        })
    },
    /**
     *
     *
     * @param {*} cd 回调函数
     */
    Type(data,cd){
        console.log(data,"+++++++++++++++++")
        MongoClient.connect(url,function(err,client){
            if(err) {
                cd({code:-101,msg:'数据加载中'});
            }else {
                var db = client.db('zwpan');
                db.collection('type').find().toArray(function(err,data){
                    if(err) {
                        cd({code:-101,msg:'查询品牌信息失败'});
                    }else{
                        console.log(data)
                        cd(null,data);
                    }
                    client.close();
                })
            }
        })
    }
}
module.exports = shopingModel;