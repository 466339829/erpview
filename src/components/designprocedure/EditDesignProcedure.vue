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
              <el-select clearable @clear="getDesignProcedureList" @change="firstKindIdChange"
                         v-model="queryDesignProcedure.firstKindId"
                         placeholder="请选择">
                <el-option v-for="item in firstKindList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="II级分类">
              <el-select clearable @clear="getDesignProcedureList" @change="secondKindChange"
                         v-model="queryDesignProcedure.secondKindId"
                         placeholder="请选择">
                <el-option v-for="item in secondKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="III级分类">
              <el-select clearable @clear="getDesignProcedureList" @change="thirdKindChange"
                         v-model="queryDesignProcedure.thirdKindId"
                         placeholder="请选择">
                <el-option v-for="item in thirdKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
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
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAddDialog(scope.row)"
            >变更设计单
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
    <el-dialog title="变更工序物料设计单" :visible.sync="addDialogVisible" width="90%" @close="addDialogClosed">

      <el-form :inline="true"
               :model="checkForm"
               ref="checkForm"
               label-width="100px"
               :rules="checkFormRules">
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
          <el-col :span="6">
            <div><strong>产品名称: </strong> {{designProcedure.productName}}</div>
          </el-col>
          <el-col :span="5">
            <div>
              <el-button icon="el-icon-view" v-if="viewShow==1" type="primary" @click="updateViewShow">预 览</el-button>
              <el-button v-if="viewShow==1" icon="el-icon-circle-close" type="danger" @click="addDialogClosed">取 消</el-button>
              <el-button icon="el-icon-back" v-if="viewShow==2" type="primary" @click="viewShow=1">返 回</el-button>
              <el-button v-if="viewShow==2" icon="el-icon-check" type="primary" @click="addProcedureDetails">提  交</el-button>
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <div>
          <label class="document-btn">已添加工序</label>
        </div>
        <!--&lt;!&ndash; 内容主体 &ndash;&gt;
        &lt;!&ndash; 产品工序组成 &ndash;&gt;-->
        <el-table :data="designProcedureDetails" :row-class-name="tableRowClassName" border stripe>
          <!--  &lt;!&ndash; stripe: 斑马条纹 border：边框&ndash;&gt;-->
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="procedureName" label="工序名称"></el-table-column>
          <el-table-column prop="procedureId" label="工序编号"></el-table-column>
          <el-table-column prop="procedureDescribe" label="描述"></el-table-column>
          <el-table-column prop="labourHourAmount" label="工时数(小时)"></el-table-column>
          <el-table-column prop="amountUnit" label="工时单位"></el-table-column>
          <el-table-column prop="costPrice" label="单位工时成本"></el-table-column>
          <el-table-column prop="subtotal" label="工时成本小计(元)"></el-table-column>
          <el-table-column label="操作" v-if="viewShow==1">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeById(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="3">
            <label class="document-btn">新添加物料</label>
          </el-col>
          <el-col :span="5" :offset="15" v-if="viewShow==1">
                <el-button icon="el-icon-circle-plus-outline" type="primary"
                           @click="addDesignProcedureDetails">添加新工序</el-button>
               <el-button icon="el-icon-remove-outline" type="info" @click="getSelected">删除新工序</el-button>
          </el-col>
        </el-row>

        <el-table :data="designProcedureDetailsList" :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange" border stripe>
          <!--  &lt;!&ndash; stripe: 斑马条纹 border：边框&ndash;&gt;-->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="procedureName" label="工序名称"></el-table-column>
          <el-table-column prop="procedureId" label="工序编号"></el-table-column>
          <el-table-column prop="procedureDescribe" label="描述"></el-table-column>
          <el-table-column v-if="viewShow==2" prop="labourHourAmount" label="工时数(小时)"></el-table-column>
          <el-table-column v-if="viewShow==1" prop="labourHourAmount" label="工时数(小时)" width="180">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.labourHourAmount"
                        oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"/>
            </template>
          </el-table-column>

          <el-table-column prop="amountUnit" label="工时单位">小时</el-table-column>

          <el-table-column v-if="viewShow==1" prop="costPrice" label="单位工时成本" width="180">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.costPrice"
                        oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"/>
            </template>
          </el-table-column>
          <el-table-column v-if="viewShow==2" prop="costPrice" label="单位工时成本"></el-table-column>


          <el-table-column label="工时成本小计(元)">
            <template slot-scope="scope">
              {{scope.row.labourHourAmount*scope.row.costPrice}}
            </template>
          </el-table-column>

        </el-table>
        <el-divider></el-divider>

        <el-row :gutter="10" v-if="viewShow==1">
          <el-col :span="6">
            <div> <el-form-item label="变更人" prop="changer">
              <el-input v-model="checkForm.changer" clearable />
            </el-form-item></div>
          </el-col>

          <el-col :span="6">
            <div> <el-form-item label="设计要求" prop="procedureDescribe">
              <el-input v-model="checkForm.procedureDescribe" clearable type="textarea" class="xxx"/>
            </el-form-item></div>
          </el-col>

          <el-col :span="7">
            <div> <el-form-item label="变更时间" prop="changeTime">
              <el-date-picker v-model="checkForm.changeTime" type="datetime" readonly></el-date-picker>
            </el-form-item></div>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="viewShow==2" style="margin-left: 30px">
          <el-col :span="5">
            <div><strong>变更人: </strong> {{checkForm.changer}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>设计要求: </strong> {{checkForm.procedureDescribe}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>变更时间: </strong> {{checkForm.changeTime}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;margin-left:30px">
          <el-col :span="5">
            <div><strong>工时总成本: </strong> {{procedureInfo.costPriceSum}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>登记人: </strong> {{designProcedure.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>登记时间: </strong> {{designProcedure.registerTime}}</div>
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
          <el-col :span="5">
            <div><strong>审核意见: </strong> {{procedureInfo.checkSuggestion}}</div>
          </el-col>
        </el-row>

      </el-form>
      <el-divider></el-divider>
    </el-dialog>

    <el-dialog title="添加新工序" :visible.sync="manufactureDialogVisible"
               width="90%">
      <!-- 产品列表区域 -->
      <el-table :data="manufactureConfigProcedureList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="procedureId" label="工序编号"></el-table-column>
        <el-table-column prop="procedureName" label="工序名称"></el-table-column>
        <el-table-column prop="procedureDescribe" label="工序描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-plus"
              size="mini"
              @click="add(scope.row)"
            >添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="manufactureDialogVisible = false">返 回</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "EditDesignProcedure",
    data() {
      return {
        checkFormRules: {
          changer: [
            {required: true, message: '请输入变更人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
          procedureDescribe: [
            {required: true, message: '请输入设计要求', trigger: 'blur'},
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
        viewShow:1,

        manufactureDialogVisible:false,
        manufactureConfigProcedureList:[],

        multipleSelection:[],
        designProcedureDetailsList:[],

        checkForm: {
          changer:'',
          changeTime:'',
          procedureDescribe:'',
        },

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
          this.viewShow=1;
          this.getDesignProcedureList();
          this.designProcedureDetailsList = [];
          this.$refs.checkForm.resetFields();
          this.addDialogVisible = false;
        /*  setInterval(() => {
            this.changeTime = this.dataTime(new Date());
          }, 1000)*/
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
          this.designProcedureList = resp.data.list.filter((item)=>{
            return item.checkTag!=0
          })
          /*this.designProcedureList = resp.data.list;*/
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
        setInterval(() => {
          this.checkForm.changeTime = this.dataTime(new Date());
        }, 1000)
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
      //删除工序
      removeById(row) {
        this.$confirm('将删除[' + row.procedureName + ']工序, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = new URLSearchParams();
          params.append("id", row.id)
          params.append("parentId", row.parentId)
          this.axios.post("/designProcedureDetails/delete", params).then((response) => {
            if (response.data.result) {
              this.getDesignProcedureList();
              this.addDialogVisible= false;
              this.$message.success("删除成功,待审核")
            } else {
              this.$message.success("删除失败");
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除")
        });
      },
      //添加新工序 查询所有工序
      addDesignProcedureDetails(){
        this.axios.post("/manufactureConfigProcedureList/list").then((resp) => {
          resp.data.forEach((item)=>{
            item.procedureId = item.typeId;
            item.procedureName = item.typeName;
            item.procedureDescribe = item.describe1;
            item.labourHourAmount = 1;
            item.costPrice = 1;
          })
          this.manufactureConfigProcedureList = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取工序列表失败！')
        });
        this.manufactureDialogVisible = true;
      },
      //添加工序
      add(row){
        var bool = true;
        this.designProcedureDetails.forEach((item => {
          if (item.procedureId == row.procedureId) {
            this.$message.error("工序已添加")
            bool = false;
          }
        }))
        this.designProcedureDetailsList.forEach((item) => {
          if (item.procedureId == row.procedureId) {
            this.$message.error("请勿重复添加工序")
            bool = false;
          }
        })
        if (bool == true)
          this.designProcedureDetailsList.push(row);
      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取选中结果删除工序
      getSelected() {
        var val = this.multipleSelection;
        if (this.designProcedureDetailsList.length == 0) {
          this.$message.error("请先添加新物料");
          return;
        }
        if (val.length == 0) {
          this.$message.error("请至少选中一个新物料删除");
          return;
        }
        val.forEach((val, index) => {
          //遍历源数据
          this.designProcedureDetailsList.forEach((v, i) => {
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.index === v.index) {
              this.designProcedureDetailsList.splice(i, 1)
            }
          })
        })
        this.$message.success("删除新工序成功");
      },
      //预览
      updateViewShow(){
        var bool = true;
        if (this.designProcedureDetails.length == 0 && this.designProcedureDetailsList.length == 0) {
          this.$message.error("请至少添加一个工序");
          return;
        }
        if (this.designProcedureDetailsList.length > 0) {
          this.designProcedureDetailsList.forEach((product) => {
            if (!product.labourHourAmount) {
              this.$message.error('请输入工时数！');
              bool = false;
            }
            if (!product.costPrice) {
              this.$message.error('请输入单位工时成本！');
              bool = false;
            }
          });
        };
        this.$refs.checkForm.validate((valid) => {
            if (valid) {
              if (bool == true){
                this.viewShow=2
              }
            }
        })
      },
      //提交
      addProcedureDetails(){
        this.designProcedureDetailsList.forEach((item)=>{
          item.subtotal = (item.labourHourAmount*item.costPrice);
          item.register = this.designProcedure.register
          item.registerTime = this.designProcedure.registerTime;
          item.designer = this.procedureInfo.designer;
          item.designModuleTag = 0;
          item.designModuleChangeTag = 0;
          item.amountUnit = "小时";
          this.designProcedureDetails.push(item)
        })
        this.designProcedureDetails.forEach((item)=>{
          item.goodsId= this.procedureInfo.designId;
          item.changer = this.checkForm.changer;
          item.changeTime = this.checkForm.changeTime;
          item.designProcedureDescribe = this.checkForm.procedureDescribe;
        })
        this.axios.post("/designProcedureDetails/update", JSON.stringify(this.designProcedureDetails),
          {headers: {"Content-Type": "application/json"}})
          .then((response) => {
            if (response.data.result == true) {
              this.$message.success('操作成功,等待审核!');
              this.addDialogClosed();
            }
          }).catch(function (error) {
          return this.$message.error('操作失败！')
        })
      }
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
  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    color: black;
    height: 20px;
    padding: 0 5px;
    line-height: 5px;
    font-size: 16px;
  }
</style>
