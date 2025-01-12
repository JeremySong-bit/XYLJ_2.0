// Your ECharts code here

window.alldata = [];
window.allday = [];
window.allnight = [];

var map = new AMap.Map('container', {
    resizeEnable: true,
    center: [114.317285, 30.572989]
});
AMap.plugin('AMap.Weather', function () {
    var weather = new AMap.Weather();
    weather.getLive('武汉市', function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        var weatherType = data.weather; // 获取天气类型，例如“雷阵雨”
        console.log(weatherType)
        var iconPath = getWeatherIconPath(weatherType); // 根据天气类型获取对应的图标路径
        console.log(iconPath)
        document.getElementById('weather-icon').src = iconPath; // 改变图片的src属性
    });

    //未来4天天气预报
    weather.getForecast('武汉市', function (err, data) {
        if (err) { return; }

        // 遍历天气数据并显示在页面上
        for (var i = 0; i < data.forecasts.length; i++) {
            var dayWeather = data.forecasts[i];
            alldata[i] = dayWeather.date;
            allday[i] = dayWeather.dayTemp;
            allnight[i] = dayWeather.nightTemp;
        }
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            title: {
                text: '武汉大学未来三天气温预测',
                top: 1,
                left: 'center',
                textStyle: {
                    color: '#ffffff'  // 标题文字颜色设置为白色
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 'bottom',
                textStyle: {
                    color: '#ffffff'  // 图例文字颜色设置为白色
                }
            },
            toolbox: {
                show: false,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: alldata.slice(0, 3),  // 只显示前三天的数据
                axisLabel: {
                    formatter: function (value) {
                        // 假设数据格式为 'YYYY-MM-DD'，我们只显示 'MM-DD'
                        return value.substr(5);
                    },
                    textStyle: {
                        color: '#ffffff'  // x轴文字颜色设置为白色
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        // 隔一个显示一个标签
                        if (index % 2 === 0) {
                            return value;
                        } else {
                            return '';
                        }
                    },
                    textStyle: {
                        color: '#ffffff'  // y轴文字颜色设置为白色
                    }
                }
            },
            series: [
                {
                    name: '白天气温',
                    type: 'line',
                    data: allday,
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max' },
                            { type: 'min', name: 'Min' }
                        ]
                    },
                    itemStyle: {
                        color: '#ffcc33'  // 将折线颜色设置为黄色
                    },
                    lineStyle: {
                        color: '#ffcc33'  // 将折线颜色设置为黄色
                    }
                },
                {
                    name: '夜间气温',
                    type: 'line',
                    data: allnight,
                    markPoint: {
                        data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
                    },
                    itemStyle: {
                        color: '#00ccff'  // 将折线颜色设置为浅蓝色
                    },
                    lineStyle: {
                        color: '#00ccff'  // 将折线颜色设置为浅蓝色
                    }
                }
            ]
        };
        // 渲染图表
        option && myChart.setOption(option);



    });
});

function getWeatherIconPath(weatherType) {
    var iconBasePath = "../../public/天气icon/";
    var iconMap = {
        "晴": "晴天.svg",
        "多云": "多云.svg",
        "少云": "多云.svg",
        "阴": "阴天.svg",
        "雨": "下雨.svg",
        "小雨": "下雨.svg",
        "阵雨": "下雨.svg",
        "中雨": "下雨.svg",
        "大雨": "下雨.svg",
        "暴雨": "下雨.svg",
        "雷阵雨": "雷阵雨.svg",
        "雾": "雾.svg",
        "雪": "小雪.svg",
        // 可以根据需要继续添加其他天气类型
    };
    return iconBasePath + (iconMap[weatherType] || "默认.svg");
}