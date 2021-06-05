<template>
  <div  v-loading="loading">
    <el-card>
      <div>
        <label class="document-btn">主信息</label>
      </div>
      <div class="app-container">
        <el-form :inline="true" :model="addFileForm" ref="addFileForm" :rules="addFileFormRules" label-width="120px">
          <el-form-item label="产品名称" prop="productName">
            <el-input clearable v-model="addFileForm.productName"/>
          </el-form-item>
          <el-form-item label="制造商" prop="factoryName">
            <el-input clearable v-model="addFileForm.factoryName"/>
          </el-form-item>
          <el-form-item label="产品简称" prop="productNick">
            <el-input clearable v-model="addFileForm.productNick"/>
          </el-form-item>
          <el-form-item label="I级分类" prop="firstKindId">
            <el-select clearable v-model="addFileForm.firstKindId" placeholder="请选择">
              <el-option label="电子" value="01"/>
            </el-select>
          </el-form-item>
          <el-form-item label="II级分类" prop="secondKindId">
            <el-select clearable v-model="addFileForm.secondKindId" placeholder="请选择">
              <el-option label="计算机" value="02"/>
            </el-select>
          </el-form-item>
          <el-form-item label="III级分类" prop="thirdKindId">
            <el-select v-model="addFileForm.thirdKindId" placeholder="请选择">
              <el-option label="服务器" value="03"/>
            </el-select>
          </el-form-item>
          <el-form-item label="用途类型" prop="type">
            <el-select clearable v-model="addFileForm.type" placeholder="请选择">
              <el-option label="商品" value="1"/>
              <el-option label="物料" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="档次级别" prop="productClass">
            <el-select clearable v-model="addFileForm.productClass" placeholder="请选择">
              <el-option label="高档" value="1"/>
              <el-option label="中档" value="2"/>
              <el-option label="抵挡" value="3"/>
            </el-select>
          </el-form-item>
          <el-form-item label="计量单位" prop="personalUnit">
            <el-input clearable v-model="addFileForm.personalUnit"/>
          </el-form-item>
          <el-form-item label="计量值" prop="personalValue">
            <el-input clearable v-model="addFileForm.personalValue"/>
          </el-form-item>
          <el-form-item label="市场单价(元)" prop="listPrice">
            <el-input clearable v-model.number="addFileForm.listPrice" maxlength="10"/>
          </el-form-item>
          <el-form-item label="计划成本单价" prop="costPrice">
            <el-input clearable v-model.number="addFileForm.costPrice" maxlength="10"/>
          </el-form-item>
          <el-divider></el-divider>
          <div>
            <label class="document-btn">辅助信息</label>
          </div>
          <el-form-item label="保修期" prop="warranty">
            <el-input clearable v-model="addFileForm.warranty"/>
          </el-form-item>
          <el-form-item label="替代品名称" prop="twinName">
            <el-input clearable v-model="addFileForm.twinName"/>
          </el-form-item>
          <el-form-item label="替代品编号" prop="twinId">
            <el-input clearable v-model="addFileForm.twinId"/>
          </el-form-item>
          <el-form-item label="生命周期(年)" prop="lifecycle">
            <el-input clearable v-model="addFileForm.lifecycle"/>
          </el-form-item>
          <el-form-item label="单位" prop="amountUnit">
            <el-input clearable v-model="addFileForm.amountUnit"/>
          </el-form-item>
          <el-form-item label="产品经理" prop="responsiblePerson">
            <el-select clearable v-model="addFileForm.responsiblePerson" placeholder="请选择">
              <el-option label="manager1" value="manager1"/>
              <el-option label="manager2" value="manager2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商集合" prop="providerGroup">
            <el-input v-model="addFileForm.providerGroup" type="textarea" class="textarea"/>
          </el-form-item>
          <el-form-item label="产品描述" prop="productDescribe">
            <el-input v-model="addFileForm.productDescribe" type="textarea" class="textarea"/>
          </el-form-item>
          <el-form-item label="登记人" prop="register">
            <el-input clearable v-model="addFileForm.register"/>
          </el-form-item>
          <el-form-item label="建档时间" prop="registerTime">
            <el-date-picker v-model="addFileForm.registerTime" type="datetime" disabled class="input-class">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="产品图片" prop="image">
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

        <el-dialog title="产品图片预览" :visible.sync="previewDialogVisible">
          <img width="100%" :src="picPreviewPath" alt="" class="previewImg">
        </el-dialog>

        <el-row :gutter="20">
          <el-col :span="16" :offset="6">
            <div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addFile('addFileForm')">提 交</el-button>
                </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "AddFile",
    data() {
      return {
        loading:true,
        // 添加产品对话框
        addFileFormRules: {
          productName: [
            {required: true, message: '请输入产品名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
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
          ]
        },
        // 添加产品参数
        addFileForm: {
         /* productName: '',
          factoryName: '',
          productNick: '',
          firstKindId: '',
          secondKindId: '',
          thirdKindId: '',
          type: '',
          productClass: '',
          personalValue: '',
          listPrice: '',
          costPrice: '',
          warranty: '',
          personalUnit: '',
          twinName: '',
          twinId: '',
          lifecycle: '',
          amountUnit: '',
          responsiblePerson: '',
          providerGroup: '',
          productDescribe: '',*/
          productId:'',
          register: window.sessionStorage.getItem('loginId'),
          registerTime: '',
          image: ''
        },

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
        this.$refs.upload.clearFiles();
        this.$nextTick(() => {
          this.$refs.addFileForm.resetFields()
        })
      },
      //添加产品
      addFile(formName) {
        this.$refs.addFileForm.validate((valid) => {
          if (valid) {
            var params = new URLSearchParams();
            Object.keys(this.addFileForm).forEach((key) => {
              params.append(key, this.addFileForm[key])
            });
            this.axios.post("/files/insert", params).then((response) => {
              if (response.data) {
                this.$message.success("添加成功,待复核");
                this.addDialogClosed();
              } else {
                this.$message.success("添加失败")
                this.addDialogClosed();
              }
            }).catch(function (error) {
              alert("服务端获取数据失败");
            })
          }
        })
      },
      getDataTime() {//默认显示今天
        this.addFileForm.registerTime = new Date();
      },
      handleRemove(file, fileList) {
        this.addFileForm.image = '';
        const filePath = file.response.data;
        console.log(filePath);
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
        this.addFileForm.image = response.data.path;
      },
    },
    mounted() {
      this.getDataTime();
      setTimeout(() => {
        this.loading = false
      }, 1.5 * 1000)
    },

  }
</script>

<style lang="less" scoped>
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

  .line {
    text-align: center;
  }

  .el-input, .textarea {
    width: 220px;
  }

</style>
