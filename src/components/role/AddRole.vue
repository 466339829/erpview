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
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="code" label="角色编号"></el-table-column>
        <el-table-column prop="descn" label="角色说明"></el-table-column>
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
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="addRoleForm"
        ref="addRoleForm"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input clearable v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="code">
          <el-input  clearable  v-model="addRoleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="descn">
          <el-input  clearable v-model="addRoleForm.descn"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addRole('addRoleForm')">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "AddRole",
    data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入角色名称'));
        } else {
          var params = new URLSearchParams();
          params.append("name", value)
          this.axios.post("/roles/checkName", params).then(function (response) {
            if (!response.data.result) {
              callback(new Error(response.data.message));
            } else
              callback();
          })
        }
      };
      return {
        // 添加角色对话框
        addRoleFormRules: {
          code: [
            { required: true, message: '请输入角色说明', trigger: 'blur' },
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          descn: [
            { required: true, message: '请输入角色说明', trigger: 'blur' },
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          name: [
            {validator: validateName, trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ]
        },
        // 获取角色列表查询参数对象
        queryRole: {
          queryName: '',
          pageNo: 1,
          pageSize: 5
        },
        roleList: [],
        total: 0,
        addDialogVisible: false,
        //添加表单的参数
        addRoleForm: {
          name: '',
          code: '',
          descn: '',
        }
      }
    },
    methods: {
      // 监听 添加角色对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.$refs.addRoleForm.resetFields()
          this.addDialogVisible = false
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
      //添加
      addRole(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(_this.addRoleForm).forEach( (key) =>{
              params.append(key, _this.addRoleForm[key])
            })
            this.axios.post("/roles/insert", params).then((response) => {
              if (response.data.result) {
                _this.$message.success(response.data.message)
                _this.addDialogClosed(),
                  _this.getRoleList();
              } else {
                _this.$message.success(response.data.message)
                _this.addDialogClosed(),
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

</style>
