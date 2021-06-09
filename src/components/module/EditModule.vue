<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getModuleList"
                        v-model="queryModule.productName"></el-input>
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
        <el-table-column prop="designer" label="设计人" width="130px"></el-table-column>
        <el-table-column prop="costPriceSum" label="物料总成本" width="130px"></el-table-column>
        <el-table-column label="登记时间">
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
              @click="showCheckDialog(scope.row.id)"
            >变更
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryModule.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryModule.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="变更物料组成设计单" :visible.sync="updateDialogVisible" width="90%" @close="updateDialogClosed">
      <el-row :gutter="20">
        <el-col :span="16" :offset="18">
          <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-check" type="primary" @click="addModuleDetails">提  交</el-button>
                 <el-button icon="el-icon-circle-close" type="danger" @click="updateDialogClosed">取消</el-button>
                </span>
          </div>
        </el-col>
      </el-row>
      <el-form
        :model="module"
        ref="module"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="5">
            <div><strong>设计单编号: </strong> {{module.designId}}</div>
          </el-col>
          <el-col :span="5">
            <div>
              <el-form-item label="设计人" prop="designer">
                <el-input clearable v-model="module.designer"></el-input>
              </el-form-item>
            </div>
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
        <div>
          <label class="document-btn">已添加物料</label>
        </div>
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

          <el-table-column prop="amount" label="数量" width="50"></el-table-column>

          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
          <el-table-column label="小计(元)">
            <template slot-scope="scope">
              {{scope.row.amount*scope.row.costPrice}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
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
        <el-row :gutter="20">
          <el-col :span="3">
            <label class="document-btn">新添加物料</label>
          </el-col>
          <el-col :span="16" :offset="17">
            <div>
              <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-circle-plus-outline" type="primary"
                           @click="AddModuleDetailLists">添加新物料</el-button>
               <el-button icon="el-icon-remove-outline" type="info" @click="getSelected">删除新物料</el-button>
                  </span>
            </div>
          </el-col>
        </el-row>
        <!-- 产品物料组成 -->
        <el-table :data="productList"
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

          <el-table-column prop="amount" label="数量" width="170">
            <template slot-scope="scope">
              <el-input clearable v-model.number="scope.row.amount"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="amountUnit" label="单位"></el-table-column>
          <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
          <el-table-column label="小计(元)">
            <template slot-scope="scope">
              {{scope.row.amount*scope.row.costPrice}}
            </template>
          </el-table-column>
        </el-table>
        <span><strong>物料总成本: </strong>  {{module.costPriceSum}}</span><br>
        <el-form-item label="设计要求" prop="moduleDescribe">
          <el-input v-model="module.moduleDescribe" clearable type="textarea" class="xxx"/>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加新物料"
      :visible.sync="moduleDialogVisible"
      width="80%">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="AddModuleDetailLists"
                        v-model="queryModuleDetails.productName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="AddModuleDetailLists">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="wuLiaoList" border stripe>
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
                     :current-page="queryModuleDetails.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryModuleDetails.pageSize"
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
    name: "EditModule",
    data() {
      return {
        rules: {
          check: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
        },
        ruleForm: {},
        // 获取产品列表查询参数对象
        queryModule: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          checkTag: 1,
        },
        moduleList: [],
        total: 0,
        moduleTotal: 0,
        updateDialogVisible: false,
        moduleDialogVisible: false,
        module: {},
        moduleDetailsList: [],
        queryModuleDetails: {
          productName: '',
          pageNo: 1,
          pageSize: 5,
          checkTag: 1,
          deleteTag: 0,
          type: 2
        },
        wuLiaoList: [],
        productList: [],
        multipleSelection: [],
        updateId: '',
      }
    },
    methods: {
      //删除物料
      removeById(row) {
        this.$confirm('将删除[' + row.productName + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = new URLSearchParams();
          params.append("id", row.id)
          params.append("parentId", row.parentId)
          this.axios.post("/moduleDetails/delete", params).then((response) => {
            if (response.data.result) {
              this.getData(this.updateId);
              this.$message.success("删除成功")
            } else {
              this.$message.success("删除失败");
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除")
        });
      },
      //获取选中结果删除物料
      getSelected() {
        var val = this.multipleSelection;
        if (this.productList.length == 0) {
          this.$message.error("请先添加新物料");
          return;
        }
        if (val.length == 0) {
          this.$message.error("请至少选中一个新物料删除");
          return;
        }
        val.forEach((val, index) => {
          //遍历源数据
          this.productList.forEach((v, i) => {
            //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
            if (val.index === v.index) {
              this.productList.splice(i, 1)
            }
          })
        })
        this.$message.success("删除新物料成功");
      },
      //保存选中结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      tableRowClassName(row, index) {
        // 给每条数据添加一个索引
        row.row.index = row.rowIndex
      },
      //点击添加物料
      addModule(row) {
        var bool = true;
        this.moduleDetailsList.forEach((item => {
          if (item.productId == row.productId) {
            this.$message.error("物料已添加")
            bool = false;
          }
        }))
        this.productList.forEach((item) => {
          if (item.productId == row.productId) {
            this.$message.error("请勿重复添加物料")
            bool = false;
          }
        })
        if (bool == true)
          this.productList.push(row);
      },
      handleAddSizeChange(newSize) {
        this.queryModuleDetails.pageSize = newSize
        this.AddModuleDetailLists()
      },
      // 监听 页码值 改变事件
      handleAddCurrentChange(newSize) {
        this.queryModuleDetails.pageNo = newSize
        this.AddModuleDetailLists()
      },
      //查询所有物料
      AddModuleDetailLists() {
        this.moduleDialogVisible = true;
        var params = new URLSearchParams();
        Object.keys(this.queryModuleDetails).forEach((key) => {
          params.append(key, this.queryModuleDetails[key])
        });

        this.axios.post("/files/page", params).then((resp) => {
          this.moduleTotal = resp.data.total;
          this.wuLiaoList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      //提交
      addModuleDetails() {
        if (this.moduleDetailsList.length == 0 && this.productList.length == 0) {
          this.$message.error("请至少添加一个物料");
          return;
        }
        this.moduleDetailsList.forEach((item) => {
          //designId
          item.designId = this.module.designId;
          item.goodsId = this.module.productId;
          item.designer = this.module.designer;
          item.moduleDescribe = this.module.moduleDescribe;
          item.register = this.module.register;
          item.changer = window.sessionStorage.getItem('loginId');
        });
        if (this.productList.length > 0) {
          this.productList.forEach((product) => {
            product.goodsId = this.module.productId;
            product.designer = this.module.designer;
            product.moduleDescribe = this.module.moduleDescribe;
            product.register = this.module.register;
            product.changer = window.sessionStorage.getItem('loginId');
            this.moduleDetailsList.push(product);
          });
        }
        this.axios.post("/module/updateModuleDetails", JSON.stringify(this.moduleDetailsList),
          {headers: {"Content-Type": "application/json"}}).then((response) => {
          if (response.data.result == true) {
            this.$message.success('操作成功!');
            this.getModuleList();
            this.updateDialogVisible = false;
          }
        }).catch(function (error) {
          return this.$message.error('操作失败！')
        })
      },
      // 监听 复核角色对话框的关闭事件
      updateDialogClosed() {
        this.$nextTick(() => {
          this.productList = [];
          this.updateDialogVisible = false;
        })
      },
      //点击变更
      showCheckDialog(id) {
        this.updateId = id;
        this.updateDialogVisible = true;
        this.getData(id);
      },
      getData(id) {
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
        Object.keys(this.queryModule).forEach((key) => {
          params.append(key, this.queryModule[key])
        });
        this.axios.post("/module/page", params).then((resp) => {
          this.total = resp.data.total;
          this.moduleList = resp.data.records;
        }).catch(function (error) {
          return this.$message.error('获取产品列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryModule.pageSize = newSize
        this.getModuleList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryModule.pageNo = newSize
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
  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    color: black;
    height: 20px;
    padding: 0 5px;
    margin: 5px;
    line-height: 5px;
    font-size: 16px;
  }

  .el-input, .textarea, .el-select {
    width: 145px;
  }

  .xxx {
    width: 400px;
  }
</style>
