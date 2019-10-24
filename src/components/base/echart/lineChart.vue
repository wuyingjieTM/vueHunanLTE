<template>
  <div class="hello">

        <canvas id="myChart1"></canvas>

  </div>
</template>

<script>
export default {
  mounted: function() {
    var ctx = document.getElementById("myChart1");
    var scatterChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Scatter Dataset",
            showLine: true,
            data: [
              {
                x: 8,
                y: 30
              },
              {
                x: 10,
                y: 12
              },
              {
                x: 12,
                y: 9
              },
              {
                x: 19,
                y: 10
              }
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom"
            }
          ]
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
