<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-form :inline="true">

            <el-form-item label="派工单编号">
              <el-input placeholder="请输入派工单编号" clearable @clear="getManufactureList"
                        v-model="queryManufacture.manufactureId"></el-input>
            </el-form-item>

            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getManufactureList"
                        v-model="queryManufacture.productName"></el-input>
            </el-form-item>

            <el-form-item label="登记时间">
              <el-date-picker @change="change"
                              v-model="queryManufacture.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getManufactureList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="manufactureList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="manufactureId" label="派工单编号"></el-table-column>
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="amount" label="数量" width="95px"></el-table-column>
        <el-table-column label="登记时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size="mini"
              @click="showCheckDialog(scope.row)"
            >审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryManufacture.pageNo"
                     :page-sizes="[7, 10, 15, 20]"
                     :page-size="queryManufacture.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="生产派工单" :visible.sync="checkDialogVisible" width="80%" @close="checkDialogClosed">
      <el-row :gutter="20">
        <el-col :span="5">
          <div><strong>派工单编号: </strong> {{manufacture.manufactureId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品编号: </strong> {{manufacture.productId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品编号: </strong> {{manufacture.productName}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>数量: </strong> {{manufacture.amount}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>工单制定人: </strong> {{manufacture.designer}}</div>
        </el-col>
      </el-row>

      <!-- 内容主体 -->
      <el-divider></el-divider>
      <!-- 产品物料组成 -->
      <el-table :data="procedureList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="procedureName" label="工序名称"></el-table-column>
        <el-table-column prop="labourHourAmount" label="设计工时数"></el-table-column>
        <el-table-column prop="realLabourHourAmount" label="实际工时数"></el-table-column>
        <el-table-column prop="subtotal" label="设计工时成本(元)"></el-table-column>
        <el-table-column prop="realSubtotal" label="实际工时成本(元)"></el-table-column>
        <el-table-column prop="moduleSubtotal" label="设计物料成本(元)"></el-table-column>
        <el-table-column prop="realModuleSubtotal" label="实际物料成本(元)"></el-table-column>
        <el-table-column label="登记复核">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-star-off" size="mini" v-if="scope.row.procedureFinishTag==2 || scope.row.procedureFinishTag==1"
                       @click="selectByPid(scope.row)"
            >审核
            </el-button>
            <a v-else-if="scope.row.procedureFinishTag==0">未登记</a>
            <a v-else-if="scope.row.procedureFinishTag==3">完成</a>
          </template>
        </el-table-column>
        <el-table-column label="交接复核">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-message" size="mini"
                       v-if="scope.row.procedureFinishTag==3 &&scope.row.procedureTransferTag==1"
                       @click="showTransferTagDialog(scope.row)"
            >交接复核
            </el-button>
            <a v-else-if="scope.row.procedureTransferTag==0">待登记</a>
            <a v-else-if="scope.row.procedureTransferTag==2">完成</a>
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>

      <el-row :gutter="20">
        <el-col :span="5">
          <div><strong>设计工时成本: </strong> {{subtotal}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>设计物料成本: </strong> {{moduleSubtotal}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>实际工时成本: </strong> {{realSubtotal}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>实际物料成本: </strong> {{realModuleSubtotal}}</div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>登记人: </strong> {{manufacture.register}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>登记时间: </strong> {{manufacture.registerTime}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>审核人: </strong> {{manufacture.checker}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>审核时间: </strong> {{manufacture.checkTime}}</div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>备注: </strong> {{manufacture.remark}}</div>
        </el-col>
      </el-row>

      <el-divider></el-divider>
    </el-dialog>

    <el-dialog title="生产登记单" :visible.sync="procedureModuleDialogVisible" width="80%"
               @close="procedureModuleDialogClosed">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="5">
          <div><strong>派工单单编号: </strong> {{manufacture.manufactureId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>工序名称: </strong> {{procedure.procedureName}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>负责人: </strong> {{proceduring.procedurePesponsiblePerson}}</div>
        </el-col>
        <el-col :span="5" :offset="4">
          <el-button type="warning" icon="el-icon-star-off"
                     @click="check('proceduringForm')">通过复核
          </el-button>
          <el-button icon="el-icon-circle-close" type="primary"
                     @click="procedureModuleDialogVisible = false">返 回
          </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="5">
          <div><strong>设计工时数: </strong> {{procedure.labourHourAmount}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>已用工时数: </strong> {{procedure.realLabourHourAmount}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>本次工时数: </strong> {{proceduring.labourHourAmount}}</div>
        </el-col>
      </el-row>

      <el-form :model="proceduringForm" ref="proceduringForm" label-width="100px"
               :rules="proceduringFormRules">
        <el-divider></el-divider>
        <!-- 产品工序组成 -->
        <el-table :data="procedureModuleList" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column prop="productId" label="物料编号"></el-table-column>
          <el-table-column prop="productName" label="物料名称"></el-table-column>
          <el-table-column prop="amount" label="设计数量"></el-table-column>
          <el-table-column prop="renewAmount" label="补充数量"></el-table-column>
          <el-table-column prop="realAmount" label="已使用数量"></el-table-column>

          <el-table-column prop="shuliang" label="本次数量"></el-table-column>
        </el-table>
        <el-divider></el-divider>

        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="审核人" prop="checker">
              <el-input clearable v-model="proceduringForm.checker"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核时间" prop="checkTime">
              <el-date-picker
                v-model="proceduringForm.checkTime" readonly
                type="datetime" class="input-class" style="width: 200px">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
    </el-dialog>


    <el-dialog :title="procedureName | title" :visible.sync="transferTagVisible" width="30%"
               :close-on-click-modal="false" @close="checkTransferTagClosed">
      <el-form :inline="true" label-width="150px">
        <span>本工序合投产数量:{{procedure.demandAmount}}</span>
        <el-form-item label="本工序合格品数量" prop="realAmount">
          <el-input v-model.number="procedure.realAmount"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="checkTransferTag">确 定</el-button>
      <el-button type="primary" @click="checkTransferTagClosed">返 回</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "CheckTagManufacture",
    data() {
      return {
        proceduringFormRules: {
          checker: [
            {required: true, message: '请输入审核人', trigger: 'blur'},
            {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'},
          ],
        },
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
        queryManufacture: {
          pageNo: 1,
          pageSize: 7,
          manufactureId: '',
          productName: '',
          dataTime: '',
          checkTag: '1',
          manufactureProcedureTag: "1"
        },
        total: 0,
        manufactureList: [],

        manufacture: {},
        procedureList: [],

        checkDialogVisible: false,
        procedure: {},
        procedureModuleDialogVisible: false,
        procedureModuleList: [],

        proceduringForm: {
          checker: window.sessionStorage.getItem('loginId'),
          checkTime: '',
        },
        proceduring:{},

        transferTagVisible:false,
        procedureName:''
      }
    },
    methods: {
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getManufactureList();
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
      //获取产品列表
      getManufactureList() {
        var params = new URLSearchParams();
        if (this.queryManufacture.dataTime) {
          params.append("registerTime", this.getDataTime(this.queryManufacture.dataTime[0]))
          params.append("registerTime2", this.getDataTime(this.queryManufacture.dataTime[1]))
        }
        Object.keys(this.queryManufacture).forEach((key) => {
          params.append(key, this.queryManufacture[key])
        });
        this.axios.post("/manufacture/page", params).then((resp) => {
          this.total = resp.data.total;
          this.manufactureList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取生产总表列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryManufacture.pageSize = newSize
        this.getManufactureList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryManufacture.pageNo = newSize
        this.getManufactureList()
      },
      //审核
      showCheckDialog(row) {
        this.manufacture = row;
        this.procedureSelectByPid(this.manufacture.id);
      },
      procedureSelectByPid(id) {
        this.axios.post("/procedure/selectByPid/" + id).then((resp) => {
          this.procedureList = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        this.checkDialogVisible = true;
      },
      // 监听 复核话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.checkDialogVisible = false;
        })
      },
      selectByPid(row) {
        this.procedure = row;
        this.axios.post("/procedureModule/selectShuLiang/" + row.id).then((resp) => {
          console.log(resp.data)
          this.procedureModuleList = resp.data.list;
          this.proceduring = resp.data.proceduring;
        }).catch(function (error) {
          return this.$message.error('获取信息失败！')
        })
        setInterval(() => {
          this.proceduringForm.checkTime = this.getDataTime(new Date());
        }, 1000)
        this.procedureModuleDialogVisible = true;
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
      // 监听 添加设计单对话框的关闭事件
      procedureModuleDialogClosed() {
        this.$nextTick(() => {
          this.$refs.proceduringForm.resetFields();
          this.procedureModuleDialogVisible = false;
        })
      },
      check(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.procedureModuleList.forEach((item)=>{
              item.checker = this.proceduringForm.checker;
              item.checkTime = this.proceduringForm.checkTime;
              item.proceduringId = this.proceduring.id;
              item.labourHourAmount = this.proceduring.labourHourAmount;
            })
            this.axios.post("/procedureModule/checkProcedureFinish", JSON.stringify(this.procedureModuleList),
              {headers: {"Content-Type": "application/json"}}).then((response) => {
              if (response.data.result == true) {
                this.$message.success('操作成功!');
                this.procedureSelectByPid(this.manufacture.id);
                this.procedureModuleDialogClosed();
              }
            }).catch(function (error) {
              return this.$message.error('操作失败！')
            })
          }
        })
      },
      //交接登记框
      showTransferTagDialog(row){
        this.procedure = row;
        this.procedureName = row.procedureName;
        this.transferTagVisible = true;
      },
      // 监听 复核角色对话框的关闭事件
      checkTransferTagClosed() {
        this.$nextTick(() => {
          this.transferTagVisible = false
        })
      },
      checkTransferTag(){
        this.axios.post("/procedure/checkTransferTag/"+this.procedure.id).then((response) => {
          if (response.data) {
            this.$message.success("交接登记成功");
            this.procedureSelectByPid(this.manufacture.id);
            this.checkTransferTagClosed();
          }
        }).catch(function (error) {
          alert("服务端获取数据失败");
        })
      }
    },
    created() {
      this.getManufactureList();
    },
    filters: {
      title(val) {
        return "交接登记复核【" + val + "】";
      },
    },
    computed:{
      moduleSubtotal(){
        var sum =0;
        this.procedureList.forEach( (item) =>{
          sum+= item.moduleSubtotal;
        })
        return sum;
      },
      subtotal(){
        var sum =0;
        this.procedureList.forEach( (item) =>{
          sum+= item.subtotal;
        })
        return sum;
      },
      realModuleSubtotal(){
        var sum =0;
        this.procedureList.forEach( (item) =>{
          sum+= item.realModuleSubtotal;
        })
        return sum;
      },
      realSubtotal(){
        var sum =0;
        this.procedureList.forEach( (item) =>{
          sum+= item.realSubtotal;
        })
        return sum;
      }
    },
  }
</script>

<style scoped>

</style>
