<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
      <el-steps :active="activeName-1" align-center class="step">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="Addgoodsform" label-width="150px" :rules="addgoodsrules" ref="addformref">
        <el-tabs
          tab-position="left"
          v-model="activeName"
          @tab-click="handleClick"
          :before-leave="beforeTab"
        >
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="Addgoodsform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="Addgoodsform.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="Addgoodsform.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="Addgoodsform.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="selectedOptions"
                :props="OptionsProps"
                @change="changeid"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item v-for="(v,i) in manylist" :key="i" :label="v.attr_name">
              :
              <el-checkbox-group
                border
                v-for="(vv,ii) in v.attr_vals"
                :key="ii"
                v-model="v.attr_vals"
              >
                <el-checkbox :label="vv"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item v-for="(v,b) in onlylist" :key="b" :label="v.attr_name">
              <el-input v-model="v.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <!--
              1. 之前axios发送请求->配置axios里面的baseUrl
            图片上传的请求不是axios发送的,所以action的值需要写全路径
            2. 之前axios的请求拦截器设置请求头->进行token授权
            图片上传的请求不是axios,所以需要设置图片上传请求的请求头
            -->
            <el-upload
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <quill-editor v-model="Addgoodsform.goods_introduce"></quill-editor>

            <el-button type="primary" class="l-button" @click="addgoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    //  <quill-editor>
    quillEditor
  },
  created() {
    this.getOptionsList()
  },
  methods: {
    async addgoods() {

          const { data: res } = await this.$http.post(
            `goods`,
            this.Addgoodsform
          )

          if(res.meta.status !==201){
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.$router.push('goods')
          console.log(res)

    },
    handleRemove(file) {
      // 移除图片的方法
      this.Addgoodsform.pics = ''
    },
    handleSuccess(response) {
      this.Addgoodsform.pics = response.data.tmp_path
      // 上传成功的方法
    },
    changeid() {
      this.threeid = this.selectedOptions[2]
      this.Addgoodsform.goods_cat = this.selectedOptions.join(',')
    },
    beforeTab(activeName, oldActiveName) {
      if (oldActiveName === '1' && this.selectedOptions.length !== 3) {
        // 提示框:提示选择三级分类
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    async handleClick() {
      if (this.activeName == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeid}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        // 将动态数组中的attr_vals数组转换为以逗号分割的字符创
        res.data.forEach((item, i) => {
          item.attr_vals = item.attr_vals.split(',')
        })

        this.manylist = res.data

        this.manylist.forEach(item => {
          if (this.manylist.length > 0) {
            let obj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.Addgoodsform.attrs.push(obj)
          }
        })
      }
      if (this.activeName == '3') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeid}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        this.onlylist = res.data

        this.onlylist.forEach(item => {
          if (this.onlylist.length > 0) {
            let obj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.Addgoodsform.attrs.push(obj)
          }
        })
      }
    },
    async getOptionsList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      this.options = dt.data
    }
  },
  data() {
    return {
      headers: {
        // 创建请求头  图片上传所使用的的方法不是axios所以上传时没带token 需要使用上传组件中的headers属性将token保存在headers上
        // var token = window.sessionStorage.getItem('token')
        // config.headers.Authorization = token
        Authorization: window.sessionStorage.getItem('token')
      },
      // 动态参数的数据
      manylist: [],
      onlylist: [],
      threeid: 0,
      addgoodsrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选取商品分类', trigger: 'blur' }
        ]
      },
      selectedOptions: [],
      options: [],
      activeName: '1',
      Addgoodsform: {
        goods_cat:'',
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        pics: '',
        attrs: [],
        goods_introduce: ''
      },
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
.el-step,
.el-tabs {
  margin-top: 20px;
}
.el-input {
  margin-right: 200px;
}
.quill-editor {
  height: 200px;
}
.l-button {
  margin-top: 50px;
}
</style>
