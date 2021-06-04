<template>
  <div>
    <!--   搜索 用户列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form :inline="true">
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" clearable @clear="getUserList" v-model="queryInfo.queryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getUserList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="loginId" label="用户名"></el-table-column>
        <el-table-column prop="" label="密码">******</el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img width="60px" height="60px" :src=URL+scope.row.photo alt="" class="previewImg">
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.creationDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-setting" size="mini"
                       @click="showSetRightDialog(scope.row)">分配角色
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pageNo"
                     :page-sizes="[4, 8, 16, 32]"
                     :page-size="queryInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog
      :title="title | newTitle"
      :visible.sync="setUserRoleDialogVisible"
      width="40%"
      @close="setUserRoleDialogClosed">

      <template>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                     @change="handleCheckAllChange">全选
        </el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <el-checkbox v-for="role in roles" :label="role.id"
                       :checked="role.checked" :key="role.id">{{role.name}}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    name: "UserRoles",
    data() {
      return {
        checkAll: false,
        //所拥有的角色
        checkedRoles: [],
        //所有角色
        roles: [],
        isIndeterminate: true,
        URL: 'http://localhost:8080/images/',
        // 获取用户列表查询参数对象
        queryInfo: {
          queryName: '',
          pageNo: 1,
          pageSize: 4
        },
        userList: [],
        total: 0,
        userId: 0,
        title: '',
        // 分配角色框
        setUserRoleDialogVisible: false,
        uid: window.sessionStorage.getItem('id'),
      }
    },
    methods: {
      //分配角色
      setUserRole(){
        if (this.checkedRoles.length == 0) {
          this.removeRoleByUserId();
          return;
        }
        var arr = new Array();
        this.checkedRoles.forEach( (item)=> {
          var rm = {user_id: this.userId, role_id: item};
          arr.push(rm);
        })
        this.axios.post("/userRole/setUserRole",
          JSON.stringify(arr),
          {headers: {"Content-Type": "application/json"}}).then((response) => {
          if (response.data.result == true) {
            this.$message.success('分配角色成功')
            this.setUserRoleDialogVisible = false
          }
        }).catch(function (error) {
          return this.$message.error('分配角色失败')
        })
      },
      //删除所有权限
      removeRoleByUserId() {
        this.$confirm('将删除[' + this.title + ']所有角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post("/userRole/deleteByUserId/" + this.userId).then((response) => {
            if (response.data.result) {
              this.$message.success("删除成功")
              this.setUserRoleDialogVisible = false
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除")
          this.setUserRoleDialogVisible = false
        });
      },
      //全选
      handleCheckAllChange(val) {
        this.checkedRoles = val ? this.roles.map((item) => {
          return item.id
        }) : [];
        this.isIndeterminate = false;
      },
      handleCheckedRolesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.roles.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
      },
      // 权限对话框关闭事件
      setUserRoleDialogClosed() {
        this.checkedRoles = [];
        this.roles = [];
        this.setUserRoleDialogVisible = false
      },
      //   获取所有角色
      showSetRightDialog(user) {
        this.userId = user.id;
        this.title = user.loginId;
        this.axios.post("/roles/selectAllRole/" + this.uid + "/" + this.userId).then((resp) => {
          this.roles = resp.data;
        })
        this.setUserRoleDialogVisible = true
      },
      //获取用户列表
      getUserList() {
        var params = new URLSearchParams();
        params.append("pageNo", this.queryInfo.pageNo);
        params.append("pageSize", this.queryInfo.pageSize);
        params.append("loginId", this.queryInfo.queryName);
        this.axios.post("/users/page", params).then( (resp)=> {
          this.total = resp.data.total;
          this.userList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取用户列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNo = newSize
        this.getUserList()
      },
    },
    created() {
      this.getUserList()
    },
    filters: {   //过滤器
      newTitle(val) {
        return "分配角色【" + val + "】";
      }
    }
  }
</script>

<style scoped>

</style>
