<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="13">
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
      <!-- 产品列表区域 -->
      <el-table :data="fileList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column label="用途类型" width="120px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="firstKindName" label="I级分类" width="120px"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类" width="120px"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类" width="120px"></el-table-column>
        <el-table-column label="建档时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="showCheckDialog(scope.row.id)"
            >复核
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
    <!-- 添加产品的对话框 -->
    <el-dialog title="登记复核" :visible.sync="checkDialogVisible" width="80%" @close="checkDialogClosed">
      <el-row :gutter="20">
        <el-col :span="16" :offset="21">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button type="success" icon="el-icon-star-off"  @click="checkFile(checkFileForm.id)">复核通过</el-button>
                </span>
          </div>
        </el-col>
      </el-row>
      <!-- 内容主体 -->
      <div>
        <label class="document-btn">主信息</label>
      </div>
      <span ><strong >产品编号: </strong>  {{checkFileForm.productId}}</span>
      <span ><strong>产品名称: </strong>  {{checkFileForm.productName}}</span>
      <span ><strong>制造商: </strong>  {{checkFileForm.factoryName}}</span>
      <span ><strong>产品简称: </strong>  {{checkFileForm.productNick}}</span><br/>
      <span ><strong>I级分类: </strong>  {{checkFileForm.firstKindName}}</span>
      <span ><strong>II级分类: </strong>  {{checkFileForm.secondKindName}}</span>
      <span><strong>III级分类: </strong>  {{checkFileForm.thirdKindName}}</span>
      <span><strong>用途类型: </strong>  {{checkFileForm.type}}</span><br/>
      <span><strong>档次级别: </strong>  {{checkFileForm.productClass}}</span>
      <span><strong>计量单位: </strong>  {{checkFileForm.personalUnit}}</span>
      <span><strong>计量值: </strong>  {{checkFileForm.personalValue}}</span>
      <span><strong>市场单价(元): </strong>  {{checkFileForm.listPrice}}</span>
      <span><strong>计划成本单价: </strong>  {{checkFileForm.costPrice}}</span>
        <el-divider></el-divider>
        <div>
          <label class="document-btn">辅助信息</label>
        </div>
      <span><strong>保修期: </strong>  {{checkFileForm.warranty}}</span>
      <span><strong>替代品名称: </strong>  {{checkFileForm.twinName}}</span>
      <span><strong>替代品编号: </strong>  {{checkFileForm.twinId}}</span>
      <span><strong>生命周期(年): </strong>  {{checkFileForm.lifecycle}}</span><br/>
      <span><strong>单位: </strong>  {{checkFileForm.amountUnit}}</span>
      <span><strong>产品经理: </strong>  {{checkFileForm.responsiblePerson}}</span>
      <span><strong>供应商集合: </strong>  {{checkFileForm.providerGroup}}</span>
      <span><strong>产品描述: </strong>  {{checkFileForm.productDescribe}}</span><br/>
      <span><strong>登记人: </strong>  {{checkFileForm.register}}</span>
      <span><strong>建档时间: </strong>  {{checkFileForm.registerTime}}</span>
      <span><strong>产品图片: </strong><img :src=URL+checkFileForm.image width="60px" height="60px"></span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "CheckFile",
    data() {
      return {
        checkFileForm:{
        },
        checker: window.sessionStorage.getItem('loginId'),
        // 获取角色列表查询参数对象
        queryFile: {
          queryName: '',
          pageNo: 1,
          pageSize: 5,
          //审核标志0: 等待1: 通过2: 不通过
          checkTag:0,
          //产品删除标志0: 未删除1: 已删除2永久删除
          deleteTag:0
        },
        fileList: [],
        total: 0,
        checkDialogVisible: false,
        URL:'http://localhost:8080/images/',
      }
    },
    methods: {
      // 监听 复核角色对话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.checkDialogVisible = false
        })
      },

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
        this.queryFile.pageSize = newSize
        this.getFileList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryFile.pageNo = newSize
        this.getFileList()
      },
      //编辑打开模态框
      showCheckDialog(id){
        this.checkDialogVisible = true;
          this.axios.post("/files/selectById/"+id).then( (resp) =>{
            this.checkFileForm = resp.data;
          }).catch(function (error) {
            return this.$message.error('获取角色信息失败！')
          })
      },
      //复核
      checkFile(id) {
        var params = new URLSearchParams();
        params.append("id",id)
        params.append("checker",this.checker)
        this.axios.post("/files/checkTag/",params).then((response) => {
          if (response.data==true) {
            this.$message.success("复核成功")
            this.checkDialogClosed(),
              this.getFileList();
          } else {
            this.$message.success("复核失败")
            this.checkDialogClosed(),
             this.getFileList();
          }
        }).catch(function (error) {
          alert("服务端获取数据失败");
        });

      },
    },
    created() {
      this.getFileList()
    },
    filters: {   //过滤器
      newTitle(val) {
        if (val==1)
          return "商品";
        else if(val==2)
          return "物料";
        else
          return "";
      }
    }
  }
</script>

<style scoped>
  .el-input,.el-select,.textarea {
    width: 200px;
  }
  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    color: black;
    height: 20px;
    padding: 0 5px;
    margin: 5px;
    line-height: 5px;
    font-size: 20px;
  }
</style>
