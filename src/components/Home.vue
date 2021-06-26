<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <span>REP后台管理系统</span>
      </div>

      <!--<el-button type="info" @click="logout">退出</el-button>-->
      <el-row>
        <el-col :span="6">
          <el-dropdown>
            <span class="el-dropdown-link">
              <div class="avatar-wrapper">
              <img :src="photo" class="user-avatar">
              <i class="el-icon-caret-bottom"/>
              </div>
      </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="dialogVisible = true" icon="el-icon-edit">修改信息</el-dropdown-item>
              <el-dropdown-item @click.native="logout" icon="el-icon-switch-button">退 出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
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


      <el-dialog
        title="修改个人信息"
        :visible.sync="dialogVisible"
        width="50%">
        <el-divider></el-divider>
        <el-tabs :tab-position="tabPosition" style="height: 250px;">
          <el-tab-pane label="修改密码">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
              <el-form-item label="原始密码" prop="pwd">
                <el-input clearable type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="password">
                <el-input clearable type="password" v-model="ruleForm.password" show-password
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="checkPassword">
                <el-input clearable type="password" v-model="ruleForm.checkPassword" show-password
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改头像">
            <span>原始头像</span>
            <el-form :inline="true" :model="photoForm" status-icon ref="photoForm" label-width="100px"
                     class="demo-ruleForm">
              <img :src=photo class="fileImages" style="display: inline;float: left">
              <span class="el-upload-list__item-actions">
            </span>
              <el-form-item label="新头像" prop="image">
                <el-upload
                  ref="upload"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :action="uploadURL"
                  :limit="1"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleSuccess">
                  <i class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">只能上传一张图片，且不超过2MB</div>
                </el-upload>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitPhotoForm('photoForm')">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
      </el-dialog>
      <el-dialog title="产品图片预览" :visible.sync="previewDialogVisible">
        <img width="100%" :src="picPreviewPath" alt="" class="previewImg">
      </el-dialog>
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
  import AddDesignProcedureModule from '../components/designproceduremodule/AddDesignProcedureModule'
  import CheckDesignProcedureModule from '../components/designproceduremodule/CheckDesignProcedureModule'
  import QueryDesignProcedureModule from '../components/designproceduremodule/QueryDesignProcedureModule'
  import EditDesignProcedureModule from '../components/designproceduremodule/EditDesignProcedureModule'
  import AddApply from '../components/apply/AddApply'
  import CheckApply from '../components/apply/CheckApply'
  import QueryApply from '../components/apply/QueryApply'
  import AddManufacture from '../components/manufacture/AddManufacture'
  import CheckManufacture from '../components/manufacture/CheckManufacture'
  import QueryManufacture from '../components/manufacture/QueryManufacture'

  import AddDesignProcedure from '../components/designprocedure/AddDesignProcedure'
  import CheckDesignProcedure from '../components/designprocedure/CheckDesignProcedure'
  import QueryDesignProcedure from '../components/designprocedure/QueryDesignProcedure'
  import EditDesignProcedure from '../components/designprocedure/EditDesignProcedure'
  import AddTagManufacture from '../components/tagmanufacture/AddTagManufacture'
  import CheckTagManufacture from  '../components/tagmanufacture/CheckTagManufacture'
  import QueryTagManufacture from  '../components/tagmanufacture/QueryTagManufacture'
  import AddGather from  '../components/gather/AddGather'

  import Inboundapplication from "./warehouse/Inboundapplication";
  import SafetystockQuery from "./warehouse/SafetystockQuery";
  import SafetystockUpdate from "./warehouse/SafetystockUpdate";
  import Safetystock from "./warehouse/Safetystock";

  import InboundappFuhe from "./warehouse/InboundappFuhe";
  import Library from "./warehouse/Library";
  import Inboundquery from "./warehouse/Inboundquery";

  export default {
    components: {
      //yong
      Users, AddUser, Welcome, RoleMenus, DelUser, EditUser, Roles, AddRole, DelRole, EditRole,
      Menus, AddMenus, EditMenu, DelMenu, UserRoles, AddFile, CheckFile, QueryFile, EditFile,
      DelFile, RemoveFile, RecoveryFile, AddModule, CheckModule, EditModule, QueryModule,
       AddApply, CheckApply, QueryApply, AddManufacture, AddDesignProcedure,
      CheckDesignProcedure, QueryDesignProcedure, EditDesignProcedure, CheckManufacture, QueryManufacture,
      AddTagManufacture,CheckTagManufacture,QueryTagManufacture,
      AddDesignProcedureModule, CheckDesignProcedureModule, QueryDesignProcedureModule,AddGather,
      EditDesignProcedureModule, Inboundapplication, SafetystockQuery, SafetystockUpdate, InboundappFuhe,
      Inboundquery,
      //
      Safetystock,

      //
      Library
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPassword !== '') {
            this.$refs.ruleForm.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原始密码'));
        } else if (value !== this.mm) {
          callback(new Error('原始密码不正确!'));
        } else {
          callback();
        }
      };
      return {
        uploadURL: 'http://localhost:8080/file/upload',
        rules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPassword: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          pwd: [
            {validator: checkPwd, trigger: 'blur'}
          ]
        },
        photo: window.sessionStorage.getItem('photo'),
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
        tabIndex: 1,   // 设置到name属性的值
        dialogVisible: false,
        tabPosition: 'left',
        ruleForm: {
          password: '',
          checkPassword: '',
          pwd: ''
        },
        photoForm: {
          image: ''
        },
        mm: window.sessionStorage.getItem('password'),
        previewDialogVisible: false,
        picPreviewPath: ''
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            params.append("id", window.sessionStorage.getItem('id'));
            params.append("password", this.ruleForm.password)
            this.axios.post("/users/updatePwd", params).then((response) => {
              if (response.data) {
                window.sessionStorage.clear();
                this.$message.success("修改成功,请重新登录");
                this.$router.push("/login");
              } else {
                this.$message.error("修改失败");
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            });
          } else {
            return false;
          }
        });
      },

      handleRemove(file, fileList) {
        this.photoForm.image = '';
        const filePath = file.response.data;
        this.axios.post("file/delete/" + filePath.id).then((resp) => {
          if (resp.data == true)
            this.$message.success("删除成功")
        }).catch(function (error) {
          return this.$message.error('图片加载失败！')
        })
      },
      handlePictureCardPreview(file) {
        this.picPreviewPath = file.url;
        this.previewDialogVisible = true;
      },
      handleSuccess(response) {
        this.imageUrl = this.URL + response.data.path;
        // 1.拼接得到一个图片信息对象 临时路径
        // 2.将图片信息对象，添加到addFileForm.image 中
        this.photoForm.image = response.data.path;
      },
      submitPhotoForm(formName) {
        var bool = true;
        if (this.photoForm.image == '') {
          this.$message.error("请上传新头像");
          bool = false;
        }
        if (bool==true) {
          var params = new URLSearchParams();
          params.append("id", window.sessionStorage.getItem('id'));
          params.append("photo", this.photoForm.image)
          this.axios.post("/users/updatePhoto", params).then((response) => {
            if (response.data) {
              window.sessionStorage.clear();
              this.$message.success("修改成功,请重新登录");
              this.$router.push("/login");
            } else {
              this.$message.error("修改失败");
            }
          }).catch(function (error) {
            alert("服务端获取数据失败");
          });
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .avatar-wrapper {
    margin-top: -5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 2px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -15px;
      top: 25px;
      font-size: 12px;
    }
  }

  .fileImages {
    width: 70px;
    height: 70px;
    display: inline;
  }
</style>
