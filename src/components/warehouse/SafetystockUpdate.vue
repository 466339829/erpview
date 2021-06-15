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
            <el-button @click="biangeng(scope.row.id)" type="success">变更</el-button>
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
      <el-drawer
        title="安全库存配置单"
        :visible.sync="drawer"
        :center="true"
        :size="size">
        <el-form label-width="60px" :modal="ctfrom">
          <el-row :gutter="20">
            <el-col :span="10" :offset="1">
              <div>
                <span>产品名称:{{ctfrom.productName}}</span>
              </div>
            </el-col>
            <el-col :span="10" :offset="1">
              <div>
                <span>产品编号:{{ctfrom.productId}}</span>
              </div>
            </el-col>
          </el-row>
          <br>
          <el-row :gutter="24">
            <el-col :span="12">
              <div>
                <el-form-item label="库存上限:">
                  <el-input v-model="ctfrom.maxAmount" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item label="库存下限:">
                  <el-input v-model="ctfrom.minAmount" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div>
                <el-form-item label="登记人:">
                  <el-input :disabled="true" v-model="ctfrom.register" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item label="设计人:">
                  <el-input v-model="ctfrom.designer"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <hr>
          <el-table
            :data="tabssa"
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
                  size="mini"
                  placeholder="请输入内容"
                  v-model="ctfrom.maxCapacityAmount">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="储存单位">
              <template slot-scope="scope">
                <el-input
                  size="mini"
                  placeholder="请输入内容"
                  v-model="ctfrom.amountUnit">
                </el-input>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 20px 0;">
          </div>
          <br>
          <span>配置要求:</span>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ctfrom.config"
            maxlength="40"
            show-word-limit
          >
          </el-input>
          <br>
          <br>
          <el-row :gutter="20">
            <el-col :span="10" :offset="12">
              <div class="grid-content bg-purple">
                <span v-model="ctfrom.registerTime">系统当前时间:&nbsp&nbsp&nbsp{{currentTime}}</span>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <br>
        <br>
        <el-row :gutter="20">
          <el-col :span="6" :offset="10">
            <div class="grid-content bg-purple">
              <el-row>
                <el-button type="primary"  @click="f1">修改</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-drawer>
    </div>
</template>

<script>
    export default {
        name: "SafetystockUpdate",
      data(){
          return{
            pageNo: 1,
            pageSize: 5,
            total:0,
            tableData:[],
            one: "",
            tuo: "",
            san: "",
            cpname:"",
            drawer:false,
            size:'800px',
            ctfrom:{
            },
            tabssa: [{
              id: 1, kc: "成品库", ycc: "01-01-01", menuca: "",
            }],
            currentTime: new Date(),
          }
      },
      methods:{
        f1(){
          var _this = this
              var params=new URLSearchParams();
          this.ctfrom.storeId=0,
            this.ctfrom.amount=0,
          Object.keys(this.ctfrom).forEach(function (item){
                    params.append(item,_this.ctfrom[item]);
              });
              this.axios.post("/Cells/updateStatyquery",params).then((response)=>{
                        if (response.data==true){
                          this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                          });
                          _this.drawer=false;
                        }
              })
        },

        biangeng(id){
          this.drawer=true
          var params=new URLSearchParams();
          params.append("id",id)
          this.axios.post("/Cells/StaByid",params).then((response)=>{
                this.ctfrom=response.data;
          })
        },
        cx(){
            this.tbDate();
        },

          tbDate(){
            var params=new URLSearchParams();
            params.append("pageNo", this.pageNo);
            params.append("pageSize", this.pageSize);
            params.append("productName", this.cpname);
            params.append("firstKindName", this.one);
            params.append("secondKindName", this.tuo);
            params.append("thirdKindName", this.san);
            this.axios.post("/Cells/selectSafety2",params).then((response)=>{
              this.tableData=response.data.records;
              this.total=response.data.total;
            })
          },


        sizechage(val) {
          this.pageSize = val
          this.pageNo = 1;
          this.tbDate()
        },
        pagenochage(val) {
          this.pageNo = val
          this.tbDate()
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
                style: 'color:red;margin-left:5px;'
              })
            ],
          );
        }
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
          this.tbDate();
      },
      beforeDestroy() {
        if (this.timer) {
          clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
        }
      },
    }
</script>

<style scoped>

</style>
