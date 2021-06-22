<template>
  <div>

    <el-table
      :data="tabs"
      style="width: 100%">
      <el-table-column
        prop="gatherId"
        label="入库单编号">
      </el-table-column>
      <el-table-column
        prop="storer"
        label="入库人">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="入库时间">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="入库理由">
        <template slot-scope="scope">
          {{scope.row.reason|reason}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="fh(scope.row.id)">复核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title=入库单复核 width="900px" center :visible.sync="dialogFormVisible">
      <el-row :gutter="24">
        <el-col :span="20" :offset="15">
          <el-radio v-model="radio" label="1">通过复核</el-radio>
          <el-radio v-model="radio" label="2">拒绝复核</el-radio>
          <el-button @click="chti(tabs[0].id)" type="danger">提交</el-button>
        </el-col>
        <hr>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10" :offset="2">
          <div class="grid-content bg-purple">
            入库人:
            <el-input :disabled="true" style="width: 220px" clearable v-model="tbdate[0].storer"></el-input>
          </div>
        </el-col>

        <el-col :span="10" :offset="2">
          <div class="grid-content bg-purple-light">
            <el-form label-width="120px">
              <el-form-item label="入库理由">
                <el-select :disabled="true" v-model="tbdate[0].reason" placeholder="请选择">
                  <el-option clearable
                             v-for="item in options"
                             :key="item.value"
                             :value="item.value"
                             :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tbdate"
        style="width: 100%">
        <el-table-column
          prop="productName"
          label="产品名称">
        </el-table-column>
        <el-table-column
          prop="productId"
          label="产品编号"
          width="180px">
        </el-table-column>
        <el-table-column
          prop="productDescribe"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="数量" width="190px">
          <template slot-scope="scope">
            <el-input-number :disabled="true" v-model="scope.row.amount" :min="1" :max="10"
                             label="描述文字"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="costPrice"
          label="成本单价(元)">
        </el-table-column>
        <el-table-column
          prop="subtotal"
          label="小计(元)">
        </el-table-column>
      </el-table>
      <el-row :gutter="24">
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总件数:{{tbdate[0].amountSum}}
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总金额:{{tbdate[0].costPriceSum}}
          </div>
        </el-col>
        <br>
        <br>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复核人:{{register}}
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复核时间:{{currentTime}}
          </div>
        </el-col>
        <br>
        <br>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记人:{{tbdate[0].register}}
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="grid-content bg-purple-light">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记时间:{{tbdate[0].registerTime}}
          </div>
        </el-col>
      </el-row>
      <br>
      <br>
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="备注:" prop="remark">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="tbdate.remark"
                maxlength="40"
                show-word-limit>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-pagination
      @size-change="sizechage"
      @current-change="pagenochage"
      :current-page="pageNo"
      :page-sizes="[3,5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "InboundappFuhe",
    data() {
      return {
        tableDate: [],
        tabs: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        dialogFormVisible: false,
        tbdate: [{}],
        radio: 0,
        okfuid: 0,
        currentTime: new Date(),
        register: window.sessionStorage.getItem('loginId'),//登记人
        options: [{
          value: "1",
          label: '生产入库'
        }, {
          value: "2",
          label: '库存初始'
        }, {
          value: "3",
          label: '赠送'
        }, {
          value: "4",
          label: '内部归还'
        }],
      }
    },
    methods: {
      chti() {
        var params = new URLSearchParams();
        if (this.radio == 1) {
          params.append("id",this.okfuid)
          params.append("checker", this.register)
          params.append("checkTime", this.currentTime)
          params.append("checkTag", this.radio)
          this.axios.post("/Gath/Shenheok", params).then(() => {
            this.$message({
              message: '恭喜你，提交成功',
              type: 'success'
            });
            this.dialogFormVisible=false
          })
        }else if (this.radio==2){
          params.append("checker", this.register)
          params.append("checkTime", this.currentTime)
          params.append("checkTag", this.radio)
          params.append("id",this.okfuid)
          this.axios.post("/Gath/Shenheok", params).then(() => {
            this.$message({
              message: '恭喜你，提交成功',
              type: 'success'
            });
          })
          this.dialogFormVisible=false
        }
      },
      fh(id) {
        this.okfuid = id
        this.dialogFormVisible = true
        var params = new URLSearchParams();
        params.append("id", id)
        this.axios.post("/GathDtos/lisat", params).then((response) => {
          this.tbdate = response.data
        })
      },
      bbs() {
        var params = new URLSearchParams();
        params.append("pageNo", this.pageNo)
        params.append("pageSize", this.pageSize)
        this.axios.post("/Gath/pages", params).then((response) => {
          this.tabs = response.data.records;
          this.total = response.data.total
        })
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
      this.bbs();
    },
    filters: {
      reason(val) {
        if (val == 1) {
          return "生产入库"
        } else if (val == 2) {
          return "库存初始"
        } else if (val == 3) {
          return "赠送"
        } else if (val == 4) {
          return "内部归还"
        } else if (val == 5) {
          return "其他归还"
        }
      }

    }
  }
</script>

<style scoped>

</style>
