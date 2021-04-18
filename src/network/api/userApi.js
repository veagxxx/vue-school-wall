const sqlMap = require('../sqlMap.js');
const express = require('express');
const mysql = require('../mysql.js');
const router = express.Router();

router.post('/login', function(request, response) {
  // console.log(request.body);
  let username = request.body.username;
  let password = request.body.password;
  mysql.query(sqlMap.users.login, [username, password], function(error, data) {
    if (error) {
      return response.json({
        status: 'error',
        message: '登录失败，请重试',
        data: error,
      });
    }
    // console.log(data);
    if (data.length === 0) {
      return response.json({
        status: 'error',
        message: '用户名或密码错误',
      });
    } else {
      response.json({
        status: 'success',
        message: '登录成功',
        data: data[0],
      });
    }
  });
});

module.exports = router;