<template>
  <div class="hello">
        <canvas id="myChart2"></canvas>
  </div>
</template>
<script>
export default {
  mounted: function() {
    // 柱状图
    var ctx = document.getElementById("myChart2");
    var dsedx = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Running", "Swimming", "Eating", "Cycling"],
        datasets: [
          {
            data: [20, 10, 4, 2]
          }
        ]
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
