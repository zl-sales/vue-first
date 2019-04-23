<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData" border style="width: 100%" :stripe="true">
      <el-table-column prop="id" label="序号" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <el-switch v-model="val" active-color="#13ce66" inactive-color="#cccccc"></el-switch>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="danger" icon="el-icon-delete"></el-button>
        <el-button type="warning" icon="el-icon-setting"></el-button>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.tatol"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getusersinfo()
  },
  methods: {
    async getusersinfo() {
      var { data: list } = await this.$http.get('/users', {
        params: this.page
      })
      console.log(list)
      this.tableData = list.data.users
      this.page.tatol = list.data.total
    }
  },
  data() {
    return {
      tableData: [],
      page: {
        pagenum: 1,
        pagesize: 2
      },
      val:true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
