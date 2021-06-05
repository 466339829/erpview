<template>
  <div>
    <!--   搜索 添加 用户列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form :inline="true">
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" clearable @clear="getUserList" v-model="queryInfo.queryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getUserList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="loginId" label="用户名"></el-table-column>
        <el-table-column prop="" label="密码">******</el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img width="60px" height="60px" :src=URL+scope.row.photo alt="" class="previewImg">
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.creationDate }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pageNo"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="addUserForm"
        ref="addUserForm"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="loginId">
          <el-input clearable v-model="addUserForm.loginId"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" clearable show-password v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" clearable show-password v-model="addUserForm.checkPass"></el-input>
        </el-form-item>

        <el-form-item label="头像">
          <el-upload
            ref="upload"
            list-type="picture-card"
            class="avatar-uploader"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :action="uploadURL"
            :limit="1"
            :on-success="handleSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addUser('addUserForm')">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="头像预览" :visible.sync="previewDialogVisible">
      <img width="100%" :src="picPreviewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AddUser",
    data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          var params = new URLSearchParams();
          params.append("name", value)
          this.axios.post("/users/checkName", params).then(function (response) {
            if (!response.data.result) {
              callback(new Error(response.data.message));
            } else
              callback();
          })
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.addUserForm.checkPass !== '') {
            this.$refs.addUserForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addUserForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        URL: 'http://localhost:8080/images/',
        // 添加用户对话框
        addUserFormRules: {
          password: [
            {validator: validatePass, trigger: 'blur'},
            {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          loginId: [
            {validator: validateName, trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ]
        },
        // 获取用户列表查询参数对象
        queryInfo: {
          queryName: '',
          pageNo: 1,
          pageSize: 5
        },
        userList: [],
        total: 0,
        addDialogVisible: false,
        //添加表单的参数
        addUserForm: {
          loginId: '',
          password: '',
          photo: '',
          checkPass: ''
        },
        //上传图片地址
        uploadURL: 'http://localhost:8080/file/upload',
        picPreviewPath: '',
        // 图片预览对话框
        previewDialogVisible: false,
        imageUrl: ''
      }
    },
    methods: {
      // 监听 添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.upload.clearFiles()
        this.$nextTick(() => {
          this.$refs.addUserForm.resetFields()
          this.addDialogVisible = false
        })
      },
      handleRemove(file, fileList) {
        var _this = this;
        this.addUserForm.photo = '';
        const filePath = file.response.data;
        console.log(filePath);
        this.axios.post("file/delete/"+filePath.id).then( (resp) =>{
          if (resp.data==true)
            _this.$message.success("删除成功")
        }).catch(function (error) {
          return this.$message.error('图片加载失败！')
        })
      },
      handlePictureCardPreview(file) {
        this.picPreviewPath = file.url;
        this.previewDialogVisible = true;
      },
      handleSuccess(response) {
        this.imageUrl = this.URL + response.data.path;
        // 1.拼接得到一个图片信息对象 临时路径
        const picInfo = response.data.path;
        // 2.将图片信息对象，push到pics数组中
        this.addUserForm.photo = picInfo;
      },
      //获取用户列表
      getUserList() {
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageNo", _this.queryInfo.pageNo);
        params.append("pageSize", _this.queryInfo.pageSize);
        params.append("loginId", _this.queryInfo.queryName);
        this.axios.post("/users/page", params).then(function (resp) {
          _this.total = resp.data.total;
          _this.userList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取用户列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pageNo = newSize
        this.getUserList()
      },
      //添加
      addUser(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(_this.addUserForm).forEach(function (key) {
              params.append(key, _this.addUserForm[key])
            })
            this.axios.post("/users/insert", params).then((response) => {
              if (response.data.result) {
                _this.$message.success(response.data.message)
                _this.addDialogClosed(),
                _this.getUserList();
                _this.$refs.upload.clearFiles()
              } else {
                _this.$message.success(response.data.message)
                _this.addDialogClosed(),
                _this.getUserList();
                _this.$refs.upload.clearFiles()
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            });
          }
        })
      },
    },
    created() {
      this.getUserList()
    }
  }
</script>

<style scoped>

</style>
