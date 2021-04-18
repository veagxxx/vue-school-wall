<template>
  <div id="user">
    <el-card class="data-chart">
      <el-page-header content="用户信息"></el-page-header>
      <el-divider></el-divider>
      <div class="charts">
        <div id="bingtu" :style="{width: '300px', height: '200px'}"></div>
        <div id="total" :style="{width: '300px', height: '200px'}"></div>
      </div>
    </el-card>
    <el-card class="userlist">
      <el-row :gutter="20">
        <el-col :span="8" class="search">
          <el-input v-model="keywords" size="small" placeholder="根据用户名搜索" clearable 
          @change="renderByKeywords(keywords)"></el-input>
          <el-select v-model="selectVal" size="small" clearable>
            <el-option v-for="item in selectableList" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col class="addbtn" :span="16">
          <el-button size="small" type="danger" @click="deleteAll">批量删除</el-button>
          <el-button size="small" type="primary" @click="addUser">添加用户</el-button>
          <el-button size="small" @click="fileImport">批量导入</el-button>
          <import :importUserDialog="importUserDialog" @confirmImport="confirmImport" @cancelImport="cancelImport"></import>
          <export :exportData="userListByKeywords"></export>
        </el-col>
      </el-row>
      <el-table 
      border :data="userListByKeywords" 
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" 
      @selection-change="selectItem">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="编号" prop="id" align="center"></el-table-column>
        <el-table-column label="用户头像" prop="avatar" align="center">
          <template slot-scope="scope">
            <el-avatar size="small" shape="square" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" align="center"></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.gender === 1 ? '' : 'danger'">
              {{scope.row.gender === 1 ? '男' : '女'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="registTime" align="center"></el-table-column>
        <el-table-column label="黑名单" prop="isBlackList" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isBlackList === 1 ? 'danger' : 'success'">
              {{scope.row.isBlackList === 1 ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
            <el-button size="mini" type="primary" @click="editUser(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userList.length">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <add-user-dialog :addDialog="addDialog" @cancelAdd="cancelAdd"></add-user-dialog>
      <!-- 编辑对话框 -->
      <edit-user-dialog :editItem="{editItem, editDialog}" @cancelEdit="cancelEdit" @confirmEdit="confirmEdit"></edit-user-dialog>
    </el-card>
  </div>
</template>

<script>
  import Import from './op_dialog/Import';
  import Export from './op_dialog/Export';
  import AddUserDialog from './op_dialog/AddUserDialog.vue';
  import EditUserDialog from './op_dialog/EditUserDialog.vue';
  export default {
    components: { AddUserDialog, EditUserDialog, Import, Export },
    data() {
      return {
        userList: [
          {id: 1, avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=105579250,4142900491&fm=26&gp=0.jpg', username: 'admin', gender: 1, registTime: '2020-09-15', isBlackList: 0},
          {id: 2, avatar: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2753423207,3422019655&fm=26&gp=0.jpg', username: 'Jackson', gender: 1, registTime: '2020-09-15', isBlackList: 0},
          {id: 3, avatar: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1376213484,750011907&fm=26&gp=0.jpg', username: 'Susan', gender: 0, registTime: '2020-09-15', isBlackList: 0},
          {id: 4, avatar: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1376213484,750011907&fm=26&gp=0.jpg', username: 'Jane', gender: 0, registTime: '2020-09-15', isBlackList: 1},
          {id: 5, avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3013352776,2726863757&fm=26&gp=0.jpg', username: 'Mike', gender: 1, registTime: '2020-09-15', isBlackList: 0},
        ],
        wantDelete: true,
        selectItems: [], // 选择列表项数量 
        loading: false,
        userListByKeywords: [],
        keywords: '',
        addDialog: false,
        editDialog: false,
        editItem: {},
        importUserDialog: false,
        selectVal: '用户名', // 默认选择用户名进行搜索 
        selectableList: ['用户名', '性别'] // 可选择搜索关键词
      }
    },
    mounted() {
      this.drawChart();
      this.drawTotal();
      this.renderByKeywords(this.keywords);
    },
    methods: {
      // 画男女比例图
      drawChart() {
        const myChart = this.$echarts.init(document.querySelector('#bingtu'));
        myChart.setOption({
          title: {
            text: '性别占比',
            textStyle: {
              color: '#2e3c50',
            }
          },
          tooltip: {
            trigger: 'item', // 提示
          },
          legend: {
            orient: 'horizontal', // echart 信息项方向
            x: 'center', // 往中间放
            y: 'bottom'
          },
          series : [
            {
              name: '数量',
              type: 'pie',    // 设置图表类型为饼图
              radius: ['50%', '70%'],  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
              center: ['50%', '50%'],
              data:[          // 数据数组，name 为数据项名称，value 为数据项值
              // 通过 filter 过滤出不同性别的用户，通过 .length 获取其数量
                {value: this.userList.filter(item => {
                  if (item.gender === 0) {
                    return item;
                  }
                }).length, name:'女'},
                {value: this.userList.filter(item => {
                  if (item.gender === 1) {
                    return item;
                  }
                }).length, name:'男'},
                {value: this.userList.filter(item => {
                  if (item.gender !== 1 && item.gender !== 0) {
                    return item;
                  }
                }).length, name:'不明'},
              ],
              animationDuration: 1500,
            }
          ]
        });
      },
      drawTotal() {
        const totalChart = this.$echarts.init(document.querySelector('#total'));
        totalChart.setOption({
          title: {
                text: '系统总人数'
            },
            tooltip: {},
            legend: {
                data:['总人数']
            },
            xAxis: {
                data: ["第一季度","第二季度","第三季度","第四季度"]
            },
            yAxis: {},
            series: [{
                name: '总人数',
                type: 'bar',
                data: [25, 120, 200, 310]
            }]
        });
      },
      // 列表项选择
      selectItem(value) {
        // value为数组
        // console.log(value);
        this.selectItems = value;
      },
      // 删除选中
      deleteAll() {
        if (this.selectItems.length === 0) {
          return this.$message({
            message: '未选择删除数据',
            showClose: true,
            type: 'info'
          });
        }
        this.$messageBox({
          message: '你确定删除全部吗？',
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 500);
            } else {
              done();
            }
          }
        }).then(action => {
          this.selectItems.forEach((value, index) => {
            // console.log(value, index);
            this.userListByKeywords.forEach((item, i) => {
              if (item.username === value.username) {
                this.userListByKeywords.splice(i, 1);
              }
            });
          });
          this.$message({
            message: '删除成功',
            type: 'success',
          });
        }).catch(action => {
          return;
        });
      },
      // 根据搜索关键词加载表格
      renderByKeywords(keywords) {
        this.loading = true;
        setTimeout(() => {
          this.userListByKeywords = this.userList.filter((item) => {
            if (item.username.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
              return true;
            }
          });
          this.loading = false;
        }, 500);
      },
      // 单条删除
      deleteItem(id) {
        // console.log(id);
        this.$messageBox({
          message: '确定删除该条目吗？',
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 500);
            } else {
              done();
            }
          }
        }).then((action) => {
          this.userListByKeywords.forEach((value, index) => {
            if (value.id === id) {
              this.userListByKeywords.splice(index, 1);
            }
          });
          this.$message({
            type: 'success',
            message: '删除成功',
          });
        }).catch((action) => {
          return;
        });
      },
      // 点击添加
      addUser() {
        this.addDialog = true;
      },
      // 取消添加
      cancelAdd() {
        this.addDialog = false;
      },
      // 确定添加
      confirmAdd() {
        this.addDialog = false;
      },
      // 编辑用户
      editUser(item) {
        this.editDialog = true;
        this.editItem = item;
      },
      // 取消编辑
      cancelEdit() {
        this.editDialog = false;
      },
      // 确定编辑
      confirmEdit() {
        this.editDialog = false;
      },
      // 监听 pageSize 改变的事件
      handleSizeChange(value) {
        console.log(`每页 ${value} 条`);
        // this.queryInfo.pageSize = value;
      },
      // 监听页码值改变的事件
      handleCurrentChange(value) {
        console.log(`当前页: ${value}`);
        // this.queryInfo.pageNum = value;
      },
      fileImport() {
        this.importUserDialog = true;
      },
      cancelImport() {
        this.importUserDialog = false;
      },
      confirmImport(data) {
        this.importUserDialog = false;
        console.log(data);
        data.forEach(item => {
          this.userListByKeywords.push(item);
        });
      }
    }
  }
</script>

<style scoped>
  .data-chart {
    /* display: flex; */
    margin-bottom: 15px;
  }
  .charts {
    display: flex;
    justify-content: space-between;
  }
  .search {
    display: flex;
  }
  .search .el-select {
    float: left;
    margin-left: 5px;
    width: 130px;
  }
  .userlist .row{
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }
  .addbtn {
    display: flex;
    justify-content: flex-end;
  }
  .addbtn .el-button {
    margin-left: 10px;
  }
  .el-table {
    margin-top: 15px;
  }
</style>