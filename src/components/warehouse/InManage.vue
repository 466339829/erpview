<template>
  <div>
    <!--入库调度数据显示-->
    <el-table :data="gatherList" border stripe>
      <el-table-column prop="gatherId" label="入库单编号"></el-table-column>
      <el-table-column prop="reason" label="入库理由">
        <template slot-scope="scope">
          {{scope.row.reason | newTitle}}
        </template>
      </el-table-column>
      <el-table-column prop="reasonexact" label="入库详细理由"></el-table-column>
      <el-table-column prop="registerTime" label="登记时间"></el-table-column>
      <el-table-column prop="amountSum" label="总件数"></el-table-column>
      <el-table-column prop="costPriceSum" label="总金额（元）"></el-table-column>
      <el-table-column label="入库调度">
        <template slot-scope="scope">
          <el-button type="success" @click="rcheck(scope.row)">入库调度</el-button>
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

    <!--入库调度单模态框-->
    <el-dialog title="入库调度单" width="80%" :visible.sync="InManageVisible">
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
                  <el-form-item label="入库单编号：">
                    {{beforeList.gatherId}}
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="入库理由：">
                    {{beforeList.reason | newTitle}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="入库详细理由：">
                    {{beforeList.reasonexact}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-table :data="InManageList" border stripe>
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="productId" label="产品编号"></el-table-column>
                <el-table-column prop="amount" label="应入库件数"></el-table-column>
                <el-table-column prop="gatheredAmount" label="入库件数" style="width: 500px">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.gatheredAmount" :min="0" :max="scope.row.amount"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="costPrice" label="单价（元）"></el-table-column>
                <el-table-column label="调度">
                  <template slot-scope="scope">
                    <el-button @click="diaodu(scope.row)">调度</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="10">
                  <el-form-item label="登记人：">
                    {{loginname}}
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="登记时间：">
                    {{currentTime}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="10">
                  <el-form-item label="应入库总件数：">
                    {{sum}}
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="已入库总件数：">
                    {{Insum}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="10">
                  <el-form-item label="应入库成本：">
                    {{Inprice}}（元）
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="已入库成本：">
                    {{pricesum}}（元）
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
        name: "InManage",
      data(){
          return {
            pageNo:1,
            pageSize:5,
            total:0,
            radio:'1',
            sum:0,//总件数
            Insum:0,//入库总件数
            Inprice:0,//总成本
            gid:0,
            currentTime: new Date(), // 获取当前时间
            loginname: window.sessionStorage.getItem('loginId'),
            InManageVisible:false,//入库调度单模态框是否打开
            gatherList:[],//初始化入库调度数据
            InManageList:[],//模态框表格显示数据
            beforeList:[],//模态框表格外数据
          }
      },
      methods:{
          //初始化入库调度数据显示
        getGatherList(){
          var params=new FormData();
          params.append("pageNo",this.pageNo);
          params.append("pageSize",this.pageSize);
          this.axios.post("/Gath/pages3",params).then(response=>{
            this.gatherList=response.data.records;
            this.total=response.data.total;
          }).catch();
        },
        //点击入库调度
        rcheck(e){
          this.InManageVisible=true;
          this.beforeList=e;
          this.gid=e.id;
          var sum1=0;
          var sum2=0;
          var price=0;
          //表格显示的数据
          this.axios.post("/gath/selectByPId/"+this.gid).then(response=>{
            this.InManageList=response.data;
            this.InManageList.forEach(item=>{
               sum1+=item.amount;
               sum2+=item.gatheredAmount;
               price+=item.subtotal;
            })
            this.sum=sum1;//总件数
            this.Insum=sum2;//已入库总件数
            this.Inprice=price;//应入库金额
          }).catch();
        },
        //表格调度
        diaodu(e){
          if (e.gatherTag==2){
            const h = this.$createElement;
            this.$message({
              message: h('p', null, [
                h('span', null),
                h('i', { style: 'color: red' }, '请勿重复调度')
              ])
            });
          }else{
          var befroeId=e.productId;
            this.axios.post("/Cells/selectByBeforeId/"+befroeId).then(response=>{
                //判断产品是否配置安全库存
              if (response.data>0){
                  //调度
                if (e.amount==e.gatheredAmount){
                  var params=new FormData();
                  params.append("id",e.id);
                  params.append("gatheredAmount",e.gatheredAmount);
                  this.axios.post("/gath/update",params).then(response=>{
                    if (response){
                      const h = this.$createElement;
                      this.$message({
                        message: h('p', null, [
                          h('span', null),
                          h('i', { style: 'color: teal' }, '调度成功')
                        ])
                      });
                      this.InManageVisible=false;
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
                      h('i', { style: 'color: red' }, '请选择正确的入库件数')
                    ])
                  });
                }
                }else{
                  const h = this.$createElement;
                  this.$message({
                    message: h('p', null, [
                      h('span', null),
                      h('i', { style: 'color: red' }, '请先配置该产品安全库存')
                    ])
                  });
                }
            }).catch();
          }
        },
        //提交
        tijiao(){
          //不通过
          if (this.radio==2){
            var params=new FormData();
            params.append("id",this.beforeList.id);
            this.axios.post("/Gath/update2",params).then(response=>{
              if (response){
                const h = this.$createElement;
                this.$message({
                  message: h('p', null, [
                    h('span', null),
                    h('i', { style: 'color: teal' }, '已完成审核')
                  ])
                });
              }else{
                const h = this.$createElement;
                this.$message({
                  message: h('p', null, [
                    h('span', null),
                    h('i', { style: 'color: red' }, '审核错误')
                  ])
                });
              }
            }).catch();
            this.InManageVisible=false;
            this.getGatherList();
          }
          //通过
          var list=this.InManageList.find(item=>{
            return item.gatherTag!=2;
          })
          if (list!=null){
            const h = this.$createElement;
            this.$message({
              message: h('p', null, [
                h('span', null),
                h('i', { style: 'color: red' }, '请先完成审核')
              ])
            });
            return;
          }
              //能提交
              var params=new FormData();
              params.append("id",this.beforeList.id);
              params.append("gatheredAmountSum",this.Insum);
              this.axios.post("/Gath/update",params).then(response=>{
                if (response){
                  const h = this.$createElement;
                  this.$message({
                    message: h('p', null, [
                      h('span', null),
                      h('i', { style: 'color: teal' }, '提交成功')
                    ])
                  });
                }else{
                  const h = this.$createElement;
                  this.$message({
                    message: h('p', null, [
                      h('span', null),
                      h('i', { style: 'color: red' }, '提交错误')
                    ])
                  });
                }
              }).catch();
        },
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
      filters:{
        newTitle(val) {
          if (val==1)
            return "生产入库";
          else if(val==2)
            return "库存初始";
          else if(val==3)
            return "赠送";
          else if(val==4)
            return "内部归还";
          else if (val==5)
            return "其他归还";
          else
            return "";
        }
      },
      created() {
          this.getGatherList();
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
          this.InManageList.forEach((item) => {
            price += (item.gatheredAmount - 0) * item.costPrice - 0;
          })
          return price;
        }
      }
    }
</script>

<style scoped>

</style>
