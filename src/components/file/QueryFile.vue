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
            <el-form-item label="审核状态">
              <el-select clearable @clear="getFileList" v-model="queryFile.checkTag" placeholder="请选择">
                <el-option label="等待" value="0"/>
                <el-option label="通过" value="1"/>
                <el-option label="不通过" value="2"/>
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

        <el-table-column label="审核状态" width="120px">
          <template slot-scope="scope">
            {{ scope.row.checkTag | newCheckTag }}
          </template>
        </el-table-column>
        <el-table-column label="建档时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="info"
              icon="el-icon-search"
              size="mini"
              @click="showCheckDialog(scope.row.id)"
            >查看档案
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

    <el-dialog :title="checkFileForm.productName | title" :visible.sync="checkDialogVisible" width="80%" @close="checkDialogClosed">

      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="4">
          <div><label class="document-btn">主信息</label></div>
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
        <el-col :span="5">
          <div><strong>复核人: </strong> {{checkFileForm.checker}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>复核时间: </strong> {{checkFileForm.checkTime}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>产品图片: </strong>
            <img :src=URL+checkFileForm.image width="100px" height="100px">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(checkFileForm.image)"><i class="el-icon-zoom-in"></i></span>
            </span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "QueryFile",
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
        // 获取产品列表查询参数对象
        queryFile: {
          productName: '',
          pageNo: 1,
          pageSize: 6,
          //审核标志0: 等待1: 通过2: 不通过
          checkTag:"",
          //产品删除标志0: 未删除1: 已删除2永久删除
          deleteTag: 0,
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type:'',
          dataTime: ''
        },

        fileList: [],
        total: 0,

        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],

        title:'',
        checkDialogVisible: false,

        checkFileForm: {},
        dialogImageUrl: '',
        dialogVisible: false,
        URL:'http://localhost:8080/images/',
      }
    },
    methods: {
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
      //编辑详情模态框
      showCheckDialog(id) {
        this.checkDialogVisible = true;
        this.axios.post("/files/selectById/" + id).then((resp) => {
          this.checkFileForm = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
      },
      // 监听 复核角色对话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.checkDialogVisible = false
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = this.URL+file;
        this.dialogVisible = true;
      },
    },
    created() {
      this.getFileList();
      this.getConfigFileKindList()
    },
    filters: {   //过滤器
      title(val) {
        return "档案详情【" + val + "】";
      },
      newTitle(val) {
        if (val==1)
          return "商品";
        else if(val==2)
          return "物料";
        else
          return "";
      },
      productTitle(val){
        if (val==1)
          return "高档";
        else if(val==2)
          return "中档";
        else
          return "低挡";
      },
      newCheckTag(val){
        if (val==1)
          return "通过";
        else if(val==2)
          return "不通过";
        else
          return "等待";
      }
    }
  }
</script>

<style scoped>
  .el-input,.el-select,.textarea {
    width: 200px;
  }
</style>
