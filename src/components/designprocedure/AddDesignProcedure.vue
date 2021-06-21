<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getFileList" v-model="queryFile.productName"></el-input>
            </el-form-item>

            <el-form-item label="I级分类">
              <el-select clearable @clear="getFileList" @change="firstKindIdChange" v-model="queryFile.firstKindId"
                         placeholder="请选择">
                <el-option v-for="item in firstKindList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="II级分类">
              <el-select clearable @clear="getFileList" @change="secondKindChange" v-model="queryFile.secondKindId"
                         placeholder="请选择">
                <el-option v-for="item in secondKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="III级分类">
              <el-select clearable @clear="getFileList" @change="thirdKindChange" v-model="queryFile.thirdKindId"
                         placeholder="请选择">
                <el-option v-for="item in thirdKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="建档时间">
              <el-date-picker @change="change"
                              v-model="queryFile.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getFileList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="fileList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
     <!--   <el-table-column label="用途类型" width="95px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>-->
        <el-table-column prop="firstKindName" label="I级分类" width="100px"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类" width="100px"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类" width="100px"></el-table-column>
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
                     :current-page="queryFile.pageNo"
                     :page-sizes="[6, 10, 15, 20]"
                     :page-size="queryFile.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加设计单的对话框 -->
    <el-dialog title="生产工序设计单" :visible.sync="addDialogVisible" width="90%" @close="addDialogClosed">
      <el-row :gutter="20" >
        <el-col :span="5">
          <div><strong>产品编号: </strong> {{designProcedure.productId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品名称: </strong> {{designProcedure.productName}}</div>
        </el-col>
        <el-col :span="9" :offset="5">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-circle-plus-outline" v-if="viewShow==1" type="primary"
                           @click="AddDesignProcedureList">添加工序</el-button>
                <el-button icon="el-icon-remove-outline" v-if="viewShow==1" type="info"
                           @click="getSelected">删除工序</el-button>
                 <el-button icon="el-icon-view" v-if="viewShow==1" type="primary"
                            @click="updateViewShow">预 览</el-button>
                 <el-button icon="el-icon-back" v-if="viewShow==2" type="primary" @click="viewShow=1">返 回</el-button>
                <el-button icon="el-icon-check" v-if="viewShow==2" type="primary"
                           @click="addProcedureDetail">提  交</el-button>
                <el-button icon="el-icon-circle-close" type="danger" @click="addDialogClosed">取 消</el-button>
                </span>
          </div>
        </el-col>
      </el-row>

      <!-- 内容主体 -->
      <el-row :gutter="20" style="margin-top: 10px">

      </el-row>
      <el-form
        :model="addDesignProcedureForm"
        ref="addDesignProcedureForm"
        label-width="100px"
        :rules="addDesignProcedureFormRules">
        <el-divider></el-divider>
        <!-- 产品物料组成 -->
        <el-table :data="designProcedureList"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="procedureName" label="工序名称"></el-table-column>
          <el-table-column prop="procedureId" label="工序编号"></el-table-column>
          <el-table-column prop="procedureDescribe" label="描述"></el-table-column>

          <el-table-column v-if="viewShow==1" prop="labourHourAmount" label="工时数" width="180">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.labourHourAmount"
                        oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"/>
            </template>
          </el-table-column>
          <el-table-column v-if="viewShow==2" prop="labourHourAmount" label="工时数"></el-table-column>


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
        <span><strong>登记人: </strong>  {{designProcedure.register}}</span>
        <span><strong>建档时间: </strong>  {{designProcedure.registerTime}}</span>

        <el-row v-if="viewShow==1" :gutter="20" style="margin-top: 10px;margin-left: -50px">
          <el-col :span="5">
            <el-form-item v-if="viewShow==1" label="设计人" prop="designer">
              <el-input clearable v-model="addDesignProcedureForm.designer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item v-if="viewShow==1" label="设计要求" prop="procedureDescribe">
              <el-input v-model="addDesignProcedureForm.procedureDescribe" type="textarea" class="xxx"/>
            </el-form-item>
          </el-col>
        </el-row>

      <el-row v-if="viewShow==2" :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>设计人: </strong> {{addDesignProcedureForm.designer}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>设计要求: </strong> {{addDesignProcedureForm.procedureDescribe}}</div>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="添加工序" :visible.sync="manufactureDialogVisible"
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
    name: "AddDesignProcedure",
    data(){
      return{
        addDesignProcedureFormRules: {
          designer: [
            {required: true, message: '请输入设计人', trigger: 'blur'},
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
        // 获取产品列表查询参数对象
        queryFile: {
          productName: '',
          pageNo: 1,
          pageSize: 6,
          //审核标志0: 等待1: 通过2: 不通过
          checkTag: "1",
          //产品删除标志0: 未删除1: 已删除2永久删除
          deleteTag: 0,
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type: 1,
          dataTime: '',
          designProcedureTag:0
        },
        total: 0,
        fileList:[],
        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],

        addDialogVisible:false,

        designProcedureList:[],

        addDesignProcedureForm:{
          designer:'',
          procedureDescribe:''
        },
        designProcedure:{},
        viewShow:1,
        manufactureConfigProcedureList:[],
        multipleSelection:[],
        manufactureDialogVisible:false
      }
    },
    methods:{
      getFileList() {
        var params = new URLSearchParams();
        if (this.queryFile.dataTime) {
          params.append("registerTime", this.getDataTime(this.queryFile.dataTime[0]))
          params.append("registerTime2", this.getDataTime(this.queryFile.dataTime[1]))
        }
        Object.keys(this.queryFile).forEach((key) => {
          params.append(key, this.queryFile[key])
        });

        this.axios.post("/files/page", params).then((resp) => {
          this.total = resp.data.total;
          this.fileList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
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
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryFile.pageSize = newSize
        this.getFileList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryFile.pageNo = newSize
        this.getFileList()
      },
      //I级分类选择
      firstKindIdChange(val) {
        this.queryFile.firstKindId = val;
        this.secondKindSelectList = [];
        this.thirdKindSelectList = [];
        this.queryFile.secondKindId = '';
        this.queryFile.thirdKindId = '';
        this.secondKindList.forEach(item => {
          if (item.pid == val) {
            this.secondKindSelectList.push(item);
          }
        });
      },
      //II级分类
      secondKindChange(val) {
        this.queryFile.thirdKindId = '';
        this.thirdKindSelectList = [];
        this.thirdKindList.forEach(item => {
          if (item.pid == val) {
            this.thirdKindSelectList.push(item);
          }
        });
        this.queryFile.secondKindId = val;
      },
      //III级分类
      thirdKindChange(val) {
        this.queryFile.thirdKindId = val
      },
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getFileList();
      },
      //添加物料打开模态框
      showAddDialog(row) {
        this.designProcedure = row;
        this.addDialogVisible = true;
      },
      // 监听 添加设计单对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.viewShow = 1;
          this.addDesignProcedureForm.designer='',
          this.addDesignProcedureForm.procedureDescribe=''
          this.designProcedureList = [];
          this.addDialogVisible = false;
          this.$forceUpdate();
        })
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
      //获取选中结果删除物料
      getSelected() {
        var val = this.multipleSelection;
        if (this.designProcedureList.length == 0) {
          this.$message.error("请先添加工序");
          return;
        }
        if (val.length == 0) {
          this.$message.error("请至少选中一个工序删除");
          return;
        }
        val.forEach((val, index) => {
          //遍历源数据
          this.designProcedureList.forEach((v, i) => {
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.index === v.index) {
              this.designProcedureList.splice(i, 1)
            }
          })
        })
        this.$message.success("删除工序成功");
      },
      //预览
      updateViewShow() {
        var bool = true;
        if (this.designProcedureList.length == 0) {
          this.$message.error("请至少添加一个工序");
          bool = false;
          return;
        }
        this.designProcedureList.forEach((item) => {
          if (!item.labourHourAmount) {
            this.$message.error('请输入工时数！');
            bool = false;
          }
          if (!item.costPrice) {
            this.$message.error('请输入单位工时成本！');
            bool = false;
          }
        })
        this.$refs.addDesignProcedureForm.validate((valid) => {
          if (valid) {
            if (bool == true) {
              this.viewShow = 2
            }
          }
        })
      },
      //查询所有工序
      AddDesignProcedureList() {
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
      //点击添加物料
      add(row) {
        var bool = true;
        this.designProcedureList.forEach((item) => {
          if (item.procedureId == row.procedureId) {
            this.$message.error("请勿重复添加工序")
            bool = false;
          }
        })
        if (bool == true){
          this.designProcedureList.push(row);
        }
      },
      //提交
      addProcedureDetail(){
        this.designProcedureList.forEach((item)=>{
          item.subtotal = (item.labourHourAmount*item.costPrice);
          item.goodsId = this.designProcedure.productId;
          item.productName = this.designProcedure.productName;
          item.register = this.designProcedure.register;
          item.registerTime = this.designProcedure.registerTime;
          item.designer = this.addDesignProcedureForm.designer;
          item.designProcedureDescribe = this.addDesignProcedureForm.procedureDescribe;
          item.designModuleTag = 0;
          item.designModuleChangeTag = 0;
          item.amountUnit = "小时";
        })
        this.axios.post("/designProcedureDetails/insert", JSON.stringify(this.designProcedureList),
          {headers: {"Content-Type": "application/json"}})
          .then((response) => {
            if (response.data.result == true) {
              this.$message.success('操作成功,等待审核!');
              this.getFileList();
              this.addDialogVisible = false;
            }
          }).catch(function (error) {
          return this.$message.error('操作失败！')
        })
      }
    },
    created() {
      this.getFileList();
      this.getConfigFileKindList();
    },
    filters: {   //过滤器
      newTitle(val) {
        if (val == 1)
          return "商品";
        else if (val == 2)
          return "物料";
        else
          return "";
      }
    }
  }
</script>

<style scoped>
  .el-input, .textarea, .el-select {
    width: 145px;
  }

  .xxx {
    width: 300px;
  }
</style>
