<template>
  <div>
    <!--   搜索 添加 用户列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form :inline="true">
            <el-form-item label="角色名称">
              <el-input placeholder="请输入角色名称" clearable @clear="getRoleList" v-model="queryRole.queryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getRoleList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryRole.pageNo"
                     :page-sizes="[2, 8, 10, 15]"
                     :page-size="queryRole.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog
      :title="title | newTitle"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClosed"
    >

      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        highlight-current
        default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "RoleMenus",
    data() {
      return {
        uid: window.sessionStorage.getItem('id'),
        // 获取用户列表查询参数对象
        queryRole: {
          queryName: '',
          pageNo: 1,
          pageSize: 8
        },
        //角色列表
        roleList: [],
        menuList: [],
        total: 0,
        roleId: 0,
        title: '',
        // 分配权限框
        setRightDialogVisible: false,
        // 权限列表
        rightsList: [],
        //  树形控件的属性绑定对象
        treeProps: {
          label: 'name',
          children: 'childMenu',
          disabled: 'disabled'
        },
      }
    },
    methods: {
      //树控件
      showSetRightDialog(role) {
        var _this = this;
        _this.roleId = role.id;
        _this.title = role.name;
        this.axios.post("menus/selectAllMenu/" + _this.uid).then((resp) => {
          //   获取权限树
          _this.rightsList = resp.data;
          //   获取角色已有权限
          _this.axios.post("/menus/selectMenuByRid/" + _this.roleId).then((response) => {
            _this.$refs.treeRef.setCheckedNodes(response.data)
          }).catch(function (error) {
            return _this.$message.error('获取权限列表失败！')
          })
        })
        this.setRightDialogVisible = true
      },

      // 分配权限
      allotRights() {
        var _this = this;
        // 获得当前选中和半选中的Id
        const keys = [
          ...this.$refs.treeRef.getHalfCheckedKeys(),
          ...this.$refs.treeRef.getCheckedKeys()
        ];
        if (keys.length == 0) {
          this.removeMenuByRoleId();
          return;
        }
        var arr = new Array();
        keys.forEach( (item)=> {
          var rm = {role_id: _this.roleId, menu_id: item};
          arr.push(rm);
        })

        this.axios.post("/roleMenu/setRoleMenu",
          JSON.stringify(arr),
          {headers: {"Content-Type": "application/json"}}).then((response) => {
          if (response.data.result == true) {
            _this.$message.success('分配权限成功!')
            _this.setRightDialogVisible = false
          }
        }).catch(function (error) {
          return this.$message.error('分配权限失败！')
        })
      },
      // 权限对话框关闭事件
      setRightDialogClosed() {
        this.defKeys = []
      },
      //删除所有权限
      removeMenuByRoleId() {
        var _this = this;
        this.$confirm('将删除[' + _this.title + ']所有权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.axios.post("/roleMenu/deleteByRoleId/" + _this.roleId).then((response) => {
            if (response.data.result == true) {
              _this.$message.success("删除成功")
              this.setRightDialogVisible = false
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除")
          this.setRightDialogVisible = false
        });
      },
      //获取角色列表
      getRoleList() {
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageNo", _this.queryRole.pageNo);
        params.append("pageSize", _this.queryRole.pageSize);
        params.append("name", _this.queryRole.queryName);
        this.axios.post("/roles/page", params).then(function (resp) {
          _this.total = resp.data.total;
          _this.roleList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取角色列表失败！')
        })
      },
      // 监听 pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryRole.pageSize = newSize
        this.getRoleList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryRole.pageNo = newSize
        this.getRoleList()
      },
    },
    created() {
      this.getRoleList();
    },
    filters: {   //过滤器
      newTitle(val) {
        return "分配权限【" + val + "】";
      }
    }
  }
</script>

<style scoped>

</style>
