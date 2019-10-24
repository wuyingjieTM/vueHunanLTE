<template>
    <div class="hello">
        <v-button id="btn" type="primary">Primary</v-button>
        <p>toSOn： {{toSon}}</p>
        <v-button @click="transmit">toTather</v-button>
        <canvas id="barChart"></canvas>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          toFather: "你儿子就是一个大坏蛋"
        };
      },
      props: {
        toSon: {
          default: "我是默认的字符串"
        }
      },
      methods: {
        transmit() {
          this.$emit("on-change", this.toFather);
        }
      },
      mounted() {
        this.$emit("test", "hi");

        // 柱状图
        var ctx = document.getElementById("barChart");
        var btn = document.getElementById("btn");
        var barChart = new Chart(ctx, {
          type: "bar",
          offset: true,
          //type: 'horizontalBar',//将柱状图设置为横向的
          data: {
            labels: ["2016-12-25", "2016-12-26", "2016-12-24"],
            datasets: [
              {
                label: "one",
                data: [12, 25, 53],
                yAxisID: "leftAxis",
                borderWidth: 1,
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
                ]
              },
              {
                label: "two",
                data: [61, 72, 28],
                yAxisID: "rightAxis",
                borderWidth: 1,
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
                ]
                // type: "line"
              }
            ],

            labels: ["January", "February", "March"]
          },
          options: {
            title: {
              display: true,
              text: "Custom Chart Title"
            },
            scaleLabel: {
              display: true,
              fontColor: "red",
              labelString: "人数"
            },
            scales: {
              xAxes: [
                {
                  stacked: false, //对应多个Y的数值，true为叠起来
                  //barThickness: 50,//设置x轴上，每个柱状图的宽度（像素）
                  //categoryPercentage: 0.4, //设置x轴上，每个柱状图的宽度（占比）
                  // barPercentage: 0.5, //设置x轴上，每个柱状图的宽度（占比）
                  gridLines: {
                    //网格线设置
                    display: true,
                    offsetGridLines: true, //x轴上的竖线，在柱状图的中间为（false）
                    borderDash: [3]
                  },
                  type: "category",
                  scaleLabel: {
                    //轴上的Lable
                    display: true,
                    labelString: "reshuffle",
                    fontStyle: "normal",
                    position: "right"
                  },
                  xAxisID: "2016-12-26"
                }
              ],
              yAxes: [
                {
                  stacked: false,
                  ticks: {
                    //y轴上字体的设置
                    // display:false,//设置为false，不显示字体
                    callback: function(value, index, values) {
                      return value;
                    },
                    minor: {
                      minorTick: {
                        callback: function() {
                          console.log("minorTick");
                        }
                      }
                    },
                    major: {
                      majorTick: {
                        callback: function() {
                          // console.log("majorTick");
                        }
                      }
                    }
                  },
                  scaleLabel: {
                    //轴上的Lable
                    display: true,
                    labelString: "reshuffle",
                    fontStyle: "normal",
                    padding: ["top"]
                  },
                  gridLines: {
                    //网格线设置
                    display: true,
                    borderDash: [3],
                    drawOnChartArea: true, //边缘有内部没有
                    drawBorder: true //为false时去掉边框
                    // drawTicks: false,
                  },
                  id: "leftAxis",
                  type: "linear",
                  position: "left"
                },
                {
                  id: "rightAxis",
                  type: "linear",
                  position: "right",
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          }
        });

        function updateConfigByMutating(barChart) {
          barChart.options.title.text = "new title";
          barChart.update();
        }

        btn.onclick = updateConfigByMutating(barChart);
      }
    };
</script>

<style scoped>
    .chartSet,
    .ant-transfer {
      width: 500px;
      margin: 50px auto;
    }
</style>
