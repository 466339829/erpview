<template>

  <div>

    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="8" :offset="16">
        <el-button type="primary" @click="getstocklist">添加产品</el-button>
        <el-button type="primary" @click="addsave">提交</el-button>
      </el-col>
    </el-row>

      <el-card>
      <el-header align="center"><strong>出库申请单</strong></el-header>
      <el-main>
        <template>
          <el-form :inline="true" :label-position="labelPosition" :model="addstockform">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="10">
                <el-form-item label="出库人：">
                  <el-input placeholder="请输入内容" v-model="addstockform.storer" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="出库理由：">
                  <el-select v-model="value" clearable placeholder="请选择">
                    <el-option
                      v-for="item in reason"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!--<el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="10">
                <el-form-item label="是否归还：">
                  &lt;!&ndash;<el-select value="否" clearable placeholder="请选择">
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>&ndash;&gt;
                  <span>否</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="归还时间：">
                  <el-date-picker
                    v-model="addstockform.datetime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>-->
            <el-table :data="addstocklist" border stripe>
                <el-table-column prop="productName" label="名称"></el-table-column>
                <el-table-column prop="productId" label="编号"></el-table-column>
                <el-table-column prop="" label="描述">
                  <template slot-scope="scope">
                    {{scope.row.type | newTitle}}
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    <el-input type="text" v-model="amount"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="amountUnit" label="单位"></el-table-column>
                <el-table-column prop="costPrice" label="成本单价（元）"></el-table-column>
                <el-table-column label="小计（元）">
                  <template slot-scope="scope">
                    {{1*scope.row.costPrice}}
                  </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="10">
                <el-form-item label="总件数：" v-model="addstockform.amountSum"></el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="总金额：" v-model="addstockform.costPriceSum"></el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="10">
                <el-form-item label="登记人：" v-model="addstockform.register">
                  {{loginname}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="登记时间：" v-model="addstockform.registerTime"></el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-main>
      </el-card>

    <!--添加出库产品的模态框-->
    <el-dialog title="添加出库产品" width="80%" :visible.sync="addstockVisible">
      <el-table :data="stocklist" border stripe>
        <el-table-column prop="productId" label="编号"></el-table-column>
        <el-table-column prop="productName" label="名称"></el-table-column>
        <el-table-column label="商品类型">
          <template slot-scope="scope">
            {{scope.row.type | newTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="listPrice" label="单价"></el-table-column>
        <el-table-column prop="costPrice" label="成本单价（元）"></el-table-column>
        <el-table-column label="出库">
          <template slot-scope="scope">
            <el-button @click="outstock(scope.index,scope.row)">出库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="addstockVisible=false">取消</el-button>
        <el-button type="primary" @click="addsave">确认</el-button>
      </div>-->
    </el-dialog>
  </div>




</template>

<script>
    export default {
        name: "OutOfStock",
      data(){
          return {
            amount:1,
            addstocklist:[],
            addstockform:{},
            stocklist:[],
            addstockVisible:false,
            loginname: window.sessionStorage.getItem('loginId'),
            labelPosition: 'left',
            reason:[{
              value: '1',
              label: '生产领料'
            },
              {
                value: '2',
                label: '赠送'
              },
              {
                value: '3',
                label: '内部借领'
              },
              {
                value: '4',
                label: '其他借领'
              }],
            value:''
          }
      },
      methods:{
        getstocklist(){
            this.addstockVisible=true;
            this.axios.post("/files/all").then((response)=>{
              this.stocklist=response.data;
            }).catch();
        },//查询产品，予添加出库产品
        outstock(index,e){
          if (this.addstocklist.length==0){
              this.addstocklist.push(e)
          }else if (this.addstocklist.length>0){
            var a=this.addstocklist.find(item=> {return item.productId==e.productId})
            if (a==null){
              this.addstocklist.push(e)
            }else{
              const h = this.$createElement;
              this.$message({
                message: h('p', null, [
                  h('span', null),
                  h('i', { style: 'color: teal' }, '已添加该物品')
                ])
              });
            }
          }

        },//添加产品到表格
        addsave(){
          this.addstockform.amountSum=this.amount;
          this.addstockform.reason=this.value;
          this.addstockform.register=this.loginname;
          var params=new FormData();
          Object.keys(this.addstockform).forEach((item)=>{
            params.append(item,this.addstockform[item]);
          });
          this.axios.post("/pays/add",params,
            {headers:{'Content-Type':'multipart/form-data'}}).then().catch();
        }
      },
      filters: {   //过滤器
        newTitle(val) {
          if (val==1)
            return "商品";
          else if(val==2)
            return "物料";
          else
            return "";
        }
      }
    }
</script>

<style scoped>

</style>
