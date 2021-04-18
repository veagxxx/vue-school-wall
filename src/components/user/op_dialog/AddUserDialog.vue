<template>
  <el-dialog title="添加用户" :visible="addDialog" @close="cancelAdd">
    <span slot="footer" class="add-user-dialog">
      <el-button size="small" @click="cancelAdd">取消</el-button>
      <el-button size="small" type="primary" @click="confirmAdd">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ['addDialog'],
    data() {
      return {
      }
    },
    beforeUpdate() {
    },
    methods: {
      cancelAdd() {
        this.$emit('cancelAdd');
      },
      confirmAdd() {
        this.$emit('confirmAdd');
      }
    }
  }
</script>

<style>

</style>