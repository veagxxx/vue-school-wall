<template>
  <el-dialog title="编辑用户" :visible="editItem.editDialog" @close="cancelEdit">
    <span slot="footer" class="edit-dialog-footer">
      <el-button @click="cancelEdit" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="confirmEdit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ['editItem'],
    data() {
      return {
        editUser: {}
      }
    },
    beforeUpdate() {
      // console.log(this.editItem);
      this.editUser = this.editItem.editItem;
    },
    methods: {
      cancelEdit() {
        this.$emit('cancelEdit');
      },
      confirmEdit() {
        this.$emit('confirmEdit');
      }
    }
  }
</script>

<style scoped>

</style>