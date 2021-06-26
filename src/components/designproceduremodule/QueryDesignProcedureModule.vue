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
        <el-table-column  label="设计单状态" >
          <template slot-scope="scope">
            {{ scope.row.designModuleTag | newTag  }}
          </template>
        </el-table-column>
        <el-table-column  label="审核状态" >
          <template slot-scope="scope">
            {{ scope.row.checkTag | newTitle  }}
          </template>
        </el-table-column>
        <el-table-column label="登记时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-view"
              size="mini"
              @click="showAddDialog(scope.row)"
            >查看
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
    <el-dialog title="工序物料设计单" :visible.sync="addDialogVisible" width="90%" @close="addDialogClosed">

      <el-row :gutter="20" style="margin-bottom: 20px;margin-top: -20px;margin-left: 30px">
        <el-col :span="5">
          <div><strong>设计单编号: </strong> {{procedureInfo.designId}}</div>
        </el-col>
        <el-col :span="3">
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
      <!--&lt;!&ndash; 内容主体 &ndash;&gt;
      &lt;!&ndash; 产品工序组成 &ndash;&gt;-->
      <el-table :data="designProcedureDetails" :row-class-name="tableRowClassName" border stripe>
        <!--  &lt;!&ndash; stripe: 斑马条纹 border：边框&ndash;&gt;-->
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="procedureName" label="工序名称"></el-table-column>
        <el-table-column prop="procedureId" label="工序编号"></el-table-column>
        <el-table-column prop="procedureDescribe" label="描述"></el-table-column>
        <el-table-column prop="labourHourAmount" label="公时数(小时)"></el-table-column>
        <el-table-column prop="subtotal" label="公时成本小计(元)"></el-table-column>
        <el-table-column prop="moduleSubtotal" label="物料成本小计(元)"></el-table-column>
        <el-table-column label="设计">
          <template slot-scope="scope">
            <el-button v-if="scope.row.moduleDetails == null"
                       type="warning"
                       icon="el-icon-star-off"
                       size="mini"
                       @click="showModuleDetails(scope.row)"
            >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="20" style="margin-top: 20px;margin-left:30px">
        <el-col :span="5">
          <div><strong>工时总成本: </strong> {{subtotal}}</div>
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
      <br>

      <el-row :gutter="20" style="margin-left:30px">
        <el-col :span="5">
          <div><strong>审核人: </strong> {{procedureInfo.checker}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>审核时间: </strong> {{procedureInfo.checkTime}}</div>
        </el-col><br><br>
        <el-col :span="4">
          <div><strong>审核意见: </strong> {{designProcedure.checkSuggestion}}</div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </el-dialog>

    <!-- 添加设计单的对话框 -->
    <el-dialog title="工序物料设计单" :visible.sync="moduleDialogVisible" width="90%" @close="moduleDialogClosed">
      <el-row :gutter="20" style="margin-top: -20px">
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
        <el-table-column prop="amount" label="本工序数量"></el-table-column>
        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column prop="costPrice" label="单价(元)"></el-table-column>
        <el-table-column label="小计(元)">
          <template slot-scope="scope">
            {{scope.row.amount*scope.row.costPrice}}
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "QueryDesignProcedureModule",
    data() {
      return {
        // 获取品生产工序列表查询参数对象
        queryDesignProcedure: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          /*CheckTag: 0,
          designModuleTag: 1*/
        },
        designProcedureList: [],
        total: 0,

        addDialogVisible: false,
        designProcedure: {},
        designProcedureDetails: [],
        moduleDetailsList: [],

        moduleDialogVisible: false,
        procedureInfo: {},
        proDetail: {},
        fileId: '',

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
      },
      //点击设计
      showModuleDetails(row) {
        this.proDetail = row;
        this.index = row.index;
        this.axios.post("/designProcedureModule/selectByPId/" + row.id).then((resp) => {
          this.moduleDetailsList = resp.data
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        this.moduleDialogVisible = true;
      },
      // 监听 添加设计单对话框的关闭事件
      moduleDialogClosed() {
        this.$nextTick(() => {
          this.moduleDialogVisible = false;
        })
      },
    },
    created() {
      this.getDesignProcedureList()
    },
    filters: {   //过滤器
      newTitle(val) {
        if (val==0)
          return "等待";
        else if(val==1)
          return "通过";
        else
          return "不通过";
      },
      newTag(val) {
        if (val==0)
          return "未设计";
        else if(val==1)
          return "已提交";
        else
          return "已审核";
      }
    },
    computed:{
      moduleSubtotal(){
        var sum =0;
        this.designProcedureDetails.forEach( (item) =>{
          sum+= item.moduleSubtotal;
        })
        return sum;
      },
      subtotal(){
        var sum =0;
        this.designProcedureDetails.forEach( (item) =>{
          sum+= item.subtotal;
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
