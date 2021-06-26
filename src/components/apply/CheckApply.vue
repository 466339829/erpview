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
            <el-form-item label="登记时间">
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
              <el-button type="primary" icon="el-icon-search" @click="getApplyList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="applyList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="applyId" label="生产计划编号"></el-table-column>
        <el-table-column prop="register" label="登记人"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
                     :current-page="queryApply.pageNo"
                     :page-sizes="[7, 10, 15, 20]"
                     :page-size="queryApply.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="生产计划单" :visible.sync="checkDialogVisible" width="80%" @close="checkDialogClosed">
      <el-form :inline="true"  :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" style="margin-top: -10px">
      <el-row :gutter="20" style="margin-bottom: -20px">
        <el-col :span="5">
          <div><strong>生产计划编号: </strong> {{apply.applyId}}</div>
        </el-col>
        <el-col :span="7" :offset="12">
          <div>
               <el-form-item  prop="check">
                <el-radio-group v-model="ruleForm.check">
                  <el-radio v-model="ruleForm.check" label="1">通过</el-radio>
                  <el-radio v-model="ruleForm.check" label="2">未通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-button type="warning" icon="el-icon-star-off" @click="submitForm('ruleForm')">确 定</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 内容主体 -->
      <el-divider ></el-divider>
      <!-- 产品物料组成 -->
      <el-table :data="applys" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="productDescribe" label="描述"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
      </el-table>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="6"><div ><strong>登记人: </strong>  {{apply.register}}</div></el-col>
        <el-col :span="6"><div ><strong>登记时间: </strong>  {{apply.registerTime}}</div></el-col>
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
          <el-form-item label="审核意见" prop="checkSuggestion">
            <el-input v-model="ruleForm.checkSuggestion" clearable type="textarea"  style="width: 280px"/>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "CheckApply",
    data(){
      return{
        rules: {
          check: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          checker: [
            {required: true, message: '请输入审核人', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          ],
          checkSuggestion: [
            {required: true, message: '请输入审核意见', trigger: 'blur'},
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
        queryApply:{
          pageNo: 1,
          pageSize: 7,
          dataTime:'',
          checkTag:0
        },
        total:0,
        applyList:[],

        checkDialogVisible:false,
        applys:[],
        apply:{},
        ruleForm:{
          checkSuggestion:'',
          checkTime:'',
          checker:'',
          check:''
        },
      }
    },
    methods: {
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getApplyList();
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
      getApplyList() {
        var params = new URLSearchParams();
        if (this.queryApply.dataTime) {
          params.append("registerTime", this.getDataTime(this.queryApply.dataTime[0]))
          params.append("registerTime2", this.getDataTime(this.queryApply.dataTime[1]))
        }
        Object.keys(this.queryApply).forEach((key) => {
          params.append(key, this.queryApply[key])
        });
        this.axios.post("/apply/applyList", params).then((resp) => {
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
      //编辑审核模态框
      showCheckDialog(row) {
        this.apply = row;
        var params = new URLSearchParams();
        params.append("applyId", row.applyId)
        this.axios.post("/apply/selectByAid", params).then((resp) => {
          this.applys = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
        this.ruleForm.checker=window.sessionStorage.getItem('loginId');
        this.checkDialogVisible = true;
        setInterval(() => {
          this.getData();
        },1000)
      },
      // 监听 复核角色对话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
          this.checkDialogVisible = false;
        })
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

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var checked = this.ruleForm.check;
            if (checked==2) {
              this.$confirm('不通过此生产计划单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var params = new URLSearchParams();
                params.append("applyId", this.apply.applyId);
                params.append("checkTag", "2")
                Object.keys(this.ruleForm).forEach((key) => {
                  params.append(key, this.ruleForm[key])
                });
                this.axios.post("/apply/checkTag", params).then((response) => {
                  if (response.data) {
                    this.$message.success("操作成功")
                    this.queryApply.pageNo = 1;
                    this.getApplyList();
                    this.checkDialogVisible= false;
                  }else {
                    this.$message.error("操作失败")
                  }
                })
              }).catch(() => {
                this.$message.info("已取消不通过")
              });
            }
            if (checked==1) {
              this.$confirm('通过此生产计划单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                var params = new URLSearchParams();
                params.append("applyId", this.apply.applyId);
                params.append("checkTag", "1")
                Object.keys(this.ruleForm).forEach((key) => {
                  params.append(key, this.ruleForm[key])
                });
                this.axios.post("/apply/checkTag",params).then((response) => {
                  if (response.data) {
                    this.$message.success("操作成功")
                    this.queryApply.pageNo = 1;
                    this.getApplyList();
                    this.checkDialogVisible= false;
                  }else {
                    this.$message.error("操作失败")
                  }
                })
              }).catch(() => {
                this.$message.info("已取消通过")
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    created() {
      this.getApplyList();
    }
  }
</script>

<style scoped>

</style>
