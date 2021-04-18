<template>
  <el-dialog title="文章详情" :visible="detailMsg.detailDialog" @close="closeDetail">

    <span slot="footer" class="edit-dialog-footer">
      <el-button @click="closeDetail" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="saveDetail">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ['detailMsg'],
    data() {
      return {
        detailMessage: {},
      }
    },
    beforeUpdate() {
      this.detailMessage = this.detailMsg;
      // console.log(this.detailMessage);
    },
    methods: {
      closeDetail() {
        this.$emit('closeDetail');
      },
      saveDetail() {
        this.$emit('saveDetail', {data: 123});
      }
    }
  }
</script>

<style scoped>

</style>