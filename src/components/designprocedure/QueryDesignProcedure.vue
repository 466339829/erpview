<template>
  <div>
    <!--   搜索 品生产工序列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getDesignProcedureList"
                        v-model="queryDesignProcedure.productName"></el-input>
            </el-form-item>
            <el-form-item label="I级分类">
              <el-select clearable @clear="getDesignProcedureList" @change="firstKindIdChange" v-model="queryDesignProcedure.firstKindId"
                         placeholder="请选择">
                <el-option v-for="item in firstKindList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="II级分类">
              <el-select clearable @clear="getDesignProcedureList" @change="secondKindChange" v-model="queryDesignProcedure.secondKindId"
                         placeholder="请选择">
                <el-option v-for="item in secondKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="III级分类">
              <el-select clearable @clear="getDesignProcedureList" @change="thirdKindChange" v-model="queryDesignProcedure.thirdKindId"
                         placeholder="请选择">
                <el-option v-for="item in thirdKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>

            <el-form-item label="审核状态">
              <el-select clearable @clear="getDesignProcedureList"  v-model="queryDesignProcedure.checkTag" placeholder="请选择">
                <el-option value="0" label="等待"/>
                <el-option value="1" label="通过"/>
                <el-option value="2" label="不通过"/>
              </el-select>
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
        <el-table-column prop="firstKindName" label="I级分类" width="120px"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类" width="120px"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类" width="120px"></el-table-column>
        <el-table-column label="审核状态" width="120px">
          <template slot-scope="scope">
            {{ scope.row.checkTag | newCheckTag}}
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
            >查看设计单
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

      <el-form :inline="true"
               :model="checkForm"
               ref="checkForm"
               label-width="100px"
               :rules="rules">
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
          <el-table-column prop="labourHourAmount" label="工时数(小时)"></el-table-column>
          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column prop="costPrice" label="单位工时成本"></el-table-column>
          <el-table-column prop="subtotal" label="工时成本小计(元)"></el-table-column>
        </el-table>
        <el-row :gutter="20" style="margin-top: 20px;margin-left:30px">
          <el-col :span="5">
            <div><strong>工时总成本: </strong> {{procedureInfo.costPriceSum}}</div>
          </el-col>
          <el-col :span="4">
            <div><strong>登记人: </strong> {{designProcedure.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>建档时间: </strong> {{designProcedure.registerTime}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;margin-left:30px">
          <el-col :span="5">
            <div><strong>审核人: </strong> {{procedureInfo.checker}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>审核时间: </strong> {{procedureInfo.checkTime}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;margin-left:30px">
          <el-col :span="4">
            <div><strong>审核意见: </strong> {{procedureInfo.checkSuggestion}}</div>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "QueryDesignProcedure",
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
        rules: {
          check: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          checker: [
            {required: true, message: '请输入审核人', trigger: 'blur'},
            {min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur'},
          ],
          checkSuggestion: [
            {required: true, message: '请输入审核意见', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
        },
        checkForm: {},
        // 获取品生产工序列表查询参数对象
        queryDesignProcedure: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          firstKindId:'',
          secondKindId:'',
          thirdKindId:'',
          dataTime:'',
          checkTag:''
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

        ruleForm: {},

        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],
      }
    },
    methods: {
      getDataTime() {//默认显示今天
        setInterval(() => {
          this.checkForm.checkTime = this.dataTime(new Date());
        }, 1000)
      },
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
        if (this.queryDesignProcedure.dataTime) {
          params.append("registerTime", this.dataTime(this.queryDesignProcedure.dataTime[0]))
          params.append("registerTime2", this.dataTime(this.queryDesignProcedure.dataTime[1]))
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
      dataTime(date){
        var nian =   date.getFullYear();
        var yue =   date.getMonth()+1;
        var ri = date.getDate();
        var shi = date.getHours();
        var fen = date.getMinutes();
        var miao = date.getSeconds();
        if (yue<10) yue= "0"+yue;
        if (ri<10) ri= "0"+ri;
        if(miao<10) miao= "0"+miao;
        if(fen<10) fen= "0"+fen;
        if(shi<10) shi= "0"+shi;
        return nian+"-"+yue+"-"+ri+" "+shi+":"+fen+":"+miao;
      },
      submitForm(formName) {
        var checked = this.checkForm.check;
        if (!checked) {
          this.$message.error("请选择")
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            var checkTime = this.checkForm.checkTime;
            params.append("id", this.procedureInfo.id)
            params.append("checkTime",checkTime)
            params.append("checker",this.checkForm.checker)
            params.append("checkSuggestion",this.checkForm.checkSuggestion)
            if (checked == 2) {
              this.$confirm('不通过[' + this.designProcedure.productName + ']工序设计单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                params.append("checkTag","2")
                this.axios.post("/designProcedure/checkTag" ,params).then((response) => {
                  if (response.data.result) {
                    this.$message.success("操作成功")
                    this.queryModule.pageNo = 1;
                    this.getDesignProcedureList();
                    this.addDialogVisible = false;
                  } else {
                    this.$message.error("操作失败")
                  }
                })
              }).catch(() => {
                this.$message.info("已取消不通过")
              });
            }
            if (checked == 1) {
              this.$confirm('通过[' + this.designProcedure.productName + ']工序设计单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                params.append("checkTag","1")
                this.axios.post("/designProcedure/checkTag", params).then((response) => {
                  if (response.data) {
                    this.$message.success("操作成功")
                    this.queryDesignProcedure.pageNo = 1;
                    this.getDesignProcedureList();
                    this.addDialogVisible = false;
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
      //获取所有分类信息
      getConfigFileKindList() {
        this.axios.post("/configFileKind/list").then((resp) => {
          resp.data.forEach((item) => {
            if (item.kindLevel == 1)
              this.firstKindList.push(item)
            if (item.kindLevel == 2)
              this.secondKindList.push(item)
            if (item.kindLevel == 3)
              this.thirdKindList.push(item)
          })
        }).catch(function (error) {
          return this.$message.error('获取酚类信息失败！')
        })
      },
      //I级分类选择
      firstKindIdChange(val) {
        this.queryDesignProcedure.firstKindId = val;
        this.secondKindSelectList = [];
        this.thirdKindSelectList = [];
        this.queryDesignProcedure.secondKindId = '';
        this.queryDesignProcedure.thirdKindId = '';
        this.secondKindList.forEach(item => {
          if (item.pid == val) {
            this.secondKindSelectList.push(item);
          }
        });
      },
      //II级分类
      secondKindChange(val) {
        this.queryDesignProcedure.thirdKindId = '';
        this.thirdKindSelectList = [];
        this.thirdKindList.forEach(item => {
          if (item.pid == val) {
            this.thirdKindSelectList.push(item);
          }
        });
        this.queryDesignProcedure.secondKindId = val;
      },
      //III级分类
      thirdKindChange(val) {
        this.queryDesignProcedure.thirdKindId = val
      },
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getDesignProcedureList();
      },
    },
    created() {
      this.getDesignProcedureList();
      this.getConfigFileKindList();
      this.getDataTime();
    },
    filters: {//过滤器
      newCheckTag(val) {
        if (val==1)
          return "通过";
        else if(val==2)
          return "不通过";
        else
          return "等待";
      },

    }
  }
</script>

<style scoped>

</style>
