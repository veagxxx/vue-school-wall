<template>
  <div id="login">
    <transition name="slide-fade" mode="out-in">
      <el-card v-if="isShow">
        <el-form class="loginForm" :model="loginData" :rules="loginRule" ref="loginFormRef" label-width="80px" status-icon>
          <el-form-item label="Username:" prop="username">
            <el-input clearable prefix-icon="el-icon-user" v-model="loginData.username"></el-input>
          </el-form-item>
          <el-form-item label="Password:" prop="password">
            <el-input clearable prefix-icon="el-icon-lock" type="password" show-password v-model="loginData.password"></el-input>
          </el-form-item>
          <el-form-item label="Captcha:" prop="captcha">
            <el-input clearable class="captcha" v-model="loginData.captcha"></el-input>
            <el-tooltip effect="dark" content="点击更换" placement="top-start">
              <canvas @click="createCaptcha()" title="验证码" id="canvas" width="80px" height="40px"></canvas>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="login()">Sign in</el-button>
            <el-button type="primary" @click="register()">Register</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'Login',
    mounted() {
      this.isShow = true;
      // 定时器延迟，先进行动画效果，再生成验证码
      setTimeout(()=> {
        this.createCaptcha();
      }, 500);
    },
    data() {
      // 自定义验证码验证是否错误规则
      const validaCaptcha = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入验证码'));
        } else {
          callback();
        }

      };
      return {
        loginData: {
          username: 'admin',
          password: '123456',
          captcha: '',
        },
        loginRule: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 9, message: '请输入长度为3~9个字符的用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '请输入长度为6~12个字符的密码', trigger: 'blur' },
          ],
          captcha: [
            { required: true, validator: validaCaptcha, trigger: 'blur' },
          ]
        },
        code: '',
        isShow: false,
      }
    },
    methods: {
      // 生产验证码
      createCaptcha() {
        let canvas = document.querySelector('#canvas');
        let context = canvas.getContext('2d');
        const chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let code = '';
        let colors = ['#2c3e50', 'pink', 'blue', 'black'];
        let color =  colors[Math.floor(Math.random() * colors.length)];
        context.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
        for (let i = 0; i < 4; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)]; // 随机获取4验证码
          code += char; // 保存验证码
          context.font='20px sans-serif';
          context.fillStyle = `${color}`;
          context.textBaseline = 'middle';
          context.shadowOffsetX = 3;
          context.shadowOffsetY = 3;
          context.shadowBlur = 3;
          context.shadowColor='#2c3e50';
          let x = canvas.width / 5 * (i + 1);
          let y = canvas.height / 2;
          let deg = Math.floor(Math.random() * (-50) + 25); // 角度 -25~25 度之间
          // context.translate(x, y);
          // context.rotate(deg * Math.PI / 180);
          context.fillText(char, x, y);
          // context.fillText(char, 10, 10);
          // context.rotate(-deg * Math.PI / 180);
          // context.translate(-x, -y);

          // 画干扰线
          context.beginPath();
          context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          context.strokeStyle='#2c3e50';
          context.stroke();
          
        }
        this.code = code; // 保存验证码
      },
      // 登录
      login() {
        if (this.loginData.username === '' || this.loginData.password === '' || this.loginData.captcha === '') {
          return;
        } else if (this.loginData.captcha.toLowerCase() !== this.code.toLowerCase()) {
          this.$message({
            type: 'error',
            message: '验证码错误',
          });
        } else {
          this.$http.post('/login', this.loginData)
          .then(result => {
            // console.log(result);
            if (result.status === 'success') {
              this.$message({
                type: result.status,
                message: result.message,
              });
              // console.log(result.data);
              // sessionStorage存储对象需要使用JSON.stringify转为字符串
              window.sessionStorage.setItem('user', JSON.stringify(result.data));
              this.$router.push('/home');
            } else {
              this.$message({
                type: result.status,
                message: result.message,
              });
            }
          }).catch(error => {
            return;
          });
        }

        
      },
      // 注册
      register() {},
    }
  }
</script>

<style scoped>
  #login {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  #login .el-card {
    width: 100%;
    height: auto;
    display: flex;
  }
  .loginForm {
    margin-top: 20px;
    width: 500px;
    height: auto;
  }
  .loginForm .captcha {
    width: 80%;
  }
  .loginForm canvas {
    float: right;
    background-color: #1cffc6;
  }
  .slide-fade-enter-active {
    transition: all 1.5s;
  }
  .slide-fade-enter
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(50%);
    opacity: 0;
  }
</style>