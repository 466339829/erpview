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

            <el-form-item label="用途类型">
              <el-select clearable @clear="getFileList" v-model="queryFile.type" placeholder="请选择">
                <el-option label="商品" value="1"/>
                <el-option label="物料" value="2"/>
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
        <el-table-column label="用途类型" width="120px">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="firstKindName" label="I级分类" width="120px"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类" width="120px"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类" width="120px"></el-table-column>
        <el-table-column label="建档时间">
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
              @click="showCheckDialog(scope.row.id)"
            >复核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryFile.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryFile.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加产品的对话框 -->
    <el-dialog :title="checkFileForm.productName | title" :visible.sync="checkDialogVisible" width="80%"
               @close="checkDialogClosed">

      <el-form :inline="true"
               :model="checkForm"
               ref="checkForm"
               label-width="100px"
               :rules="rules">
        <el-row>
          <el-col :span="4">
            <div><label class="document-btn">主信息</label></div>
          </el-col>
        <el-col :span="6" :offset="14">
          <div>
            <el-form-item prop="check">
              <el-radio-group v-model="checkForm.check">
                <el-radio v-model="checkForm.check" label="1">通过</el-radio>
                <el-radio v-model="checkForm.check" label="2">未通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="warning" icon="el-icon-star-off" @click="checkFile('checkForm')">复 核</el-button>
          </div>
        </el-col>
        </el-row>
        <!-- 内容主体 -->
        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-top: 0px">
          <el-col :span="5">
            <div><strong>产品编号: </strong> {{checkFileForm.productId}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>产品名称: </strong> {{checkFileForm.productName}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>制造商: </strong> {{checkFileForm.factoryName}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>产品简称: </strong> {{checkFileForm.productNick}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="5">
            <div><strong>I级分类: </strong> {{checkFileForm.firstKindName}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>II级分类: </strong> {{checkFileForm.secondKindName}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>III级分类: </strong> {{checkFileForm.thirdKindName}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>用途类型: </strong> {{checkFileForm.type | newTitle}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="5">
            <div><strong>档次级别: </strong> {{checkFileForm.productClass | productTitle}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>计量单位: </strong> {{checkFileForm.personalUnit}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>计量值: </strong> {{checkFileForm.personalValue}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>市场单价(元): </strong> {{checkFileForm.listPrice}}</div>
          </el-col>
          <el-col :span="4">
            <div><strong>计划成本单价: </strong> {{checkFileForm.costPrice}}</div>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="4">
            <div><label class="document-btn">辅助信息</label></div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="5">
            <div><strong>保修期: </strong> {{checkFileForm.warranty}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>替代品名称: </strong> {{checkFileForm.twinName}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>替代品编号: </strong> {{checkFileForm.twinId}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>生命周期(年): </strong> {{checkFileForm.lifecycle}}</div>
          </el-col>
          <el-col :span="4">
            <div><strong>保修期: </strong> {{checkFileForm.warranty}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="5">
            <div><strong>生命周期(年): </strong> {{checkFileForm.lifecycle}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>单位: </strong> {{checkFileForm.amountUnit}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>产品经理: </strong> {{checkFileForm.responsiblePerson}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>供应商集合: </strong> {{checkFileForm.providerGroup}}</div>
          </el-col>
          <el-col :span="4">
            <div><strong>产品描述: </strong> {{checkFileForm.productDescribe}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="5">
            <div><strong>登记人: </strong> {{checkFileForm.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>建档时间: </strong> {{checkFileForm.registerTime}}</div>
          </el-col>
          <el-col :span="7">
            <div><strong>产品图片: </strong>
              <img :src=checkFileForm.image width="100px" height="100px">
              <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(checkFileForm.image)"><i
                class="el-icon-zoom-in"></i></span>
            </span>
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-form-item label="审核人" prop="checker">
            <el-input clearable v-model="checkForm.checker"/>
          </el-form-item>
          <el-form-item label="审核时间" prop="checkTime">
            <el-date-picker
              v-model="checkForm.checkTime" readonly
              type="datetime" class="input-class" style="width: 200px">
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "CheckFile",
    data() {
      return {
        rules: {
          check: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          checker: [
            {required: true, message: '请输入复核人', trigger: 'blur'},
            {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'},
          ],
        },
        checkForm: {
          checkTime:'',
          checker: window.sessionStorage.getItem('loginId'),
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
        checkFileForm: {},
        // 获取产品列表查询参数对象
        queryFile: {
          productName: '',
          pageNo: 1,
          pageSize: 7,
          //审核标志0: 等待1: 通过2: 不通过
          checkTag: 0,
          //产品删除标志0: 未删除1: 已删除2永久删除
          deleteTag: 0,
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type: '',
          dataTime: ''
        },
        fileList: [],
        total: 0,
        checkDialogVisible: false,
        URL: 'http://localhost:8080/images/',
        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],

        title: '',
        dialogImageUrl: '',
        dialogVisible: false,
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      // 监听 复核角色对话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.checkDialogVisible = false
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
          return this.$message.error('获取角色列表失败！')
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
      //编辑打开模态框
      showCheckDialog(id) {
        this.checkDialogVisible = true;
        this.axios.post("/files/selectById/" + id).then((resp) => {
          this.checkFileForm = resp.data;
          this.checkFileForm.image = this.URL + this.checkFileForm.image
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        setInterval(() => {
          this.checkForm.checkTime = this.getDataTime(new Date());
        }, 1000)
      },
      //复核
      checkFile(formName) {
        var checked = this.checkForm.check;
        if (!checked) {
          this.$message.error("请选择")
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            params.append("id", (this.checkFileForm.id-0))
            params.append("checkTime",this.checkForm.checkTime)
            params.append("checker",this.checkForm.checker)
            if (checked == 2) {
              this.$confirm('不通过[' + this.checkFileForm.productName + ']工序设计单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                params.append("checkTag","2")
                this.axios.post("/files/checkTag" ,params).then((response) => {
                  if (response.data) {
                    this.$message.success("操作成功")
                    this.queryFile.pageNo = 1;
                    this.getFileList();
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
              this.$confirm('通过[' + this.checkFileForm.productName + ']工序设计单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                params.append("checkTag","1")
                this.axios.post("/files/checkTag", params).then((response) => {
                  if (response.data) {
                    this.$message.success("操作成功")
                    this.queryFile.pageNo = 1;
                    this.getFileList();
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
    filters: {//过滤器
      title(val) {
        return "登记复核【" + val + "】";
      },
      newTitle(val) {
        if (val == 1)
          return "商品";
        else if (val == 2)
          return "物料";
        else
          return "";
      },
      productTitle(val) {
        if (val == 1)
          return "高档";
        else if (val == 2)
          return "中档";
        else
          return "低挡";
      }
    }
  }
</script>

<style scoped>
  .el-input, .el-select, .textarea {
    width: 200px;
  }

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    color: black;
    height: 20px;
    padding: 0 5px;
    margin: 5px;
    line-height: 5px;
    font-size: 20px;
  }
</style>
