<template>
<div>
  <el-table
    :data="tabsa"
    border
    highlight-current-row
    stripe
    style="width: 100%"
  >
    <el-table-column
      prop="productId"
      width="180"
      label="产品编号"
      :render-header="renderHeader">
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
      prop="checkTag"
      label="状态" :render-header="renderHeader">
      <template  slot-scope="scope">
        <span v-if="scope.row.checkTag==1" style="color: olivedrab">{{scope.row.checkTag |Tag}}</span>
        <span v-if="scope.row.checkTag==2" style="color:blue">{{scope.row.checkTag |Tag}}</span>

      </template>
    </el-table-column>
    <el-table-column label="操作" :render-header="heand2">
      <template slot-scope="scope">
        <el-button @click=select(scope.row) type="warning">查看</el-button>
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
    <el-dialog  title="安全配置查询" width="900px" center :visible.sync="dialogFormVisible">
      <el-form :model="selectfrom">
        <el-row :gutter="20">
          <el-col :span="10" :offset="1">
            <div>
              <span>产品名称:&nbsp&nbsp&nbsp&nbsp&nbsp{{selectfrom.productName}}</span>
            </div>
          </el-col>
          <el-col :span="10" :offset="1">
            <div>
              <span>产品编号:&nbsp&nbsp&nbsp&nbsp&nbsp{{selectfrom.productId}}</span>
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
                          v-model="selectfrom.maxAmount" clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="库存下限:" :label-width="formLabelWidth">
                <el-input suffix-icon="el-icon-remove-outline" :disabled="true" size="mini" v-model="selectfrom.minAmount"
                          clearable></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <div>
              &nbsp&nbsp<span>登记人:&nbsp&nbsp&nbsp&nbsp&nbsp{{selectfrom.register}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <span>设计人:&nbsp&nbsp&nbsp&nbsp&nbsp{{selectfrom.designer}}</span>
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
                :disabled="true"
                size="mini"
                placeholder="请输入内容"
                v-model="selectfrom.maxCapacityAmount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="储存单位">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="mini"
                placeholder="请输入内容"
                v-model="selectfrom.amountUnit">
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
          v-model="selectfrom.config"
          maxlength="40"
          show-word-limit
        >
        </el-input>
        <br>
        <br>
        <el-row :gutter="20">
          <el-col :span="10" :offset="12">
            <div class="grid-content bg-purple">
<!--              <span v-model="selectfrom.registerTime">系统当前时间:&nbsp&nbsp&nbsp{{currentTime}}</span>-->
            </div>
            &nbsp
            <el-switch
              v-model="value1"
              active-text="通过复核"
              inactive-text="未通过"
              disabled>
            </el-switch>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Fhisok">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
    export default {
        name: "SafetystockQuery",
      data(){
          return{
            tabsa:[],
            pageNo: 1,
            pageSize: 5,
            total:0,
            drawer: false,
            direction: 'rtl',
            size: '800px',
            selectfrom:{},
            formLabelWidth: "75px",
            dialogFormVisible: false,
            tabssa: [{
              id: 1, kc: "成品库", ycc: "01-01-01", menuca: "",
            }],
            value1:'',
          }
      },
      methods:{
          //查询
        select(item) {
              var params=new URLSearchParams();
              params.append("id",item.id)
          this.value1=true
          this.axios.post("/Cells/fuHebyid",params).then((response)=>{
            this.selectfrom=response.data;
            this.tabssa[0].menuca = response.data.firstKindName + '/' + response.data.secondKindName + '/' + response.data.thirdKindName;
          }).catch()
          if (item.checkTag==1){
            this.value1=false
          }else if (item.checkTag==2){

          }
          this.dialogFormVisible=true

        },
          tablsData(){
            var params = new URLSearchParams();
            params.append("pageNo", this.pageNo);
            params.append("pageSize", this.pageSize);
              this.axios.post("/Cells/Cellquery",params).then((response)=>{
                this.tabsa=response.data.records;
                this.total=response.data.total;
              }).catch()
          },
        Fhisok(){
          this.dialogFormVisible=false
        },
        sizechage(val) {
          this.pageSize = val
          this.pageNo = 1;
          this.tablsData()
        },
        pagenochage(val) {
          this.pageNo = val
          this.tablsData()
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
        }
      },
    created(){
              this.tablsData();
    },
      filters: {
        Tag(val) {
          if (val == 1) {
            return "未审核"
          } else if (val == 2) {
            return "已审核"
          }

        }
      }
    }
</script>

<style scoped>

</style>
