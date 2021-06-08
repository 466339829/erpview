<template>
  <div>
  <!--   搜索 菜单列表分页-->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form :inline="true">
          <el-form-item label="菜单名称">
            <el-input placeholder="请输入菜单名称" clearable @clear="getMenuList" v-model="queryInfo.queryName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getMenuList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加菜单</el-button>
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

    <!-- 添加角色的对话框 -->
    <el-dialog title="编辑菜单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="addMenuForm"
        ref="addMenuForm"
        :rules="addMenuFormRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input clearable v-model="addMenuForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="分类级别" prop="seq">
          <!--<el-input  clearable  v-model="addMenuForm.seq"></el-input>-->
          <template>
            <el-select @change="selectByMenuByParentId(addMenuForm.seq)" v-model="addMenuForm.seq" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="菜单图标" prop="imageUrl">
          <el-input  clearable v-model="addMenuForm.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input  clearable v-model="addMenuForm.linkUrl"></el-input>
        </el-form-item>
        <el-form-item v-if="addMenuForm.seq>1" label="父级分类" prop="parentId">
          <!--<el-input  clearable v-model="addMenuForm.parentId"></el-input>-->
          <template>
            <el-select  v-model="addMenuForm.parentId" clearable placeholder="请选择">
              <el-option
                v-for="item in parentOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addMenu('addMenuForm')">添 加</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "AddMenus",
    data(){
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入菜单名称'));
        } else {
          var params = new URLSearchParams();
          params.append("name", value)
          this.axios.post("/menus/checkName", params).then( (response) =>{
            if (!response.data.result) {
              callback(new Error(response.data.message));
            } else
              callback();
          })
        }
      };
      return{
        options: [{value: '1', label: '一级菜单'}, {value: '2', label: '二级菜单'}, {value: '3', label: '三级菜单'}],
        parentOptions:[],
        // 添加角色对话框
        addMenuFormRules: {
          name: [
            {validator: validateName, trigger: 'blur'},
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          seq: [
            { required: true, message: '请选择分类级别', trigger: 'blur' },
          ],
          imageUrl: [
            { required: true, message: '请输入菜单图标', trigger: 'blur' },
            {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
          ],
          linkUrl: [
            { required: true, message: '请输入链接地址', trigger: 'blur' },
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          parentId: [
            { required: true, message: '请选择父级分类', trigger: 'blur' },
          ],
        },
        addMenuForm: {
        },
        addDialogVisible: false,
        // 获取菜单列表查询参数对象
        queryInfo: {
          queryName: '',
          pageNo: 1,
          pageSize: 8
        },
        menuList: [],
        total: 0,
      }
    },
    methods: {
      selectByMenuByParentId(seq){
        var _this = this;
        this.parentOptions=[];
        if (seq<=1)
          return;
        this.axios.post("/menus/selectByMenuByParentId/"+(seq-1),).then( (resp) =>{
          _this.parentOptions = resp.data;
        }).catch(function (error) {
          return this.$message.error('获取菜单列表失败！')
        })
      },
      //获取菜单列表
      getMenuList() {
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageNo", _this.queryInfo.pageNo);
        params.append("pageSize", _this.queryInfo.pageSize);
        params.append("name", _this.queryInfo.queryName);
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
      //添加
      addMenu(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(_this.addMenuForm).forEach( (key) =>{
              params.append(key, _this.addMenuForm[key])
            })
            this.axios.post("/menus/insert", params).then((response) => {
              if (response.data.result) {
                _this.$message.success(response.data.message)
                _this.addDialogClosed(),
                  _this.getMenuList();
              } else {
                _this.$message.success(response.data.message)
                _this.addDialogClosed(),
                  _this.getMenuList();
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            });
          }
        })
      },
      // 监听 添加角色对话框的关闭事件
      addDialogClosed() {
        this.$nextTick(() => {
          this.$refs.addMenuForm.resetFields()
          this.addDialogVisible = false
        })
      },
    },
    created() {
      this.getMenuList()
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
  .el-select {
    width: 100%;
  }

</style>
