<template>
  <div>
    <!--   搜索 用户列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form :inline="true">
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" clearable @clear="getUserList" v-model="queryInfo.queryName"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker @change="change"
                              v-model="queryInfo.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
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
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="pictureCardPreview(scope.row.photo)"><i class="el-icon-zoom-in"></i></span>
            </span>
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
    <el-dialog title="头像预览" :visible.sync="previewDialogVisible">
      <img width="100%" :src="picPreviewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "users",
    data(){
      return{
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        previewDialogVisible:false,
        picPreviewPath:'',
        URL:'http://localhost:8080/images/',
        // 获取用户列表查询参数对象
        queryInfo: {
          queryName: '',
          pageNo: 1,
          pageSize: 5,
          dataTime:''
        },
        userList: [],
        total: 0,
      }
    },
    methods: {
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getUserList();
      },
      pictureCardPreview(file) {
        this.picPreviewPath = this.URL+file;
        this.previewDialogVisible = true;
      },
      getDataTime(dataTime) {//默认显示今天
        var nian = dataTime.getFullYear();
        var yue = dataTime.getMonth() + 1;
        var ri = dataTime.getDate();
        var shi = dataTime.getHours();
        var fen = dataTime.getMinutes();
        var miao = dataTime.getSeconds();
        if (yue < 10) yue = "0" + yue;
        if (ri < 10) ri = "0" + ri;
        if (miao < 10) miao = "0" + miao;
        if (fen < 10) fen = "0" + fen;
        if (shi < 10) shi = "0" + shi;
        return nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
      },
      //获取用户列表
      getUserList() {
        var _this = this;
        var params = new URLSearchParams();
        if (this.queryInfo.dataTime) {
          params.append("creationDate", this.getDataTime(this.queryInfo.dataTime[0]))
          params.append("creationDate2", this.getDataTime(this.queryInfo.dataTime[1]))
        }
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
