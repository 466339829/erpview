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
      <el-button type="success"@click="cx" plain icon="el-icon-search">搜索</el-button>
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
      <el-form label-width="80px" :modal="ctfrom">
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
              产品名称:CPU
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            产品编号:CPU
          </div></el-col>
        </el-row>

      </el-form>
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
        mol:false,
        drawer:false,
        size:'800px',
        ctfrom:{}

      }
    },
    methods: {
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
      renderHeader (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', column.label),
            h('i', {
              class:'el-icon-s-check',
              style:'color:pink;margin-left:5px;'
            })
          ],
        );
      },
      heand2 (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', column.label),
            h('i', {
              class:'el-icon-loading',
              style:'color:pink;margin-left:5px;'
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


</style>
