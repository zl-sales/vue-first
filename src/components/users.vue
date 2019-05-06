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

      <!-- 分配角色弹出层 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setroleFormVisible"
        @close="$refs.setrolefromref.resetFields()"
      >
        <el-form :model="setroleform" :rules="setroleFormrules" ref="setrolefromref">
          <el-form-item
            label="当前用户："
            :label-width="setroleformLabelWidth"
            prop="username"
          >{{setroleform.username}}</el-form-item>
          <el-form-item
            label="当前角色："
            :label-width="setroleformLabelWidth"
            prop="role_name"
          >{{setroleform.role_name}}</el-form-item>
          <el-form-item label="分配的角色：" prop="rid">
            <el-select v-model="setroleform.rid" placeholder="请选择">
              <el-option v-for="v in roleinfo" :key="v.id" :label="v.roleName" :value="v.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setroleFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="getrole()">确 定</el-button>
        </div>
      </el-dialog>

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

      <!-- 编辑用户信息的弹出框-->
      <el-dialog title="添加用户" :visible.sync="editFormVisible">
        <el-form :model="editform" :rules="editFormrules" ref="ediformref">
          <el-form-item label="用户名" :label-width="editformLabelWidth" prop="username">
            <el-input v-model="editform.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="editformLabelWidth" prop="mobile">
            <el-input v-model="editform.mobile" autocomplete="off" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="editformLabelWidth" prop="email">
            <el-input v-model="editform.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="edituser">确 定</el-button>
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
            v-model="info.row.mg_state"
            slot-scope="info"
            active-color="#13ce66"
            inactive-color="#cccccc"
            @change="kaiguan(info.row.id,info.row.mg_state)"
          ></el-switch>

          <!-- 此处使用<slot-scoped方式获取当值 -->
          <!-- <el-switch v-model="bool.mg_state"  slot-scope="bool"></el-switch> -->
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="250">
          <!-- 三个按钮 -->
          <template slot-scope="info">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(info.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="dele(info.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setrole(info.row)"
              ></el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
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
    // 开启或关闭状态开关
    async kaiguan(id, state) {
      const { data: dt } = await this.$http.put(`users/${id}/state/${state}`)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    // 分配角色
    async getrole() {
      const { data: dt } = await this.$http.put(
        `users/${this.setroleform.id}/role`,
        {
          rid: this.setroleform.rid
        }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.setroleFormVisible = false
      this.getusersinfo()
    },
    // 打开分配角色弹出框 获取数据渲染弹出框
    async setrole(user) {
      const { data: dt } = await this.$http.get('roles')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 渲染到弹出框上的数据
      this.setroleform = user
      // 下来菜单
      this.roleinfo = dt.data
      // 打开弹出框
      this.setroleFormVisible = true
    },
    // 点击修改弹窗的确定按钮，发送axios请求，修改数据
    edituser() {
      this.$refs.ediformref.validate(async val => {
        if (val) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editform.id,
            this.editform
          )
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.editFormVisible = false
          this.$message.success(dt.meta.msg)
          this.getusersinfo()
        }
      })
    },
    // 打开修改用户弹窗，并且发送axios请求获取数据，渲染弹窗、
    async edit(id) {
      this.editFormVisible = true
      const { data } = await this.$http.get('users/' + id)
      // console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg)
      }
      this.editform = data.data
    },
    // 通过id删除该条数据
    dele(ids) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          var { data } = await this.$http.delete('users/' + ids)
          // console.log(data)
          // console.log(ids)
          this.getusersinfo()
          this.$message({
            type: 'success',
            message: data.meta.msg
          })
          if (this.tableData.length === 1 && this.page.pagenum !== 1) {
            this.page.pagenum--
          }
        })
        .catch(() => {
          return false
        })
    },
    // 关闭添加用户弹出框后，清空表单数据
    addclose() {
      this.$refs.addfromref.resetFields()
    },
    // 添加用户
    add() {
      this.$refs.addfromref.validate(async val => {
        if (val) {
          var { data } = await this.$http.post('/users', this.addform)
          // console.log(data)
          this.$message.success(data.meta.msg)
          this.$refs.addfromref.resetFields()
          this.getusersinfo()
          return (this.addFormVisible = false)
        }
      })
    },
    // 分页器切换页码时触发的函数方法
    handleCurrentChange(val) {
      this.page.pagenum = val
      this.getusersinfo()
    },
    // 分页器切换页码时触发的函数方法
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getusersinfo()
    },
    // 用户获取列表页
    async getusersinfo() {
      var { data: list } = await this.$http.get('/users', {
        params: this.page
      })
      // console.log(list)
      this.tableData = list.data.users
      this.page.tatol = list.data.total
    }
  },
  data() {
    var checkemail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      // 如果不符合正则表达式的条件的话则触发下边代码
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的邮箱地址'))
      }
      callback()
    }
    var checkmobile = (rule, value, callback) => {
      const rega = /^1[35789]\d{9}$/
      // 如果不符合正则表达式的条件的话则触发下边代码
      if (!rega.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    return {
      // 显示在分配角色弹出框的数据。
      roleinfo: [],
      setroleFormrules: {
        rid: [
          {
            required: true,
            message: '请选择一个角色',
            trigger: 'change'
          }
        ]
      },
      // 存储分配角色表单的对象成员
      setroleform: {
        username: '',
        role_name: '',
        rid: 0
      },
      // 编辑用户信息的表单数据的验证规则
      editFormrules: {
        mobile: [
          {
            required: true,
            message: '此项必填',
            trigger: 'blur'
          },
          { validator: checkmobile, trigger: 'blur' }
        ],

        email: [
          { required: false, trigger: 'blur' },
          { validator: checkemail, trigger: 'change' }
        ]
      },
      // 编辑用户信息的表单数据
      editform: {
        username: '',
        email: '',
        mobile: ''
      },
      // 存储table表格数据的
      tableData: [],
      // 分页的功能
      page: {
        query: '',
        pagenum: 1,
        pagesize: 6
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
            message: '此项必填',
            trigger: 'blur'
          },
          { validator: checkmobile, trigger: 'blur' }
        ],

        email: [
          { required: false, trigger: 'blur' },
          { validator: checkemail, trigger: 'change' }
        ]
      },

      // 添加用户表单的对象成员
      addform: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      setroleformLabelWidth: '100px',
      addformLabelWidth: '100px',
      editformLabelWidth: '100px',
      // 添加表单的开关
      addFormVisible: false,
      // edit显示开关
      editFormVisible: false,
      // 分配用户角色开关
      setroleFormVisible: false
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
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
