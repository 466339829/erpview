<template>
  <div>
    <!--表单查询库存-->
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
      <el-button type="success" @click="query()" plain icon="el-icon-search">搜索</el-button>
    </el-form>
    <!--表格显示库存数据-->
    <el-table :data="cellList" border stripe>
      <el-table-column prop="firstKindName" label="一级分类"></el-table-column>
      <el-table-column prop="secondKindName" label="一级分类"></el-table-column>
      <el-table-column prop="thirdKindName" label="一级分类"></el-table-column>
      <el-table-column prop="productId" label="产品编号与名称"></el-table-column>
      <el-table-column prop="amount" label="库存数量"></el-table-column>
      <el-table-column prop="maxAmount" label="库存报警上限数"></el-table-column>
      <el-table-column prop="minAmount" label="库存报警下限数"></el-table-column>
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
  </div>
</template>

<script>
    export default {
        name: "ManageSelect",
      data(){
          return {
              pageNo: 1,
              pageSize: 5,
              total:0,
              cellList:[],
            one: "",
            tuo: "",
            san: "",
            cpname:"",
          }
      },
      methods:{
          getcellList(){
            var params=new URLSearchParams();
            params.append("pageNo", this.pageNo);
            params.append("pageSize", this.pageSize);
            params.append("productName", this.cpname);
            params.append("firstKindName", this.one);
            params.append("secondKindName", this.tuo);
            params.append("thirdKindName", this.san);
            this.axios.post("/Cells/selectAll").then(response=>{
              this.cellList=response.data.records;
              this.total=response.data.total;
            }).catch();
          },
          query(){
              this.getcellList();
          },
          sizechage(val) {
            this.pageSize = val
            this.pageNo = 1;
            this.getcellList();
          },
          pagenochage(val) {
            this.pageNo = val
            this.getcellList();
          }
      },
      created() {
          this.getcellLList();
      }
    }
</script>

<style scoped>

</style>
