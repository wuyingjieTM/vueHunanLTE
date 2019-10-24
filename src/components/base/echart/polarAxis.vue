<template>
  <div class="hello">

        <canvas id="polarAxis"></canvas>

  </div>
</template>

<script>
export default {
  mounted: function() {
    // 柱状图
    var ctx = document.getElementById("polarAxis");
    var pieChart = new Chart(ctx, {
      type: "polarArea",
      data: {
        datasets: [
          {
            data: [10, 20, 30],
            backgroundColor:["Red", "Yellow", "Blue"]
          }
        ],
        labels: ["Red", "Yellow", "Blue"]
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chartSet,
.ant-transfer {
  width: 500px;
  margin: 50px auto;
}
</style>
