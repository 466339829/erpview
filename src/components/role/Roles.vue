<template>
  <div>
    <!--   搜索 用户列表分页-->
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
      <!-- 用户列表区域 -->
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
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data(){
      return{
        // 获取用户列表查询参数对象
        queryRole: {
          queryName: '',
          pageNo: 1,
          pageSize: 5
        },
        roleList: [],
        total: 0,
      }
    },
    methods: {
      //获取用户列表
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
        this.getRoleList()
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
