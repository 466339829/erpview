<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getModuleList"
                        v-model="selectModule.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getModuleList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="moduleList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="designId" label="设计单编号"></el-table-column>
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称" width="130px"></el-table-column>
        <el-table-column prop="costPriceSum" label="物料总成本" width="130px"></el-table-column>
        <el-table-column label="登记时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column prop="checkTag" label="审核状态" width="130px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-search"
              size="mini"
              @click="showCheckDialog(scope.row.id)"
            >查看设计单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="selectModule.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="selectModule.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="物料组成设计单" :visible.sync="checkDialogVisible" width="80%" @close="checkDialogClosed">
      <el-row :gutter="20">
        <el-col :span="5">
          <div><strong>设计单编号: </strong> {{module.designId}}</div>
        </el-col>
        <el-col :span="3">
          <div><strong>设计人: </strong> {{module.designer}}</div>
        </el-col>
        <el-col :span="4">
          <div><strong>产品名称: </strong> {{module.productName}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>产品编号: </strong> {{module.productId}}</div>
        </el-col>

      </el-row>
      <!-- 内容主体 -->
      <el-divider></el-divider>
      <!-- 产品物料组成 -->
      <el-table :data="moduleDetailsList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="物料编号"></el-table-column>
        <el-table-column prop="productName" label="物料名称"></el-table-column>
        <el-table-column label="用途类型" width="120px" prop="type">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="productDescribe" label="描述"></el-table-column>

        <el-table-column prop="amount" label="数量" width="170"></el-table-column>

        <el-table-column prop="amountUnit" label="单位"></el-table-column>
        <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
        <el-table-column label="小计(元)">
          <template slot-scope="scope">
            {{scope.row.amount*scope.row.costPrice}}
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="6"><div ><strong>物料总成本: </strong>  {{module.costPriceSum}}</div></el-col>
        <el-col :span="6"><div ><strong>登记人: </strong>  {{module.register}}</div></el-col>
        <el-col :span="6"><div ><strong>登记时间: </strong>  {{module.registerTime}}</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"><div ><strong>复核人: </strong>  {{module.checker}}</div></el-col>
        <el-col :span="6"><div ><strong>复核时间: </strong>  {{module.checkTime}}</div></el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="6"><div ><strong>设计要求: </strong>  {{module.moduleDescribe}}</div></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "QueryModule",
    data() {
      return {
        ruleForm:{},
        // 获取产品列表查询参数对象
        selectModule: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
        },
        moduleList: [],
        total: 0,
        checkDialogVisible: false,
        module: {},
        moduleDetailsList: [],
      }
    },
    methods: {
      // 监听 复核角色对话框的关闭事件
      checkDialogClosed() {
        this.$nextTick(() => {
          this.checkDialogVisible = false
        })
      },
      showCheckDialog(id) {
        this.checkDialogVisible = true;
        this.axios.post("/module/selectById/" + id).then((resp) => {
          this.module = resp.data.module;
          this.moduleDetailsList = resp.data.moduleDetailsList
        }).catch(function (error) {
          return this.$message.error('获取角色信息失败！')
        })
      },
      //获取产品列表
      getModuleList() {
        var params = new URLSearchParams();
        Object.keys(this.selectModule).forEach((key) => {
          params.append(key, this.selectModule[key])
        });
        this.axios.post("/module/page", params).then((resp) => {
          resp.data.records.forEach((item)=>{
            if (item.checkTag==0)
              item.checkTag='等待';
            else if (item.checkTag==1)
              item.checkTag='通过';
            else
              item.checkTag='不通过';
          })
          this.total = resp.data.total;
          this.moduleList = resp.data.records;

        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.selectModule.pageSize = newSize
        this.getModuleList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.selectModule.pageNo = newSize
        this.getModuleList()
      },

    },
    created() {
      this.getModuleList()
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

</style>
