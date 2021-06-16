<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="20" :offset="18">
        <el-button type="danger" icon="el-icon-delete" circle>删除产品</el-button>
        <el-button icon="el-icon-search" type="primary" @click="tjcp" circle>添加产品</el-button>
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
              <el-input style="width: 220px" clearable v-model="form.name"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10" :offset="2">
          <div class="grid-content bg-purple-light">
            <el-form-item label="入库理由:">
              <el-select v-model="opvalue" placeholder="请选择">
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
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="id"
          type="selection"
          width="55">
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
        <el-table-column prop="personalUnit" label="小计(元)">
          <template slot-scope="scope">
            {{scope.row.amount*scope.row.costPrice}}
          </template>
        </el-table-column>
      </el-table>

      <el-row :gutter="24">
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总件数:0
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总金额:
          </div>
        </el-col>
        <br>
        <br>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记人:0
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记时间:
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
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="入库申请登记" width="900px" center :visible.sync="dialogFormVisible">
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
<!--        <el-table-column-->
<!--          prop="amountUnit"-->
<!--          label="单位"-->
<!--          width="180">-->
<!--        </el-table-column>-->
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
        num: 0,
        dialogFormVisible: false,
        tabs: [],
        tableData: [],//对话框
        pageNo: 1,
        pageSize: 5,
        total: 0,
      }
    },
    methods: {
      op(item){
          var run =this.num*item.costPrice;
          item.costPrice=run;
      },
      tjcp() {
        var params=new URLSearchParams();
        params.append("pageNo", this.pageNo);
        params.append("pageSize", this.pageSize);
        this.dialogFormVisible = true
        this.axios.post("/files/FilePages2",params).then((response)=>{
        this.tableData=response.data.records;
        this.total=response.data.total;
        })
      },
      dhktb(row){
        alert(row)
        this.tabs.find((item)=>{

        })
        this.tabs.push(row);
        this.tabs;
      },
      tableRowClassName({row, rowIndex}) {
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
    },
    filters: {
      type(val) {
        if (val == 1) {
          return "商品"
        } else if (val == 2) {
          return "物料"
        }
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
