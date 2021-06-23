<template>
  <div>
    <!--   搜索 添加 用户列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form :inline="true">
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名" clearable @clear="getUserList" v-model="queryInfo.queryName"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker @change="change"
                              v-model="queryInfo.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
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
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="pictureCardPreview(scope.row.photo)"><i class="el-icon-zoom-in"></i></span>
            </span>
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
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传一张图片，且不超过2MB</div>
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
          pageSize: 5,
          dataTime:''
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
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getUserList();
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
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
      //获取用户列表
      getUserList() {
        var _this = this;
        var params = new URLSearchParams();
        if (this.queryInfo.dataTime) {
          params.append("creationDate", this.getDataTime(this.queryInfo.dataTime[0]))
          params.append("creationDate2", this.getDataTime(this.queryInfo.dataTime[1]))
        }
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
        var bool = true;
        if (this.addUserForm.photo==''){
          this.$message.error("请上传头像");
          bool = false;
        }
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(_this.addUserForm).forEach(function (key) {
              params.append(key, _this.addUserForm[key])
            })
            if (bool==true) {
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
          }
        })
      },
      pictureCardPreview(file) {
        this.picPreviewPath = this.URL+file;
        this.previewDialogVisible = true;
      },
    },
    created() {
      this.getUserList()
    }
  }
</script>

<style scoped>
  el-form el-form-item .el-input, .textarea ,.el-select{
    width: 500px;
  }
</style>
