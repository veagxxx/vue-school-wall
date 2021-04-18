<template>
  <el-button size="small" type="primary" @click="export2Excel">导出Excel</el-button>
</template>

<script>
  export default {
    props: ['exportData'],
    data() {
      return {
        
      }
    },
    methods: {
      export2Excel() {
        import('../../../introduce/Export2Excel.js').then(excel => {
          const tHeader = ['id', 'publishUser', 'gender', 'commentsCount', 'starCount', 'isAnonymous', 'status', 'publishTime'];
          const filterVal = ['id', 'publishUser', 'gender', 'commentsCount', 'starCount', 'isAnonymous', 'status', 'publishTime'];
          const list = this.exportData;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel(tHeader, data, '导出表格');
        });
      },
      // 格式化数据
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      }
    }
  } 
</script>

<style scoped>
  .el-button {
    margin-left: 10px;
  }
</style>