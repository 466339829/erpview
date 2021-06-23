<template>
  <div>
    <el-table
      ref="filterTable"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="gatherId"
        label="入库单编号"width="150 px">
      </el-table-column>
      <el-table-column
        prop="storer"
        label="入库人">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="入库理由">
        <template slot-scope="scope">
          <span v-if="scope.row.reason==1" style="color:darkorange">{{scope.row.reason|reason}}</span>
          <span v-if="scope.row.reason==2" style="color:yellow">{{scope.row.reason|reason}}</span>
          <span v-if="scope.row.reason==3" style="color:darkcyan">{{scope.row.reason|reason}}</span>
          <span v-if="scope.row.reason==4" style="color:deepskyblue">{{scope.row.reason|reason}}</span>
          <span v-if="scope.row.reason==5" style="color:orchid">{{scope.row.reason|reason}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="总金额">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="register"
        label="登记人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间"width="150 px">
      </el-table-column>
      <el-table-column
        prop="checker"
        label="复核人">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="复核时间">
      </el-table-column>
      <el-table-column
        prop="checkTag"
        label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag==0" style="color: olivedrab">{{scope.row.checkTag|checkTag}}</span>
          <span v-if="scope.row.checkTag==1" style="color:blue">{{scope.row.checkTag|checkTag}}</span>
          <span v-if="scope.row.checkTag==2" style="color:red">{{scope.row.checkTag|checkTag}}</span>
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
  </div>
</template>

<script>
  export default {
    name: "Inboundquery",
    data() {
      return {
        tableData: [],
        pageNo: 1,
        pageSize: 3,
        total: 0
      }
    },
    methods: {
      tabDate() {
        var params = new URLSearchParams();
        params.append("pageNo", this.pageNo);
        params.append("pageSize", this.pageSize);
        this.axios.post("/Gath/pages2",params).then((response)=>{
          this.tableData=response.data.records
          this.total=response.data.total
        })
      },
      sizechage(val) {
        this.pageSize = val
        this.pageNo = 1;
        this.tabDate()
      },
      pagenochage(val) {
        this.pageNo = val
        this.tabDate()
      },
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
      },
      checkTag(val) {
        if (val == 0) {
          return "等待审核"
        } else if (val == 1) {
          return "审核通过"
        } else if (val = 2) {
          return "审核不通过"
        }
      }

    },
    created() {
      this.tabDate()
    }
  }
</script>

<style scoped>

</style>
