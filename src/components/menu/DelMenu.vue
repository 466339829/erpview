<template>
  <div>
    <!--   搜索 菜单列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form :inline="true">
            <el-form-item label="菜单名称">
              <el-input placeholder="请输入菜单名称" clearable @clear="getMenuList" v-model="queryInfo.queryName"></el-input>
            </el-form-item>
            <el-form-item label="分类级别">
              <el-select clearable @clear="getMenuList"  v-model="queryInfo.seq" placeholder="请选择分类级别">
                <el-option label="一级菜单" value="1"></el-option>
                <el-option label="二级菜单" value="2"></el-option>
                <el-option label="三级菜单" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getMenuList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 菜单列表区域 -->
      <el-table :data="menuList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column label="分类级别">
          <template slot-scope="scope">
            {{scope.row.seq | newTitle}}
          </template>
        </el-table-column>
        <el-table-column label="菜单图标">
          <template slot-scope="scope">
            <i :class="scope.row.imageUrl" style="font-size: 20px"></i>
          </template>
        </el-table-column>
        <el-table-column prop="linkUrl" label="链接地址"></el-table-column>
        <el-table-column prop="parentName" label="父级分类"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeMenuById(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pageNo"
                     :page-sizes="[5, 8, 15, 20]"
                     :page-size="queryInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "DelMenu",
    data(){
      return{
        // 获取菜单列表查询参数对象
        queryInfo: {
          queryName: '',
          pageNo: 1,
          pageSize: 8,
          seq:''
        },
        menuList: [],
        total: 0,
      }
    },
    methods: {

      //获取菜单列表
      getMenuList() {
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageNo", _this.queryInfo.pageNo);
        params.append("pageSize", _this.queryInfo.pageSize);
        params.append("name", _this.queryInfo.queryName);
        params.append("seq", _this.queryInfo.seq);
        this.axios.post("/menus/page", params).then(function (resp) {
          _this.total = resp.data.total;
          _this.menuList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取菜单列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getMenuList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNo = newSize
        this.getMenuList()
      },
      //删除
      removeMenuById(menu){
        this.$confirm('将删除[' + menu.name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.axios.post("/menus/delete/" + menu.id).then((response) => {
            if (response.data.result) {
              _this.$message.success(response.data.message)
              _this.queryInfo.pageNo = 1;
              _this.getMenuList();
            }else {
              _this.$message.success(response.data.message);
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除")
        });
      }
    },
    created() {
      this.getMenuList();
    },
    filters: {   //过滤器
      newTitle(val) {
        if (val==1)
          return "一级菜单";
        else if(val==2)
          return "二级菜单";
        else
          return "三级菜单";
      }
    }
  }
</script>

<style scoped>
  .el-input, .textarea ,.el-select{
    width: 180px;
  }
</style>
