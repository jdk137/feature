var ParaSet = function (container, chartWidth, chartHeight, columnWidth) {
  //this.color = d3.scale.category20();
  this.color = d3.scale.ordinal()
    .domain(['男', '女', '<30', '30-49', '≥50', '华东', '华南', '华中', '西南','华北','东北','西北', '白领','学生'])
    .range(["#3fa9f5", "#ff88a2", "#FFEDA0", "#FEB24C", "#F03B20",
        //"#EFF3FF",  "#C6DBEF",  "#9ECAE1", "#6BAED6",  "#2171B5", "#4292C6", "#084594",
        "#EDF8E9", "#C7E9C0", "#A1D99B", "#74C476", "#41AB5D", "#238B45", "#005A32",
        "#BCBDDC", "#756BB1"]);
  
  var that = this;
  var container = $(container);
  var chartHead = $("<div/>").addClass("chartHead").appendTo(container);
  var chart = $("<div/>").addClass("chart").appendTo(container);
  
  var nodeWidth = columnWidth || 100;
  var w = chartWidth || 960;
  var h = chartHeight || 500;
  
  //state
  var animatable = false;
  var sorting = false;
  var undermouse = false;
  var animating = false;
  
  //chart layout set
  var margin = {top: 1, right: 1, bottom: 3, left: 1},
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
  
  var svg = d3.select(chart[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var sankey = d3.sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(0)
      .size([width, height]);
  
  // d3 obj
  var node;
  var link;
  
  //data
  var rawData = {
    sum: 22026724,
    gender_age: [
    ["1", "0-29", 7611311],
    ["1", "30-49", 3124843],
    ["1", "50-", 155322],
    ["2", "0-29", 7603596],
    ["2", "30-49", 3354497],
    ["2", "50-", 177155]
    ],
    gender_area: [
    ["1", "Central China", 1390545],
    ["1", "Northeast China", 640875],
    ["1", "East China", 4216881],
    ["1", "Northwest China", 495433],
    ["1", "North China", 655254],
    ["1", "Southwest China", 897505],
    ["1", "South China", 2594983],
    ["2", "Central China", 1432824],
    ["2", "Northeast China", 785444],
    ["2", "East China", 4503027],
    ["2", "Northwest China", 468340],
    ["2", "North China", 658308],
    ["2", "Southwest China", 961694],
    ["2", "South China", 2325611]
    ],
    gender_career: [
    ["1", "1", 9202161],
    ["1", "2", 1689315],
    ["2", "1", 9878019],
    ["2", "2", 1257229]
    ],
    age_area: [
    ["0-29", "Central China", 2006959],
    ["0-29", "Northeast China", 926581],
    ["0-29", "East China", 5951861],
    ["0-29", "Northwest China", 651427],
    ["0-29", "North China", 903988],
    ["0-29", "Southwest China", 1273083],
    ["0-29", "South China", 3501008],
    ["30-49", "Northeast China", 475700],
    ["30-49", "Central China", 774820],
    ["30-49", "Northwest China", 299106],
    ["30-49", "East China", 2627001],
    ["30-49", "Southwest China", 559727],
    ["30-49", "North China", 390774],
    ["30-49", "South China", 1352212],
    ["50-", "Central China", 41590],
    ["50-", "East China", 141046],
    ["50-", "Northeast China", 24038],
    ["50-", "North China", 18800],
    ["50-", "Northwest China", 13240],
    ["50-", "South China", 67374],
    ["50-", "Southwest China", 26389]
    ],
    age_career: [
    ["0-29", "1", 12269921],
    ["0-29", "2", 2944986],
    ["30-49", "1", 6477916],
    ["30-49", "2", 1424],
    ["50-", "1", 332343],
    ["50-", "2", 134]
    ],
    area_career: [
    ["Central China", "1", 2332281],
    ["Central China", "2", 491088],
    ["East China", "1", 7750537],
    ["East China", "2", 969371],
    ["North China", "1", 1113763],
    ["North China", "2", 199799],
    ["Northeast China", "1", 1205417],
    ["Northeast China", "2", 220902],
    ["Northwest China", "1", 805424],
    ["Northwest China", "2", 158349],
    ["South China", "1", 4330191],
    ["South China", "2", 590403],
    ["Southwest China", "1", 1542567],
    ["Southwest China", "2", 316632]
    ]
  };
  var rawDataHash = {};
  //getRawDataHash
  (function () {
      var featureValueHash = {
          'gender': {
              '1': '男',
              '2': '女'
          },
          'age': {
              '0-29': '<30',
              '30-49': '30-49',
              '50-': '≥50'
          },
          'area': {
              "East China": '华东',
              "South China": '华南',
              "Central China": '华中',
              "Southwest China": '西南',
              "North China": '华北',
              "Northeast China": '东北',
              "Northwest China": '西北'
          },
          'career': {
              '1': '白领',
              '2': '学生'
          }
      };
      var features = ["gender", "age", "area", "career"];
      var i, j, l = features.length;
      var f1, f2;
      var rawMapData;
      var newMapData;
      for (i = 0; i < l - 1; i++) {
          for (j = i + 1; j < l; j++) {
              newMapData = [];
              f1 = features[i];
              f2 = features[j];
              rawMapData = rawData[f1 + "_" + f2];
              rawMapData.forEach(function (d) {
                  var h = {'value': d[2] / rawData.sum};
                  h[f1] = featureValueHash[f1][d[0]];
                  h[f2] = featureValueHash[f2][d[1]];
                  newMapData.push(h);
              });
              rawDataHash[f1 + "_" + f2] = rawDataHash[f2 + "_" + f1] = newMapData;
          }
      }
  }());
  var featureOrder = ["gender", "age", "area", "career"];
  var features = {
      gender: ['女', '男'],
      age: ['<30', '30-49', '≥50'],
      area: ['华东', '华南', '华中', '西南', '华北', '东北', '西北'],
      career: ['白领', '学生']
  };
  var nodeFeatureHash = {
      '男': 'gender',
      '女': 'gender',
      '<30': 'age',
      '30-49': 'age',
      '≥50': 'age',
      '华东': 'area',
      '华南': 'area',
      '华中': 'area',
      '西南': 'area',
      '华北': 'area',
      '东北': 'area',
      '西北': 'area',
      '白领': 'career',
      '学生': 'career'
  };
  
  var source = {
      "nodes": [],
      "links": []
  };
  var nodeIndex = {}; 
  
  // get nodes, and their nodeIndex
  features.gender
    .concat(features.age)
    .concat(features.area)
    .concat(features.career)
    .forEach(function (d, i) {
      nodeIndex[d] = i;
      source.nodes.push({'name': d});
    });
  
  //get links, input is array of features with some order
  var createSourceLinks = function (fs) {
      var getLinkValueHash = (function () {
          var memory = {};
          return function (n1, n2) { //input two node names
              return (typeof memory[n1 + "_" + n2] === 'undefined') 
                  ? (memory[n1 + "_" + n2] = get2FHash(n1, n2))
                  : memory[n1 + "_" + n2];
          };
      }());
      
      // get 2 feature hash
      var get2FHash = function (f1, f2) {
          return d3.nest()
              .key(function (d) { return d[f1]; })
              .key(function (d) { return d[f2]; })
              .rollup(function(leafs) {
                  return d3.sum(leafs, function(d) { return d.value;});
              })
              .map(rawDataHash[f1 + "_" + f2]);
      };
      
      var links = source.links = [];
      var i, j;
      var l = fs.length;
      var hash;
      for (i = 0; i < l - 1; i++) {
          j = i + 1;
          hash = getLinkValueHash(fs[i], fs[j]);
          features[fs[i]].forEach(function (d1) {
              features[fs[j]].forEach(function (d2) {
                  links.push({
                      'source': nodeIndex[d1],
                      'target': nodeIndex[d2],
                      'value': hash[d1][d2]
                  });
              });
          });
      }
  };
  createSourceLinks(featureOrder);
  
  //init
  //create dom and bind event
  var init = function () {
      //create float tag
      var createFloatTag = function () {
          var _mousemove = function (e) {
              var jqNode = e.data.jqNode;
              var container = e.data.container;
              var mouseToFloatTag = {x: 20, y: 20};
              var offset = $(container).offset();
              if (!(e.pageX && e.pageY)) {return false;}
              var x = e.pageX - offset.left,
                  y = e.pageY - offset.top;
              var position = $(container).position();
      
              setContent.call(this);
      
              //set floatTag location
              floatTagWidth = jqNode.outerWidth();
              floatTagHeight = jqNode.outerHeight();
              if (floatTagWidth + x + 2 * mouseToFloatTag.x <=  $(container).width()) {
                  x += mouseToFloatTag.x;
              } else {
                  x = x - floatTagWidth - mouseToFloatTag.x;
              }
              if (y >= floatTagHeight + mouseToFloatTag.y) {
                  y = y - mouseToFloatTag.y - floatTagHeight;
              } else {
                  y += mouseToFloatTag.y;
              }
              jqNode.css("left",  x  + "px");
              jqNode.css("top",  y + "px");
          };
      
          var setContent = function () {};
      
          function floatTag(cont) {
              var container = cont;
              var jqNode = $("<div/>").css({
                  "border": "1px solid",
                  "border-color": $.browser.msie ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.8)",
                  "background-color": $.browser.msie ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.75)",
                  "color": "white",
                  "border-radius": "2px",
                  "padding": "12px 8px",
                  //"line-height": "170%",
                  //"opacity": 0.7,
                  "font-size": "12px",
                  "box-shadow": "3px 3px 6px 0px rgba(0,0,0,0.58)",
                  "font-familiy": "宋体",
                  "z-index": 10000,
                  "text-align": "center",
                  "visibility": "hidden",
                  "position": "absolute"
              });
              $(container).append(jqNode)
                  .mousemove({"jqNode": jqNode, "container": container}, _mousemove);
              return jqNode;
          }
      
          floatTag.setContent = function (sc) {
              if (arguments.length === 0) {
                  return setContent;
              }
              setContent = sc;
          };
          return floatTag;
      };
      
      container.css({
        "overflow": "hidden",
        "width": w
      });
      //init chart;
      chart.css("position", "relative");
      floatTag = createFloatTag()(chart);
      floatTag.css({"visibility": "hidden"});
  
      container.on("mouseenter", function () {
          //console.log("enter");
          undermouse = true;
      });
      container.on("mouseleave", function () {
          //console.log("leave");
          undermouse = false;
          start();
      });
  
      chart.delegate(".node", "mouseover", function () {
          var node = this.__data__;
          //set floatTag content
          floatTag.html('<div><p>' + node.name + '</p>'
              + '<p>总占比：' + Math.round(node.value * 100000) / 1000 + '%</p>'
              + '</div>'
          );
          floatTag.css({"visibility": "visible"});
      });
  
  
      chart.delegate(".node", "mouseout", function () {
          floatTag.css({"visibility": "hidden"});
      });
  
      chart.delegate(".link", "mouseover", function () {
          var node = this.__data__;
          //set floatTag content
          floatTag.html('<div><p>' + node.source.name + " - " + node.target.name + '</p>'
              + '<p>总占比：' + Math.round(node.value * 100000) / 1000 + '%</p>'
              + '<p>' + node.source.name + '占比：' + Math.round(node.value / node.source.value * 100000) / 1000 + '%</p>'
              + '<p>' + node.target.name + '占比：' + Math.round(node.value / node.target.value * 100000) / 1000 + '%</p>'
              + '</div>'
          );
          floatTag.css({"visibility": "visible"});
      });
  
      chart.delegate(".link", "mouseout", function () {
          floatTag.css({"visibility": "hidden"});
      });
  }
  init();
  
  //these draw will repeat;
  var draw = function (source, first) {
    sankey
        .nodes(source.nodes)
        .links(source.links)
        .layout(0);
  
    //level summary config
    var createHead = function () {
        chartHead.empty()
                  .css({
                      "width": width / (featureOrder.length - 1) * featureOrder.length
                  });
        var enToCn = {
          'gender': '性别',
          'age': '年龄',
          'area': '地域',
          'career': '职业'
        };
        var cnToEn = {
          '性别': 'gender',
          '年龄': 'age',
          '地域': 'area',
          '职业': 'career'
        };
        featureOrder.forEach(function (d, i) {
            var getTabMargin = function (tab) {
              var w = $(tab).outerWidth();
              var tabTotalWidth = (width - nodeWidth) / (featureOrder.length - 1);
              var left, right;
              if (w < nodeWidth) {
                left = (nodeWidth - w) / 2;
              } else {
                left = 0;
              }
              right = tabTotalWidth - left - w;
              return "0 " + right + "px 3px " + left + "px";
            };
            var tab = $('<div class="ui-state-default">' + enToCn[d] + '</div>')
            .appendTo(chartHead);
            //tab.css({"margin": getTabMargin(tab)});
        });
        chartHead.sortable({
            "axis": "x",
            "placeholder": "sortable-placeholder",
            "opacity": 0.5,
            update: function(event, ui) {
              //$('#sortable li').removeClass('highlights');
              newOrder = [];
              chartHead.find(".ui-state-default").each(function () {
                newOrder.push(cnToEn[$(this).html()]);
              })
              animate(newOrder, 500);
              //console.log("stop sorting");
              sorting = false;
              start();
            },
            start: function(event, ui) {
              //console.log("start sorting");
              sorting = true;
            }
        });
    }; 
  
    var drawLink = function () {
      //var path = sankey.link();
      var path =  function(d) {
          var x0 = d.source.x + d.source.dx,
              x1 = d.target.x,
              y0 = d.source.y + d.sy,
              y1 = d.target.y + d.ty;
      
          return "M" + x0 + "," + y0
               + "L" + x1 + "," + y1
               + "L" + x1 + "," + (y1 + d.dy)
               + "L" + x0 + "," + (y0 + d.dy)
               + "Z";
      };
  
      var link = svg.append("g").selectAll(".link")
          .data(source.links)
        .enter().append("path")
          .attr("class", "link")
          .attr("d", path)
          //.style("stroke-width", function(d) { return Math.max(1, d.dy); })
          .style("stroke-width", 1)
          .sort(function(a, b) { return b.dy - a.dy; });
  
      return link;
    };
  
    var drawNode = function () {
      var node = svg.append("g").selectAll(".node")
          .data(source.nodes)
        .enter().append("g")
          .attr("class", function (d) {
            return "node " + nodeFeatureHash[d.name];
          })
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
      node.append("rect")
          .attr("height", function(d) { return d.dy; })
          .attr("width", sankey.nodeWidth())
          .style("fill", function(d) { return d.color = that.color(d.name.replace(/ .*/, "")); })
          .style("stroke", function(d) { return d3.rgb(d.color).darker(2); });
    
      node.append("text")
          .attr("x", 6)
          .attr("y", function(d) { return d.dy / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .attr("transform", null)
          .attr("font-size", function (d) { return d.name === '≥50' ? 10 : 20;})
          .text(function(d) { return d.name; });
  
      return node;
    };
  
    link = drawLink();
    if (first === true) {
      node = drawNode();
    }
    createHead();
  };
  draw(source, true);
  
  var animate = function (newfo, time) {
    if (typeof time === 'undefined') {
      time = 1500;
    }
    //disable sort
    animating = true;
    chartHead.sortable('disable');
    // remove link;
    link.remove();
    // move nodes;
    var fNodes = [];
    var x = []; //old x
    newfo.forEach(function (d, i) {
      fNodes.push(d3.selectAll("." + d));
    });
  
    var getX = function (select) {
      var trStr = select.attr('transform');
      var start = trStr.indexOf('(') + 1;
      var end = trStr.indexOf(',');
      return parseFloat(trStr.substr(start, end - start));
    };
    featureOrder.forEach(function (d) {
      x.push(getX(d3.selectAll("." + d)));
    });
    fNodes.forEach(function (d, i) {
      var t = d.transition()
        .duration(time)
        .attr("transform", function(d) { return "translate(" + x[i] + "," + d.y + ")"; });
      if (i === 0) {
        t.each('end', _.after(d[0].length, function () {
          featureOrder = newfo;
          createSourceLinks(featureOrder);
          draw(source);
          //enable sort
          chartHead.sortable('enable');
          animating = false;
          start();
        }));
      }
    });
  };
  
  var start = (function () {
    var waitToAnim = false;
    return function () {
      if (waitToAnim) {
        return;
      }
      if (animatable && sorting === false && undermouse === false && animating === false) {
        waitToAnim = true;
        setTimeout(function () {
          waitToAnim = false;
          var i1 = Math.floor(Math.random() * featureOrder.length);
          var i2 = Math.floor(Math.random() * (featureOrder.length - 1));
          if (i2 >= i1) {
            i2 += 1;
          }
          var newOrder = featureOrder.slice();
          newOrder[i1] = featureOrder[i2];
          newOrder[i2] = featureOrder[i1];
          if (animatable && sorting === false && undermouse === false && animating === false) {
            animate(newOrder, 400);
          } 
        }, 2000);
      };
    }
  }());
  
  this.startAnim = function () {
    animatable = true;
    start();
  };
  
  this.stopAnim = function () {
    animatable = false;
  };
}
