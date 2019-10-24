<template>
  <div class="hello">

        <canvas id="mixedChart"></canvas>

  </div>
</template>

<script>
export default {
  mounted: function() {
    // 柱状图
    var ctx = document.getElementById("mixedChart");
    var mixedChart = new Chart(ctx, {
      type: "bar",
      //type: 'horizontalBar',//将柱状图设置为横向的
      data: {
        datasets: [
          {
            label: "Bar Dataset",
            data: [10, 20, 30, 40],
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
            borderWidth: 1,
            type: "bar"
          },
          {
            label: "Line Dataset",
            data: [30, 10, 34, 22],
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
            borderWidth: 1,
            type: "bar"
          }
        ],

        labels: ["January", "February", "March", "April"]
      },
      options: {
        scaleLabel: {
          fontColor: "red"
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              //barThickness: 50,//设置x轴上，每个柱状图的宽度（像素）
              //categoryPercentage: 0.4, //设置x轴上，每个柱状图的宽度（占比）
              barPercentage: 0.5, //设置x轴上，每个柱状图的宽度（占比）
              gridLines: {
                offsetGridLines: true //x轴上的竖线，在柱状图的中间为（false）
              },
              xAxisID: "2016-12-26"
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                // Include a dollar sign in the ticks
                callback: function(value, index, values) {
                  return value;
                }
              }
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
