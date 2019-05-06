<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card class="box-card">
      <!-- 表格、 -->
      <el-table :data="tableData" border style="width: 100%" :stripe="true">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="authName" label="权限"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="等级" width="200">
            <template slot-scope="info">
                <el-tag v-if="info.row.level==0">等级一</el-tag>
                <el-tag v-else-if="info.row.level==1" type="success">等级二</el-tag>
                <el-tag v-else type="warning">等级三</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getrightslist()
  },
  methods: {
    async getrightslist() {
      const { data: dt } = await this.$http.get('rights/list')
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tableData = dt.data
    }
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
