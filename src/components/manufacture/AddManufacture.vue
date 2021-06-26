<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-form :inline="true">

            <el-form-item label="生产计划编号">
              <el-input placeholder="请输入生产计划编号" clearable @clear="getApplyList" v-model="queryApply.applyId"></el-input>
            </el-form-item>

            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getApplyList"
                        v-model="queryApply.productName"></el-input>
            </el-form-item>

            <el-form-item label="审核时间">
              <el-date-picker @change="change"
                              v-model="queryApply.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getApplyList">查 询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="5">
          <div>
            <el-button type="primary" icon="el-icon-edit" @click="addManufacture">生产派工单</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="applyList" :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="applyId" label="生产计划编号"></el-table-column>
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="productDescribe" label="产品描述"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column label="审核时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.checkTime }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryApply.pageNo"
                     :page-sizes="[7, 10, 15, 20]"
                     :page-size="queryApply.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="生产派工单" :visible.sync="procedureDialogVisible" width="80%" @close="procedureDialogClosed">
        <el-row :gutter="10" style="margin-bottom: 5px">
          <el-col :span="4">
              <div><strong>产品编号: </strong> {{applyData.productId}}</div>
          </el-col>
          <el-col :span="4">
              <div><strong>产品名称: </strong> {{applyData.productName}}</div>
          </el-col>
          <el-col :span="4">
            <div><strong>数量: </strong> {{amount}}</div>
          </el-col>
          <el-col :span="4">
            <div><strong>描述: </strong> {{applyData.productDescribe}}</div>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button icon="el-icon-check" type="primary" @click="submitAddManufactureForm">提 交</el-button>
            <el-button icon="el-icon-circle-close" type="danger" @click="procedureDialogClosed">取 消</el-button>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <!-- 产品列表区域 -->
        <el-table :data="designProcedureDetailsList" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column prop="procedureName" label="工序名称"></el-table-column>
          <el-table-column prop="detailsNumber" label="工序编号"></el-table-column>
          <el-table-column prop="procedureDescribe" label="描述"></el-table-column>
          <el-table-column prop="labourHourAmount" label="工时数(小时)">
            <template slot-scope="scope">
              {{scope.row.labourHourAmount*amount}}
            </template>
          </el-table-column>
          <el-table-column prop="subtotal" label="工时成本小计(元)">
            <template slot-scope="scope">
              {{scope.row.subtotal*amount}}
            </template>
          </el-table-column>
          <el-table-column prop="moduleSubtotal" label="物料成本小计">
            <template slot-scope="scope">
              {{scope.row.moduleSubtotal*amount}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-circle-plus"
                size="mini"
                @click="showProcedureModuleDialog(scope.row)"
              >审核物料
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-divider></el-divider>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="6">
              <div><strong>登记人: </strong> {{applyData.register}}</div>
            </el-col>
          <el-col :span="6">
              <div><strong>登记时间: </strong> {{applyData.registerTime}}</div>
          </el-col>
        </el-row>

        <el-form
          :model="addManufactureForm"
          ref="addManufactureForm"
          label-width="100px"
          :rules="addManufactureFormRules" style="margin-top: 10px">

          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="6">
              <el-form-item label="工单制定人" prop="designer">
                <el-input clearable v-model="addManufactureForm.designer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注" prop="remark" style="margin-left: -50px;margin-top: 10px">
                <el-input v-model="addManufactureForm.remark" type="textarea" class="xxx"/>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <el-divider></el-divider>
      <!--<span slot="footer" class="dialog-footer">
   &lt;!&ndash; <el-button @click="procedureDialogVisible = false">返 回</el-button>&ndash;&gt;
  </span>-->
    </el-dialog>

    <el-dialog title="工序物料单" :visible.sync="ProcedureModuleDialogVisible"
               width="80%">
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="10">
          <el-col :span="7">
            <div><strong>工序名称: </strong> {{designProcedureDetails.procedureName}}</div>
          </el-col>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="designProcedureModuleList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column prop="productDescribe" label="描述"></el-table-column>
        <el-table-column prop="amount" label="本工序数量">
          <template slot-scope="scope">
            {{scope.row.amount*amount}}
          </template>
        </el-table-column>
        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column prop="costPrice" label="单价(元)"></el-table-column>
        <el-table-column prop="subtotal" label="小计(元)">
          <template slot-scope="scope">
            {{scope.row.subtotal*amount}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="ProcedureModuleDialogVisible = false">返 回</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AddManufacture",
    data() {
      return {
        addManufactureFormRules: {
          designer: [
            {required: true, message: '请输入工单制定人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
          register: [
            {required: true, message: '请输入登记人', trigger: 'blur'},
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
        queryApply: {
          pageNo: 1,
          pageSize: 7,
          productName: '',
          applyId: '',
          dataTime: '',
          manufactureTag: 0,
        },
        total: 0,
        applyList: [],
        multipleSelection: [],

        designProcedureDetailsList: [],
        procedureDialogVisible: false,

        applyData: {},
        designProcedureDetails: '',

        designProcedureModuleList: [],
        ProcedureModuleDialogVisible: false,

        addManufactureForm: {
          designer: '',
          remark: ''
        },
        amount: 0,
        applyIdGroup: '',
        ids: '',
        moduleCostPriceSum:0,
        labourCostPriceSum:0,
      }
    },
    methods: {
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getApplyList();
      },
      //时间年月日格式
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
      getApplyList() {
        var params = new URLSearchParams();
        if (this.queryApply.dataTime) {
          params.append("checkTime", this.getDataTime(this.queryApply.dataTime[0]))
          params.append("checkTime2", this.getDataTime(this.queryApply.dataTime[1]))
        }
        Object.keys(this.queryApply).forEach((key) => {
          params.append(key, this.queryApply[key])
        });
        this.axios.post("/apply/page", params).then((resp) => {
          this.total = resp.data.total;
          this.applyList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取角色列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryApply.pageSize = newSize
        this.getApplyList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryApply.pageNo = newSize
        this.getApplyList()
      },
      // 添加索引
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //生产派工单
      addManufacture() {
        var bool = true;
        if (this.multipleSelection.length == 0) {
          bool = false;
          this.$message.error("请至少选择一个产品")
        }
        var productId = this.multipleSelection[0].productId;
        this.multipleSelection.forEach((item) => {
          if (productId != item.productId) {
            this.$message.error("产品编号必须一致")
            bool = false;
          }
        })

        if (bool==true) {
          this.applyData = this.multipleSelection[0];
          this.multipleSelection.forEach((item) => {
            this.amount += item.amount;
            this.applyIdGroup += (item.applyId + "|")
          })
          var params = new URLSearchParams();
          params.append("productId", productId)

          this.axios.post("/files/selectByProductId", params).then((resp) => {
            if (!resp.data) {
              this.$message.error("该产品的工序设计或工序物料设计尚未完成，不能制定生产派工单")
              bool = false;
            }else {
              this.axios.post("/designProcedureDetails/selectByPid", params).then((resp) => {
                this.designProcedureDetailsList = resp.data
              }).catch(function (error) {
                return this.$message.error('获取信息失败！')
              })
              this.procedureDialogVisible = true;
            }
          }).catch(function (error) {
            return this.$message.error('获取信息失败！')
          })
        }
      },
      //查看物料
      showProcedureModuleDialog(row) {
        this.designProcedureDetails = row;
        this.axios.post("/designProcedureModule/selectByPId/" + row.id).then((resp) => {
          this.designProcedureModuleList = resp.data
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        this.ProcedureModuleDialogVisible = true;
      },
      // 监听 添加设计单对话框的关闭事件
      procedureDialogClosed() {
        this.$nextTick(() => {
          this.amount = 0;
          this.ids = "";
          this.applyIdGroup = "";
          this.moduleCostPriceSum = 0;
          this.labourCostPriceSum = 0;
          this.$refs.addManufactureForm.resetFields();
          this.multipleSelection = [];
          this.procedureDialogVisible = false;
        })
      },
      submitAddManufactureForm() {
        this.$refs.addManufactureForm.validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(this.addManufactureForm).forEach((key) => {
              params.append(key, this.addManufactureForm[key]);
            })
            this.multipleSelection.forEach((item) => {
              this.ids += item.id + ",";
            })
            this.designProcedureDetailsList.forEach((item) => {
              this.moduleCostPriceSum += item.moduleSubtotal;
              this.labourCostPriceSum += item.subtotal;
            })
            params.append("ids", this.ids);
            params.append("productId", this.applyData.productId);
            params.append("productName", this.applyData.productName);
            params.append("moduleCostPriceSum", this.moduleCostPriceSum);
            params.append("labourCostPriceSum", this.labourCostPriceSum);
            params.append("amount", this.amount);
            params.append("applyIdGroup", this.applyIdGroup);
            params.append("productDescribe", this.applyData.productDescribe);
            params.append("register", this.applyData.register);
            params.append("registerTime", this.applyData.registerTime);
            params.append("checkTag", "0");
            params.append("manufactureProcedureTag", "0");
            this.axios.post("/manufacture/insert", params).then((response) => {
              if (response.data.result == true) {
                this.$message.success('操作成功,等待审核!');
                this.procedureDialogClosed();
                this.ids = "";
                this.getApplyList();
              }
            }).catch(function (error) {
              return this.$message.error('操作失败！')
            })
          }
        })
      }
    },
    created() {
      this.getApplyList();
    },
  }
</script>

<style scoped>
  .el-input, .textarea, .el-select {
    width: 145px;
  }

  .xxx {
    width: 400px;
  }
</style>
