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
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "users",
    data(){
      return{
        URL:'http://localhost:8080/images/',
        // 获取用户列表查询参数对象
        queryInfo: {
          queryName: '',
          pageNo: 1,
          pageSize: 5
        },
        userList: [],
        total: 0,
      }
    },
    methods: {
      //获取用户列表
      getUserList() {
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageNo", _this.queryInfo.pageNo);
        params.append("pageSize", _this.queryInfo.pageSize);
        params.append("loginId", _this.queryInfo.queryName);
        this.axios.post("/users/page", params).then(function (resp) {
          _this.total = resp.data.total;
          _this.userList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取用户列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pageNo = newSize
        this.getUserList()
      },
    },
    created() {
      this.getUserList()
    }
  }
</script>

<style scoped>
  .el-input, .textarea ,.el-select{
    width: 180px;
  }
</style>
