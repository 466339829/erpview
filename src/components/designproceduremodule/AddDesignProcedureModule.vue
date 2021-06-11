<template>
  <div>
    <!--   搜索 品生产工序列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form :inline="true">
            <el-form-item label="姓名">
              <el-input placeholder="请输入产品名称" clearable @clear="getDesignProcedureList"
                        v-model="queryDesignProcedure.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getDesignProcedureList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 品生产工序列表区域 -->
      <el-table :data="designProcedureList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="designId" label="工序设计单编号"></el-table-column>
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="costPriceSum" label="工时总成本" width="100px"></el-table-column>
        <el-table-column prop="designer" label="设计人" width="100px"></el-table-column>
        <el-table-column label="登记时间">
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
              @click="showAddDialog(scope.row)"
            >制定设计单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryDesignProcedure.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryDesignProcedure.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加设计单的对话框 -->
    <el-dialog title="工序物料设计单" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">
      <el-row :gutter="20" style="margin-bottom: 20px;margin-top: -40px" >

        <el-col :span="16" :offset="20">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-check" type="primary" @click="addDesignProcedureModule">提  交</el-button>
                </span>
          </div>
        </el-col>

        <el-col :span="5">
          <div><strong>设计单编号: </strong> {{procedureInfo.designId}}</div>
        </el-col>
        <el-col :span="4">
            <div><strong>设计人: </strong> {{procedureInfo.designer}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品编号: </strong>  {{designProcedure.productId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品名称: </strong> {{designProcedure.productName}}</div>
        </el-col>
      </el-row>
      <!-- 内容主体 -->
      <!-- 产品工序组成 -->
      <el-table :data="designProcedureDetails" :row-class-name="tableRowClassName"  border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="procedureName" label="工序名称"></el-table-column>
        <el-table-column prop="procedureId" label="工序编号"></el-table-column>
        <el-table-column prop="procedureDescribe" label="描述"></el-table-column>
        <el-table-column prop="labourHourAmount" label="公时数(小时)"></el-table-column>
        <el-table-column prop="subtotal" label="公时成本小计(元)"></el-table-column>
        <el-table-column prop="moduleSubtotal" label="物料成本小计(元)"></el-table-column>
        <el-table-column label="设计" >
          <template slot-scope="scope">
            <el-button v-if="scope.row.moduleDetails == null"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showModuleDetails(scope.row)"
            >设计
            </el-button>
            <el-button v-else
                       type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="updateModuleDetails(scope.row)"
            >重新设计
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row :gutter="20" style="margin-top: 20px" >
        <el-col :span="5">
          <div><strong>工时总成本: </strong> {{procedureInfo.costPriceSum}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>物料总成本: </strong> {{procedureInfo.moduleCostPriceSum}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>登记人: </strong>  {{designProcedure.register}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>建档时间: </strong> {{designProcedure.registerTime}}</div>
        </el-col>
      </el-row>


    </el-dialog>

    <!-- 添加设计单的对话框 -->
    <el-dialog title="工序物料设计单" :visible.sync="moduleDialogVisible" width="80%" @close="moduleDialogClosed">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="16" :offset="20">
          <div>
            <el-button icon="el-icon-check" type="primary" @click="AddModuleDetail">确 定</el-button>
          </div>
        </el-col>
        <el-col :span="5">
          <div><strong>设计单编号: </strong> {{procedureInfo.designId}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>设计人: </strong> {{procedureInfo.designer}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品编号: </strong>  {{designProcedure.productId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品名称: </strong> {{designProcedure.productName}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>工序名称: </strong> {{proDetail.procedureName}}</div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!-- 产品工序组成 -->
      <el-table :data="moduleDetailsList"  border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="序号" width="80px"></el-table-column>
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column prop="productDescribe" label="描述"></el-table-column>
        <el-table-column prop="amount" label="数量" width="80px"></el-table-column>
        <el-table-column prop="residualAmount" label="可用数量" width="80px"></el-table-column>
        <el-table-column prop="amountUnit" label="单位" width="100px"></el-table-column>
        <el-table-column prop="costPrice" label="单价(元)" ></el-table-column>
        <el-table-column label="本工序数量" >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.amount"
                      min="1"  style="width: 80px" ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AddDesignProcedureModule",
    data() {
      return {
        fileId: '',
        ProductId: '',
        // 获取品生产工序列表查询参数对象
        queryDesignProcedure: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          CheckTag: "1",
          designModuleTag:"0"
        },
        designProcedureList: [],
        total: 0,

        addDialogVisible: false,
        designProcedure: {},
        designProcedureDetails: [],

        moduleDialogVisible:false,
        moduleDetailsList:[],
        moduleDetailsList2:[],
        moduleDetailsList3:[],
        addModuleDetailList:[],

        procedureInfo:{},
        proDetail:{},
        index:'',
      }
    },
    methods: {
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      // 监听 添加设计单对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.addDialogVisible = false
        })
      },
      //获取品生产工序列表
      getDesignProcedureList() {
        var params = new URLSearchParams();
        Object.keys(this.queryDesignProcedure).forEach((key) => {
          params.append(key, this.queryDesignProcedure[key])
        })
        this.axios.post("/designProcedure/page", params).then((resp) => {
          this.total = resp.data.total;
          this.designProcedureList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取品生产工序列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryDesignProcedure.pageSize = newSize
        this.getDesignProcedureList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryDesignProcedure.pageNo = newSize
        this.getDesignProcedureList()
      },
      //获取产品生产工序明细(m_design_procedure_details)
      showAddDialog(row) {
        this.procedureInfo = row;
        this.fileId = row.id;
        this.productId = row.productId;
        this.addDialogVisible = true;
        this.axios.post("/designProcedure/designProcedureDetailsByPId/" + row.id).then((resp) => {
          this.designProcedure = resp.data.designProcedure;
          this.designProcedureDetails = resp.data.designProcedureDetails;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
        this.getModuleDetails();
      },
      //获取产品物料
      getModuleDetails(){
        var params = new URLSearchParams();
        params.append("productId", this.productId)
        this.axios.post("/moduleDetails/selectByProductId", params).then((resp) => {
          this.moduleDetailsList2=resp.data;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      //点击设计
      showModuleDetails(row) {
        this.proDetail = row;
        this.index = row.index;
        this.moduleDetailsList = this.moduleDetailsList2;
        this.moduleDialogVisible=true;
      },
      // 监听 添加设计单对话框的关闭事件
      moduleDialogClosed() {
        this.$nextTick(() => {
          this.moduleDialogVisible = false;
        })
      },
      //工序添加物料
      AddModuleDetail(){
        //添加当前工序所需物料
        this.designProcedureDetails[this.index].moduleDetails = this.moduleDetailsList;
        /*this.moduleDetailsList.forEach((item)=>{
          item.residualAmount = (item.residualAmount - item.amount);
          item.amount = item.residualAmount;
        })*/
        this.moduleDialogClosed();
      },
      updateModuleDetails(row){
        this.moduleDetailsList = row.moduleDetails ;
        this.moduleDialogVisible=true;
      },
      //添加
      addDesignProcedureModule(){
        var bool = true;
        var designProcedureModuleList =[];
        this.designProcedureDetails.forEach((item)=>{
          if (item.moduleDetails==null){
            this.$message.error("请设计工序物料");
            bool = false;
            return false;
          }else {
            item.moduleDetails.forEach((i)=>{
              item.parentId=item.id;
              designProcedureModuleList.push(i)
            })
          }
        })
        if (bool){
          this.axios.post("/designProcedureModule/addDesignProcedureModule", JSON.stringify(designProcedureModuleList),
            {headers: {"Content-Type": "application/json"}}).then((response) => {
            if (response.data.result == true) {
              this.getDesignProcedureList();
              this.addDialogVisible = false;
              this.$message.success('操作成功,等待审核!');
            }
          }).catch(function (error) {
            return this.$message.error('操作失败！')
          })
        }
      }
    },
    created() {
      this.getDesignProcedureList()
    }
  }
</script>

<style scoped>
  .el-input, .textarea, .el-select {
    width: 180px;
  }
</style>
