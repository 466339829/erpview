<template>
  <div>
    <!--   搜索 添加 产品列表分页-->
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-form :inline="true">
            <el-form-item label="产品名称">
              <el-input placeholder="请输入产品名称" clearable @clear="getFileList" v-model="queryFile.productName"></el-input>
            </el-form-item>

            <el-form-item label="I级分类">
              <el-select clearable @clear="getFileList" @change="firstKindIdChange" v-model="queryFile.firstKindId"
                         placeholder="请选择">
                <el-option v-for="item in firstKindList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="II级分类">
              <el-select clearable @clear="getFileList" @change="secondKindChange" v-model="queryFile.secondKindId"
                         placeholder="请选择">
                <el-option v-for="item in secondKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="III级分类">
              <el-select clearable @clear="getFileList" @change="thirdKindChange" v-model="queryFile.thirdKindId"
                         placeholder="请选择">
                <el-option v-for="item in thirdKindSelectList" :key="item.id" :value="item.kindId"
                           :label="item.kindName"/>
              </el-select>
            </el-form-item>

            <el-form-item label="用途类型">
              <el-select clearable @clear="getFileList" v-model="queryFile.type" placeholder="请选择">
                <el-option label="商品" value="1"/>
                <el-option label="物料" value="2"/>
              </el-select>
            </el-form-item>

            <el-form-item label="建档时间">
              <el-date-picker @change="change"
                              v-model="queryFile.dataTime"
                              type="daterange"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getFileList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="fileList" border stripe>
        <!-- stripe: 斑马条纹 border：边框-->
        <el-table-column prop="productId" label="产品编号"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column label="用途类型" width="120px">
          <template slot-scope="scope">
            {{scope.row.type | Title}}
          </template>
        </el-table-column>
        <el-table-column prop="firstKindName" label="I级分类" width="100px"></el-table-column>
        <el-table-column prop="secondKindName" label="II级分类" width="100px"></el-table-column>
        <el-table-column prop="thirdKindName" label="III级分类" width="100px"></el-table-column>
        <el-table-column label="建档时间" width="190px">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            {{ scope.row.registerTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdateDialog(scope.row)"
            >档案变更
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryFile.pageNo"
                     :page-sizes="[6, 10, 15, 20]"
                     :page-size="queryFile.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加修改的对话框 -->
    <el-dialog :title="title| newTitle" :visible.sync="updateDialogVisible" width="70%" @close="updateDialogClosed">
      <el-row style="margin-top: -10px">
        <el-col :span="4">
          <div><label class="document-btn">主信息</label></div>
        </el-col>
        <el-col :span="16" :offset="20">
          <div style="margin-top: -30px">
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateFile('updateFileForm')">提 交</el-button>
                </span>
          </div>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <!-- 内容主体 -->
      <el-form :inline="true"
               :model="updateFileForm"
               ref="updateFileForm"
               :rules="updateFileFormRules"
               label-width="107px">
        <el-form-item label="产品ID" prop="id">
          <el-input disabled v-model="updateFileForm.id"/>
        </el-form-item>
        <el-form-item label="产品编号" prop="productId">
          <el-input disabled v-model="updateFileForm.productId"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input disabled v-model="updateFileForm.productName"/>
        </el-form-item>
        <el-form-item label="制造商" prop="factoryName">
          <el-input clearable v-model="updateFileForm.factoryName"/>
        </el-form-item>
        <el-form-item label="产品简称" prop="productNick">
          <el-input clearable v-model="updateFileForm.productNick"/>
        </el-form-item>

        <el-form-item label="I级分类" prop="firstKindId">
          <el-select clearable @change="firstKindIdChange" v-model="updateFileForm.firstKindId" placeholder="请选择">
            <el-option v-for="item in firstKindList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
          </el-select>
        </el-form-item>

        <el-form-item label="II级分类" prop="secondKindId">
          <el-select clearable @change="secondKindChange" v-model="updateFileForm.secondKindId" placeholder="请选择">
            <el-option v-for="item in secondKindSelectList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
          </el-select>
        </el-form-item>

        <el-form-item label="III级分类" prop="thirdKindId">
          <el-select clearable @change="thirdKindChange" v-model="updateFileForm.thirdKindId" placeholder="请选择">
            <el-option v-for="item in thirdKindSelectList" :key="item.id" :value="item.kindId" :label="item.kindName"/>
          </el-select>
        </el-form-item>

        <el-form-item label="用途类型" prop="type">
          <el-select clearable v-model="updateFileForm.type" placeholder="请选择">
            <el-option label="商品" value="1"/>
            <el-option label="物料" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="档次级别" prop="productClass">
          <el-select clearable v-model="updateFileForm.productClass" placeholder="请选择">
            <el-option label="高档" value="1"/>
            <el-option label="中档" value="2"/>
            <el-option label="抵挡" value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="计量单位" prop="personalUnit">
          <el-input clearable v-model="updateFileForm.personalUnit"/>
        </el-form-item>
        <el-form-item label="计量值" prop="personalValue">
          <el-input clearable v-model.number="updateFileForm.personalValue"/>
        </el-form-item>
        <el-form-item label="市场单价(元)" prop="listPrice">
          <el-input clearable v-model.number="updateFileForm.listPrice" maxlength="10"/>
        </el-form-item>
        <el-form-item label="计划成本单价" prop="costPrice">
          <el-input clearable v-model.number="updateFileForm.costPrice" maxlength="10"/>
        </el-form-item>
        <el-divider></el-divider>
        <div>
          <label class="document-btn">辅助信息</label>
        </div>
        <el-form-item label="保修期" prop="warranty">
          <el-input clearable v-model="updateFileForm.warranty"/>
        </el-form-item>
        <el-form-item label="替代品名称" prop="twinName">
          <el-input clearable v-model="updateFileForm.twinName"/>
        </el-form-item>
        <el-form-item label="替代品编号" prop="twinId">
          <el-input clearable v-model="updateFileForm.twinId"/>
        </el-form-item>
        <el-form-item label="生命周期(年)" prop="lifecycle">
          <el-input clearable v-model="updateFileForm.lifecycle"/>
        </el-form-item>
        <el-form-item label="单位" prop="amountUnit">
          <el-input clearable v-model="updateFileForm.amountUnit"/>
        </el-form-item>
        <el-form-item label="产品经理" prop="responsiblePerson">
          <el-select clearable v-model="updateFileForm.responsiblePerson" placeholder="请选择">
            <el-option label="manager1" value="manager1"/>
            <el-option label="manager2" value="manager2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商集合" prop="providerGroup">
          <el-input v-model="updateFileForm.providerGroup" type="textarea" class="textarea"/>
        </el-form-item>
        <el-form-item label="产品描述" prop="productDescribe">
          <el-input v-model="updateFileForm.productDescribe" type="textarea" class="textarea"/>
        </el-form-item>
        <el-form-item label="登记人" prop="register">
          <el-input clearable v-model="updateFileForm.register"/>
        </el-form-item>
        <el-form-item label="建档时间" prop="registerTime">
          <el-input disabled v-model="updateFileForm.registerTime"/>
        </el-form-item>
        <el-form-item label="复核人" prop="checker">
          <el-input clearable v-model="updateFileForm.checker"/>
        </el-form-item>
        <el-form-item label="变更人" prop="changer">
          <el-input clearable v-model="updateFileForm.changer"/>
        </el-form-item>
        <el-form-item label="变更时间" prop="changeTime">
          <el-date-picker v-model="updateFileForm.changeTime" type="datetime" disabled class="input-class">
          </el-date-picker>
        </el-form-item>


        <el-form-item label="产品图片" prop="image">
          <img :src=imageURL class="fileImages">
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
          </el-upload>
        </el-form-item>
      </el-form>
      <el-dialog title="产品图片预览" :visible.sync="previewDialogVisible">
        <img width="100%" :src="picPreviewPath" alt="" class="previewImg">
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "EditFile",
    data() {
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
        loginId: window.sessionStorage.getItem('loginId'),
        imageURL:'',
        // 添加产品对话框
        updateFileFormRules: {
          firstKindId: [
            {required: true, message: '请选择I分类级别', trigger: 'change'},
          ],
          secondKindId: [
            {required: true, message: '请选择II分类级别', trigger: 'change'},
          ],
          thirdKindId: [
            {required: true, message: '请选择III分类级别', trigger: 'change'},
          ],
          listPrice: [
            {required: true, message: '请输入市场单价(元)', trigger: 'blur'},
            {type: 'number', message: '请输入数字值', trigger: 'blur'}
          ],
          costPrice: [
            {required: true, message: '请输入计划成本单价', trigger: 'blur'},
            {type: 'number', message: '请输入数字值', trigger: 'blur'}
          ],
          personalValue: [
            {required: true, message: '请输入计量值', trigger: 'blur'},
            {type: 'number', message: '请输入数字值', trigger: 'blur'}
          ]
        },
        updateFileForm: {},

        // 获取产品列表查询参数对象
        queryFile: {
          productName: '',
          pageNo: 1,
          pageSize:6,
          //审核标志0: 等待1: 通过2: 不通过
          checkTag: 1,
          //产品删除标志0: 未删除1: 已删除2永久删除
          deleteTag: 0,
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type:'',
          dataTime:'',
        },

        fileList: [],
        total: 0,
        title: '',
        updateDialogVisible: false,
        uploadURL: 'http://localhost:8080/file/upload',
        picPreviewPath: '',
        // 图片预览对话框
        previewDialogVisible: false,
        imageUrl: '',
        fileURL: 'http://localhost:8080/images/',

        firstKindList: [],
        secondKindList: [],
        thirdKindList: [],

        secondKindSelectList: [],
        thirdKindSelectList: [],
      }
    },
    methods: {
      getNowTime() {//默认显示今天
        var date = new Date();
        var nian = date.getFullYear();
        var yue = date.getMonth() + 1;
        var ri = date.getDate();
        var shi = date.getHours();
        var fen = date.getMinutes();
        var miao = date.getSeconds();
        if (yue < 10) yue = "0" + yue;
        if (ri < 10) ri = "0" + ri;
        if (miao < 10) miao = "0" + miao;
        if (fen < 10) fen = "0" + fen;
        if (shi < 10) shi = "0" + shi;
        this.updateFileForm.changeTime =nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
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
      // 监听 复核角色对话框的关闭事件
      updateDialogClosed() {
        this.$nextTick(() => {
          this.$refs.updateFileForm.resetFields();
          this.$refs.upload.clearFiles();
          this.updateDialogVisible = false;
        })
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
      //获取产品列表
      getFileList() {
        var params = new URLSearchParams();
        if (this.queryFile.dataTime) {
          params.append("registerTime", this.getDataTime(this.queryFile.dataTime[0]))
          params.append("registerTime2", this.getDataTime(this.queryFile.dataTime[1]))
        }
        Object.keys(this.queryFile).forEach((key) => {
          params.append(key, this.queryFile[key])
        });
        this.axios.post("/files/page", params).then((resp) => {
          this.total = resp.data.total;
          this.fileList = resp.data.list;
        }).catch(function (error) {
          return this.$message.error('获取角色列表失败！')
        })
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryFile.pageSize = newSize
        this.getFileList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryFile.pageNo = newSize
        this.getFileList()
      },
      //编辑打开模态框
      showUpdateDialog(row) {
        this.title = row.productName;
        this.updateDialogVisible = true,
          this.axios.post("/files/selectById/" + row.id).then((resp) => {
            this.updateFileForm = resp.data;
            this.updateFileForm.changer=this.loginId;
            this.updateFileForm.changeTime=this.changeTime;
            this.imageURL = this.fileURL + this.updateFileForm.image;
            this.updateFileForm.image=this.updateFileForm.image;
            this.firstKindIdChange( resp.data.firstKindId);
            this.secondKindChange(resp.data.secondKindId);
            this.thirdKindChange(resp.data.thirdKindId);
          }).catch(function (error) {
            return this.$message.error('获取角色信息失败！')
          });

        setInterval(() => {
          this.getNowTime();
        },1000)
      },
      //编辑
      updateFile(formName) {
        this.$refs.updateFileForm.validate((valid) => {
          if (valid) {
            this.updateFileForm.registerTime2=this.updateFileForm.changeTime;
            this.updateFileForm.realCostPrice=0;
            var data = new URLSearchParams();
            Object.keys(this.updateFileForm).forEach((key) => {
              data.append(key, this.updateFileForm[key])
            })
            this.axios.post("/files/update", data).then((response) => {
              if (response.data) {
                this.getFileList();
                this.$message.success("档案变更成功,复核中");
                this.updateDialogClosed();
              } else {
                this.$message.success("档案变更失败")
                this.updateDialogClosed();
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            })
          }
        })

      },
      handleRemove(file, fileList) {
        this.updateFileForm.image = '';
        const filePath = file.response.data;
        this.axios.post("file/delete/" + filePath.id).then((resp) => {
          if (resp.data == true)
            this.$message.success("删除成功")
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
        // 2.将图片信息对象，添加到addFileForm.image 中
        this.updateFileForm.image = response.data.path;
      },

      //获取所有分类信息
      getConfigFileKindList() {
        this.axios.post("/configFileKind/list").then((resp) => {
          resp.data.forEach((item) => {
            if (item.kindLevel == 1)
              this.firstKindList.push(item)
            if (item.kindLevel == 2)
              this.secondKindList.push(item)
            if (item.kindLevel == 3)
              this.thirdKindList.push(item)
          })
        }).catch(function (error) {
          return this.$message.error('获取酚类信息失败！')
        })
      },
      //I级分类选择
      firstKindIdChange(val) {
        this.updateFileForm.firstKindId = val;
        this.secondKindSelectList = [];
        this.thirdKindSelectList = [];
       /* this.updateFileForm.secondKindId = '';
        this.updateFileForm.thirdKindId = '';*/
        this.secondKindList.forEach(item => {
          if (item.pid == val) {
            this.secondKindSelectList.push(item);
          }
        });
      },
      //II级分类
      secondKindChange(val) {
        /*this.updateFileForm.thirdKindId = '';*/
        this.thirdKindSelectList = [];
        this.thirdKindList.forEach(item => {
          if (item.pid == val) {
            this.thirdKindSelectList.push(item);
          }
        });
        this.updateFileForm.secondKindId = val;
      },
      //III级分类
      thirdKindChange(val) {
        this.updateFileForm.thirdKindId = val
      },
      // 条件查询建档时间value = []
      change(value) {
        if (value == null) this.getFileList();
      },
    },
    created() {
      this.getFileList();
      this.getConfigFileKindList();
    },
    mounted() {

    },

    filters: {   //过滤器
      newTitle(val) {
        return "档案变更【" + val + "】";
      },
      Title(val) {
        if (val == 1)
          return "商品";
        else if (val == 2)
          return "物料";
        else
          return "";
      }

    },

  }
</script>

<style scoped>
  .el-input, .el-select, .textarea {
    width: 200px;
  }

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    color: black;
    height: 20px;
    padding: 0 5px;
    margin: 5px;
    line-height: 5px;
    font-size: 20px;
  }

  .fileImages {
    width: 70px;
    height: 70px;
    display: inline;
  }
</style>
