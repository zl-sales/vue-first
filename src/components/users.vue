<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片组件 -->
    <el-card class="box-card">
      <!--搜索框 和 添加按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 此文本框可以输入搜索信息后通过按下回车键来查询 -->
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="page.query"
            clearable
            @clear="getusersinfo()"
            @keyup.enter.native="getusersinfo()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getusersinfo()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 添加用户弹出层 -->
      <el-dialog title="添加用户" :visible.sync="addFormVisible" @close="addclose">
        <el-form :model="addform" :rules="addFormrules" ref="addfromref">
          <el-form-item label="用户名" :label-width="addformLabelWidth" prop="username">
            <el-input v-model="addform.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="addformLabelWidth" prop="password">
            <el-input v-model="addform.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="addformLabelWidth" prop="mobile">
            <el-input v-model="addform.mobile" autocomplete="off" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="addformLabelWidth" prop="email">
            <el-input v-model="addform.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑用户信息的弹出框 -->
      <el-dialog title="修改用户" :visible.sync="editFormVisible">
        <el-form :model="editform" ref="edifromref" :rules="editfromrules">
          <el-form-item label="用户名" :label-width="editformLabelWidth" prop="username">
            <el-input placeholder="请输入内容" v-model="editform.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="editformLabelWidth" prop="editform.email">
            <el-input placeholder="请输入内容" v-model="editform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="editformLabelWidth" prop="editform.mobile">
            <el-input placeholder="请输入内容" v-model="editform.mobile" :maxlength="11"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" :stripe="true">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="130"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch
            v-model="bool.row.mg_state"
            slot-scope="bool"
            active-color="#13ce66"
            inactive-color="#cccccc"
          ></el-switch>

          <!-- 此处使用<slot-scoped方式获取当值 -->
          <!-- <el-switch v-model="bool.mg_state"  slot-scope="bool"></el-switch> -->
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="250">
          <!-- 三个按钮 -->
          <template slot-scope="bol">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(bol.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="dele(bol.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-size="page.pagesize"
        :page-sizes="[2, 4, 6, 8]"
        layout="total,  sizes, prev, pager, next, jumper"
        :total="page.tatol"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getusersinfo()
  },
  methods: {
    // 打开修改用户弹窗，并且发送axios请求获取数据，渲染弹窗、
    async edit(id) {
      var { data } = await this.$http.get('/users/' + id)
      this.editform = data.data
      console.log(this.editform)
      this.editFormVisible = true
    },
    // 通过id删除该条数据
    dele(ids) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          var { data } = await this.$http.delete('/users/' + ids)
          // console.log(data)
          // console.log(ids)
          this.getusersinfo()
          this.$message({
            type: 'success',
            message: data.meta.msg
          })
        })
        .catch(() => {
          return false
        })
    },
    // 关闭弹出框后，清空表单数据
    addclose() {
      this.$refs.addfromref.resetFields()
    },
    // 添加用户
    add() {
      this.$refs.addfromref.validate(async Bool => {
        if (Bool) {
          var { data } = await this.$http.post('/users', this.addform)
          // console.log(data)
          this.$message.success(data.meta.msg)
          this.$refs.addfromref.resetFields()
          this.getusersinfo()
          return (this.addFormVisible = false)
        }
      })
    },
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.getusersinfo()
    },
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getusersinfo()
    },
    // 用户获取列表页
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
      // 编辑用户信息的表单数据的验证规则
      editfromrules: {
        email: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      // 编辑用户信息的表单数据
      editform: {
        username: '',
        email: '',
        mobile: ''
      },
      props: ['id'],
      // 存储表格数据的
      tableData: [],

      // 分页的功能
      page: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 添加表单的规则
      addFormrules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        email: [{ required: false, message: '此项为必填项', trigger: 'blur' }]
      },
      // 添加表单的开关
      addFormVisible: false,
      addform: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addformLabelWidth: '100px',
      editformLabelWidth: '100px',
      // edit显示开关
      editFormVisible: false
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 20px;
}
.el-container,
.el-main {
  background-color: #eaedf1;
}
</style>
