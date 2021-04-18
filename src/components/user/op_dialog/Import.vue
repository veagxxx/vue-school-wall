<template>
  <el-dialog :visible="importUserDialog" title="批量导入用户" @close="cancelImport">
    <!--limit:最大上传数，on-exceed：超过最大上传数量时的操作  -->
    <el-upload
      class="upload-user"
      action=""
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :limit="3"
      accept=".xlsx, .xls"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="success" icon="el-icon-upload">选择文件</el-button>
      <el-button size="small" type="primary" @click="exportTemplate" icon="el-icon-download">下载模板
      </el-button>
      <div slot="tip" class="el-upload__tip">只能上传.xls/.xlsx文件，您可以先下载模板</div>
    </el-upload>
    <span slot="footer">
      <el-button size="small" @click="cancelImport">取 消</el-button>
      <el-button size="small" type="primary" @click="confirmImport">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // 加载导出Excel的 js 资源
  import {export_json_to_excel, ex, export_json_to_multiSheet} from '../../../introduce/Export2Excel.js';
  export default {
    props: ['importUserDialog'],
    data() {
      return {
        fileTemp: null, // 指向最新上传的附件
        fileList: [],
        fileListLength: 0,
      }
    },
    methods: {
      //上传文件时处理方法  
      handleChange(file, fileList){
        this.fileListLength = fileList.length;
        this.fileTemp = file.raw;
        let extention = file.name.substring(file.name.lastIndexOf('.') + 1);
        if(this.fileTemp){
          if((extention === 'xlsx') 
            || (extention === 'xls')){
            this.importfxx(this.fileTemp);
          } else {
            this.$message({
              type:'warning',
              message:'附件格式错误，请删除后重新上传！'
            })
          }
        } else {
          this.$message({
            type:'warning',
            message:'请上传附件！'
          })
        }
      },
      //超出最大上传文件数量时的处理方法
      handleExceed(){
        this.$message({
          type:'warning',
          message:'超出最大上传文件数量的限制！'
        })
        return;
      },
      //移除文件的操作方法
      handleRemove(file,fileList){
        this.fileTemp = null
      },
      // 读取 Excel 文件并解析
      importfxx(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        let rABS = false; //是否将文件读取为二进制字符串
        let f = this.file;
        let reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
          let binary = "";
          let rABS = false; //是否将文件读取为二进制字符串
          let pt = this;
          let wb; //读取完成的数据
          let outdata;
          let reader = new FileReader();
          reader.onload = function(e) {
            let bytes = new Uint8Array(reader.result);
            let length = bytes.byteLength;
            for (let i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            //此处引入，用于解析excel
            let XLSX = require("xlsx");
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), {
                //手动转化
                type: "base64"
              });
            } else {
                wb = XLSX.read(binary, {
                type: "binary"
              });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
            //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
            //此处可对数据进行处理
            // console.log(outdata);
            let arr = [];
            outdata.map(v => {
              let obj = {};
              obj.id = v['id'];
              obj.avatar = v['avatar'];
              obj.username = v['username'];
              obj.gender = v['gender'];
              obj.publishCount = v['publishCount'];
              obj.registTime = v['registTime'];
              obj.isBlackList = v['isBlackList'];
              arr.push(obj);
            });
            _this.da=arr;
            _this.dalen=arr;
            // _this.$emit('confirmImport', arr);
            // 获取导入数据
            _this.fileList = arr;
            return arr;
          };
          reader.readAsArrayBuffer(f);
        };
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      },
      // 取消导入
      cancelImport() {
        this.$emit('cancelImport');
      },
      // 确认导入
      confirmImport() {
        // console.log(this.fileListLength);
        if (this.fileListLength === 0) {
          return this.$message({
            type: 'error',
            message: '未选择上传的文件'
          });
        }
        this.$emit('confirmImport', this.fileList);
      },
       // 导出模板（多 Sheet 表）
      exportTemplate() {
        // 使用 import 加载 js 资源并处理逻辑
        // const tHeader = ['id','avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'];
        // const data = this.formatJson([], []);
        // export_json_to_excel(tHeader, data, '用户模板');
        
        let templateData = [
          {
            tHeader: ['id','avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'],
            filterVal: [],
            data: [],
            sheetName: '导出模板'
          },
          {
            tHeader: ['用户ID','头像', '用户名', '性别', '发布数量', '注册时间', '是否黑名单'],
            filterVal: ['id', 'avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'],
            data: [
              {
                id:'id是用户id, 可不填，自动生成。', 
                avatar: 'avater为用户头像url。', 
                username: 'username为必填用户名。', 
                gender: 'gender为必填用户性别（1为男0为女）。', 
                publishCount: 'publishCount为发布数量。', 
                registTime: 'registerTime为注册时间。', 
                isBlackList: 'isBlackList为是否黑名单（1为是0为否）'
              }
             ],
            sheetName: '导入说明'
          }
        ]
        this.json2excel(templateData, '用户模板', true, 'xlsx');
      },
      // tableJson 导出数据 ; filenames导出表的名字; autowidth表格宽度自动 true or false; bookTypes xlsx & csv & txt
      json2excel (tableJson, filenames, autoWidth, bookTypes) {
        var that = this
        //这个是引用插件
        import("../../../introduce/Export2Excel.js").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].data))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_multiSheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autoWidth,
            bookType: bookTypes
          });
        });
      },
      // 格式化 json 数据
      formatJson(filterVal, jsonData) {
        // v[j] 是一个个 jsonData 每个属性的值，返回每个 v 为一个对象, 包含每个键值对
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
    }
  }
</script>

<style scoped>
  .el-button {
    margin-left: 10px;
  }
</style>