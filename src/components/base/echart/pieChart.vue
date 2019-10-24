<template>
  <div class="hello">

        <canvas id="pieChart"></canvas>

  </div>
</template>

<script>
export default {
  mounted: function() {
    // 柱状图
    var ctx = document.getElementById("pieChart");
    var pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Red", "Yellow", "Blue"],
        datasets: [
          {
            data: [10, 20, 30],
            backgroundColor: ["Red", "Yellow", "Blue"]
          }
        ]
      },
      options: {
        cutoutPercentage: 50, //内环的大小
        // rotation: .3,//起始角度,
        circumference: 2 * Math.PI,
        animation:{
          animateScale:true
        }
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
