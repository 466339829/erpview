<template>
  <div>
  <el-card>

    <el-row :gutter="20">
      <el-col :span="16" :offset="16">
        <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-circle-plus-outline" type="primary" v-if="viewShow==1"
                           @click="getFileList">添加产品</el-button>
                <el-button icon="el-icon-remove-outline" type="primary" v-if="viewShow==1"
                           @click="getSelected">删除产品</el-button>
                <el-button icon="el-icon-view" type="primary" v-if="viewShow==1"
                           @click="updateViewShow">预览</el-button>
                <el-button icon="el-icon-back" type="primary" v-if="viewShow==2"
                           @click="viewShow=1">返回</el-button>
                <el-button icon="el-icon-view" type="primary" v-if="viewShow==2"
                           @click="addApplyList">提交</el-button>
                </span>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">
        <div><label class="document-btn">生产计划单</label></div>
      </el-col>
    </el-row>

    <el-divider></el-divider>

    <div class="app-container">
      <el-form :model="addApplyForm"
               ref="addApplyForm" :rules="addApplyFormRules":inline="true" label-width="120px">

        <el-form-item label="生产理由" v-if="viewShow==1" >
          <el-input placeholder="新发生" disabled/>
        </el-form-item>
        <el-form-item label="登记人" prop="register" v-if="viewShow==1">
          <el-input  clearable v-model="addApplyForm.register"/>
        </el-form-item>
        <el-form-item label="登记时间" v-if="viewShow==1">
          <el-date-picker readonly  type="datetime"
                            v-model="addApplyForm.registerTime">
          </el-date-picker>
        </el-form-item>

        <el-row :gutter="20" v-if="viewShow==2">
          <el-col :span="5">
            <div><strong>生产理由: </strong> 新发生</div>
          </el-col>
          <el-col :span="5">
            <div><strong>登记人: </strong> {{addApplyForm.register}}</div>
          </el-col>
          <el-col :span="5">
            <div><strong>登记时间: </strong> {{addApplyForm.registerTime}}</div>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <!-- 产品列表区域 -->
        <el-table :data="designProcedure" :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="productId" label="产品编号"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="productDescribe" label="产品描述"></el-table-column>
          <el-table-column prop="costPrice" label="价格(元)"></el-table-column>
          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column label="小计(元)">
            <template slot-scope="scope">
              {{scope.row.amount*scope.row.costPrice}}
            </template>
          </el-table-column>

          <el-table-column v-if="viewShow==1" prop="amount" label="数量">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.amount" maxlength="4"
                        oninput="value=value.replace(/[^\d]/g,'')"/>
            </template>
          </el-table-column>

          <el-table-column v-if="viewShow==2" prop="amount" label="数量"></el-table-column>
        </el-table>
        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-top: 20px;margin-left:70px">
          <el-col :span="5">
            <div><span>总件数: </span> {{countSum}}</div>
          </el-col>
          <el-col :span="5">
            <div><span>总金额: </span> {{moneySum}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;" v-if="viewShow==1">
          <el-col :span="15">
            <el-form-item label="备注" prop="remark">
              <el-input clearable v-model="addApplyForm.remark" type="textarea" style="width: 300px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;" v-if="viewShow==2">
          <el-col :span="9">
            <div><strong>备注: </strong> {{addApplyForm.remark}}</div>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </el-card>

    <!-- 添加产品的对话框 -->
    <el-dialog title="添加产品" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">

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
        <el-table-column label="用途类型" >
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="firstKindName" label="I级分类" width="120px"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类" width="120px"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类" width="120px"></el-table-column>
         <el-table-column prop="costPrice" label="价格(元)"></el-table-column>
        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column label="生产">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="addApply(scope.row)"
            >生产
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


    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "AddApply",
    data(){
      return{
        addApplyFormRules: {
          register: [
            {required: true, message: '请输入登记人', trigger: 'blur'},
            {min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur'},
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 6 个字符', trigger: 'blur'},
          ],
        },
        viewShow:1,
        addApplyForm:{
          register:'',
          remark:'',
          registerTime:''
        },
        registerTime:'',
        value1:'',

        designProcedure:[],

        addDialogVisible: false,
        fileList:[],
        // 获取产品列表查询参数对象
        queryFile: {
          productName: '',
          pageNo: 1,
          pageSize: 7,
          //审核标志0: 等待1: 通过2: 不通过
          checkTag: 1,
          //产品删除标志0: 未删除1: 已删除2永久删除
          deleteTag: 0,
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type:1,
          designModuleTag:1,
          designProcedureTag:1,
        },
        total:0,

        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],

        multipleSelection: [],
      }
    },
    methods:{
      getDataTime() {//默认显示今天
        setInterval(() => {
          var dataTime = new Date();
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
          this.addApplyForm.registerTime =nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
        },1000)
      },
      //获取产品列表
      getFileList() {
        var params = new URLSearchParams();
        Object.keys(this.queryFile).forEach((key) => {
          params.append(key, this.queryFile[key])
        });
        this.axios.post("/files/page", params).then((resp) => {
          this.total = resp.data.total;
          resp.data.list.forEach((item)=>{
            item.amount =1
          })
          this.fileList = resp.data.list;
          this.addDialogVisible = true;
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
      // 监听 复核角色对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.addDialogVisible = false
        })
      },
      addApply(row){
        var bool = true;
        this.designProcedure.forEach((item) => {
          if (item.productId == row.productId) {
            this.$message.error("请勿重复添加物料")
            bool = false;
          }
        })
        if (bool == true)
          this.designProcedure.push(row);
      },
      updateViewShow(){
        var bool = true;
        if (this.designProcedure.length==0){
          bool = false;
          this.$message.error("请至少添加一个产品")
        }
        this.$refs.addApplyForm.validate((valid) => {
          if (valid) {
            if (bool==true) {
              this.viewShow = 2;
            }
          }
        })

      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 添加索引
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //获取选中结果删除物料
      getSelected() {
        var val = this.multipleSelection;
        if (this.designProcedure.length == 0) {
          this.$message.error("请先添加产品");
          return;
        }
        if (val.length == 0) {
          this.$message.error("请至少选中一个产品删除");
          return;
        }
        val.forEach((val, index) => {
          //遍历源数据
          this.designProcedure.forEach((v, i) => {
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.index === v.index) {
              this.designProcedure.splice(i, 1)
            }
          })
        })
        this.$message.success("删除产品成功");
      },
      getData(dataTime) {//默认显示今天
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
      //提交
      addApplyList(){
        this.designProcedure.forEach((item)=>{
          item.id="";
          item.appltId="";
          item.register = this.addApplyForm.register;
          item.remark = this.addApplyForm.remark;
          item.registerTime =this.addApplyForm.registerTime ;
          item.checkTag = 0;
          item.manufactureTag = 0;
          item.checker ="";
          item.checkSuggestion ="";
          item.checkTime ="";
          item.manufactureTag =0;
        })
        this.axios.post("/apply/addApply", JSON.stringify(this.designProcedure),
          {headers: {"Content-Type": "application/json"}}).then((response) => {
            if (response.data) {
              this.designProcedure = [];
              this.addApplyForm = {};
              this.viewShow=1;
              this.$message.success('操作成功,等待审核!');
            }
          }).catch(function (error) {
          return this.$message.error('操作失败！')
        })
      }
    },
    mounted() {

    },
    created() {
      this.getConfigFileKindList();
      this.getDataTime()
    },
    filters: {//过滤器
      title(val) {
        return "登记复核【" + val + "】";
      },
      newTitle(val) {
        if (val==1)
          return "商品";
        else if(val==2)
          return "物料";
        else
          return "";
      },

    },
    computed:{
      moneySum(){
        var sum =0;//scope.row.amount*scope.row.realCostPrice
        this.designProcedure.forEach( (item) =>{
          sum+= item.amount*item.costPrice;
        })
        return sum;
      },
      countSum(){
        return this.designProcedure.length
      }
    },

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
    margin: 5px;
    line-height: 5px;
    font-size: 20px;
  }
</style>
