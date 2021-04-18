<template>
  <span class="export">
    <el-button size="small" @click="exportExcel">导出用户</el-button>
  </span>
</template>

<script>
 // 加载导出Excel的 js 资源
  import {export_json_to_excel} from '../../../introduce/Export2Excel.js';
  export default {
    props: ['exportData'],
    data() {
      return {
        select: '导出'
      }
    },
    methods: {
      // 导出 Excel 函数
      exportExcel() {
        // require.ensure 方式加载 js 资源并处理逻辑
        // require.ensure([], () => {
        //   const { export_json_to_excel } = require('../../../introduce/Export2Excel.js');
        //   const tHeader = ['id','avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'];
        //   const filterVal = ['id', 'avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'];
        //   const list = this.exportData;
        //   const data = this.formatJson(filterVal, list);
        //   export_json_to_excel(tHeader, data, '导出用户');
        //   // console.log(filterVal, list);
        // });

        // 使用 import 加载 js 资源并处理逻辑
        const tHeader = ['id','avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'];
        const filterVal = ['id','avatar', 'username', 'gender', 'publishCount', 'registTime', 'isBlackList'];
        const list = this.exportData;  // 父组件传的值
        const data = this.formatJson(filterVal, list);
        /**
         * 三个参数
         * @param th 表头字段
         * @param jsonData json 数据
         * @param defaultTitle 文件名称
         */
        export_json_to_excel(tHeader, data, '导出用户');
      },
      // 格式化 json 数据
      formatJson(filterVal, jsonData) {
        // v[j] 是一个个 jsonData 每个属性的值，返回每个 v 为一个对象, 包含每个键值对
        return jsonData.map(v => filterVal.map(j => v[j]));
  
        // 与上面简写效果相同
        // let value = jsonData.map(value => {
        //   return filterVal.map(index => {
        //     return value[index];
        //   });
        // });
        // return value;
      },
    }
  }
</script>

<style scoped>
  .el-button {
    margin-left: 10px;
  }
</style>