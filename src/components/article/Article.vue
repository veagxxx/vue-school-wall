<template>
  <div id="confession">
    <el-row class="dataShow" :gutter="20">
      <el-col :lg="8" :sm="8">
        <el-card>
          <span>文章总数</span>
          <el-divider></el-divider>
          <div id="articleTotal">
            <h1>{{articleList.length}}</h1>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :sm="8">
        <el-card>
          <span>文章信息性别比例</span>
          <el-divider></el-divider>
          <div id="sexratio"></div>
        </el-card>
      </el-col>
      <el-col :lg="8" :sm="8">
        <el-card>
          <span>文章信息实名比例</span>
          <el-divider></el-divider>
          <div id="anonmousratio"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="articleList">
      <el-page-header content="文章信息"></el-page-header>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input type="search" size="small" placeholder="搜索相关信息" v-model="keywords" 
          prefix-icon="el-icon-search" @change="renderBySearch(keywords)"> 
          </el-input>
        </el-col>
        <el-col class="btnGroup" :span="16">
          <el-button size="small" type="danger" @click="deleteSelected">删除选中</el-button>
          <el-button size="small" type="primary">添加文章</el-button>
          <el-button size="small" type="success" @click="importMany">批量导入</el-button>
          <!-- 导入数据子组件 -->
          <import-dialog 
          :importDialog="importDialog"
          @cancelImport="cancelImport"
          @comfirmImport="comfirmImport">
          </import-dialog>
          <!-- 导出数据子组件 -->
          <export-table :exportData="articleListBySearch"></export-table>
        </el-col>
      </el-row>
      <!-- 文章列表 -->
      <el-table v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" 
      border :data="articleListBySearch" 
      style="width: 100%" 
      @selection-change="selectListItem">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="编号" prop="id" align="center" width="50"></el-table-column>
        <el-table-column label="发布用户" prop="publishUser" align="center"></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.gender === 1 ? '' : 'danger'">
              {{scope.row.gender === 1 ? '男' : '女'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评论数量" prop="commentsCount" align="center"></el-table-column>
        <el-table-column label="点赞数量" prop="starCount" align="center"></el-table-column>
        <el-table-column label="是否匿名" prop="isAnonymous" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isAnonymous === 1 ? 'success' : ''">
              {{scope.row.isAnonymous === 1 ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="显示状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{scope.row.status === 1 ? '正常' : '禁止'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="publishTime" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :type="scope.row.status === 1 ? 'danger' : 'success'" @click="forbidOrDisplay(scope.row)">
              {{scope.row.status === 1 ? '禁止' : '显示'}}
            </el-button>  
            <el-button size="mini" type="primary" @click="goToDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->

      <!-- 详情对话框 -->
      <detail-dialog :detailMsg="{detailDialog, detailArticle}" @closeDetail="closeDetail" @saveDetail="saveDetail"></detail-dialog>
    </el-card>
  </div>
</template>

<script>
  import ImportDialog from './dialog/ImportDialog.vue';
  import ExportTable from './dialog/ExportTable.vue';
  import DetailDialog from './dialog/DetailDialog.vue';
  export default {
    components: {DetailDialog, ImportDialog, ExportTable},
    data() {
      return {
        keywords: '',  // 关键词
        articleList: [
          {
            id: 1, publishUser: 'admin', gender: 1, commentsCount: 20, starCount: 50, isAnonymous: 1, status: 1, publishTime: '2020-09-28'
          }, {
            id: 2, publishUser: 'Jackson', gender: 1, commentsCount: 18, starCount: 39, isAnonymous: 0, status: 1, publishTime: '2020-09-25'
          }, {
            id: 3, publishUser: 'Sarah', gender: 0, commentsCount: 22, starCount: 41, isAnonymous: 1, status: 1, publishTime: '2020-09-23'
          }, {
            id: 4, publishUser: 'Catherine', gender: 0, commentsCount: 30, starCount: 50, isAnonymous: 0, status: 0, publishTime: '2020-09-24'
          }, {
            id: 5, publishUser: 'Alice', gender: 0, commentsCount: 50, starCount: 150, isAnonymous: 1, status: 1, publishTime: '2020-09-29'
          }
        ],
        selectedItems: [],
        detailDialog: false, // 详情对话框标志
        detailArticle: '',  // 详情文章
        articleListBySearch: [], // 根据搜索框关键词获取文章列表
        loading: false,
        importDialog: false,
      }
    },
    mounted() {
      // 加载图表
      this.drawSexRatioChart();
      this.drawAnonmousRatioChart();
      this.renderBySearch(this.keywords);
    },
    methods: {
      // 性别比例图
      drawSexRatioChart() {
        const sex_ratio_chart = this.$echarts.init(document.querySelector('#sexratio'));
        sex_ratio_chart.setOption({
          graphic: {  // 饼图中间显示文字
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: '男女比例',
              x: 100,
              y: 100,
              fill: '#000',
              textAlign: 'center',
              font: 'bolder 16px Microsoft YaHei'
            }
          },
          color: ['rgb(203,155,255)','rgb(58,186,255)', 'rgb(149,162,255)'], // echart 颜色(data数据有3个)
          tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c}({d}%)"   
            formatter: "{a} <br/>{b} : {d}%"   
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom'
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: ['50%', '70%'],  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
              center: ['50%', '50%'],
              // label:{            //饼图图形上的文本标签
              //   normal:{
              //     show:true,
              //     position:'center', //标签的位置
              //     textStyle : {
              //       fontWeight : 300 ,
              //       fontSize : 16    //文字的字体大小
              //     },
              //     formatter: '{d}%'
              //   }
              // },
              data: [
                // 数据数组，name 为数据项名称，value 为数据项值
                // 通过 filter 过滤出不同性别的用户，通过 .length 获取其数量
                {
                  value: this.articleList.filter(item => item.gender === 0).length, name: '女'
                }, {
                  value: this.articleList.filter(item => item.gender === 1).length, name: '男'
                }, {
                  value: this.articleList.filter(item => item.gender !== 1 && item.gender !== 0).length, name: '不明'
                }
              ],
              animationDuration: 1500,
            }
          ]
        });
      },
      // 画出实名比例图
      drawAnonmousRatioChart() {
        const anonmous_Ratio_Chart = this.$echarts.init(document.querySelector('#anonmousratio'));
        anonmous_Ratio_Chart.setOption({
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: '实名比例',
              x: 100,
              y: 100,
              fill: '#000',
              textAlign: 'center',
              font: 'bolder 16px Microsoft YaHei'
            }
          },
          color: ['#32CD32', '#778899'],
          tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c}({d}%)"   
            formatter: "{a} <br/>{b} : {d}%"   
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom'
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: ['50%', '70%'],  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
              center: ['50%', '50%'],
              data: [
                // 数据数组，name 为数据项名称，value 为数据项值
                // 通过 filter 过滤出不同性别的用户，通过 .length 获取其数量
                {
                  value: this.articleList.filter(item => item.isAnonymous === 0).length, name: '实名'
                }, {
                  value: this.articleList.filter(item => item.isAnonymous === 1).length, name: '匿名'
                }
              ],
              animationDuration: 1500,
            }
          ]
        });
      },
      // 根据搜索框渲染列表
      renderBySearch(keywords) {
        this.loading = true;
        setTimeout(() => {
          this.articleListBySearch = this.articleList.filter((item) => {
            if (item.publishUser.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
              return true;
            } 
          });
          this.loading = false;
        }, 1000 * Math.random());
      },
      // 获取选中列表项
      selectListItem(value) {
        // console.log(value);
        this.selectedItems = value;
      },
      // 删除选中
      deleteSelected() {
        if (this.selectedItems.length === 0) {
          return this.$message({
            type: 'error',
            message: '未选择删除条目'
          });
        }
        this.$messageBox({
          message: '你确定删除所选条目吗?',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                },300);
              }, 500);
            } else {
              done();
            }
          }
        }).then((action) => {
          this.selectedItems.forEach((value, index) => {
            this.articleListBySearch.forEach((item, i) => {
              if (item.publishUser === value.publishUser) {
                this.articleListBySearch.splice(i, 1);
              }
            });
          });
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }).catch((action) => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
          });
        });
      },
      // 显示状态操作
      forbidOrDisplay(item) {
        if (item.status === 1) {
          this.$messageBox({
            message: '你确定禁止显示该文章吗?',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
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
            item.status = 0;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }).catch((action) => {
            return;
          });
        } else {
          this.$messageBox({
            message: '你确定显示该文章吗?',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
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
            item.status = 1;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }).catch((action) => {
            return;
          });
        }
      },
      // 点击详情
      goToDetail(item) {
        // console.log(item);
        this.detailDialog = true;
        this.detailArticle = item;
      },
      // 关闭详情页
      closeDetail() {
        this.detailDialog = false;
      },
      // 确定详情页
      saveDetail(param) {
        this.detailDialog = false;
        console.log(param);
      },
      // 批量导入
      importMany() {
        this.importDialog = true;
      },
      // 取消导入
      cancelImport() {
        this.importDialog = false;
      },
      // 确定导入
      comfirmImport(data) {
        // console.log(data);
        data.forEach(item => {
          this.articleListBySearch.push(item);
        });
        this.importDialog = false;
      }
    },
    computed: {
      
    }
  }
</script>

<style scoped>
  .dataShow {
    display: flex;
    justify-content: center;
  }
  .dataShow .el-card:hover {
    box-shadow: 0 0 5px 0px gray;
  }
  #sexratio {
    width: 100%;
    height: 150px;
  }
  #articleTotal {
    width: 100%;
    height: 150px;
    text-align: center;
    display: flex;
  }
  #articleTotal h1 {
    margin: auto;
    font-size: 50px;
    color: brown;
  }
  #anonmousratio {
    width: 100%;
    height: 150px;
  }
  .articleList {
    margin-top: 15px;
  }
  .btnGroup {
    display: flex;
    justify-content: flex-end;
  }
  .el-table {
    margin-top: 10px;
  }
</style>