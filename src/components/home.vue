<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>第一次使用Vue独立完成项目</span>
      </div>
      <el-button type="danger" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="show?'65px':'200px'">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :router="true"
          :collapse="show"
          :collapse-transition="false"
        >
          <div id="button" @click="show=!show" :style="{width:show?'65px':'200px'}">|||</div>
          <el-submenu
            :index="item.id"
            v-for=" (item, k) in menulist"
            :key="item.id"
            :style="{width:show?'65px':'200px'}"
          >
            <template slot="title">
              <i :class="iconlist[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group
              v-for="ite in item.children"
              :key="ite.id"
              :style="{width:show?'65px':'200px'}"
            >
              <el-menu-item :index="ite.path">
                <i class="el-icon-menu"></i>
                <span>{{ite.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenulist()
  },
  methods: {
    loginout() {
      this.$confirm('是否退出?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已退出!'
        })
        window.sessionStorage.clear()
        this.$router.push('/lg')
      })
    },
    async getmenulist() {
      const { data: dt } = await this.$http.get('/menus')
      if (dt.meta.status !== 200) {
        this.$message.danger(dt.meta.msg)
      }
      this.menulist = dt.data
      console.log(this.menulist)
    }
  },
  data() {
    return {
      menulist: [],
      show: false,
      iconlist: [
        'iconfont icon-users',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41; //rgb(51, 55, 68)
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    .logo-box {
      color: #fff;
      line-height: 1;
      font-size: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        margin-right: 10px;
        width: 50px;
        height: 50px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-submenu {
      width: 200px;
    }
    #button {
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      height: 25px;
      user-select: none;
      letter-spacing: 0.1em;
      line-height: 25px;
      font-size: 12px;
      cursor: pointer;
      width: 100%;
    }
    .iconfont {
      margin-right: 10px;
    }
  }
}
</style>
