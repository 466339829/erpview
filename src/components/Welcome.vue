<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您: {{ roleName }}</div>
  </div>
</template>

<script>
  export default {
    name: "Welcome",
    data(){
      return{
        roleName: window.sessionStorage.getItem('roleName'),
      }
    }
  }
</script>

<style scoped>
  .dashboard-container {
      margin: 30px;
    }
  .dashboard-text{
    font-size: 30px;
    line-height: 46px;

  }
</style>
