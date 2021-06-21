<template>
  <div>
    <!--   搜索 品生产工序列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form :inline="true">
            <el-form-item label="姓名">
              <el-input placeholder="请输入产品名称" clearable @clear="getDesignProcedureList"
                        v-model="queryDesignProcedure.productName"></el-input>
            </el-form-item>
            <el-form-item label="建档时间">
              <el-date-picker @change="change"
                              v-model="queryDesignProcedure.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
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
      <el-row :gutter="20" style="margin-bottom: 20px;margin-top: -40px">

        <el-col :span="16" :offset="20">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-check" type="primary" @click="checkDesignModuleTag">提  交</el-button>
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
          <div><strong>产品编号: </strong> {{designProcedure.productId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品名称: </strong> {{designProcedure.productName}}</div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!-- 内容主体 -->
      <!-- 产品工序组成 -->
      <el-table :data="designProcedureDetails" :row-class-name="tableRowClassName" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="procedureName" label="工序名称"></el-table-column>
        <el-table-column prop="procedureId" label="工序编号"></el-table-column>
        <el-table-column prop="procedureDescribe" label="描述"></el-table-column>
        <el-table-column prop="labourHourAmount" label="公时数(小时)"></el-table-column>
        <el-table-column prop="subtotal" label="公时成本小计(元)"></el-table-column>
        <el-table-column prop="moduleSubtotal" label="物料成本小计(元)"></el-table-column>
        <el-table-column label="设计">
          <template slot-scope="scope">
            <el-button v-if="scope.row.designModuleTag == 0"
                       type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showModuleDetails(scope.row)"
            >设计
            </el-button>
            <el-button v-else-if="scope.row.designModuleTag == 1"
                       type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="updateModuleDetails(scope.row)"
            >重新设计
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="5">
          <div><strong>工时总成本: </strong> {{procedureInfo.costPriceSum}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>物料总成本: </strong> {{moduleSubtotal}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>登记人: </strong> {{designProcedure.register}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>建档时间: </strong> {{designProcedure.registerTime}}</div>
        </el-col>
      </el-row>
    </el-dialog>


    <!-- 设计-->
    <el-dialog title="工序物料设计单" :visible.sync="moduleDialogVisible" width="80%" @close="moduleDialogClosed">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="17" :offset="19">
          <div v-if="addViewShow==true">
            <el-button icon="el-icon-check" type="primary" @click="addModuleDetail">确 定</el-button>
            <el-button icon="el-icon-back"  type="primary" @click="addViewShow=false">返 回</el-button>
          </div>
          <div v-if="addViewShow==false">
            <el-button icon="el-icon-view" type="primary" @click="checkAddDetail">预 览</el-button>
          </div>
        </el-col>
        <el-col :span="5">
          <div><strong>设计单编号: </strong> {{procedureInfo.designId}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>设计人: </strong> {{procedureInfo.designer}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品编号: </strong> {{designProcedure.productId}}</div>
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
      <el-table :data="moduleDetailsList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="序号" width="80px"></el-table-column>
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column prop="productDescribe" label="描述"></el-table-column>
        <el-table-column prop="amount" label="数量" width="80px"></el-table-column>
        <el-table-column prop="residualAmount" label="可用数量" width="80px"></el-table-column>
        <el-table-column prop="amountUnit" label="单位" width="100px"></el-table-column>
        <el-table-column prop="costPrice" label="单价(元)"></el-table-column>
        <el-table-column label="小计(元)" prop="subtotal">
          <template slot-scope="scope">
            {{scope.row.amount*scope.row.costPrice}}
          </template>
        </el-table-column>
        <el-table-column label="本工序数量" v-if="addViewShow==false">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.amount" :max="10" :min="1"
                      onkeyup="this.value = this.value.replace(/[^\d.]/g,'')" style="width: 130px"></el-input>
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
        // 获取品生产工序列表查询参数对象
        queryDesignProcedure: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          checkTag: "1",
          designModuleTag: "0",
          dataTime: ''
        },
        total: 0,
        designProcedureList: [],

        addDialogVisible:false,
        viewShow:1,
        addViewShow:false,

        procedureInfo:{},
        designProcedure: {},

        designProcedureDetails: [],

        proDetail:{},
        moduleDialogVisible:false,
        moduleDetailsList:[],

      }
    },
    methods: {
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
      getDesignProcedureList() {
        var params = new URLSearchParams();
        if (this.queryDesignProcedure.dataTime) {
          params.append("registerTime", this.getDataTime(this.queryDesignProcedure.dataTime[0]))
          params.append("registerTime2", this.getDataTime(this.queryDesignProcedure.dataTime[1]))
        }
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
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getDesignProcedureList();
      },
      //制定设计单
      showAddDialog(row) {
        this.procedureInfo = row;
        this.productId = row.productId;
        this.getProcedureDetailsByPId(row.id);
        this.addDialogVisible = true;
      },
      //获取产品生产工序明细(m_design_procedure_details)
      getProcedureDetailsByPId(id) {
        this.axios.post("/designProcedure/designProcedureDetailsByPId/" + id).then((resp) => {
          this.designProcedure = resp.data.designProcedure;
          this.designProcedureDetails = resp.data.designProcedureDetails;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败!')
        })
      },
      // 给每条数据添加一个索引
      tableRowClassName(row, index) {
        row.row.index = row.rowIndex
      },
      // 监听 添加设计单对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.viewShow =1;
          this.addViewShow = false;
          this.addDialogVisible = false
        })
      },
      //点击设计
      showModuleDetails(row) {
        this.proDetail = row;
        this.getDesignList();
        this.moduleDialogVisible = true;
      },
      //获取产品物料
      getDesignList() {
        var params = new URLSearchParams();
        params.append("productId", this.productId);
        this.axios.post("/moduleDetails/selectByProductId", params).then((resp) => {
          this.moduleDetailsList = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      // 监听 添加设计单对话框的关闭事件
      moduleDialogClosed() {
        this.getProcedureDetailsByPId(this.procedureInfo.id);
        this.$nextTick(() => {
          this.addViewShow = false;
          this.moduleDialogVisible = false;
        })
      },
      //预览
      checkAddDetail(){
        var bool = true;
        this.moduleDetailsList.forEach((item) => {
          if (item.residualAmount < item.amount){
            this.$message.error("超出可用数量范围");
            bool = false;
          }
        })
        if (bool == true){
          this.addViewShow=true
        }
      },
      //工序添加物料
      addModuleDetail() {
        this.moduleDetailsList.forEach((item) => {
          item.parentId = this.proDetail.id;
          item.subtotal = item.amount * item.costPrice;
        })
        this.axios.post("/designProcedureModule/addDesignProcedureModule", JSON.stringify(this.moduleDetailsList),
          {headers: {"Content-Type": "application/json"}}).then((response) => {
          if (response.data.result == true) {
            this.getProcedureDetailsByPId(this.procedureInfo.id);
            this.$message.success('操作成功!');
          }
        }).catch(function (error) {
          return this.$message.error('操作失败！')
        })
        this.addViewShow=false;
        this.moduleDialogClosed();
      },
      //打开重新设计
      updateModuleDetails(row) {
        this.proDetail = row;
        this.axios.post("/designProcedureModule/updateByPId/" + row.id).then((resp) => {
        if (resp.data==true){
          this.getDesignList();
          this.moduleDialogVisible = true;
        }
        }).catch(function (error) {
          return this.$message.error('获取物料信息失败！')
        })
      },

      //提交
      checkDesignModuleTag(){
        var bool = true;
        this.getDesignList();
        console.log(this.moduleDetailsList)
        this.moduleDetailsList.forEach((item)=>{
          if (item.residualAmount!=0){
            this.$message.error("对不起，尚有可用物料，请您仔细检查工序物料设计！");
            bool = false;
          }
        })
        if (bool == true){
          this.axios.post("/designProcedure/checkDesignModuleTag/" + this.procedureInfo.id).then((resp) => {
            if (resp.data==true){
              this.getDesignProcedureList();
              this.addDialogClosed();
              this.$message.success('操作成功，待审核！')
            }
          }).catch(function (error) {
            return this.$message.error('获取物料信息失败！')
          })
        }
      }
    },
    created() {
      this.getDesignProcedureList();
    },
    computed:{
      moduleSubtotal(){
        var sum =0;
        this.designProcedureDetails.forEach( (item) =>{
          sum+= item.moduleSubtotal;
        })
        return sum;
      }
    },
  }
</script>

<style scoped>
  .el-input, .textarea, .el-select {
    width: 180px;
  }
</style>
