<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-form :inline="true">
            <el-form-item label="入库单编号">
              <el-input placeholder="请输入入库单编号" clearable @clear="getGatherList" v-model="queryGather.gatherId"></el-input>
            </el-form-item>

            <el-form-item label="登记时间">
              <el-date-picker @change="change"
                              v-model="queryGather.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getGatherList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 产品列表区域 -->
      <el-table :data="gatherList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="gatherId" label="入库单编号"></el-table-column>
        <el-table-column prop="reason" label="入库理由"></el-table-column>
        <el-table-column prop="reasonexact" label="入库详细理由"></el-table-column>
        <el-table-column prop="amountSum" label="总件数" width="120px"></el-table-column>
        <el-table-column prop="costPriceSum" label="总金额" width="120px"></el-table-column>
        <el-table-column label="登记时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary" icon="el-icon-message"
              size="mini"
              @click="showCheckDialog(scope.row)"
            >登记
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryGather.pageNo"
                     :page-sizes="[6, 10, 15, 20]"
                     :page-size="queryGather.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="入库单" :visible.sync="checkDialogVisible" width="80%" @close="checkDialogClosed">

      <!-- 内容主体 -->
      <el-row :gutter="20" style="margin-top: 0px">
        <el-col :span="5">
          <div><strong>入库单编号: </strong> {{gather.gatherId}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>入库理由: </strong> {{gather.reason}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>入库详细理由: </strong> {{gather.reasonexact}}</div>
        </el-col>
      </el-row>
      <el-divider></el-divider>

      <el-table :data="gatherDetails" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column label="库房名称">成品库</el-table-column>
        <el-table-column  label="存放地址"></el-table-column>
        <el-table-column prop="amount" label="应入库件数"></el-table-column>
        <el-table-column prop="gatheredAmount" label="已入库件数"></el-table-column>
        <el-table-column prop="count" label="本次入库件数">
          <template slot-scope="scope">
            <el-input clearable v-model.number="scope.row.count"
                      oninput="value=value.replace(/[^\d]/g,'')"/>
          </template>
        </el-table-column>
      </el-table>

      <el-divider></el-divider>

      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>应入库总件数: </strong> {{gather.amountSum}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>已入库总件数: </strong> {{gather.gatheredAmountSum}}</div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="5">
          <div><strong>应入库总成本: </strong> {{gather.register}}</div>
        </el-col>
        <el-col :span="5">
          <div><strong>已入库总成本: </strong> {{gather.registerTime}}</div>
        </el-col>
      </el-row>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "AddGather",
    data(){
      return{
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        queryGather:{
          gatherId:'',
          dataTime:'',
          gatherTag:'k002-2',
          pageNo: 1,
          pageSize: 6,
        },
        gatherList: [],
        total: 0,

        gather:{},
        checkDialogVisible:false,

        gatherDetails:{}
      }
    },
    methods:{
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getGatherList();
      },
      getDataTime(dataTime) {//默认显示今天
        var nian = dataTime.getFullYear();
        var yue = dataTime.getMonth() + 1;
        var ri = dataTime.getDate();
        var shi = dataTime.getHours();
        var fen = dataTime.getMinutes();
        var miao = dataTime.getSeconds();
        if (yue < 10) yue = "0" + yue;
        if (ri < 10) ri = "0" + ri;
        if (miao < 10) miao = "0" + miao;
        if (fen < 10) fen = "0" + fen;
        if (shi < 10) shi = "0" + shi;
        return nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
      },
      //获取入库列表
      getGatherList() {
        var params = new URLSearchParams();
        if (this.queryGather.dataTime) {
          params.append("registerTime", this.getDataTime(this.queryGather.dataTime[0]))
          params.append("registerTime2", this.getDataTime(this.queryGather.dataTime[1]))
        }
        Object.keys(this.queryGather).forEach((key) => {
          params.append(key, this.queryGather[key])
        });
        this.axios.post("/gather/page", params).then((resp) => {
          this.total = resp.data.total;
          this.gatherList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取角色列表失败！')
        })
      },
      showCheckDialog(row){
        this.gather = row;
        this.checkDialogVisible = true;

        this.axios.post("/gather/applyList", params).then((resp) => {
          this.total = resp.data.total;
          this.applyList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取角色列表失败！')
        })

      },
      checkDialogClosed(){
        this.$nextTick(() => {
          this.checkDialogVisible = false
        })
      },
    },
    created() {
      this.getGatherList();
    }
  }
</script>

<style scoped>

</style>
