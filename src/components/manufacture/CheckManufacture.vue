<template>
    <div>
      <!--   搜索 添加 产品列表分页-->
      <el-card>
        <el-row :gutter="20">
          <el-col>
            <el-form :inline="true">

              <el-form-item label="派工单编号">
                <el-input placeholder="请输入派工单编号" clearable @clear="getManufactureList" v-model="queryManufacture.manufactureId"></el-input>
              </el-form-item>

              <el-form-item label="产品名称">
                <el-input placeholder="请输入产品名称" clearable @clear="getManufactureList" v-model="queryManufacture.productName"></el-input>
              </el-form-item>

              <el-form-item label="登记时间">
                <el-date-picker @change="change"
                                v-model="queryApply.dataTime"
                                type="daterange"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getManufactureList">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 产品列表区域 -->
        <el-table :data="manufactureList" border stripe>
          <!-- stripe: 斑马条纹 border：边框-->
          <el-table-column prop="applyId" label="派工单编号"></el-table-column>
          <el-table-column prop="register" label="产品编号"></el-table-column>
          <el-table-column prop="remark" label="产品名称"></el-table-column>
          <el-table-column prop="checkTag" label="计划单状态">
            <template slot-scope="scope">
              {{scope.row.checkTag | checkTagTitle}}
            </template>
          </el-table-column>
          <el-table-column label="登记时间">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              {{ scope.row.registerTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-search"
                size="mini"
                @click="showCheckDialog(scope.row)"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryApply.pageNo"
                       :page-sizes="[7, 10, 15, 20]"
                       :page-size="queryApply.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"
        ></el-pagination>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "CheckManufacture"
    }
</script>

<style scoped>

</style>
