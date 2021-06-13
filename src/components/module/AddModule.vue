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
        <el-table-column label="用途类型" width="95px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
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
              @click="showAddDialog(scope.row.id)"
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
    <el-dialog title="物料组成设计单" :visible.sync="addDialogVisible" width="90%" @close="addDialogClosed">
      <el-row :gutter="20">
        <el-col :span="16" :offset="15">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-circle-plus-outline" v-if="viewShow==1" type="primary"
                           @click="AddModuleDetailLists">添加物料</el-button>
                <el-button icon="el-icon-remove-outline" v-if="viewShow==1" type="info"
                           @click="getSelected">删除物料</el-button>
                 <el-button icon="el-icon-view" v-if="viewShow==1" type="primary"
                            @click="updateViewShow">预 览</el-button>
                 <el-button icon="el-icon-back" v-if="viewShow==2" type="primary" @click="viewShow=1">返 回</el-button>
                <el-button icon="el-icon-check" v-if="viewShow==2" type="primary"
                           @click="addModuleDetails">提  交</el-button>
                <el-button icon="el-icon-circle-close" type="danger" @click="addDialogClosed">取 消</el-button>
                </span>
          </div>
        </el-col>
      </el-row>

      <!-- 内容主体 -->
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>产品编号: </strong> {{addModuleForm.productId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品名称: </strong> {{addModuleForm.productName}}</div>
        </el-col>
      </el-row>

      <el-row v-if="viewShow==2" :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>设计人: </strong> {{addModuleForm.designer}}</div>
        </el-col>
      </el-row>
      <el-form
        :model="addModuleForm"
        ref="addModuleForm"
        label-width="100px"
        :rules="addModuleFormRules">
        <el-form-item v-if="viewShow==1" label="设计人" prop="designer">
          <el-input clearable v-model="addModuleForm.designer"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <!-- 产品物料组成 -->
        <el-table :data="moduleList"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="productId" label="物料编号"></el-table-column>
          <el-table-column prop="productName" label="物料名称"></el-table-column>
          <el-table-column label="用途类型" width="120px" prop="type">
            <template slot-scope="scope">
              {{scope.row.type | newTitle}}
            </template>
          </el-table-column>
          <el-table-column prop="productDescribe" label="描述"></el-table-column>

          <el-table-column v-if="viewShow==1" prop="amount" label="数量" width="180">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.amount" maxlength="4"
                        oninput="value=value.replace(/[^\d]/g,'')"/>
            </template>
          </el-table-column>
          <el-table-column v-if="viewShow==2" prop="amount" label="数量"></el-table-column>
          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
          <el-table-column label="小计(元)">
            <template slot-scope="scope">
              {{scope.row.amount*scope.row.costPrice}}
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <span><strong>登记人: </strong>  {{addModuleForm.register}}</span>
        <span><strong>建档时间: </strong>  {{addModuleForm.registerTime}}</span>
        <el-form-item v-if="viewShow==1" label="设计要求" prop="moduleDescribe">
          <el-input v-model="addModuleForm.moduleDescribe" type="textarea" class="xxx"/>
        </el-form-item>
      </el-form>
      <el-row v-if="viewShow==2" :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>设计要求: </strong> {{addModuleForm.moduleDescribe}}</div>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="添加物料"
      :visible.sync="moduleDialogVisible"
      width="90%">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="AddModuleDetailLists"
                        v-model="queryModule.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="AddModuleDetailLists">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="moduleDetailsList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column label="用途类型" width="120px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="productDescribe" label="物料描述"></el-table-column>
        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column prop="costPrice" label="设计成本单价"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addModule(scope.row)"
            >添加
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleAddSizeChange"
                     @current-change="handleAddCurrentChange"
                     :current-page="queryModule.pageNo"
                     :page-sizes="[6, 10, 15, 20]"
                     :page-size="queryModule.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="moduleTotal"
      ></el-pagination>

      <span slot="footer" class="dialog-footer">
    <el-button @click="moduleDialogVisible = false">返 回</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AddModule",
    data() {
      return {
        viewShow: 1,
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
        addModuleFormRules: {
          designer: [
            {required: true, message: '请输入设计人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
          moduleDescribe: [
            {required: true, message: '请输入设计要求', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ]
        },
        moduleDialogVisible: false,
        addDialogVisible: false,
        addModuleForm: {},
        moduleList: [],
        moduleDetailsList: [],

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
          designModuleTag: 0
        },
        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],
        // 获取物料列表查询参数对象
        queryModule: {
          productName: '',
          pageNo: 1,
          pageSize: 6,
          checkTag: 1,
          deleteTag: 0,
          type: 2
        },
        fileList: [],
        total: 0,
        moduleTotal: 0,
        multipleSelection: [],
      }
    },
    methods: {
      updateViewShow() {
        var bool = true;
        if (this.moduleList.length == 0) {
          this.$message.error("请至少添加一个物料");
          bool = false;
          return;
        }
        this.moduleList.forEach((item) => {
          if (!item.amount) {
            this.$message.error('请输入数量！');
            bool = false;
          }
          item.goodsId = this.addModuleForm.productId;
          item.designer = this.addModuleForm.designer;
          item.moduleDescribe = this.addModuleForm.moduleDescribe;
          item.register = window.sessionStorage.getItem('loginId');
        })
        this.$refs.addModuleForm.validate((valid) => {
          if (valid) {
            if (bool == true) {
              this.viewShow = 2
            }
          }
        })
      },
      addModuleDetails() {
        var bool = true;
        if (this.moduleList.length == 0) {
          this.$message.error("请至少添加一个物料");
          bool = false;
          return;
        }
        this.moduleList.forEach((item) => {
          if (!item.amount) {
            this.$message.error('请输入数量！');
            bool = false;
          }
          item.goodsId = this.addModuleForm.productId;
          item.designer = this.addModuleForm.designer;
          item.moduleDescribe = this.addModuleForm.moduleDescribe;
          item.register = window.sessionStorage.getItem('loginId');
        })
        this.$refs.addModuleForm.validate((valid) => {
          if (valid) {
            if (bool == true) {
              this.axios.post("/module/addModuleDetails", JSON.stringify(this.moduleList), {headers: {"Content-Type": "application/json"}})
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
          }
        })
      },
      // 添加索引
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //获取选中结果删除物料
      getSelected() {
        var val = this.multipleSelection;
        if (this.moduleList.length == 0) {
          this.$message.error("请先添加物料");
          return;
        }
        if (val.length == 0) {
          this.$message.error("请至少选中一个物料删除");
          return;
        }
        val.forEach((val, index) => {
          //遍历源数据
          this.moduleList.forEach((v, i) => {
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.index === v.index) {
              this.moduleList.splice(i, 1)
            }
          })
        })
        this.$message.success("删除物料成功");
      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击添加物料
      addModule(row) {
        var bool = true;
        this.moduleList.forEach((item) => {
          if (item.productId == row.productId) {
            this.$message.error("请勿重复添加物料")
            bool = false;
          }
        })
        if (bool == true)
          this.moduleList.push(row);
      },
      //查询所有物料
      AddModuleDetailLists() {
        this.moduleDialogVisible = true;
        var params = new URLSearchParams();
        Object.keys(this.queryModule).forEach((key) => {
          params.append(key, this.queryModule[key])
        });
        this.axios.post("/files/page", params).then((resp) => {
          this.moduleTotal = resp.data.total;
          this.moduleDetailsList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      handleAddSizeChange(newSize) {
        this.queryModule.pageSize = newSize
        this.AddModuleDetailLists()
      },
      // 监听 页码值 改变事件
      handleAddCurrentChange(newSize) {
        this.queryModule.pageNo = newSize
        this.AddModuleDetailLists()
      },
      //添加物料打开模态框
      showAddDialog(id) {
        this.addDialogVisible = true;
        this.axios.post("/files/selectById/" + id).then((resp) => {
          this.addModuleForm = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
      },
      // 监听 添加设计单对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.viewShow = 1;
          this.$refs.addModuleForm.resetFields();
          this.moduleList = [];
          this.addDialogVisible = false
        })
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
    },
    created() {
      this.getFileList();
      this.getConfigFileKindList()
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
    width: 400px;
  }
</style>
