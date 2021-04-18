const sqlMap = {
  users: {
    login: 'SELECT uid, username, password, phone_no, gender, avatar FROM users WHERE username = ? AND password = ?',
  }
}

module.exports = sqlMap;