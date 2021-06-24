<template>
    <div>
      <el-table :data="DesignProcedureList" border stripe>
        <el-table-column prop="payId" label="出库单编号"></el-table-column>
        <el-table-column prop="reason" label="出库理由">
          <template slot-scope="scope">
            {{scope.row.reason | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="reasonexact" label="出库详细理由"></el-table-column>
        <el-table-column prop="registerTime" label="登记时间"></el-table-column>
        <el-table-column prop="amountSum" label="总件数"></el-table-column>
        <el-table-column prop="costPriceSum" label="总金额（元）"></el-table-column>
        <el-table-column label="出库调度">
          <template slot-scope="scope">
            <el-button @click="manage(scope.row)">出库调度</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizechage"
        @current-change="pagenochage"
        :current-page="pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--出库调度单-->
      <el-dialog title="出库调度单" width="80%" :visible.sync="manageVisible">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="8" :offset="16">
              <el-radio v-model="radio" label="1">通过</el-radio>
              <el-radio v-model="radio" label="2">不通过</el-radio>
              <el-button type="primary" @click="tijiao()">提交</el-button>
          </el-col>
        </el-row>
        <el-card>
          <el-main>
            <template>
              <el-form :inline="true" >
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="10">
                    <el-form-item label="出库单编号：">
                      {{outlist.payId}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="出库理由：">
                        {{outlist.reason | newTitle}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="出库详细理由">
                        {{outlist.reasonexact}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-table :data="PayDetailsList" border stripe>
                  <el-table-column prop="productName" label="产品名称"></el-table-column>
                  <el-table-column prop="productId" label="产品编号"></el-table-column>
                  <el-table-column prop="amount" label="应出库件数"></el-table-column>
                  <el-table-column prop="paidAmount" label="出库件数">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.paidAmount" :min="0" :max="scope.row.amount"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="调度">
                    <template slot-scope="scope">
                      <el-button @click="diaodu(scope.row)">调度</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="10">
                    <el-form-item label="应出库总件数：">
                      {{sum}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="已出库总件数：">
                      {{outsum}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-main>
        </el-card>
      </el-dialog>





    </div>
</template>

<script>
    export default {
        name: "OutManage",
      data(){
          return {
            manageVisible:false,
            pageNo:1,
            pageSize:5,
            total:0,
            sum:0,
            outsum:0,
            radio:'1',
            id:0,
            DesignProcedureList:[],//出库调度
            outlist:[],//单个出库调度物料
            PayDetailsList:{},//出库明细调度
          }
      },
      methods:{
          //加载数据
          getDesignProcedureList(){
            var params=new FormData();
            params.append("pageNo",this.pageNo);
            params.append("pageSize",this.pageSize);
            this.axios.post("/pay/selectList",params).then(response=>{
                this.DesignProcedureList=response.data.list;
                this.total=response.data.total;
            }).catch();
        },
        //点击申请调度
        manage(e){
          this.manageVisible=true;
          this.id=e.id;
          var sum1=0;
          var sum2=0;
          this.axios.post("/pay/selectId/"+this.id).then(response=>{
            this.PayDetailsList=response.data;
            this.PayDetailsList.forEach(item=>{
              sum1+=item.amount;
              sum2+=item.paidAmount;
            })
            this.sum=sum1;
            this.outsum=sum2;
          }).catch();
          this.outlist=e;
        },//最终调度
        diaodu(e){
            if (e.payTag==2){
              const h = this.$createElement;
              this.$message({
                message: h('p', null, [
                  h('span', null),
                  h('i', { style: 'color: red' }, '请勿重复调度')
                ])
              });
            }else{
              if (e.amount==e.paidAmount){
                var params=new FormData();
                params.append("id",e.id);
                params.append("paidAmount",e.paidAmount);
                this.axios.post("/pay/update",params).then(response=>{
                  if (response){
                    const h = this.$createElement;
                    this.$message({
                      message: h('p', null, [
                        h('span', null),
                        h('i', { style: 'color: teal' }, '调度成功')
                      ])
                    });
                    this.manageVisible=false;
                  }else{
                    const h = this.$createElement;
                    this.$message({
                      message: h('p', null, [
                        h('span', null),
                        h('i', { style: 'color: red' }, '调度失败')
                      ])
                    });
                  }
                }).catch();

              }else{
                const h = this.$createElement;
                this.$message({
                  message: h('p', null, [
                    h('span', null),
                    h('i', { style: 'color: red' }, '请选择正确的出库件数')
                  ])
                });
              }
            }

        },
        //提交
        tijiao(){
            if (this.sum==this.outsum){
                var params=new FormData();
                params.append("id",this.id);
                params.append("checkTag",this.radio);
                this.axios.post("/pay/payupdate",params).then(response=>{
                    if (response){
                      const h = this.$createElement;
                      this.$message({
                        message: h('p', null, [
                          h('span', null),
                          h('i', { style: 'color: teal' }, '提交成功')
                        ])
                      });
                      this.manageVisible=false;
                    }else{
                      const h = this.$createElement;
                      this.$message({
                        message: h('p', null, [
                          h('span', null),
                          h('i', { style: 'color: red' }, '提交失败')
                        ])
                      });
                    }
                }).catch();
            }else{
              const h = this.$createElement;
              this.$message({
                message: h('p', null, [
                  h('span', null),
                  h('i', { style: 'color: red' }, '请确认出库件数')
                ])
              });
            }
        }
        ,
        sizechage(val) {
          this.pageSize = val
          this.pageNo = 1;
          this.getDesignProcedureList();
        },
        pagenochage(val) {
          this.pageNo = val
          this.getDesignProcedureList();
        }
      },
      created() {
        this.getDesignProcedureList();
      },
      filters: {   //过滤器
        newTitle(val) {
          if (val==1)
            return "生产领料";
          else if(val==2)
            return "赠送";
          else if(val==3)
            return "内部借领";
          else if(val==4)
            return "其他借领";
          else
            return "";
        }
      }
    }
</script>

<style scoped>

</style>
