<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- alert警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 级联选择器 -->
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            :props="OptionsProps"
            clearable
            @change="selectChange()"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabhuan()">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showbutton">添加动态参数</el-button>
          <!-- 表格 -->
          <el-table :data="dynamictableData" border style="width: 100%">
            <el-table-column type="expand" width="50">
              <!-- <el-row> -->
                <!-- <el-col> -->
                  <template slot-scope="info">
                    <el-tag v-for=" (v,k) in info.row.attr_arr" :key="k" closable>{{v}}</el-tag>
                  </template>
                <!-- </el-col> -->
              <!-- </el-row> -->
            </el-table-column>
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column prop="address" label="操作">
              <el-button type="primary" size="mini">编辑</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="showbutton">添加静态属性</el-button>
          <!-- 表格 -->
          <el-table :data="statictableData" border style="width: 100%">
            <el-table-column type="expand" width="50">
              <!-- <el-row> -->
                <!-- <el-col> -->
                  <template slot-scope="info">
                    <el-tag v-for=" (v,k) in info.row.attr_arr" :key="k">{{v}}</el-tag>
                  </template>
                <!-- </el-col> -->
              <!-- </el-row> -->
            </el-table-column>
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="230">
              <el-button type="primary" size="mini">编辑</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getOptionsList()
  },
  methods: {
    // 获取数据的方法
    async gettableData() {
      const { data: dt } = await this.$http.get(
        `categories/${this.threeid}/attributes`,
        { params: { sel: this.activeName } }
      )
      console.log(dt)
      dt.data.forEach(item => {
        item.attr_arr = item.attr_vals.split(' ')
      })
      console.log(dt)
      if (this.activeName == 'many') {
        this.dynamictableData = dt.data
      } else {
        this.statictableData = dt.data
      }
    },
    // 级联选择器变化时触发的方法
    selectChange() {
      var len = this.selectedOptions.length
      if (len !== 3) {
        this.selectedOptions = []
        this.showbutton = true
        // 清空第三级别id  静态和动态列表数据
        this.threeid = 0
        this.dynamictableData = []
        this.statictableData = []
      } else {
        this.showbutton = false
        this.threeid = this.selectedOptions[2]
        this.gettableData()
      }
    },
    // tab栏切换触发的方法
    tabhuan() {
      // console.log(this.activeName)
      // 只有threeid 不为零的时候 才触发内部判断 调用获取数据的方法
      if (this.threeid !== 0) {
        this.gettableData()
      }
    },
    async getOptionsList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      // console.log(dt)
      this.options = dt.data
      // console.log(this.options)
    }
  },
  data() {
    return {
      // 第三级别权限的id
      threeid: 0,
      // 按钮禁用
      showbutton: true,
      // 静态参数列表
      statictableData: [],
      // 动态参数列表
      dynamictableData: [],
      // tab默认选项
      activeName: 'many',
      options: [],
      // 获取选中的列表
      selectedOptions: [],
      // 级联选择器的配置项
      OptionsProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-tabs__item {
  font-size: 14px;
}
.el-tag{
margin: 10px 
}
</style>
