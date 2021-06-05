<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getFileList" v-model="queryFile.queryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getFileList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="fileList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="type" label="用途类型"></el-table-column>
        <el-table-column prop="firstKindName" label="I级分类"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类"></el-table-column>
        <el-table-column prop="responsiblePerson" label="产品经理"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              size="mini"
              @click="delFileById(scope.row)"
            >永久删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryFile.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryFile.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "RemoveFile",
    data() {
      return {

        checkFileForm:{
          id:'',
          firstKindName:'',
          secondKindName:'',
          thirdKindName:'',
          checkTag:'',
          productId:'',
          productName: '',
          factoryName: '',
          productNick: '',
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type: '',
          productClass: '',
          personalValue: '',
          listPrice: '',
          costPrice: '',
          warranty: '',
          personalUnit: '',
          twinName: '',
          twinId: '',
          lifecycle: '',
          amountUnit: '',
          responsiblePerson: '',
          providerGroup: '',
          productDescribe: '',
          register: window.sessionStorage.getItem('loginId'),
          registerTime: '',
          image: ''
        },
        // 获取角色列表查询参数对象
        queryFile: {
          queryName: '',
          pageNo: 1,
          pageSize: 5,
          checkTag:'1',
          deleteTag:'1'
        },
        fileList: [],
        total: 0,
      }
    },
    methods: {
      //获取角色列表
      getFileList() {
        var params = new URLSearchParams();
        params.append("pageNo", this.queryFile.pageNo);
        params.append("pageSize", this.queryFile.pageSize);
        params.append("productName", this.queryFile.queryName);
        params.append("checkTag", this.queryFile.checkTag);
        params.append("deleteTag", this.queryFile.deleteTag);
        this.axios.post("/files/page", params).then( (resp) =>{
          this.total = resp.data.total;
          this.fileList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取角色列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getFileList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNo = newSize
        this.getFileList()
      },
      //删除
      delFileById(row){
        this.$confirm('将永久删除[' + row.productName + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post("/files/remove/" + row.id).then((response) => {
            if (response.data.result) {
              this.$message.success("删除成功")
              this.queryFile.pageNo = 1;
              this.getFileList();
            }else {
              this.$message.error(response.data.message)
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除")
        });
      }
    },
    created() {
      this.getFileList()
    },
  }
</script>

<style scoped>

</style>
