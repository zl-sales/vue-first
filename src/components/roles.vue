<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色权限</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色弹出框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="$refs.addformref.resetFields()"
    >
      <el-form ref="addformref" :model="addform" label-width="120px" :rules="editFormrules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adddialogVisible = true">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹出框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="$refs.editformref.resetFields()"
    >
      <el-form ref="editformref" :model="editform" label-width="120px" :rules="editFormrules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = true">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的弹出框 -->
    <el-dialog title="分配权限" :visible.sync="rightsFormVisible">
      <el-form :model="rightsform" ref="edifromref">
        <el-form-item label="当前角色:">{{rightsform.roleName}}</el-form-item>
      </el-form>
      <el-tree
        :data="treedata"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expand-all="true"
        :default-checked-keys="treeids"
        :highlight-current="true"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="leaves()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 卡片组件 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addrole()">添加用户</el-button>
      <el-table :data="rightslist" style="width: 100%" border lazy>
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 一级标签 -->
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom':'1px solid rgb(235, 238, 245)',
              'border-top':k===0?'1px solid rgb(235, 238, 245)':''}"
            >
              <!-- 一级出现 -->
              <el-col :span="5">
                <el-tag closable @close="deletag(info.row,v.id)">{{v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-bottom':'1px solid rgb(235, 238, 245)',
                  'border-top':kk!==0?'1px solid rgb(235, 238, 245)':''}"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deletag(info,row,vv.id)">{{vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      type="warning"
                      closable
                      @close="deletag(info.row,vvv.id)"
                    >{{vvv.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="240"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
        <el-table-column label="操作" width="340">
          <!-- 获取当前的数据 通过作用域插槽 -->
          <template slot-scope="info">
            <!-- <span>{{info.row}}</span> 当前行的所有数据 -->
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editrole(info.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delerole(info.row)"></el-button>
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="rights(info.row)"
            >分配权限</el-button>
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
    // 打开添加用户弹出框
    addrole() {
      this.adddialogVisible = true
    },
    // 打开编辑角色信息弹出框  渲染当前用户信息
    editrole(role) {
      this.editdialogVisible = true
      this.editform = role
    },
    // 删除该角色
    delerole(role) {
      this.$confirm('是否确定删除该角色?', '删除示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: dt } = await this.$http.delete('roles/' + role.id)
        this.$message.success(dt.meta.msg)
        this.getrightslist()
      })
    },
    // 删除单个tag权限标签
    deletag(role, rid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: dt } = await this.$http.delete(
          `roles/${role.id}/rights/${rid}`
        )
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 删除成功后，将获取到的最新权限信息赋值给role。son 重新渲染到展开行中  进行小范围的更新
        role.son = dt.data
      })
    },
    // 使用参数获取到了当前的数据
    // 获取当前角色列表的数据渲染权限树
    // 多次循环大量占用资源
    async rights(roles) {
      const { data: dt } = await this.$http.get('rights/tree')
      this.rightsFormVisible = true
      this.rightsform = roles
      this.treedata = dt.data
      console.log(this.rightsform)
      // 循环完毕，将获取到的数据清空
      this.treeids = []
      for (let i = 0; i < roles.son.length; i++) {
        // 循环当前行数据的son 获取一级的标签数据
        for (let a = 0; a < roles.son[i].children.length; a++) {
          // 根据当前行数据的son的数据，获取到了二级标签数据
          for (let b = 0; b < roles.son[i].children[a].children.length; b++) {
            // 根据当前行数据二级标签数据，获取到了三级标签数据 就可以拿到三级数据的id值 将其添加到数组中去
            this.treeids.push(roles.son[i].children[a].children[b].id)
          }
        }
      }
    },
    // 获取所有被选中的叶子结点，发送axios请求给其发配权限
    async leaves() {
      let ids1 = this.$refs.tree.getCheckedKeys()
      let ids2 = this.$refs.tree.getHalfCheckedKeys()
      ids1.push(...ids2)
      var ids = ids1.join(',')
      const { data: dt } = await this.$http.post(
        `roles/${this.rightsform.id}/rights`,
        { rids: ids }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.rightsFormVisible = false
      this.getrightslist()
    },
    // 获取当前展示的数据
    async getrightslist() {
      const { data: dt } = await this.$http.get('roles')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把dt.data的第1维的"children"字段更换为"son"名称
      dt.data.forEach(item => {
        // item:遍历出来的小单元
        item.son = item.children // 把children的信息交予给son
        delete item.children // 把多余的children给去掉(删除对象的成员)
      })
      // 角色获取成功，把获取到的角色数据赋予给roleList
      this.rightslist = dt.data
    }
  },
  data() {
    return {
      addFormrules: {},
      addform: {
        roleName: '',
        roleDesc: ''
      },
      adddialogVisible: false,
      editFormrules: {
        roleName: [{ required: true, message: '此处必填', tigger: 'blur' }]
      },
      editform: {
        roleName: '',
        roleDesc: ''
      },
      editdialogVisible: false,
      rightslist: [],
      rightsFormVisible: false,
      rightsform: {},
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      treedata: [],
      treeids: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
