<template>
  <div>
    <!--   搜索 添加 角色列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
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
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="code" label="角色编号"></el-table-column>
        <el-table-column prop="descn" label="角色说明"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryRole.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryRole.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="editRoleForm"
        ref="editRoleForm"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色ID" prop="id">
          <el-input clearable disabled v-model="editRoleForm.id"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input clearable disabled v-model="editRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="code">
          <el-input  clearable  v-model="editRoleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="descn">
          <el-input  clearable v-model="editRoleForm.descn"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editRole('editRoleForm')">编 辑</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "EditRole",
    data() {
      return {
        // 添加角色对话框
        editRoleFormRules: {
          code: [
            { required: true, message: '请输入角色说明', trigger: 'blur' },
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          descn: [
            { required: true, message: '请输入角色说明', trigger: 'blur' },
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
        },
        // 获取角色列表查询参数对象
        queryRole: {
          queryName: '',
          pageNo: 1,
          pageSize: 5
        },
        roleList: [],
        total: 0,
        //添加表单的参数
        editRoleForm: {
          id:'',
          name: '',
          code: '',
          descn: '',
        },
        editDialogVisible: false,
      }
    },
    methods: {
      // 监听 添加角色对话框的关闭事件
      editDialogClosed() {
        this.$nextTick(() => {
          this.$refs.editRoleForm.resetFields()
          this.editDialogVisible = false
        })
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
      //编辑打开模态框
      showEditDialog(id){
        this.editDialogVisible = true,
        this.axios.post("/roles/selectById/"+id).then( (resp) =>{
          this.editRoleForm = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
      },
      //编辑
      editRole(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(_this.editRoleForm).forEach( (key) =>{
              params.append(key, _this.editRoleForm[key])
            })
            this.axios.post("/roles/update", params).then((response) => {
              if (response.data==true) {
                _this.$message.success("编辑成功")
                _this.editDialogClosed(),
                  _this.getRoleList();
              } else {
                _this.$message.success("编辑失败")
                _this.editDialogClosed(),
                  _this.getRoleList();
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            });
          }
        })
      },
    },
    created() {
      this.getRoleList()
    }
  }
</script>

<style scoped>
  .el-input, .textarea ,.el-select{
    width: 180px;
  }
</style>
