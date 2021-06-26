<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="一级分类：">
        <el-input style="width: 80px" clearable v-model="ones"></el-input>
      </el-form-item>
      <el-form-item label="二级分类：">
        <el-input clearable style="width: 80px" v-model="tuos"></el-input>
      </el-form-item>
      <el-form-item label="三级分类：">
        <el-input clearable style="width: 80px" v-model="sans"></el-input>
      </el-form-item>
      <el-form-item label="产品名称：">
        <el-input placeholder="可输入产品名称..." clearable v-model="cpnames"></el-input>
      </el-form-item>
      <el-button type="success" @click="cx" plain icon="el-icon-search">搜索</el-button>
    </el-form>
    <el-table
      :data="tabs"
      border
      highlight-current-row
      stripe
      style="width: 100%">
      <el-table-column
        prop="productId"
        width="180"
        label="产品编号" :render-header="renderHeader">
      </el-table-column>

      <el-table-column
        prop="productName"
        label="产品名称" :render-header="renderHeader"
        width="180">
      </el-table-column>
      <el-table-column
        prop="firstKindName"
        label="一级分类" :render-header="renderHeader"
        width="180">
      </el-table-column>
      <el-table-column
        prop="secondKindName"
        label="二级分类" :render-header="renderHeader">
      </el-table-column>
      <el-table-column
        prop="thirdKindName"
        label="三级分类" :render-header="renderHeader">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="建档时间" :render-header="renderHeader">
      </el-table-column>
      <el-table-column label="操作" :render-header="heand2">
        <template slot-scope="scope">
          <el-button @click=FHbtn(scope.row) type="warning">复核</el-button>
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
    <!-- Form -->
    <el-dialog  title="安全配置复核" width="900px" center :visible.sync="dialogFormVisible">
      <el-form :model="FHfrom">
        <el-row :gutter="20">
          <el-col :span="10" :offset="1">
            <div>
              <span>产品名称:&nbsp&nbsp&nbsp&nbsp&nbsp{{FHfrom.productName}}</span>
            </div>
          </el-col>
          <el-col :span="10" :offset="1">
            <div>
              <span>产品编号:&nbsp&nbsp&nbsp&nbsp&nbsp{{FHfrom.productId}}</span>
            </div>
          </el-col>
        </el-row>
        <br>
        <br>
        <el-row :gutter="24">
          <el-col :span="12">
            <div>
              <el-form-item label="库存上限" :label-width="formLabelWidth">
                <el-input suffix-icon="el-icon-circle-plus-outline" :disabled="true" size="mini"
                          v-model="FHfrom.maxAmount" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="库存下限:" :label-width="formLabelWidth">
                <el-input suffix-icon="el-icon-remove-outline" :disabled="true" size="mini" v-model="FHfrom.minAmount"
                          clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <div>
              &nbsp&nbsp<span>登记人:&nbsp&nbsp&nbsp&nbsp&nbsp{{FHfrom.register}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <span>设计人:&nbsp&nbsp&nbsp&nbsp&nbsp{{FHfrom.designer}}</span>
            </div>
          </el-col>
        </el-row>
        <hr>

        <el-table
          :data="tabsa"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="kc"
            label="库房名称">
          </el-table-column>
          <el-table-column
            prop="ycc"
            label="储存地址编号">
          </el-table-column>
          <el-table-column
            prop="menuca"
            label="储存地址名称">
          </el-table-column>
          <el-table-column label="最大存储量">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="mini"
                placeholder="请输入内容"
                v-model="FHfrom.maxCapacityAmount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="储存单位">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="mini"
                placeholder="请输入内容"
                v-model="FHfrom.amountUnit">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 20px 0;">
        </div>
        <br>
        <span>配置要求:</span>
        <el-input
          :disabled="true"
          type="textarea"
          placeholder="请输入内容"
          v-model="FHfrom.config"
          maxlength="40"
          show-word-limit
        >
        </el-input>
        <br>
        <br>
        <el-row :gutter="20">
          <el-col :span="10" :offset="12">
            <div class="grid-content bg-purple">
              <span v-model="FHfrom.registerTime">系统当前时间:&nbsp&nbsp&nbsp{{currentTime}}</span>
            </div>
            &nbsp
            <el-switch
              v-model="value1"
              active-text="通过复核"
              inactive-text="未通过">
            </el-switch>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="Fhisok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Library",
    data() {
      return {
        tabs: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        ones: "",
        tuos: "",
        sans: "",
        cpnames: "",
        dialogFormVisible: false,//模态框
        dialogTableVisible: true,
        FHfrom: {},
        formLabelWidth: "75px",
        tabsa: [{
          id: 1, kc: "成品库", ycc: "01-01-01", menuca: "",
        }],
        currentTime: new Date(), // 获取当前时间
        value1: true,
        ceid: '',
        fename: '',
        register: window.sessionStorage.getItem('loginId'),//复核人
        checkTag: 2
      }
    },
    methods: {
      Fhisok() {
        var kg = this.value1;
        var ceid = this.ceid;
        var fenames = this.fename;
        var params = new URLSearchParams();
        if (kg == false) {
          params.append("id", ceid)
          params.append("productId", fenames);
          this.axios.post("/Cells/fudeleteid", params).then((response) => {
            this.dialogFormVisible = false;
            this.$message({
              message: '已拒绝复核，已转发重新复核！！！',
              type: 'warning'
            });
            this.tbsdata()
          }).catch()
        } else if (kg == true) {
          params.append("id", ceid);
          params.append("checker", this.register);
          params.append("checkTime", this.currentTime);
          params.append("checkTag", this.checkTag);
          this.axios.post("/Cells/updateio", params).then(() => {
            this.dialogFormVisible = false;
            this.$message({
              message: '复核成功，已成功复核！！！',
              type: 'warning'
            });
            this.tbsdata()
          }).catch()
        }
      },
      FHbtn(item) {
        this.fename = item.productId;
        this.ceid = item.id
        this.dialogFormVisible = true
        var params = new URLSearchParams();
        params.append("id", item.id);
        this.axios.post("/Cells/fuHebyid", params).then((response) => {
          this.FHfrom = response.data
        }).catch()
      },
      //初始化查询
      tbsdata() {
        var params = new URLSearchParams();
        params.append("pageNo", this.pageNo);
        params.append("pageSize", this.pageSize);
        params.append("productName", this.cpnames)
        params.append("firstKindName", this.ones)
        params.append("secondKindName", this.tuos)
        params.append("thirdKindName", this.sans)
        this.axios.post("/Cells/fuHe", params).then((response) => {
          this.tabs = response.data.list;
          this.total = response.data.total;
          this.feid = response.data.list.id;
        }).catch()
      },

      //分页
      sizechage(val) {
        this.pageSize = val
        this.pageNo = 1;
        this.tables()
      },
      pagenochage(val) {
        this.pageNo = val
        this.tables()
      },
      cx() {
        this.tbsdata()
      },
      renderHeader(h, {column}) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', column.label),
            h('i', {
              class: 'el-icon-s-check',
              style: 'color:#67C23A;margin-left:5px;'
            })
          ],
        );
      },
      heand2(h, {column}) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', column.label),
            h('i', {
              class: 'el-icon-loading',
              style: 'color:#67C23A;margin-left:5px;'
            })
          ],
        );
      },
    },
    //弹框
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

      this.tbsdata();
    },
    filters: {
      type(val) {
        if (val == 1) {
          return "商品"
        } else if (val == 2) {
          return "物料"
        }
      },
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    }

  }

</script>

<style scoped>

</style>
