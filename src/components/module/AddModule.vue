<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getFileList" v-model="queryFile.productName"></el-input>
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
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAddDialog(scope.row.id)"
            >制定设计单
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

    <!-- 添加设计单的对话框 -->
    <el-dialog title="物料组成设计单" :visible.sync="addDialogVisible" width="85%" @close="addDialogClosed">
      <el-row :gutter="20">
        <el-col :span="16" :offset="12">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="AddModuleDetails">添加物料</el-button>
                 <el-button icon="el-icon-remove-outline" type="info" @click="getSelected">删除物料</el-button>
                      <el-button icon="el-icon-check" type="primary" @click="addModuleDetails('addModuleForm')">提  交</el-button>

                <el-button icon="el-icon-circle-close" type="danger" @click="addDialogClosed">取消</el-button>
                </span>
          </div>
        </el-col>
      </el-row>

      <!-- 内容主体 -->
      <span ><strong >产品编号: </strong>  {{addModuleForm.productId}}</span>
      <span ><strong>产品名称: </strong>  {{addModuleForm.productName}}</span>
      <el-form
        :model="addModuleForm"
        ref="addModuleForm"
        label-width="100px"
        :rules="addModuleFormRules"
      >
        <el-form-item label="设计人" prop="designer">
          <el-input clearable  v-model="addModuleForm.designer"></el-input>
        </el-form-item>

        <!-- 产品物料组成 -->
        <el-table :data="moduleList"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="productId" label="物料编号"></el-table-column>
          <el-table-column prop="productName" label="物料名称"></el-table-column>
          <el-table-column label="用途类型" width="120px" prop="type" >
            <template slot-scope="scope">
              {{scope.row.type | newTitle}}
            </template>
          </el-table-column>
          <el-table-column prop="productDescribe" label="描述"></el-table-column>

          <el-table-column prop="amount" label="数量"  width="170">
            <template slot-scope="scope">
              <el-input clearable  v-model.number="scope.row.amount" ></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
          <el-table-column label="小计(元)">
            <template slot-scope="scope">
              {{scope.row.amount*scope.row.costPrice}}
            </template>
          </el-table-column>
        </el-table>
        <span><strong>登记人: </strong>  {{addModuleForm.register}}</span>
        <span><strong>建档时间: </strong>  {{addModuleForm.registerTime}}</span>

        <el-form-item label="设计要求" prop="moduleDescribe">
          <el-input v-model="addModuleForm.moduleDescribe" type="textarea" class="xxx" />
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog
      title="添加物料"
      :visible.sync="moduleDialogVisible"
      width="80%">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="AddModuleDetails" v-model="queryModule.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="AddModuleDetails">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="moduleDetailsList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column label="用途类型" width="120px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="productDescribe" label="物料描述"></el-table-column>
        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column prop="costPrice" label="设计成本单价"></el-table-column>
        <el-table-column label="操作"  >
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addModule(scope.row)"
            >添加
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryModule.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryModule.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="moduleTotal"
      ></el-pagination>

      <span slot="footer" class="dialog-footer">
    <el-button @click="moduleDialogVisible = false">返 回</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "AddModule",
    data() {
      return {
        addModuleFormRules: {
          amount: [
            {required: true, message: '请输入数量', trigger: 'blur'},
            {type: 'number', message: '请输入数字值', trigger: 'blur'}
          ]
        },
        moduleDialogVisible:false,
        addDialogVisible: false,
        addModuleForm:{},
        moduleList:[],
        moduleDetailsList:[],
        // 获取产品列表查询参数对象
        queryFile: {
          queryName: '',
          pageNo: 1,
          pageSize: 5,
          checkTag:1,
          deleteTag:0,
          type:1
        },
        queryModule:{
          name: '',
          pageNo: 1,
          pageSize: 5,
          checkTag:1,
          deleteTag:0,
          type:2
        },
        fileList: [],
        total: 0,
        moduleTotal:0,
        multipleSelection: [],
      }
    },
    methods: {
      addModuleDetails(){
        if (this.moduleList.length==0){
          this.$message.error("请至少添加一个物料");
          return;
        }

      },
      // 添加索引
      tableRowClassName(row, index){
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //获取选中结果删除物料
      getSelected() {
        var val = this.multipleSelection;
        if (this.moduleList.length==0){
          this.$message.error("请先添加物料");
          return;
        }
        if (val.length==0){
          this.$message.error("请至少选中一个物料删除");
          return;
        }
        val.forEach((val,index) =>{
          //遍历源数据
          this.moduleList.forEach((v,i)=>{
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if(val.index === v.index){
              this.moduleList.splice(i,1)
            }
          })
        })
        this.$message.success("删除物料成功");
      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击添加物料
      addModule(row){
        var bool = true;
        this.moduleList.forEach((item)=>{
          if (item.productId==row.productId) {
            this.$message.error("请勿重复添加物料")
            bool=false;
          }
        })
        if (bool==true)
        this.moduleList.push(row);
      },
      //查询所有物料
      AddModuleDetails(){
        this.moduleDialogVisible = true;
        var params = new URLSearchParams();
        Object.keys(this.queryModule).forEach((key) => {
          params.append(key, this.queryModule[key])
        });

        this.axios.post("/files/page", params).then( (resp) =>{
          this.moduleTotal = resp.data.total;
          this.moduleDetailsList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      //添加物料打开模态框
      showAddDialog(id){
        this.addDialogVisible = true;
        this.axios.post("/files/selectById/"+id).then( (resp) =>{
          this.addModuleForm = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
      },
      // 监听 添加设计单对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.$refs.addModuleForm.resetFields();
          this.moduleList=[];
          this.addDialogVisible = false
        })
      },
      //获取产品列表
      getFileList() {
        var params = new URLSearchParams();
        Object.keys(this.queryFile).forEach((key) => {
          params.append(key, this.queryFile[key])
        });

        this.axios.post("/files/page", params).then( (resp) =>{
          this.total = resp.data.total;
          this.fileList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
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
  .el-input, .textarea ,.el-select{
    width: 145px;
  }
  .xxx{
    width: 400px;
  }
</style>
