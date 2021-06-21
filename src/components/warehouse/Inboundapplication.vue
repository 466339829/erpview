<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="20" :offset="16">
        <el-button type="primary" @click="sccp" icon="el-icon-delete">删除产品</el-button>
        <el-button @click="tjcp" type="warning">添加产品</el-button>
        <el-button @click="sc" type="success">登记<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-col>
      <hr>
      <el-row :gutter="24">
        <el-col :span="6" :offset="11">
          <div class="grid-content bg-purple">
            <span>入库申请登记</span>
          </div>
        </el-col>
      </el-row>
      <br>
    </el-row>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="10" :offset="2">
          <div class="grid-content bg-purple">
            <el-form-item label="入库人:">
              <el-input style="width: 220px" clearable v-model="form.storer"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10" :offset="2">
          <div class="grid-content bg-purple-light">
            <el-form-item label="入库理由:">
              <el-select @change="selectGet" v-model="form.reason" placeholder="请选择">
                <el-option clearable
                           v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tabs"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="checked"
          type="selection"
          width="55"
          v-model="checks">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称">
        </el-table-column>
        <el-table-column
          prop="productId"
          label="产品编号">
        </el-table-column>
        <el-table-column
          prop="productDescribe"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="数量" width="190px">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.amount" :min="1" :max="10" label="描述文字"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="costPrice"
          label="成本单价(元)">
        </el-table-column>
        <el-table-column prop="subtotal"
                         label="小计(元)">
          <template slot-scope="scope">
            {{scope.row.amount*scope.row.costPrice}}
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="24">
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总件数:{{num}}
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总金额:{{pricesum}}
          </div>
        </el-col>
        <br>
        <br>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记人:{{register}}
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记时间:{{currentTime}}
          </div>
        </el-col>
      </el-row>
      <br>
      <br>
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="备注:">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="form.remark"
                maxlength="40"
                show-word-limit>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="入库申请登记" width="850px" center :visible.sync="dialogFormVisible">
      <span style="color: #0086b3">符合条件产品档案总数：</span>{{total}}
      <hr>
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="productId"
          label="产品编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="用途类型"
          width="180">
          <template slot-scope="scope">
            {{scope.row.type|type}}
          </template>
        </el-table-column>
        <el-table-column
          prop="costPrice"
          label="成本单价"
          width="180">
        </el-table-column>
        <el-table-column label="入库">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" @click="dhktb(scope.row)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizechage"
        @current-change="pagenochage"
        :current-page="pageNo"
        :page-sizes="[3,5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Inboundapplication",
    data() {
      return {
        form: {
          storer: "",
          reason: '',
          remark: ''
        },
        opvalue: '',
        options: [{
          value: 1,
          label: '生产入库'
        }, {
          value: 2,
          label: '库存初始'
        }, {
          value: 3,
          label: '赠送'
        }, {
          value: 4,
          label: '内部归还'
        }],
        dialogFormVisible: false,
        tabs: [],
        tableData: [],//对话框
        pageNo: 1,
        pageSize: 5,
        total: 0,
        checks: '',
        multipleSelection: [],
        currentTime: new Date(), // 获取当前时间
        register: window.sessionStorage.getItem('loginId'),//登记人
        zjs: 0,//总件数
        sunprice: 0,//总金额
        gatherTag: 1//入库标记
      }
    },
    methods: {
      //添加form:
      sc() {
        var _this=this;
        var params = new URLSearchParams();
        this.tabs.forEach((item) => {
          item.storer = this.form.storer;//入库人
          item.reason = this.form.reason//入库理由
          item.amountSum = this.zjs//总件数
          item.costPriceSum = this.sunprice//总金额
          item.gatheredAmountSum = this.zjs//确认总件数
          item.remark = this.form.remark//备注
          item.register = this.register//登记人
          item.registerTime = this.currentTime//登记时间
          item.productDescribe = this.productDescribe//描述
          item.gatheredAmount = this.tabs.amount//确认入库件数
          item.gatherTag = this.gatherTag//入库标志
        })
       this.axios.post("/gath/gathset",
          JSON.stringify(this.tabs),
         {headers:{"Content-Type":"application/json"}} ).then(function (response) {
         _this.$message({
           showClose: true,
           message: '恭喜你，登记成功',
           type: 'success'
         });
              this.form="";
        }).catch();
      },
      //删除产品按钮
      //获取表格单选框索引删除
      sccp() {
        this.multipleSelection.forEach((val, index) => {
          this.tabs.forEach((item, i) => {
            if (val.index == item.index) {
              this.tabs.splice(i, 1)
            }
          })
        })
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
      },
      tjcp() {
        var params = new URLSearchParams();
        params.append("pageNo", this.pageNo);
        params.append("pageSize", this.pageSize);
        this.dialogFormVisible = true
        this.axios.post("/files/FilePages2", params).then((response) => {
          this.tableData = response.data.records;
          this.total = response.data.total;
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      dhktb(row) {
        var temp = this.tabs.find((item) => {
          return item.id == row.id;
        })
        if (temp == undefined) {
          this.tabs.push(row);
        }
      },
      tableRowClassName({row, rowIndex}) {
        row.index = rowIndex;
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      sizechage(val) {
        this.pageSize = val
        this.pageNo = 1;
        this.tjcp()
      },
      pagenochage(val) {
        this.pageNo = val
        this.tjcp()
      },
      selectGet(val) {
        //传进来的val是select组件选中的value值，也就是一个fruitEnName
        var obj = {}
        obj = this.options.find(function (item) {
          return item.value == val
        })
        //obj 就是被选中的那个对象，也就能拿到label值了。
        // console.log(obj.label)//label值
        this.form["reason"] = val;
      }
    },
    filters: {
      type(val) {
        if (val == 1) {
          return "商品"
        } else if (val == 2) {
          return "物料"
        }
      }
    },
    created() {
      var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(function () {
        _this.currentTime = //修改数据date
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate() +
          " " +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ": " +
          new Date().getSeconds();
      }, 1000);

    },
    computed: {
      pricesum() {
        var price = 0;
        var _this = this;
        this.tabs.forEach((item) => {
          price += (item.amount - 0) * item.costPrice - 0;
        })
        this.sunprice = price;
        return price;
      },
      num() {
        var i = 0;
        var _this = this;
        this.tabs.forEach((item) => {
          i += (item.amount - 0);
        })
        this.zjs = i;
        return i;
      }
    }
  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
