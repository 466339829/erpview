<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="一级分类：">
        <el-input style="width: 80px" clearable v-model="one"></el-input>
      </el-form-item>
      <el-form-item label="二级分类：">
        <el-input clearable style="width: 80px" v-model="tuo"></el-input>
      </el-form-item>
      <el-form-item label="三级分类：">
        <el-input clearable style="width: 80px" v-model="san"></el-input>
      </el-form-item>
      <el-form-item label="产品名称：">
        <el-input placeholder="可输入产品名称..." clearable v-model="cpname"></el-input>
      </el-form-item>
      <el-button type="success" @click="cx" plain icon="el-icon-search">搜索</el-button>
    </el-form>
    <el-table
      :data="tableData"
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
      <el-table-column label="操作" :render-header="heand2">
        <template slot-scope="scope">
          <el-button @click="drawer = true" type="success">配置</el-button>
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
    <!--    抽屉-->
    <el-drawer
      title="安全库存配置单"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :size="size">
      <hr>
      <br>
<!--      抽屉-->
      <el-form label-width="60px" :modal="ctfrom">
        <el-row :gutter="20">
          <el-col :span="10" :offset="1">
            <div>
              <span>产品名称:</span>
            </div>
          </el-col>
          <el-col :span="10" :offset="1">
            <div>
              <span>产品编号:</span>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-row :gutter="24">
          <el-col :span="12">
            <div>
              <el-form-item label="库存上限:">
                <el-input v-model="ctfrom.productName" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="库存下限:">
                <el-input v-model="ctfrom.productId" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <div>
              <el-form-item label="登记人:">
                <el-input v-model="ctfrom.productName" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="设计人:">
                <el-input v-model="ctfrom.productId" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-table
          :data="tabs"
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="date"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="库房名称">
          </el-table-column>
          <el-table-column
            prop="address"
            label="储存地址编号">
          </el-table-column>
          <el-table-column
            prop="address"
            label="储存地址名称">
          </el-table-column>
          <el-table-column label="存储单元简介">
            <template slot-scope="scope">
              <el-input
                size="mini"
                placeholder="请输入内容"
                v-model="input4">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="最大存储量">
            <template slot-scope="scope">
              <el-input
                size="mini"
                placeholder="请输入内容"
                v-model="input4">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="储存单位">
            <template slot-scope="scope">
              <el-input
                size="mini"
                placeholder="请输入内容"
                v-model="input4">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 20px 0;">
        </div>
        <span>配置要求:</span>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="pz"
          maxlength="40"
          show-word-limit
        >
        </el-input>
        <br>
        <br>
        <el-row :gutter="20">
          <el-col :span="6" :offset="14"><div class="grid-content bg-purple">
            系统当前时间:
          </div></el-col>
        </el-row>
      </el-form>
      <br>
      <br>
      <el-row :gutter="20">
        <el-col :span="6" :offset="10"><div class="grid-content bg-purple">

          <el-row>
            <el-button type="primary" :loading="isload" @click="f1">{{txt}}</el-button>
          </el-row>

        </div></el-col>
      </el-row>

    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: "Safetystock",
    data() {
      return {
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        cpname: "",
        one: "",
        tuo: "",
        san: "",
        mol: false,
        drawer: false,
        size: '800px',
        ctfrom: {},
        tabs: [],
        pz:'',
        txt:'提交'


      }
    },
    methods: {
      f1(){
        this.isload=true;
        this.txt="提交中";
        var _this =this;
        //模拟在回调函数中  还原按钮
        var s=setTimeout(function () {
          _this.isload=false;
          _this.txt="提交成功";
        },2000);
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      tables() {
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageNo", this.pageNo);
        params.append("pageSize", this.pageSize);
        params.append("productName", this.cpname)
        params.append("firstKindName", this.one)
        params.append("secondKindName", this.tuo)
        params.append("thirdKindName", this.san)
        this.axios.post("/files/Filespage", params).then(function (response) {
          _this.tableData = response.data.records;
          _this.total = response.data.total;
        }).catch()
      },
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
        this.tables();
      },
      renderHeader(h, {column}) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', column.label),
            h('i', {
              class: 'el-icon-s-check',
              style: 'color:pink;margin-left:5px;'
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
              style: 'color:pink;margin-left:5px;'
            })
          ],
        );
      }
    },

    created() {
      this.tables();
    }
  }
</script>

<style scoped>

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
