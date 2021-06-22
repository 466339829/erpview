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
              type="info" icon="el-icon-message"
              size="mini"
              @click="showCheckDialog(scope.row)"
            >登记
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
      <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
               style="margin-top: -10px">
        <el-row :gutter="20" >
          <el-col :span="5">
            <div><strong>派工单编号: </strong> {{manufacture.manufactureId}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>产品编号: </strong> {{manufacture.productId}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>产品编号: </strong> {{manufacture.productName}}</div>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <div><strong>数量: </strong> {{manufacture.amount}}</div>
          </el-col>
          <el-col :span="5">
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
          <el-table-column label="工序登记">
            <template slot-scope="scope">
              <el-button
                type="info" icon="el-icon-message"
                size="mini"
                @click="showProcedureModuleDialog(scope.row)"
              >登记
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <el-row :gutter="20">
          <el-col :span="5">
            <div><strong>工时总成本: </strong> {{manufacture.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>物料总成本: </strong> {{manufacture.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>登记人: </strong> {{manufacture.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>登记时间: </strong> {{manufacture.registerTime}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="20">
            <el-form-item label="审核人" prop="checker">
              <el-input clearable v-model="ruleForm.checker"></el-input>
            </el-form-item>
            <el-form-item label="审核时间" prop="checkTime">
              <el-date-picker v-model="ruleForm.checkTime" type="datetime" readonly class="input-class">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" clearable type="textarea" style="width: 280px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
    </el-dialog>

    <el-dialog title="工序物料单" :visible.sync="procedureModuleDialogVisible" width="90%" @close="procedureModuleDialogClosed">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="5">
          <div><strong>派工单单编号: </strong> {{manufacture.manufactureId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>工序名称: </strong> {{procedure.procedureName}}</div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!-- 产品工序组成 -->
      <el-table :data="procedureModuleList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="序号" width="80px"></el-table-column>
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
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
    name: "AddTagManufacture",
    data() {
      return {
        rules: {
          check: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          checker: [
            {required: true, message: '请输入审核人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ]
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
        },
        total: 0,
        applyList: [],
        manufactureList: [],
        manufacture: {},

        checkDialogVisible: false,
        procedureList: [],

        ruleForm: {
          remark: '',
          checkTime: '',
          checker: '',
          check: ''
        },
        procedure:{},
        procedureModuleDialogVisible:false,

        procedureModuleList:[],

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
        this.axios.post("/procedure/selectByPid/"+row.id).then((resp) => {
          this.procedureList = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        setInterval(() => {
          this.getData();
        }, 1000)
        this.checkDialogVisible = true;
      },
      getData() {//默认显示今天
        var date = new Date();
        var nian = date.getFullYear();
        var yue = date.getMonth() + 1;
        var ri = date.getDate();
        var shi = date.getHours();
        var fen = date.getMinutes();
        var miao = date.getSeconds();
        if (yue < 10) yue = "0" + yue;
        if (ri < 10) ri = "0" + ri;
        if (miao < 10) miao = "0" + miao;
        if (fen < 10) fen = "0" + fen;
        if (shi < 10) shi = "0" + shi;
        this.ruleForm.checkTime = nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
      },
      // 监听 复核话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
          this.checkDialogVisible = false;
        })
      },
      showProcedureModuleDialog(row){
        this.procedure = row;
        this.axios.post("/procedureModule/selectByPid/"+row.id).then((resp) => {
          this.procedureModuleList = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        this.procedureModuleDialogVisible = true;
      },
      // 监听 添加设计单对话框的关闭事件
      procedureModuleDialogClosed() {
        this.$nextTick(() => {
          this.procedureModuleDialogVisible = false;
        })
      },
      submitForm(formName) {
        var checked = this.ruleForm.check;
        if (!checked) {
          this.$message.error("请选择")
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            params.append("id", this.manufacture.id)
            params.append("checkTime",this.ruleForm.checkTime)
            params.append("checker",this.ruleForm.checker)
            params.append("remark",this.ruleForm.remark)
            if (checked == 2) {
              this.$confirm('不通过[' + this.manufacture.productName + ']生产派工单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                params.append("checkTag","2")
                this.axios.post("/manufacture/checkTag",params).then((response) => {
                  if (response.data.result) {
                    this.$message.success("操作成功")
                    this.queryManufacture.pageNo = 1;
                    this.getManufactureList();
                    this.checkDialogVisible = false;
                  } else {
                    this.$message.error("操作失败")
                  }
                })
              }).catch(() => {
                this.$message.info("已取消不通过")
              });
            }
            if (checked == 1) {
              this.$confirm('通过[' + this.manufacture.productName + ']生产派工单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                params.append("checkTag","1")
                this.axios.post("/manufacture/checkTag", params).then((response) => {
                  if (response.data.result) {
                    this.$message.success("操作成功")
                    this.queryManufacture.pageNo = 1;
                    this.getManufactureList();
                    this.checkDialogVisible = false;
                  } else {
                    this.$message.error("操作失败")
                  }
                })
              }).catch(() => {
                this.$message.info("已取消通过")
              });
            }
          } else {
            return false;
          }
        });
      },
    },
    created() {
      this.getManufactureList();
    },

  }
</script>

<style scoped>

</style>
