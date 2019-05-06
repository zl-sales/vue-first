<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialog"
      width="50%"
      @close="$refs.addCatRef.resetFields()"
    >
      <el-form :rules="addCatRules" ref="addCatRef" :model="addCatform" label-width="120px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCatform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类上级：">
          <el-cascader
            expand-trigger="hover"
            change-on-select
            clearable
            style="width:100%"
            :options="options"
            v-model="selected"
            :props="optionsProps"
          ></el-cascader>
          <!-- options 绑定选择器的数据 数据中心最好有children字段，以便进行分开级别 -->
          <!-- v-model 双向数据绑定  获得已经选中的字段的id -->
          <!-- :props    链接的凭借 和字段名          value: 'cat_id', // 选择器有效数据 获取的字段名的id -->
          <!-- label: 'cat_name', // 选择器显示的信息 -->
          <!-- children: 'children' // 父子级衔接字段   在数据中通过children字段进行链接数据，形成多级别联合选择器 -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCAT()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片组件 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addcat()">添加用户</el-button>
      <el-table :data="catlist" border stripe style="width: 100%" row-key="cat_id">
        <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="等级" width="240">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level==0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatlist()
  },
  methods: {
    async addCAT() {
      var len = this.selected.length
      if (len === 0) {
        this.addCatform.cat_level = 0
        this.addCatform.cat_pid = 0
      } else {
        this.addCatform.cat_level = len - 1
        this.addCatform.cat_pid = this.selected[len - 1]
      }
      console.log(this.selected[len - 1])
      const {data:dt} = await this.$http.post('categories',this.addCatform)
      console.log(dt)
      this.addCatDialog = false
      this.getCatlist()
    },
    async addcat() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.options = dt.data
      // console.log(dt)
      this.addCatDialog = true
    },
    async getCatlist() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.page
      })
      // console.log(dt)
      this.catlist = dt.data.result
      // console.log(this.catlist)
    }
  },
  data() {
    return {
      addCatRules: {
        cat_name: [
          {
            required: true,
            message: '此项必填',
            tigger: 'blur'
          }
        ]
      },
      // 添加用户中的级联选择器*/
      // 必不可少啊
      // 链接的凭借 和字段名
      optionsProps: {
        value: 'cat_id', // 选择器有效数据
        label: 'cat_name', // 选择器显示的信息
        children: 'children' // 父子级衔接字段
      },
      // 接收已选中的数据
      selected: [],
      // 级联选择器
      options: [],
      // 添加用户中的级联选择器*/
      // 添加对话框的表单对象
      addCatform: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      },
      // 添加对话框的规则。
      // 添加对话框的开关
      addCatDialog: false,
      // 显示页面表格数据
      catlist: [],
      // 分页器
      page: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
