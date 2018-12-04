//该模块用来 操作users 相关的后台数据库处理代码
//注册操作
//登录操作
//修改操作
//删除操作
//查询列表操作
const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';

const usersModel = {
    /**
    *     注册操作
    *     @param {Object} data 注册信息
    *    @param {Function} cb 回调函数
    */
    add(data, cb) {
        console.log('44444444444444444444444444444444444444')
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
                cb({ code: -100, msg: '连接数据库失败' });
                return;
            };
            const db = client.db('zwpan');
            // 1.对data里面的isAdmin修改为is_admin
            //2.写一个id为1
            //下一个注册要得到之前用户表的记录条数加1之后写给下一个注册的人
            //不允许用户名相同。
            let saveData = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin,
                Num:0,
            };
            console.log(saveData.Num)
            // var Num = 0;
            //async写法
            async.series([
                function (callback) {
                    //查询是已注册
                    db.collection('users').find({ usersname: saveData.username }).count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询是否已经注册失败' });
                        } else if (num !== 0) {
                            console.log('用户已经注册过了');
                            callback({ code: -102, msg: '用户已经注册了' });
                        } else {
                            console.log('当前用户可以注册');
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    //查询表的所有数据
                    db.collection('users').find().count(function (err, num) {
                        saveData.Num = num-1;
                        console.log(saveData.Num)
                        if (err) {
                            callback({ code: -101, msg: '查询表数据失败' });
                        } else {
                            callback(null);
                        }
                    })
                },
                function(callback){
                    db.collection('users').find().skip(saveData.Num).toArray(function(err,data){
                        if(err){
                            console.log('查询最后一条数据失败',err);
                            callback({ code: -101, msg:'查询最后一条数据失败'});
                        }else{
                            saveData._id = data[0]._id + 1;
                            console.log(saveData._id)
                            callback(null);
                        }
                    })
                },
                function (callback) {
                    //写入数据库
                    console.log(saveData)
                    db.collection('users').insertOne(saveData, function (err) {
                        if (err) {
                            console.log(err);
                            callback({ code: -101, msg:'写入数据失败'});
                        } else {
                            callback(null);
                        }
                    });
                }
            ], function (err, results) {
                if (err) {
                    console.log('上面的操作,可能出错了');
                    cb(err);
                } else {
                    cb(null);
                }
                client.close();
            });
        });
    },
    /**
 * 登录方法
 * @param {Object} data 登录信息 {username: '', password: ''}
 * @param {Function} cb 回调函数
 */
    login(data, cd) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -100, msg: '数据库连接失败' });
            } else {
                const db = client.db('zwpan');
                db.collection('users').find({
                    username: data.username,
                    password: data.password
                }).toArray(function (err, data) {
                    if (err) {
                        console.log('查询数据库失败', err);
                        cd({ code: -101, msg: '查询数据库失败' });
                    } else if (data.length <= 0) {
                        console.log('用户不能登录');
                        cd({ code: -102, msg: '用户名密码错误' });
                    } else {
                        console.log('用户登录成功');
                        cd(null, {
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isAdmin: data[0].is_admin
                        });
                    }
                    client.close();
                });
            }
        });
    },

    /**
     *获取用户列表
     *
     * @param {Object} data 页面信息与每页显示条数信息
     * @param {*} cd 回调函数
     */
    getUserList(data, cd) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cd({ code: -100, msg: '连接数据库失败' });
            } else {
                var db = client.db('zwpan');
                var skipnum = data.page * data.pageSize - data.pageSize;
                var pageSize = parseInt(data.pageSize);
                async.parallel([
                    function (callback) {
                        //查询所有的记录
                        db.collection('users').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库记录失败' });
                            } else {
                                callback(null, num);
                            }
                        });
                    },
                    function (callback) {
                        //查询显示分页的数据
                        db.collection('users').find().limit(pageSize).skip(skipnum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -100, msg: '查询数据库失败' });
                            } else {
                                callback(null, data)
                            }
                        });
                    }
                ], function (err, results) {
                    if (err) {
                        console.log('以上的操作可能出错了');
                    } else {
                        cd(null, {
                            userList: results[1], //用户的信息数据
                            totalPage: Math.ceil(results[0] / data.pageSize),
                            page: data.page,
                            COUNT: results[0]
                        });
                    }
                    client.close();
                });
            }
        })
    },
    /**
     *获取搜索信息
     *
     * @param {Object} nickname 页面搜索的信息
     * @param {*} cd    回调函数
     */
    getSearch(nickname, cd) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log("连接数据库失败", err);
                cd({ code: -100, msg: '链接数据库失败' });
            } else {
                const db = client.db('zwpan');
                var skipnum = nickname.page * nickname.pageSize - nickname.pageSize;
                var pageSize = parseInt(nickname.pageSize);
                async.parallel([
                    function (callback) {
                        db.collection('users').find({ nickname: nickname.nickname }).limit(pageSize).skip(skipnum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -100, msg: '查询数据库失败' });
                            } else {
                                callback(null, data)
                            }
                        });
                    },
                    function (callback) {
                        db.collection('users').find({ nickname: nickname.nickname }).count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '数据查询失败' });
                            } else {
                                callback(null, num);
                            }
                        });
                    }
                ], function (err, results) {
                    if (err) {
                        console.log('以上步骤可能出错', err);
                    } else {
                        cd(null, {
                            results: results[0],
                            totalPage: Math.ceil(results[1] / nickname.pageSize),
                            page: nickname.page,
                            pageSize: nickname.pageSize,
                            COUNT: results[1]
                        });
                    }
                });
                client.close();
            }
        });
    },
    /**
     * 删除用户信息操作
     *
     * @param {Object} id 需要删除的用户的id
     * @param {*} cd 回调函数
     */
    deleteUser(id,cd){
        MongoClient.connect(url,function(err,client){
            if(err) {
                console.log('数据库连接失败',err);
                cd({code:-100,msg:'数据库连接失败'});
            }else {
                const db = client.db('zwpan');
                db.collection('users').deleteOne({ "_id": id },function(err) {
                    if (err) {
                        console.log('删除数据失败', err);
                    } else {
                        cd(null);
                    }
                });
            }
        })
    },
    /**
     *修改用户信息
     *
     * @param {*} data 需要修改的信息
     * @param {*} cd 回调函数
     */
    updataUser(data,cd){
        var id = parseInt(data.id);
        var sex = parseInt(data.sex);
        data.sex = sex ? "男" : "女";
        MongoClient.connect(url,function(err,client){
            if(err){
                console.log('数据库连接失败');
                cd({ code: -100, msg:'数据库连接失败'});
            }else {
                const db = client.db('zwpan');
                db.collection('users').updateOne({ "_id": id }, { $set: { nickname: data.nickname, phone: data.phone,age:data.age,sex: data.sex, "is_admin": data.isAdmin } },function(err){
                    if(err) {
                        console.log('信息修改失败',err);
                        cd({ code: -101, msg:"信息修改失败"});
                    }else {
                        console.log('信息修改成功');
                        cd(null);
                    }
                });
                client.close();
            }
        })
    }
}
module.exports = usersModel;