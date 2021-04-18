<template>
  <el-container id="home">
    <el-aside :width="isCollapse ? '64px' : '180px'">
      <div class="collapse">
        <el-tooltip effect="dark" :content="!isCollapse ? '收起' : '展开'" placement="right">
          <span @click="isCollapse = !isCollapse">
            <i :class="!isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
          </span>
        </el-tooltip>
      </div>
      <el-menu 
      :default-active="$route.path"
      background-color="#24252e"
      text-color="#fff" 
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :unique-opened="true" @select="select">
        <el-menu-item index="/charts">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">数据图表</span>
        </el-menu-item>
        <el-menu-item index="/userManager">
          <i class="el-icon-user"></i>
          <span slot="title">用户信息</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-notebook-1"></i>
          <span slot="title">文章信息</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="sys-title">
          <i class="el-icon-office-building"></i>
          <span>校园墙</span>
        </div>
        <div class="sys-user-msg">
          <el-avatar :src="loginUser.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{loginUser.username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar style="height: 100%">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  data() {
    return {
      loginUser: {},
      isCollapse: false,
      activeItem: ''
    }
  },
  created() {
    // console.log(JSON.parse(window.sessionStorage.getItem('user')));
    // 由于sessionStorage中的对象被转为字符串，所以需要转为对象
    this.loginUser = JSON.parse(window.sessionStorage.getItem('user'));
  },
  methods: {
    select(key, path) {
      // console.log(key);
      this.activeItem = key;
    },
    logout() {
      window.sessionStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
}
</script>
<style>
  #home {
    height: 100%;
  }
  .el-header {
    background-color: #fff;
    color: #24252e;
    /* text-align: center; */
    display: flex;
    justify-content: space-between;
    line-height: 60px;
  }
  .el-header .sys-user-msg {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .el-header .el-dropdown {
    margin-left: 5px;
  }
  .el-header .el-dropdown span {
    font-size: 16px;
  }
  #home .collapse {
    padding: 10px;
    cursor: pointer;
    text-align: center;
  }
  .el-aside  {
    background-color: #24252e;
    color: #fff;
    text-align: left;
    border-right: none;
  }
  .el-menu {
    border-right: none;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 592px;
    padding: 5px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-scrollbar__bar.is-horizontal {
    width: 0;
  }
</style>
