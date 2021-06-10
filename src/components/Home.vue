<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '53px' : '250px'">
        <div class="toggle-button" @click="togleCollapse"><i class="el-icon-s-fold" style="font-size: 20px"></i></div>
        <el-menu unique-opened :collapse="isCollapse" :collapse-transition="true"
                 background-color="#333744" text-color="#fff" active-text-color="#409FFF">

          <el-submenu unique-opened :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="item.imageUrl"></i>
              <span>{{item.name}}</span>
            </template>

            <el-submenu :index="'/' + subItem.id" v-for="subItem in item.childMenu" :key="subItem.id">

              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <i :class="subItem.imageUrl"></i>
                <span>{{ subItem.name}}</span>
              </template>

              <el-menu-item @click="addTab(subChilItem.name,subChilItem.linkUrl)" :index="'/' + subChilItem.id"
                            v-for="subChilItem in subItem.childMenu" :key="subChilItem.id">
                <i :class="subChilItem.imageUrl"></i>
                <span>{{subChilItem.name}}</span>
              </el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>

        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <component :is="item.content"></component>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Users from '../components/user/Users'
  import AddUser from './user/AddUser'
  import Welcome from "../components/Welcome"
  import RoleMenus from '../components/menu/RoleMenus'
  import DelUser from '../components/user/DelUser'
  import EditUser from '../components/user/EditUser'
  import Roles from '../components/role/Roles'
  import AddRole from '../components/role/AddRole'
  import DelRole from '../components/role/DelRole'
  import EditRole from '../components/role/EditRole'
  import Menus from '../components/menu/Menus'
  import AddMenus from '../components/menu/AddMenus'
  import EditMenu from '../components/menu/EditMenu'
  import DelMenu from '../components/menu/DelMenu'
  import UserRoles from '../components/user/UserRoles'
  import AddFile from '../components/file/AddFile'
  import CheckFile from '../components/file/CheckFile'
  import QueryFile from '../components/file/QueryFile'
  import EditFile from '../components/file/EditFile'
  import DelFile from '../components/file/DelFile'
  import RemoveFile from '../components/file/RemoveFile'
  import RecoveryFile from '../components/file/RecoveryFile'
  import AddModule from '../components/module/AddModule'
  import CheckModule from '../components/module/CheckModule'
  import EditModule from '../components/module/EditModule'
  import QueryModule from '../components/module/QueryModule'
  import Safetystock from "./warehouse/Safetystock";
import Library from "./warehouse/Library";
  export default {
    components: {
      Users, AddUser, Welcome, RoleMenus, DelUser, EditUser, Roles, AddRole, DelRole, EditRole,
      Menus, AddMenus, EditMenu, DelMenu, UserRoles, AddFile, CheckFile, QueryFile, EditFile, DelFile, RemoveFile,
      RecoveryFile, AddModule, CheckModule, EditModule, QueryModule, Safetystock,Library
    },
    data() {
      return {
        uid: window.sessionStorage.getItem('id'),
        // 左侧菜单数据
        menuList: [],
        // 默认不折叠
        isCollapse: false,
        // 被激活导航地址
        editableTabsValue: '1',  // 设置选中的
        editableTabs: [{   //tab选项卡显示的数据内容
          title: '首页',
          name: '1',
          content: 'Welcome'
        }],
        tabIndex: 1   // 设置到name属性的值
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      addTab(titlename, linkurl) {

        //判断当前页面是否存在
        var tempobj = this.editableTabs.find((item) => {
          return item.title == titlename
        });

        //存在  active
        if (tempobj != undefined) {
          this.editableTabsValue = tempobj.name;
        } else {
          //不存在 添加
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: titlename,
            name: newTabName,
            content: linkurl
          });
          this.editableTabsValue = newTabName;
        }

      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (targetName == 1) {
          return;
        }
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      logout() {
        // 清空token
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 获取请求菜单
      getMenuList() {
        var _this = this;
        this.axios.post("/menus/selectMenusByUid/" + _this.uid).then((response) => {
          _this.menuList = response.data;
        }).catch(function (error) {
          alert("服务端获取数据失败");
        });
      },
      // 菜单的折叠与展开
      togleCollapse() {
        this.isCollapse = !this.isCollapse
      },

    }
  }
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #373f41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      img {
        height: 40px;
      }

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    // 鼠标放上去变成小手
    cursor: pointer;
  }

  .el-main {
    background: #ffffff;
  }
</style>
