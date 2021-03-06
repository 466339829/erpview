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
              type="primary" icon="el-icon-message"
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
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
               style="margin-top: -10px">
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
        <el-table :data="procedureList" border stripe :row-class-name="tableRowClassName">
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
              <el-button type="primary" icon="el-icon-message" size="mini" v-if="scope.row.procedureFinishTag==0"
                         @click="showProcedureModuleDialog(scope.row)"
              >登记
              </el-button>
              <a v-else-if="scope.row.procedureFinishTag==2 || scope.row.procedureFinishTag==1">等复核</a>
              <a v-else-if="scope.row.procedureFinishTag==3">完成</a>
            </template>
          </el-table-column>
          <el-table-column label="交接登记">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-message" size="mini"
                         v-if="scope.row.procedureFinishTag==3 && scope.row.procedureTransferTag==0"
                         @click="showTransferTagDialog(scope.row)"
              >交接登记
              </el-button>
              <a v-else-if="scope.row.procedureTransferTag==1">等复核</a>
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
      </el-form>
      <el-divider></el-divider>
    </el-dialog>

    <el-dialog title="生产登记单" :visible.sync="procedureModuleDialogVisible"
               width="80%" @close="procedureModuleDialogClosed" :close-on-click-modal="false">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="5">
          <div><strong>派工单单编号: </strong> {{manufacture.manufactureId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>工序名称: </strong> {{procedure.procedureName}}</div>
        </el-col>
        <el-col :span="5" :offset="9">
          <el-button icon="el-icon-check" type="primary"
                     @click="checkFinishTag('addProceduringForm')">提 交
          </el-button>
          <el-button icon="el-icon-circle-close" type="primary"
                     @click="procedureModuleDialogVisible = false">返 回
          </el-button>
        </el-col>
      </el-row>
      <el-form :model="addProceduringForm" ref="addProceduringForm" label-width="100px"
               :rules="addProceduringFormRules">
        <el-row :gutter="20">
          <el-col :span="5">
            <div><strong>已用工时数: </strong> {{procedure.realLabourHourAmount}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>设计工时数: </strong> {{procedure.labourHourAmount}}</div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 产品工序组成 -->
        <el-table :data="procedureModuleList" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column prop="id" label="序号" width="80px"></el-table-column>
          <el-table-column prop="productId" label="物料编号"></el-table-column>
          <el-table-column prop="productName" label="物料名称"></el-table-column>
          <el-table-column prop="amount" label="设计数量"></el-table-column>
          <el-table-column prop="renewAmount" label="补充数量"></el-table-column>
          <el-table-column prop="realAmount" label="已使用数量"></el-table-column>

          <el-table-column prop="shuliang" label="本次数量">
            <template slot-scope="scope">
              <el-input clearable v-model="scope.row.shuliang"
                        onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>

        <el-row :gutter="20">
         <!-- <el-col :span="5">
            <div><strong>已用工时数: </strong> {{procedure.realLabourHourAmount}}</div>
          </el-col>-->
          <el-col :span="5">
            <el-form-item label="负责人" prop="procedurePesponsiblePerson">
              <el-input clearable v-model="addProceduringForm.procedurePesponsiblePerson"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="本次工时数" prop="labourHourAmount">
              <el-input clearable v-model.number="addProceduringForm.labourHourAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="登记人" prop="register">
              <el-input clearable v-model="addProceduringForm.register"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="登记时间" prop="registerTime">
              <el-date-picker
                v-model="addProceduringForm.registerTime" readonly
                type="datetime" class="input-class" style="width: 200px">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%"
               :show-close="false" :close-on-click-modal="false">
      <span>本次登记成功,需要复核!你确定本工序完成了吗?</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="finishTag('2')">未完成</el-button>
      <el-button type="primary" @click="finishTag('1')">完成</el-button>
    </span>
    </el-dialog>

    <el-dialog :title="procedureName | title" :visible.sync="transferTagVisible" width="30%"
               :close-on-click-modal="false" @close="checkTransferTagClosed">
      <el-form :inline="true" :model="checkForm" ref="checkForm" label-width="150px" :rules="rules">
        <el-form-item label="本工序合格品数量" prop="realAmount">
          <el-input clearable v-model.number="checkForm.realAmount"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="checkTransferTag('checkForm')">确 定</el-button>
      <el-button type="primary" @click="checkTransferTagClosed">返 回</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "AddTagManufacture",
    data() {
      return {
        rules: {
          realAmount: [
            {required: true, message: '请输入合格品数量', trigger: 'blur'},
            {type: 'number', message: '请输入数字值', trigger: 'blur'}
          ],
        },
        addProceduringFormRules: {
          procedurePesponsiblePerson: [
            {required: true, message: '请输入责任人', trigger: 'blur'},
            {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'},
          ],
          register: [
            {required: true, message: '请输入登记人', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
          labourHourAmount: [
            {required: true, message: '请输入本次工时数', trigger: 'blur'},
            {type: 'number', message: '工时数必须为数字值', trigger: 'blur'},
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

        addProceduringForm: {
          register: window.sessionStorage.getItem('loginId'),
          procedurePesponsiblePerson: window.sessionStorage.getItem('loginId'),
          registerTime: '',
          labourHourAmount: ''
        },

        queryManufacture: {
          pageNo: 1,
          pageSize: 7,
          manufactureId: '',
          productName: '',
          dataTime: '',
          checkTag: '1',
          manufactureProcedureTag: "0"
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
        procedure: {},
        procedureModuleDialogVisible: false,

        procedureModuleList: [],
        dialogVisible: false,

        transferTagVisible: false,
        procedureName: '',
        checkForm: {
          realAmount: '',
        },
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
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //登记
      showProcedureModuleDialog(row) {
        if (row.index == 0) {
          this.selectByPid(row);
          return;
        }
        var bool = true;
        if (this.procedureList[row.index - 1].procedureTransferTag != 2) {
          this.$message.error("上一工序尚未交接，本工序不能登记完成");
          bool = false;
        }
        if (bool == true) {
          this.selectByPid(row);
        }
      },
      selectByPid(row) {
        this.procedure = row;
        this.axios.post("/procedureModule/selectByPid/" + row.id).then((resp) => {
          this.procedureModuleList = resp.data;
          this.procedureModuleList.forEach((item) => {
            item.shuliang = 0;
          })
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        setInterval(() => {
          this.addProceduringForm.registerTime = this.getDataTime(new Date());
        }, 1000)
        this.procedureModuleDialogVisible = true;
      },
      // 监听 添加设计单对话框的关闭事件
      procedureModuleDialogClosed() {
        this.$nextTick(() => {
          this.$refs.addProceduringForm.resetFields();
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
            params.append("checkTime", this.ruleForm.checkTime)
            params.append("checker", this.ruleForm.checker)
            params.append("remark", this.ruleForm.remark)
            if (checked == 2) {
              this.$confirm('不通过[' + this.manufacture.productName + ']生产派工单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                params.append("checkTag", "2")
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
                this.$message.info("已取消不通过")
              });
            }
            if (checked == 1) {
              this.$confirm('通过[' + this.manufacture.productName + ']生产派工单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                params.append("checkTag", "1")
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
      //提交
      checkFinishTag(formName) {
        var bool = true;
        this.procedureModuleList.forEach((item) => {
          console.log(item.shuliang - 0 + item.realAmount - 0)
          if ((item.shuliang - 0 + item.realAmount - 0) > item.renewAmount) {
            this.$message.error("物料登记数量有误或超出可用数量");
            bool = false;
          }
          item.register = this.addProceduringForm.register;
          item.registerTime = this.addProceduringForm.registerTime;
          item.procedureResponsiblePerson = this.addProceduringForm.procedureResponsiblePerson;
          item.labourHourAmount = this.addProceduringForm.labourHourAmount;
        })

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (bool == true) {
              this.axios.post("/procedureModule/procedureFinish", JSON.stringify(this.procedureModuleList),
                {headers: {"Content-Type": "application/json"}}).then((response) => {
                if (response.data.result == true) {
                  /*this.$message.success('操作成功,待审核!');*/
                  this.procedureSelectByPid(this.manufacture.id);
                  /*this.procedureModuleDialogClosed();*/
                  this.dialogVisible = true;
                }
              }).catch(function (error) {
                return this.$message.error('操作失败！')
              })
            }
          } else {
            return false;
          }
        });
      },
      finishTag(val) {
        /*console.log(this.procedure.id);*/
        var params = new URLSearchParams();
        params.append("procedureFinishTag", val);
        params.append("id", this.procedure.id);
        this.axios.post("/procedure/finishTag", params).then((resp) => {
          console.log(resp.data)
          if (resp.data.result == true) {
            this.procedureSelectByPid(this.manufacture.id);
            this.$message.success("操作成功,待审核!");
            this.dialogVisible = false;
            this.procedureModuleDialogClosed();
          } else {
            this.$message.success("工序未完成");
          }
        }).catch(function (error) {
          return this.$message.error('获取列表失败！')
        })
      },
      //交接登记
      checkTransferTag(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            params.append("id", this.procedure.id);
            params.append("realAmount",this.checkForm.realAmount);
            this.axios.post("/procedure/transferTag", params).then((response) => {
              if (response.data) {
                this.$message.success("交接登记成功,待复核");
                this.procedureSelectByPid(this.manufacture.id);
                this.checkTransferTagClosed();
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            })
          }
        })
      },
      //打开交接登记框
      showTransferTagDialog(row) {
        this.procedure = row;
        this.procedureName = row.procedureName;
        this.transferTagVisible = true;
      },
      // 监听 复核角色对话框的关闭事件
      checkTransferTagClosed() {
        this.$nextTick(() => {
          this.$refs.checkForm.resetFields();
          this.transferTagVisible = false
        })
      },
    },
    created() {
      this.getManufactureList();
    },
    filters: {
      title(val) {
        return "交接登记【" + val + "】";
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
