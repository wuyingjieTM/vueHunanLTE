//配置项
var API_Host = "http://43.240.138.218/gis/";

loadExtentFile(API_Host + "/esri/css/esri.css", "css");
loadExtentFile(API_Host + "/dijit/themes/tundra/tundra.css", "css");
loadExtentFile(API_Host + "css/DropdownInfoWindow.css", "css");
loadExtentFile(API_Host, "js");


//var dojoConfig = {
//    async: true,
//    packages: [{
//        "name": "lgis",
//        "location": "/lgis/js"
//        //"location": "/Scripts/lgis/js"
//        //"location": "http://172.16.21.232:8001/lgis/js"
//    }]
//};
//alert("http://localhost/lgis/lgis/js");

var dojoConfig = {
    async: true,
    packages: [{
        "name": "lgis",
        //"location": "/lgis/js/tdt.js"
        "location": "http://43.240.138.218/lgis/js"
      //  "location": "/lgis/js"
        //"location": "http://172.16.21.232:8001/lgis/js"
    },
    {
        name: "bootstrap",
        location: "http://localhost/lgis/lgis/js/dist/vendor/dojo-bootstrap"
    },
        {
            name: "calcite-maps",
            location: "http://localhost/lgis/lgis/js/dist/js/dojo"
        }
    ]
};



//配置结束
function Lgis() {

    Lgis.InitMap = InitMap;
    Lgis.AddPoints = AddPoints;
    Lgis.AddPolylines = AddPolylines;
    Lgis.FlyTo = FlyTo;
    Lgis.ShowInfo = ShowInfo;
    Lgis.MapClear = MapClear;

    Lgis.LayerClear = LayerClear;

    Lgis.AddLayer = AddLayer;


    Lgis.SetLayerScale = SetLayerScale;
    Lgis.SetLayerVisible = SetLayerVisible;
    Lgis.GetLayerVisible = GetLayerVisible;

    Lgis.IdentifyClick = IdentifyClick;
    Lgis.MapRemoveIdentifyTaskEvent = MapRemoveIdentifyTaskEvent;
    Lgis.InfoWindowSetHide = InfoWindowSetHide;

    Lgis.SetDynamicLayerClickVisible = SetDynamicLayerClickVisible;

    Lgis.CreateCircle = CreateCircle;

    Lgis.AddCirclePolygons = AddCirclePolygons;

    Lgis.AddCirclePolygons1 = AddCirclePolygons1;
    

    Lgis.SetScalebar = SetScalebar;
    Lgis.SetOverviewMap = SetOverviewMap;
    Lgis.SetLegend = SetLegend;

    Lgis.SetHomeButton = SetHomeButton;

    Lgis.MapZoom = MapZoom;
    Lgis.Measure = Measure;

    Lgis.MapZoomToExent = MapZoomToExent;



    //新的绘制点的功能
    Lgis.AddNewPoints = AddNewPoints;

    //新的绘制线的功能
    Lgis.AddNewPolylines = AddNewPolylines;


    //新的绘制面的功能
    Lgis.AddNewPolygons = AddNewPolygons;



    //属性查询的功能
    Lgis.AddFindValueByMapURL = AddFindValueByMapURL;
    


      Lgis.AddShanyePolygons = AddShanyePolygons; 


    //图层重组
    Lgis.ReorderMapLayer = ReorderMapLayer;

    //图层重组
    Lgis.ReorderMapLayerTop = ReorderMapLayerTop;

    return Lgis;
}

//公共变量
var map;
var showTextLayer;
var tb;
var bufferLayer;
var baseMaps = [];
//var geometryService = "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
var geometryService = "http://10.216.21.55:846/arcgis/rest/services/Utilities/Geometry/GeometryServer";
var layerEdits = [];
var mapEvents = [];

//地图初始化
function InitMap(lmap, loaded, eventJson) {
    require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/InfoTemplate", "esri/graphic",
        "lgis/BaiduLayer",
         "esri/geometry/Extent",
        "dojo/domReady!"],
        function (Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, GraphicsLayer,
            FeatureLayer, Point, SimpleMarkerSymbol, Color, InfoTemplate, Graphic, BaiduLayer,
          Extent) {
            dojo.addClass("map", "tundra");
            map = new Map("map", {
                logo: false,
                sliderStyle: "large",
                smartNavigation: false,
                //sliderLabels: ["1","2","3"],
                //showPanArrows: true,
                //nav: false, //不显示8个方向的按钮
                //ShowZoomSlider: true,
                //autoResize: true,
                //fadeOnZoom: true
            });

            map.setMapCursor("pointer")
            var center = lmap.center;
            for (var i = 0; i < lmap.basemaps.length; i++) {
                baseMaps.push(lmap.basemaps[i].layerId);
                var baselayer;
                switch (lmap.basemaps[i].layerType) {
                    case "baidu":
                        baselayer = new BaiduLayer(lmap.basemaps[i].layerUrl, { id: lmap.basemaps[i].layerId, opacity: lmap.basemaps[i].opacity });
                        break;
                    case "esri":
                    default:
                        if (lmap.basemaps[i].layerUrl.indexOf("http") != -1)
                            baselayer = new ArcGISTiledMapServiceLayer(lmap.basemaps[i].layerUrl, { id: lmap.basemaps[i].layerId, opacity: lmap.basemaps[i].opacity });
                        else
                            map.setBasemap(lmap.basemaps[i].layerUrl);
                        map.centerAt(new Point(lmap.center.x, lmap.center.y));
                        map.setZoom(lmap.zoom);
                        break;
                }
                if (lmap.basemaps[i].layerUrl.indexOf("http") != -1) {
                    if (lmap.basemaps[i].visible) baselayer.show(); else baselayer.hide();
                    map.addLayer(baselayer);
                }

            }
            //map.centerAt(center.x, center.y);
            //map.setZoom(lmap.zoom);
            //var extent = new Extent(8150021.703876458, 2328577.629678988, 15057483.07594942, 6535671.666493967); 
            //map.setExtent(extent);
            map.on("load", function () {
                loaded();
            })
            //map.on("mouse-move", function (e) {
            //    e;
            //})
            if (eventJson) {
                if (eventJson.mouseClick) map.on("click", function (e) {
                    window[eventJson.mouseClick](e);
                });
            }
            showTextLayer = new GraphicsLayer();
            map.addLayer(showTextLayer);

        });
};




function ReorderMapLayerTop(layerID) {
    require(["esri/map",
          "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
          "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
          "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
          "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
          "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",
          "esri/dijit/InfoWindow", "dojo/query", "esri/renderers/jsonUtils",
          "esri/symbols/jsonUtils",
          "esri/layers/LabelClass",
          "dojo/dom-construct", "dojo/domReady!"],
          function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
              SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
              Color, InfoWindowLite, InfoTemplate,
              SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer,
              InfoWindow, query, rendererJsonUtils,
              symbolJsonUtils, LabelClass,
              domConstruct) {

              

              var graphicsLayerIds = map.graphicsLayerIds;

              var graLayer = map.getLayer(layerID);

              map.reorderLayer(graLayer, graphicsLayerIds.length + 1);
           



              //  reorderLayer(layer, index)


          });
}


function ReorderMapLayer()
{
    require(["esri/map",
          "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
          "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
          "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
          "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
          "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",
          "esri/dijit/InfoWindow", "dojo/query", "esri/renderers/jsonUtils",
          "esri/symbols/jsonUtils",
          "esri/layers/LabelClass",
          "dojo/dom-construct", "dojo/domReady!"],
          function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
              SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
              Color, InfoWindowLite, InfoTemplate,
              SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer,
              InfoWindow, query, rendererJsonUtils,
              symbolJsonUtils, LabelClass,
              domConstruct) {

              var graphicsLayerIds = map.graphicsLayerIds;
              var pointLayerIds=new Array();
              var polylineLayerIds=new Array();
              var polygonLayerIds = new Array();

              var pointLayers = new Array();
              var polylineLayers = new Array();
              var polygonLayers = new Array();
              //Graphic[]
              for (var i = 0; i < graphicsLayerIds.length; i++)
              {
                  var layerId = graphicsLayerIds[i];
                  var graLayer = map.getLayer(layerId);
                  var graphics = graLayer.graphics;
                  if (graphics.length != 0)
                  {
                      switch (graphics[0].geometry.type) {
                          // point | multipoint | polyline | polygon | extent
                          case "point":
                              pointLayerIds.push(layerId);
                              pointLayers.push(graLayer);
                              break;
                          case "multipoint":
                              pointLayerIds.push(layerId);
                              pointLayers.push(graLayer);
                              break;
                          case "polyline":
                              polylineLayerIds.push(layerId);
                              polylineLayers.push(graLayer);
                              break;
                          case "polygon":
                              polygonLayerIds.push(layerId);
                              polygonLayers.push(graLayer);
                              break;
                          case "extent":
                              polygonLayerIds.push(layerId);
                              polygonLayers.push(graLayer);
                              break;
                      }

                  }
                

               
              }

              var layerCount = map.layerIds.length;

              SetMapReorderLayer(map, 0, polygonLayerIds,polygonLayers);
              SetMapReorderLayer(map,  polygonLayerIds.length, polylineLayerIds,polylineLayers);
              SetMapReorderLayer(map,  polygonLayerIds.length+polylineLayerIds.length, pointLayerIds,pointLayers);
              var graphicsLayerIds = map.graphicsLayerIds;
              function SetMapReorderLayer(map, layerCounts, ReorderIDs, Reorders)
              {
                  
                  for (var n = 0; n < Reorders.length; n++)
                  {
                      map.reorderLayer(Reorders[n], layerCounts);
                      layerCounts = layerCounts + 1;
                  }
              }
              //  reorderLayer(layer, index)
              

          });
}

function AddGraphicPoint(graPointsJson)
{
    require(["esri/map",
       "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
       "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
       "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
       "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
       "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",
       "esri/dijit/InfoWindow", "dojo/query", "esri/renderers/jsonUtils",
       "esri/symbols/jsonUtils",
       "esri/layers/LabelClass",
       "dojo/dom-construct", "dojo/domReady!"],
       function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
           SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
           Color, InfoWindowLite, InfoTemplate,
           SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer,
           InfoWindow, query, rendererJsonUtils,
           symbolJsonUtils, LabelClass,
           domConstruct) {


           var graphicsJson = graPointsJson.geometry;//点的坐标
           var pointGraphic = graPointsJson.gra;//layerID、symbol、scale
           var layerId = pointGraphic.layerID;

           var renderJson = pointGraphic.symbol;
           var graScale = pointGraphic.scale;


           var eventJson = graPointsJson.event;
           var isZoomMultiple = graPointsJson.zoom

           var eventJson = graPointsJson.event;
           //  layerId, graphicsJson, renderJson, eventJson, isZoomMultiple
           if (map == null) return;
           var graphicsLayer;
           var showInfo, showTooltip, showAny;
           if (map.getLayer(layerId)) {
               graphicsLayer = map.getLayer(layerId);
           }
           else {
               graphicsLayer = new GraphicsLayer({ id: layerId });
               map.addLayer(graphicsLayer, 100);
           }
           if (pointGraphic.scale)
           graphicsLayer.setScaleRange(graScale["min"], graScale["max"]);
           for (var i = 0; i < graphicsJson.length; i++) {
               var graphic = new Graphic(graphicsJson[i]);
               graphicsLayer.add(graphic);
               if (graphic.infoTemplate) showInfo = true;
               if (graphic.attributes) {
                   if (graphic.attributes["Tooltip"] || graphic.attributes["tooltip"]) {
                       if (graphic.attributes["Tooltip"] == "false" || graphic.attributes["tooltip"] == "false") {
                           showTooltip = false;
                           showAny = true;
                       }
                       else
                           showTooltip = true;
                   }
               }
           }
           if (showAny) showInfo = false;

           //样式渲染
           var renderer;
           if (renderJson.type == "uniqueValue")
               renderer = new UniqueValueRenderer(renderJson);
           else if (renderJson.type == "simple") {
               renderer = new SimpleRenderer(renderJson);
               if (renderer.symbol.path)
                   renderer.symbol.setPath(renderer.symbol.path);
           } else if (renderJson.type == "classBreaks") {
               renderer = new ClassBreaksRenderer(renderJson);
           } else if (renderJson.type == "heatmap") {
               //delete renderJson.type;
               renderer = new HeatmapRenderer({
                   field: "pop",
                   blurRadius: 10,
                   maxPixelIntensity: 100,
                   minPixelIntensity: 1
               });
               renderer.blurRadius = 10;
               renderer.maxPixelIntensity = 100;
               renderer.minPixelIntensity = 1;
           }
           if (renderJson.sizeInfo) renderer.setSizeInfo(renderJson.sizeInfo);
           graphicsLayer.setRenderer(renderer);
           graphicsLayer.redraw();
           if (eventJson) {
               if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
                   window[eventJson.mouseClick](e);
               });
               if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
                   window[eventJson.mousedbClick](e);
               });
               if (eventJson.onload) {
                   window[eventJson.onload]();
               };
           }
           graphicsLayer.on("mouse-over", function (e) {
               if (showTooltip) {
                   mouseOverLayer(e);
               }
               else if (showInfo) {
                   map.infoWindow.setTitle(e.graphic.getTitle());
                   map.infoWindow.setContent(e.graphic.getContent());
                   map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
               }
               if (eventJson.mouseOver) window[eventJson.mouseOver](e);
           });
           graphicsLayer.on("mouse-out", function (e) {
               if (showTooltip) {
                   mouseOutLayer(e)
               }
               //mouseOutLayer(e)
               //map.infoWindow.hide();
           });


          // var isZoomMultiple = graPointsJson.zoom;

           if (isZoomMultiple) {
               var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
               map.setExtent(layerExtent.expand(isZoomMultiple));
           }


       });


}

function AddTextGraphicPoint(graPointsJson) {


    require(["esri/map",
       "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
       "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
       "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
       "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
       "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",
       "esri/dijit/InfoWindow", "dojo/query", "esri/renderers/jsonUtils",
       "esri/symbols/jsonUtils",
       "esri/layers/LabelClass", "esri/symbols/TextSymbol",
       "dojo/dom-construct", "dojo/domReady!"],
       function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
           SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
           Color, InfoWindowLite, InfoTemplate,
           SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer,
           InfoWindow, query, rendererJsonUtils,
           symbolJsonUtils, LabelClass,TextSymbol,
           domConstruct) {

      
           //var pointGraphic = graPointsJson.gra;//layerID、symbol、scale
           //var layerId = pointGraphic.layerID;
           //var renderJson = pointGraphic.symbol;
           //var graScale = pointGraphic.scale;


           var graphicsJson = graPointsJson.geometry;//点的坐标
           var textSymbolJson = graPointsJson.textgra;
           if (textSymbolJson==undefined)
               return;

           var layerId = textSymbolJson.layerID;
           var renderJson = textSymbolJson.symbol;
           var graScale = textSymbolJson.scale;
           if (!layerId)
               return;
        


           //var eventJson = graPointsJson.event;
          //var isZoomMultiple = graPointsJson.zoom
          //var eventJson = graPointsJson.event;


           //  layerId, graphicsJson, renderJson, eventJson, isZoomMultiple
           if (map == null) return;
           var graphicsLayer;
           var showInfo, showTooltip, showAny;
           if (map.getLayer(layerId)) {
               graphicsLayer = map.getLayer(layerId);
           }
           else {
               graphicsLayer = new GraphicsLayer({ id: layerId });
               map.addLayer(graphicsLayer, 100);
           }

           if (textSymbolJson.scale)
           graphicsLayer.setScaleRange(graScale["min"], graScale["max"]);
          // graphicsLayer.visible = true;
          // graphicsLayer.visibleAtMapScale = true;
           for (var i = 0; i < graphicsJson.length; i++) {
               var graphic = new Graphic(graphicsJson[i]);


               var textSymbol = new TextSymbol(renderJson["textSymbol"]);

               textSymbol.text = graphic.attributes[renderJson["fieldName"]];

               //ALIGN_END
               //ALIGN_MIDDLE
               //ALIGN_START
               //DECORATION_LINETHROUGH
               //DECORATION_NONE
               //DECORATION_OVERLINE
               //DECORATION_UNDERLINE

              // textSymbol.setAlign(TextSymbol.DECORATION_UNDERLINE);

             //  console.log(JSON.stringify(textSymbol));



               graphic.symbol = textSymbol;

               graphicsLayer.add(graphic);
            

               //if (graphic.infoTemplate) showInfo = true;
               //if (graphic.attributes) {
               //    if (graphic.attributes["Tooltip"] || graphic.attributes["tooltip"]) {
               //        if (graphic.attributes["Tooltip"] == "false" || graphic.attributes["tooltip"] == "false") {
               //            showTooltip = false;
               //            showAny = true;
               //        }
               //        else
               //            showTooltip = true;
               //    }
               //}
           }
          // if (showAny) showInfo = false;

           //样式渲染
           //var renderer;
           //if (renderJson.type == "uniqueValue")
           //    renderer = new UniqueValueRenderer(renderJson);
           //else if (renderJson.type == "simple") {
           //    renderer = new SimpleRenderer(renderJson);
           //    if (renderer.symbol.path)
           //        renderer.symbol.setPath(renderer.symbol.path);
           //} else if (renderJson.type == "classBreaks") {
           //    renderer = new ClassBreaksRenderer(renderJson);
           //} else if (renderJson.type == "heatmap") {
           //    //delete renderJson.type;
           //    renderer = new HeatmapRenderer({
           //        field: "pop",
           //        blurRadius: 10,
           //        maxPixelIntensity: 100,
           //        minPixelIntensity: 1
           //    });
           //    renderer.blurRadius = 10;
           //    renderer.maxPixelIntensity = 100;
           //    renderer.minPixelIntensity = 1;
           //}
           //if (renderJson.sizeInfo) renderer.setSizeInfo(renderJson.sizeInfo);
           //graphicsLayer.setRenderer(renderer);


           graphicsLayer.redraw();

           //if (eventJson) {
           //    if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
           //        window[eventJson.mouseClick](e);
           //    });
           //    if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
           //        window[eventJson.mousedbClick](e);
           //    });
           //    if (eventJson.onload) {
           //        window[eventJson.onload]();
           //    };
           //}
           //graphicsLayer.on("mouse-over", function (e) {
           //    if (showTooltip) {
           //        mouseOverLayer(e);
           //    }
           //    else if (showInfo) {
           //        map.infoWindow.setTitle(e.graphic.getTitle());
           //        map.infoWindow.setContent(e.graphic.getContent());
           //        map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
           //    }
           //    if (eventJson.mouseOver) window[eventJson.mouseOver](e);
           //});
           //graphicsLayer.on("mouse-out", function (e) {
           //    if (showTooltip) {
           //        mouseOutLayer(e)
           //    }
           //    //mouseOutLayer(e)
           //    //map.infoWindow.hide();
           //}
           //);


     


       });


}
//添加点,需指定图层名、点集、样式
function AddNewPoints(graPointsJson) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",
        "esri/dijit/InfoWindow", "dojo/query", "esri/renderers/jsonUtils",
        "esri/symbols/jsonUtils",
        "esri/layers/LabelClass", "esri/symbols/TextSymbol",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer,
            InfoWindow, query, rendererJsonUtils,
            symbolJsonUtils,LabelClass,TextSymbol,
            domConstruct) {



            AddGraphicPoint(graPointsJson);

            AddTextGraphicPoint(graPointsJson);
            //var graphicsJson = graPointsJson.geometry;//点的坐标
            //var pointGraphic = graPointsJson.gra;//layerID、symbol、scale
            //var layerId = pointGraphic.layerID;

            //var renderJson = pointGraphic.symbol;
            //var graScale = pointGraphic.scale;

            //scale
            //var textSymbolJson = graPointsJson.textgra;
            //var textLayerId = textSymbolJson.layerID;
            //var textRenderJson = textSymbolJson.symbol;
            //var textGraScale = textSymbolJson.scale;

            //var eventJson = graPointsJson.event;
            //var isZoomMultiple = graPointsJson.zoom;



            //if (isZoomMultiple) {
            //    var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
            //    map.setExtent(layerExtent.expand(isZoomMultiple));
            //}

          //  var eventJson = graPointsJson.event;
          ////  layerId, graphicsJson, renderJson, eventJson, isZoomMultiple
          //  if (map == null) return;
          //  var graphicsLayer;
          //  var showInfo, showTooltip, showAny;
          //  if (map.getLayer(layerId)) {
          //      graphicsLayer = map.getLayer(layerId);
          //  }
          //  else {
          //      graphicsLayer = new GraphicsLayer({ id: layerId });
          //      map.addLayer(graphicsLayer, 100);
          //  }
          //  for (var i = 0; i < graphicsJson.length; i++) {
          //      var graphic = new Graphic(graphicsJson[i]);
          //      graphicsLayer.add(graphic);
          //      if (graphic.infoTemplate) showInfo = true;
          //      if (graphic.attributes) {
          //          if (graphic.attributes["Tooltip"] || graphic.attributes["tooltip"]) {
          //              if (graphic.attributes["Tooltip"] == "false" || graphic.attributes["tooltip"] == "false") {
          //                  showTooltip = false;
          //                  showAny = true;
          //              }
          //              else
          //                  showTooltip = true;
          //          }
          //      }
          //  }
          //  if (showAny) showInfo = false;

          //  //样式渲染
          //  var renderer;
          //  if (renderJson.type == "uniqueValue")
          //      renderer = new UniqueValueRenderer(renderJson);
          //  else if (renderJson.type == "simple") {
          //      renderer = new SimpleRenderer(renderJson);
          //      if (renderer.symbol.path)
          //          renderer.symbol.setPath(renderer.symbol.path);
          //  } else if (renderJson.type == "classBreaks") {
          //      renderer = new ClassBreaksRenderer(renderJson);
          //  } else if (renderJson.type == "heatmap") {
          //      //delete renderJson.type;
          //      renderer = new HeatmapRenderer({
          //          field: "pop",
          //          blurRadius: 10,
          //          maxPixelIntensity: 100,
          //          minPixelIntensity: 1
          //      });
          //      renderer.blurRadius = 10;
          //      renderer.maxPixelIntensity = 100;
          //      renderer.minPixelIntensity = 1;
          //  }
          //  if (renderJson.sizeInfo) renderer.setSizeInfo(renderJson.sizeInfo);
          //  graphicsLayer.setRenderer(renderer);
          //  graphicsLayer.redraw();
          //  if (eventJson) {
          //      if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
          //          window[eventJson.mouseClick](e);
          //      });
          //      if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
          //          window[eventJson.mousedbClick](e);
          //      });
          //      if (eventJson.onload) {
          //          window[eventJson.onload]();
          //      };
          //  }

          //  graphicsLayer.on("mouse-over", function (e) {
          //      if (showTooltip) {
          //          mouseOverLayer(e);
          //      }
          //      else if (showInfo) {
          //          map.infoWindow.setTitle(e.graphic.getTitle());
          //          map.infoWindow.setContent(e.graphic.getContent());
          //          map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
          //      }
          //      if (eventJson.mouseOver) window[eventJson.mouseOver](e);
          //  });
          //  graphicsLayer.on("mouse-out", function (e) {
          //      if (showTooltip) {
          //          mouseOutLayer(e)
          //      }
          //      //mouseOutLayer(e)
          //      //map.infoWindow.hide();
          //  });

            //if (isZoomMultiple) {
            //    var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
            //    map.setExtent(layerExtent.expand(isZoomMultiple));
            //}

        });
}


function AddGraphicsLine(graLineJsons)
{
    require(["esri/map",
    "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
    "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
    "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
      "esri/renderers/ClassBreaksRenderer",
    "esri/dijit/InfoWindow",
    "dojo/dom-construct", "dojo/domReady!"],
    function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
        SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
        Color, InfoWindowLite, InfoTemplate,
        SimpleRenderer, UniqueValueRenderer,ClassBreaksRenderer,

        InfoWindow,
        domConstruct) {


        var graphicsJson = graLineJsons.geometry;//线的坐标
        var pointGraphic = graLineJsons.gra;//layerID、symbol、scale
        var layerId = pointGraphic.layerID;

        var renderJson = pointGraphic.symbol;
        var graScale = pointGraphic.scale;
        var eventJson = graLineJsons.event;
        var isZoomMultiple = graLineJsons.zoom;
        var graphicsLayer;

        var showInfo, showTooltip;
        if (map.getLayer(layerId)) {
            graphicsLayer = map.getLayer(layerId);
        }
        else {
            graphicsLayer = new GraphicsLayer({ id: layerId });
            map.addLayer(graphicsLayer);
        }

        if (pointGraphic.scale)
        graphicsLayer.setScaleRange(graScale["min"], graScale["max"]);
        for (var i = 0; i < graphicsJson.length; i++) {
            var graphic = new Graphic(graphicsJson[i]);
            graphicsLayer.add(graphic);
            if (graphic.infoTemplate) showInfo = true;
            if (graphic.attributes)
                if (graphic.attributes["Tooltip"])
                    showTooltip = true;
        }

        //样式渲染
        var renderer;
        if (renderJson.type == "uniqueValue")
            renderer = new UniqueValueRenderer(renderJson);

        else if (renderJson.type == "simple")
            renderer = new SimpleRenderer(renderJson);
        else if (renderJson.type == "classBreaks") 
               renderer = new ClassBreaksRenderer(renderJson);
        graphicsLayer.setRenderer(renderer);
        graphicsLayer.redraw();



        if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
            window[eventJson.mouseClick](e);
        });
        if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
            window[eventJson.mousedbClick](e);
        });

        graphicsLayer.on("mouse-over", function (e) {
            if (showTooltip) {
                mouseOverLayer(e);
            }
            else if (showInfo) {
                map.infoWindow.setTitle(e.graphic.getTitle());
                map.infoWindow.setContent(e.graphic.getContent());
                map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
            }
            if (eventJson.mouseOver)
                window[eventJson.mouseOver](e);
        });
        graphicsLayer.on("mouse-out", function (e) {
            if (showTooltip) {
                mouseOutLayer(e)
            }
            //mouseOutLayer(e)
            //map.infoWindow.hide();
        });
        if (isZoomMultiple) {
            var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
            map.setExtent(layerExtent.expand(isZoomMultiple));
        }

    });

}

//添加线--new
function AddNewPolylines(graLineJsons) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, InfoWindow,
            domConstruct) {
            if (map == null) return;



            AddGraphicsLine(graLineJsons);

            //var graphicsLayer;


            //var showInfo, showTooltip;
            //if (map.getLayer(layerId)) {
            //    graphicsLayer = map.getLayer(layerId);
            //}
            //else {
            //    graphicsLayer = new GraphicsLayer({ id: layerId });
            //    map.addLayer(graphicsLayer);
            //}
            //for (var i = 0; i < graphicsJson.length; i++) {
            //    var graphic = new Graphic(graphicsJson[i]);
            //    graphicsLayer.add(graphic);
            //    if (graphic.infoTemplate) showInfo = true;
            //    if (graphic.attributes)
            //        if (graphic.attributes["Tooltip"])
            //            showTooltip = true;
            //}

            ////样式渲染
            //var renderer;
            //if (renderJson.type == "uniqueValue")
            //    renderer = new UniqueValueRenderer(renderJson);

            //else if (renderJson.type == "simple")
            //    renderer = new SimpleRenderer(renderJson);
            //graphicsLayer.setRenderer(renderer);
            //graphicsLayer.redraw();

            //if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
            //    window[eventJson.mouseClick](e);
            //});
            //if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
            //    window[eventJson.mousedbClick](e);
            //});

            //graphicsLayer.on("mouse-over", function (e) {
            //    if (showTooltip) {
            //        mouseOverLayer(e);
            //    }
            //    else if (showInfo) {
            //        map.infoWindow.setTitle(e.graphic.getTitle());
            //        map.infoWindow.setContent(e.graphic.getContent());
            //        map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
            //    }
            //    if (eventJson.mouseOver)
            //        window[eventJson.mouseOver](e);
            //});
            //graphicsLayer.on("mouse-out", function (e) {
            //    if (showTooltip) {
            //        mouseOutLayer(e)
            //    }
            //    //mouseOutLayer(e)
            //    //map.infoWindow.hide();
            //});
            //if (isZoomMultiple) {
            //    var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
            //    map.setExtent(layerExtent.expand(isZoomMultiple));
            //}

        });
}



function AddGraphicsPolygon(graPolygonJsons) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
            "esri/renderers/ClassBreaksRenderer",
        "esri/dijit/InfoWindow",
         "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer,ClassBreaksRenderer,
            InfoWindow,

            SimpleFillSymbol, SimpleLineSymbol, Color,
            domConstruct) {
            if (map == null) return;


        var graphicsJson = graPolygonJsons.geometry;//线的坐标
        var pointGraphic = graPolygonJsons.gra;//layerID、symbol、scale
        var layerId = pointGraphic.layerID;

        var renderJson = pointGraphic.symbol;
        var graScale = pointGraphic.scale;
        var eventJson = graPolygonJsons.event;
        var isZoomMultiple = graPolygonJsons.zoom;
        var graphicsLayer;

        var showInfo, showTooltip;
        if (map.getLayer(layerId)) {
            graphicsLayer = map.getLayer(layerId);
        }
        else {
            graphicsLayer = new GraphicsLayer({ id: layerId });
            map.addLayer(graphicsLayer);
        }
        graphicsLayer.setScaleRange(graScale["min"], graScale["max"]);
        for (var i = 0; i < graphicsJson.length; i++) {
            var graphic = new Graphic(graphicsJson[i]);
            graphicsLayer.add(graphic);
            if (graphic.infoTemplate) showInfo = true;
            if (graphic.attributes)
                if (graphic.attributes["Tooltip"])
                    showTooltip = true;
        }

        //样式渲染
        var renderer;
        if (renderJson.type == "uniqueValue")
            renderer = new UniqueValueRenderer(renderJson);
        else if (renderJson.type == "simple")
            renderer = new SimpleRenderer(renderJson);
        else if (renderJson.type == "classBreaks")
            renderer = new ClassBreaksRenderer(renderJson);

        console.log(JSON.stringify(renderer));
        graphicsLayer.setRenderer(renderer);
        graphicsLayer.redraw();



        if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
            window[eventJson.mouseClick](e);
        });
        if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
            window[eventJson.mousedbClick](e);
        });

        graphicsLayer.on("mouse-over", function (e) {
            if (showTooltip) {
                mouseLayerOverLayer(e);
            }
            else if (showInfo) {
                map.infoWindow.setTitle(e.graphic.getTitle());
                map.infoWindow.setContent(e.graphic.getContent());
                map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
            }
            if (eventJson.mouseOver)
                window[eventJson.mouseOver](e);
        });
        graphicsLayer.on("mouse-out", function (e) {
            if (showTooltip) {
                mouseLayerOutLayer(e)
            }
            //mouseOutLayer(e)
            //map.infoWindow.hide();
        });
        if (isZoomMultiple) {
            var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
            map.setExtent(layerExtent.expand(isZoomMultiple));
        }

    });

}




//添加面
function AddFindValueByMapURL(findJsons, callback) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/dijit/InfoWindow",

        "esri/tasks/FindParameters", "esri/tasks/FindResult", "esri/tasks/FindTask",
         "dojo/_base/array",

        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, InfoWindow,
            FindParameters, FindResult, FindTask,
            arrayUtils,

            domConstruct) {
            var find, params;


            

            //var FindJson = {
            //    mapURL: "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_2000-2010_Population_Change/MapServer",
            //    layerIds: [0, 3],
            //    searchFields: ["NAME"],
            //    searchText: "a"
            //}
            var mapFindURL = findJsons.mapURL;
            var layerIds = findJsons.layerIds;
            var searchFields = findJsons.searchFields;
            var searchText = findJsons.searchText;

            //find = new FindTask("https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_2000-2010_Population_Change/MapServer");
            //    params = new FindParameters();
            //    params.layerIds = [3];
            //    params.searchFields = ["NAME"];

            find = new FindTask(mapFindURL);
            params = new FindParameters();
            params.layerIds = layerIds;
            params.searchFields = searchFields;
            params.searchText = searchText;
            params.returnGeometry = true;

               // params.searchText = dojo.byId("searchText").value;
           find.execute(params, showResults);
           
            function showResults(results) {
               // var result, attribs;
              //  var s = ["<table border=\"1\"><thead><tr style=\"background-color:#ccc;\"><td>State Name</td><td>FIPS</td><td>Population (1990)</td><td>Population (1999)</td></tr></thead><tbody id=\"states\">"];

                //console.log(JSON.stringify(results));
                //dojo.forEach(results, function (result) {
                //    attribs = result.feature.attributes;
                //    s.push("<tr><td>" + attribs.STATE_NAME + "</td><td>" + attribs.STATE_FIPS + "</td><td>" + attribs.POP1990 + "</td><td>" + attribs.POP1999 + "</td></tr>");
                //});

                var graPointJson = new Array();
                arrayUtils.forEach(results, function (findResult, i) {

                    //geometryType
                    var pPt;
                    switch (findResult["geometryType"])
                    {
                        case "esriGeometryPolygon":
                             pPt = findResult["feature"]["geometry"].getCentroid();
                            break;
                        case "esriGeometryPolyline":
                            var polyLinePoints = findResult["feature"]["geometry"];

                            var pPtlength =Math.round( polyLinePoints["paths"][0].length / 2);

                            pPt = polyLinePoints.getPoint(0, pPtlength);
                            // findResult["feature"]["geometry"].getCentroid();
                          //  getPoint(pathIndex, pointIndex)
                            break;
                        case "esriGeometryPoint":
                           // var pPt = findResult["feature"]["geometry"].getCentroid();
                             pPt = findResult["feature"]["geometry"];
                             break;
                    }


                    var graphic = new Graphic();
                    graphic.geometry = pPt;
                    graphic.attributes = findResult["feature"]["attributes"];

                    graPointJson.push(graphic);

                    //    graphicsLayer.add(graphic);


                    //"esriGeometryPolygon"
                   // var dddd = "";
                    // Get each value of the desired attributes
                   // var county = findResult.feature.attributes.Name;
                    //var state = findResult.feature.attributes[
                    //  "State Abbreviation"];
                    //var popGrowth = findResult.feature.attributes[
                    //  "2000-2010 Population Annual Compound Growth Rate (U.S. Census)"
                    //];
                    //var pop2012 = findResult.feature.attributes[
                    //  "2012 Total Population (Esri
                });

              //  graPointJson.push(graphic);

              //  console.log(JSON.stringify(graPointJson));


                callback(graPointJson);// console.log(JSON.stringify(graPointJson)));
          
            
              //  s.push("</tbody></table>");
              //  dojo.byId("tbl").innerHTML = s.join("");
            }
          
         

        });
}


//添加面
function AddNewPolygons(graPolygonJsons) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, InfoWindow,
            domConstruct) {


            AddGraphicsPolygon(graPolygonJsons);
            //if (map == null) return;
            //var graphicsLayer;
            //if (map.getLayer(layerId)) {
            //    graphicsLayer = map.getLayer(layerId);

            //}
            //else {
            //    graphicsLayer = new GraphicsLayer({ id: layerId });
            //    map.addLayer(graphicsLayer);
            //}
            //for (var i = 0; i < graphicsJson.length; i++) {
            //    var graphic = new Graphic(graphicsJson[i]);
            //    graphicsLayer.add(graphic);
            //}

            ////样式渲染
            //var renderer;
            //if (renderJson.type == "uniqueValue")
            //    renderer = new UniqueValueRenderer(renderJson);
            //else if (renderJson.type == "simple")
            //    renderer = new SimpleRenderer(renderJson);
            //graphicsLayer.setRenderer(renderer);
            //graphicsLayer.redraw();

            //if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
            //    window[eventJson.mouseClick](e);
            //});
            //if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
            //    window[eventJson.mousedbClick](e);
            //});
            //if (eventJson.mouseOver) graphicsLayer.on("mouse-over", function (e) {
            //    window[eventJson.mouseOver](e);
            //});
            //if (eventJson.mouseOut) graphicsLayer.on("mouse-out", function (e) {
            //    window[eventJson.mouseOut](e);
            //});
            //if (isZoomMultiple) {
            //    var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
            //    map.setExtent(layerExtent.expand(isZoomMultiple));
            //}

            //graphicsLayer.on("mouse-over", function (e) {
            //    map.infoWindow.setTitle(e.graphic.getTitle());
            //    map.infoWindow.setContent(e.graphic.getContent());
            //    map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
            //});
            //graphicsLayer.on("mouse-out", function (e) {
            //    //mouseOutLayer(e)
            //    map.infoWindow.hide();
            //});

        });
}




function AddShanyeGraphicsPolygon(graPolygonJsons) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
           "esri/renderers/ClassBreaksRenderer",
              "esri/renderers/jsonUtils",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer,ClassBreaksRenderer,rendererJsonUtils, InfoWindow,
            domConstruct) {
            if (map == null) return;


            var graphicsJson1 = graPolygonJsons.geometry;//线的坐标
            var fieldRadius = graPolygonJsons.fieldRadius;//角度的字段


            var angle = graPolygonJsons.angle;  //角度的间隔

            var radius = graPolygonJsons.radius;//半径长
            

            var pointGraphic = graPolygonJsons.gra;//layerID、symbol、scale
            var layerId = pointGraphic.layerID;

            var renderJson = pointGraphic.symbol;
            var graScale = pointGraphic.scale;
            var eventJson = graPolygonJsons.event;
            var isZoomMultiple = graPolygonJsons.zoom;
            var graphicsLayer;

            var showInfo, showTooltip;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);
            }
            else {
                graphicsLayer = new GraphicsLayer({ id: layerId });
                map.addLayer(graphicsLayer);
            }
            if (pointGraphic.scale)
            graphicsLayer.setScaleRange(graScale["min"], graScale["max"]);
            var graphicsJsonString = JSON.stringify(graphicsJson1);
            var graphicsJson = JSON.parse(graphicsJsonString);

            for (var i = 0; i < graphicsJson.length; i++) {

                //var gJson = graphicsJson[i];
                //var radius1 = radius;
                //var lon = gJson["geometry"]["x"];
                //var lat = gJson["geometry"]["y"];
                //var bufferPoints = createCricle(lon, lat, radius1);
                //var geo = new Object();
                //geo["rings"] = [bufferPoints];
                //geo["spatialReference"] = gJson["geometry"]["spatialReference"];
                //gJson["geometry"] = geo;

                //var graphic = new Graphic(gJson);
                ////   var graphic = new Graphic(graphicsJson[i]);
                ////  console.log("绘制多边形" + JSON.stringify(graphic));
                //// console.log("绘制多边形图形" + JSON.stringify(graphic.geometry));
                //graphicsLayer.add(graphic);



                
                var gJson = graphicsJson[i];
                var radius1 =parseInt(radius);
                var lon = gJson["geometry"]["x"];
                var lat = gJson["geometry"]["y"];

                var startRadius = parseInt(gJson["attributes"][fieldRadius]);
                var endRadius = parseInt(angle) + startRadius;
              


                var bufferPoints = createCricle1(lon, lat, radius1, startRadius, endRadius);

                    var geo = new Object();
                    geo["rings"] = [bufferPoints];
                    geo["spatialReference"] = gJson["geometry"]["spatialReference"];
                    gJson["geometry"] = geo;

                    var graphic = new Graphic(gJson);

        
                    graphicsLayer.add(graphic);


                //var graphic = new Graphic(graphicsJson[i]);
                //graphicsLayer.add(graphic);

                if (graphic.infoTemplate) showInfo = true;
                if (graphic.attributes)
                    if (graphic.attributes["Tooltip"])
                        showTooltip = true;
            }

            //样式渲染
            var renderer;
            if (renderJson.type == "uniqueValue")
                renderer = new UniqueValueRenderer(renderJson);

            else if (renderJson.type == "simple")
                renderer = new SimpleRenderer(renderJson);
            else if (renderJson.type == "classBreaks")
                renderer = new ClassBreaksRenderer(renderJson);


            // var renderer = rendererJsonUtils.constructor(renderJson);
            graphicsLayer.setRenderer(renderer);
            graphicsLayer.redraw();



            if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
                window[eventJson.mouseClick](e);
            });
            if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
                window[eventJson.mousedbClick](e);
            });

            graphicsLayer.on("mouse-over", function (e) {
                if (showTooltip) {
                    mouseOverLayer(e);
                }
                else if (showInfo) {
                    map.infoWindow.setTitle(e.graphic.getTitle());
                    map.infoWindow.setContent(e.graphic.getContent());
                    map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
                }
                if (eventJson.mouseOver)
                    window[eventJson.mouseOver](e);
            });
            graphicsLayer.on("mouse-out", function (e) {
                if (showTooltip) {
                    mouseOutLayer(e)
                }
                //mouseOutLayer(e)
                //map.infoWindow.hide();
            });
            if (isZoomMultiple) {
                var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
                map.setExtent(layerExtent.expand(isZoomMultiple));
            }

        });

}

//添加扇叶面
function AddShanyePolygons(graPolygonJsons) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
        "esri/renderers/jsonUtils",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer,rendererJsonUtils, InfoWindow,
            domConstruct) {

            AddShanyeGraphicsPolygon(graPolygonJsons);

        });
}
//添加点,需指定图层名、点集、样式
function AddPoints(layerId, graphicsJson, renderJson, eventJson, isZoomMultiple) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/renderers/ClassBreaksRenderer", "esri/renderers/HeatmapRenderer",
        "esri/dijit/InfoWindow", "dojo/query", "esri/renderers/jsonUtils",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer,
            InfoWindow, query, rendererJsonUtils,
            domConstruct) {
            if (map == null) return;
            var graphicsLayer;
            var showInfo, showTooltip, showAny;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);
            }
            else {
                graphicsLayer = new GraphicsLayer({ id: layerId });
                map.addLayer(graphicsLayer, 100);
            }
            for (var i = 0; i < graphicsJson.length; i++) {
                var graphic = new Graphic(graphicsJson[i]);
                graphicsLayer.add(graphic);
                if (graphic.infoTemplate) showInfo = true;
                if (graphic.attributes) {
                    if (graphic.attributes["Tooltip"] || graphic.attributes["tooltip"]) {
                        if (graphic.attributes["Tooltip"] == "false" || graphic.attributes["tooltip"] == "false") {
                            showTooltip = false;
                            showAny = true;
                        }
                        else
                            showTooltip = true;
                    }
                }
            }
            if (showAny) showInfo = false;
            //var link = domConstruct.create("a", {
            //    "class": "action",
            //    "id": "statsLink",
            //    "innerHTML": "Population", //text that appears in the popup for the link 
            //    "href": "javascript: void(0);"
            //}, query(".actionList", window.map.infoWindow.domNode)[0]);
            //样式渲染
            var renderer;
            if (renderJson.type == "uniqueValue")
                renderer = new UniqueValueRenderer(renderJson);
            else if (renderJson.type == "simple") {
                renderer = new SimpleRenderer(renderJson);
                if (renderer.symbol.path)
                    renderer.symbol.setPath(renderer.symbol.path);
            } else if (renderJson.type == "classBreaks") {
                renderer = new ClassBreaksRenderer(renderJson);
            } else if (renderJson.type == "heatmap") {
                //delete renderJson.type;
                renderer = new HeatmapRenderer({
                    field: "pop",
                    blurRadius: 10,
                    maxPixelIntensity: 100,
                    minPixelIntensity: 1
                });
                renderer.blurRadius = 10;
                renderer.maxPixelIntensity = 100;
                renderer.minPixelIntensity = 1;
            }
            //else {

            // //   var renderer;


            //    renderer = rendererJsonUtils.fromJSON(renderJson);
            //}
            if (renderJson.sizeInfo) renderer.setSizeInfo(renderJson.sizeInfo);
            graphicsLayer.setRenderer(renderer);
            graphicsLayer.redraw();
            if (eventJson) {
                if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
                    window[eventJson.mouseClick](e);
                });
                if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
                    window[eventJson.mousedbClick](e);
                });
                if (eventJson.onload) {
                    window[eventJson.onload]();
                };
            }

            graphicsLayer.on("mouse-over", function (e) {
                if (showTooltip) {
                    mouseOverLayer(e);
                }
                else if (showInfo) {
                    map.infoWindow.setTitle(e.graphic.getTitle());
                    map.infoWindow.setContent(e.graphic.getContent());
                    map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
                }
                if (eventJson.mouseOver) window[eventJson.mouseOver](e);
            });
            graphicsLayer.on("mouse-out", function (e) {
                if (showTooltip) {
                    mouseOutLayer(e)
                }
                //mouseOutLayer(e)
                //map.infoWindow.hide();
            });

            if (isZoomMultiple) {
                var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
                map.setExtent(layerExtent.expand(isZoomMultiple));
            }

        });
}

//添加线--new
function AddPolylines(layerId, graphicsJson, renderJson, eventJson, isZoomMultiple) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
              "esri/renderers/ClassBreaksRenderer",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer,
            InfoWindow,
            domConstruct) {
            if (map == null) return;
            var graphicsLayer;
            var showInfo, showTooltip;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);

            }
            else {
                graphicsLayer = new GraphicsLayer({ id: layerId });
                map.addLayer(graphicsLayer);
            }
            for (var i = 0; i < graphicsJson.length; i++) {
                var graphic = new Graphic(graphicsJson[i]);
                graphicsLayer.add(graphic);
                if (graphic.infoTemplate) showInfo = true;
                if (graphic.attributes)
                    if (graphic.attributes["Tooltip"])
                        showTooltip = true;
            }

            //样式渲染
            var renderer;
            if (renderJson.type == "uniqueValue")
                renderer = new UniqueValueRenderer(renderJson);
            else if (renderJson.type == "simple")
                renderer = new SimpleRenderer(renderJson);
            else if (renderJson.type == "classBreaks")
                renderer = new ClassBreaksRenderer(renderJson);
            graphicsLayer.setRenderer(renderer);
            graphicsLayer.redraw();

            if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
                window[eventJson.mouseClick](e);
            });
            if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
                window[eventJson.mousedbClick](e);
            });

            graphicsLayer.on("mouse-over", function (e) {
                if (showTooltip) {
                    mouseOverLayer(e);
                }
                else if (showInfo) {
                    map.infoWindow.setTitle(e.graphic.getTitle());
                    map.infoWindow.setContent(e.graphic.getContent());
                    map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
                }
                if (eventJson.mouseOver)
                    window[eventJson.mouseOver](e);
            });
            graphicsLayer.on("mouse-out", function (e) {
                if (showTooltip) {
                    mouseOutLayer(e)
                }
                //mouseOutLayer(e)
                //map.infoWindow.hide();
            });
            if (isZoomMultiple) {
                var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
                map.setExtent(layerExtent.expand(isZoomMultiple));
            }

        });
}










var executeIdentifyTaskEvent;


//隐藏浮动窗体
function InfoWindowSetHide() {
    require([
               "esri/map"
    ], function (Map) {
        map.infoWindow.hide();
    })
}
//地图缩放
function MapRemoveIdentifyTaskEvent() {
    require([
               "esri/map"
    ], function (Map) {
        alert("nihaod");
        executeIdentifyTaskEvent.remove();
    })
}
//  响应点击事件
//parcelsURL = "https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer";

//定位到已存在的点
function FlyTo(layerId, AttrName, Value, styleJson, ZoomTile, gis_targetLayerName) {
    require(["esri/map", "esri/layers/Layer",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, Layer, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, InfoWindow,
            domConstruct) {
            if (map == null) return;
            if (layerId == null) return;
            var graphicsLayer;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);
            }
            else
                return;
            var targetPoint;
            for (var i = 0; i < graphicsLayer.graphics.length; i++) {
                var graphic = graphicsLayer.graphics[i];
                if (graphic.attributes[AttrName] == Value) {
                    var symbol;
                    if (styleJson) {
                        switch (styleJson.type) {
                            case "esriPMS":
                                symbol = new PictureMarkerSymbol(styleJson);
                                break;
                            case "esriSFS":
                                symbol = new SimpleFillSymbol(styleJson);
                                break;
                            default:

                        }
                        var targetgraphic = new Graphic(graphic.geometry, symbol);
                        var gis_targetLayer;
                        //if (map.getLayer("gis_targetLayer")) {
                        //    gis_targetLayer = map.getLayer("gis_targetLayer");
                        //    gis_targetLayer.clear();
                        //}
                        //else {
                        //    gis_targetLayer = new GraphicsLayer({ id: "gis_targetLayer" });
                        //    map.addLayer(gis_targetLayer, 0);
                        //}

                        if (map.getLayer(gis_targetLayerName)) {
                            gis_targetLayer = map.getLayer(gis_targetLayerName);
                            gis_targetLayer.clear();
                        }
                        else {
                            gis_targetLayer = new GraphicsLayer({ id: gis_targetLayerName });
                            map.addLayer(gis_targetLayer, 0);
                        }
                        gis_targetLayer.add(targetgraphic);
                    }
                    if (ZoomTile) {
                        map.setZoom(ZoomTile);
                        map.setExtent(graphicsUtils.graphicsExtent([graphic]));
                    }
                    return;
                }
            }

        });
}

//定位到已存在的点
function ShowInfo(layerId, AttrName, Value) {
    require(["esri/map", "esri/layers/Layer",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, Layer, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, InfoWindow,
            domConstruct) {
            if (map == null) return;
            if (layerId == null) return;
            var graphicsLayer;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);
            }
            else
                return;
            var targetPoint;
            for (var i = 0; i < graphicsLayer.graphics.length; i++) {
                var graphic = graphicsLayer.graphics[i];
                if (graphic.attributes[AttrName] == Value) {
                    //show
                    map.infoWindow.setTitle(graphic.getTitle());
                    map.infoWindow.setContent(graphic.getContent());
                    map.infoWindow.show(graphic.geometry, location, InfoWindow.ANCHOR_UPPERRIGHT);

                    return;
                }
            }

        });
}

//加载图层
function AddLayer(url, renderJson, isZoomMultiple) {
    require([
            "dojo/dom-construct",
            "esri/map",
            "esri/layers/FeatureLayer", "esri/geometry/Extent", "esri/InfoTemplate",
            "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color",
            "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/tasks/query",
            "dojo/domReady!"
    ], function (
              domConstruct, Map, FeatureLayer, Extent,
              InfoTemplate, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol, Color, SimpleRenderer, UniqueValueRenderer, Query
            ) {
        var featureLayer = new FeatureLayer(url, {
            id: "world-regions"
        });

        var renderer;
        if (renderJson.type == "uniqueValue")
            renderer = new UniqueValueRenderer(renderJson);
        else if (renderJson.type == "simple") {
            renderer = new SimpleRenderer(renderJson);
            if (renderer.symbol.path)
                renderer.symbol.setPath(renderer.symbol.path);
        } else if (renderJson.type == "ClassBreaks") {
            renderer = new ClassBreaksRenderer(renderJson);
        }
        if (renderJson.sizeInfo) renderer.setSizeInfo(renderJson.sizeInfo);
        featureLayer.setRenderer(renderer);
        //featureLayer.redraw();
        map.addLayer(featureLayer, 2);
        if (isZoomMultiple) {
            //map.setExtent(featureLayer.fullExtent);
            var query = new Query();
            query.where = "1=1";
            query.outFields = ["*"];
            query.returnGeometry = true;
            // Query for the features with the given object ID
            featureLayer.queryExtent(query,
                function (e) {
                    var extent = new Extent(e.extent);
                    extent.spatialReference = { "wkid": 4326 };
                    map.setExtent(new Extent(extent.expand(isZoomMultiple)));
                }, function (e) {
                });
        }
    }
)
}

//获取图层可见性
function GetLayerVisible(layerId, callback) {
    require([
            "esri/map", "esri/layers/layer"
    ], function (Map, Layer) {
        var layer = map.getLayer(layerId)
        callback(layer.visible);
    })
}



//鼠标滑过
var TooltipInfoWindow;
var graRender;
function mouseLayerOverLayer(event) {
    require(["esri/map", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate", "esri/graphic", "lgis/BubblePopup",


         "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color",
        "dojo/dom", "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, SimpleMarkerSymbol, PictureMarkerSymbol,
           InfoTemplate, Graphic, InfoWindow,
            SimpleFillSymbol, SimpleLineSymbol, Color,
            dom, domConstruct) {
            if (!event.graphic.attributes.Tooltip) return;
            map.setMapCursor("pointer");
            if (event.graphic == undefined) return;


            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
   new Color([98, 194, 204]), 2), new Color([98, 194, 204, 0.5])
 );

            var staticSymbol = event.graphic.symbol;
            console.log(JSON.stringify(staticSymbol));

            graRender = JSON.stringify(event.graphic._graphicsLayer.renderer);
           // console.log(JSON.stringify(event.graphic._graphicsLayer.renderer));
           // var graphic = results[i].feature;
            event.graphic.setSymbol(symbol);
            //var font = new esri.symbol.Font();
            //font.setSize("10pt");
            //font.setFamily("微软雅黑");
            //var cpoint;
            //if (event.graphic.type == "polygon")
            //{
            //    cpoint = event.graphic.geometry.getCentroid();
            //}
            //else if (event.graphic.type == "point")
            //{
            //    cpoint = event.graphic.geometry;
            //}
            var cpoint = event.mapPoint;
            //var text = new esri.symbol.TextSymbol(event.graphic.attributes.Tooltip);
            //text.setFont(font);
            //text.setColor(new dojo.Color([0, 0, 0, 100]));
            //text.setOffset(20, -35);
            //var pmsTextBg = new PictureMarkerSymbol("../img/bd.jpg", 80, 20);
            //pmsTextBg.setOffset(20, -30);
            var textLength = event.graphic.attributes.Tooltip.length;
            //pmsTextBg.setWidth(textLength * 13.5 + 5);
            //var bgGraphic = new esri.Graphic(cpoint, pmsTextBg);
            //showTextLayer.add(bgGraphic);
            //var labelGraphic = new esri.Graphic(cpoint, text);
            //showTextLayer.add(labelGraphic);
            TooltipInfoWindow = new InfoWindow();
            TooltipInfoWindow.setMap(map);
            //TooltipInfoWindow.resize(textLength * 13.5 + 5, 75);
            //TooltipInfoWindow.resize(150, 75);
            //TooltipInfoWindow.__mcoords = cpoint;
            //TooltipInfoWindow.setTitle(event.graphic.attributes.Tooltip);
            TooltipInfoWindow.setContent(event.graphic.attributes.Tooltip);
            TooltipInfoWindow.show(cpoint);

        })
};
//鼠标滑出
function mouseLayerOutLayer(e) {

    require(["esri/map",
      "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
      "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
      "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
      "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
          "esri/renderers/ClassBreaksRenderer",
      "esri/dijit/InfoWindow",
       "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color",
      "dojo/dom-construct", "dojo/domReady!"],
      function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
          SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
          Color, InfoWindowLite, InfoTemplate,
          SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer,
          InfoWindow,

          SimpleFillSymbol, SimpleLineSymbol, Color,
          domConstruct) {



          if (TooltipInfoWindow) {
              TooltipInfoWindow.hide();
              var pops = document.getElementsByClassName("dextra-bubble-pop");
              for (var i = 0; i < pops.length; i++) {
                  pops[i].style.display = 'none';
              }
          }

        //  event.graphic._graphicsLayer.renderer = JSON.parse(graRender);

          var renderJson= JSON.parse(graRender);
          var renderer;
          if (renderJson.type == "uniqueValue")
              renderer = new UniqueValueRenderer(renderJson);
          else if (renderJson.type == "simple")
              renderer = new SimpleRenderer(renderJson);
          else if (renderJson.type == "classBreaks")
              renderer = new ClassBreaksRenderer(renderJson);

          event.graphic._graphicsLayer.setRenderer(renderer);
         // graphicsLayer.setRenderer(renderer);
          event.graphic._graphicsLayer.redraw();

        
          //  graRender = JSON.stringify(event.graphic._graphicsLayer.renderer);
          //map.graphics.clear();
          //showTextLayer.clear();
          map.setMapCursor("default");


      });
  
 
}



//鼠标滑过
var TooltipInfoWindow;
function mouseOverLayer(event) {
    require(["esri/map", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol",
        "esri/Color", "esri/InfoTemplate", "esri/graphic", "lgis/BubblePopup",
        "dojo/dom", "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, SimpleMarkerSymbol, PictureMarkerSymbol, Color, InfoTemplate, Graphic, InfoWindow, dom, domConstruct) {
            if (!event.graphic.attributes.Tooltip) return;
            map.setMapCursor("pointer");
            if (event.graphic == undefined) return;
            //var font = new esri.symbol.Font();
            //font.setSize("10pt");
            //font.setFamily("微软雅黑");
            //var cpoint;
            //if (event.graphic.type == "polygon")
            //{
            //    cpoint = event.graphic.geometry.getCentroid();
            //}
            //else if (event.graphic.type == "point")
            //{
            //    cpoint = event.graphic.geometry;
            //}
            var cpoint = event.mapPoint;
            //var text = new esri.symbol.TextSymbol(event.graphic.attributes.Tooltip);
            //text.setFont(font);
            //text.setColor(new dojo.Color([0, 0, 0, 100]));
            //text.setOffset(20, -35);
            //var pmsTextBg = new PictureMarkerSymbol("../img/bd.jpg", 80, 20);
            //pmsTextBg.setOffset(20, -30);
            var textLength = event.graphic.attributes.Tooltip.length;
            //pmsTextBg.setWidth(textLength * 13.5 + 5);
            //var bgGraphic = new esri.Graphic(cpoint, pmsTextBg);
            //showTextLayer.add(bgGraphic);
            //var labelGraphic = new esri.Graphic(cpoint, text);
            //showTextLayer.add(labelGraphic);
            TooltipInfoWindow = new InfoWindow();
            TooltipInfoWindow.setMap(map);
            //TooltipInfoWindow.resize(textLength * 13.5 + 5, 75);
            //TooltipInfoWindow.resize(150, 75);
            //TooltipInfoWindow.__mcoords = cpoint;
            //TooltipInfoWindow.setTitle(event.graphic.attributes.Tooltip);
            TooltipInfoWindow.setContent(event.graphic.attributes.Tooltip);
            TooltipInfoWindow.show(cpoint);

        })
};
//鼠标滑出
function mouseOutLayer() {
    if (TooltipInfoWindow) {
        TooltipInfoWindow.hide();
        var pops = document.getElementsByClassName("dextra-bubble-pop");
        for (var i = 0; i < pops.length; i++) {
            pops[i].style.display = 'none';
        }
    }
    //map.graphics.clear();
    //showTextLayer.clear();
    map.setMapCursor("default");
}


//地图缩放
function MapZoom(lon, lat, level) {
    require([
               "esri/map", "esri/geometry/Point"
    ], function (Map, Point) {
        map.centerAndZoom(new Point(parseFloat(lon), parseFloat(lat)), parseFloat(level));
    })
}

//地图缩放
function MapZoomToExent(exentJson) {
    require([
               "esri/map", "esri/geometry/Point"
    ], function (Map, Point) {
        var extent = new esri.geometry.Extent(exentJson);
        map.setExtent(extent);
    })
}


//地图清空
function MapClear() {
    require([
            "esri/map"
    ], function () {
        map.graphics.clear();


       // removeAllLayers()
       // map.removeAllLayers();

        var graphicsLayerIds = map.graphicsLayerIds;

        var graphicsJson = JSON.stringify(graphicsLayerIds);
        var graphicsObject = JSON.parse(graphicsJson);
       
        var layersID = graphicsObject.length;
        for (var i = 0; i < layersID; i++)
        {
            var layerID = graphicsObject[i];
            var graLayer = map.getLayer(layerID);
          //  removeAllLayers()
            map.removeLayer(graLayer);
           // graphicsLayerIds = map.graphicsLayerIds;
        }
       

        //map.reorderLayer(graLayer, graphicsLayerIds.length + 1);


      
    })
}



//设置图层可见性
function SetLayerVisible(layerId, visible) {
    require([
            "esri/map", "esri/layers/layer"
    ], function (Map, Layer) {
        var layer = map.getLayer(layerId);
        if (visible) {
            layer.show();
            layer.visible = true;
        }
        else {
            layer.hide();
            layer.visible = false;
        }
    });
}

//图层清空
function LayerClear(layerId) {
    require([
            "esri/map"
    ], function () {
        if (map.getLayer(layerId)) {
            //map.getLayer(layerId).clear();
            //map.getLayer(layerId).redraw();
            map.removeLayer(map.getLayer(layerId));
        }
        // map.infoWindow.visible = false;
    });
}
//设置图层可见性
function SetLayerScale(layerId, MinScale, MaxScale) {
    require([
            "esri/map", "esri/layers/layer"
    ], function (Map, Layer) {
        var layer = map.getLayer(layerId);
        if (layer) {
            layer.setMinScale(MinScale);
            layer.setMaxScale(MaxScale);

        };
    });
}




var scalebar;
//比例尺设定
//postion: "top-right","bottom-right","top-center","bottom-center","bottom-left","top-left". The default value is "bottom-left".
function SetScalebar(visible, postion) {
    require(["esri/map", "esri/dijit/Scalebar"
    ], function (Map, Scalebar) {
        if (scalebar == undefined) {
            scalebar = new Scalebar({
                map: map,
                attachTo: postion
            });
        }
        if (visible)
            scalebar.show();
        else
            scalebar.hide();
    });
}
var overviewMapDijit;
//鹰眼设定
//postion: "top-right","bottom-right","top-center","bottom-center","bottom-left","top-left". The default value is "bottom-left".
function SetOverviewMap(visible, postion) {
    require([
        "esri/map", "esri/dijit/OverviewMap",
        "dojo/parser",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
    ], function (
        Map, OverviewMap,
        parser
      ) {
        //parser.parse();
        if (overviewMapDijit == undefined) {
            overviewMapDijit = new OverviewMap({
                map: map,
                attachTo: postion,
            });
        }
        if (visible) {
            overviewMapDijit.startup();
            overviewMapDijit.show();
        }
        else {
            overviewMapDijit.visible = false;
            overviewMapDijit.hide();
        }
    });
}
var legend;
//图例设定 
function SetLegend(visible, legendDiv) {
    require([
        "esri/map", "esri/dijit/Legend"
    ], function (
        Map, Legend
      ) {
        //parser.parse();
        if (legend == undefined) {
            legend = new Legend({
                map: map
            }, legendDiv);
        }
        if (visible) {
            legend.startup();
        }
        else {
            legend.destroy();
        }
    });
}
var home;
//图例设定 
function SetHomeButton(visible, HomeButtonDiv) {
    require([
        "esri/map", "esri/dijit/HomeButton", "dojo/domReady!"
    ], function (
        Map, HomeButton
      ) {
        //parser.parse();
        if (home == undefined) {
            home = new HomeButton({
                map: map
            }, HomeButtonDiv);
            home.startup();
        }
        if (visible) {
            home.show();
        }
        else {
            home.hide();
        }
    });
}
//测量
function Measure(index) {
    require(["lgis/Measure"], function (Navigation) {
        measure = new widgets.Measure({ map: map });
        if (index == "distance") {
            measure.measure(esri.toolbars.Draw.POLYLINE);
        }
        else if (index == "area") {
            measure.measure(esri.toolbars.Draw.POLYGON);
        }
        else if (index == "clear") {
            LayerClear("GL_Widgets_Measure_01");
            var x = document.getElementsByClassName("class_widgets_measure");
            var n = x.length;
            for (var i = 0; i < n; i++) {
                x[0].parentNode.removeChild(x[0]);
            }
        }
    });
}





//加载脚本或样式文件
function loadExtentFile(filePath, fileType) {
    if (fileType == "js") {
        var oJs = document.createElement('script');
        oJs.setAttribute("type", "text/javascript");
        oJs.setAttribute("src", filePath);//文件的地址 ,可为绝对及相对路径
        document.getElementsByTagName("head")[0].appendChild(oJs);//绑定
    } else if (fileType == "css") {
        var oCss = document.createElement("link");
        oCss.setAttribute("rel", "stylesheet");
        oCss.setAttribute("type", "text/css");
        oCss.setAttribute("href", filePath);
        document.getElementsByTagName("head")[0].appendChild(oCss);//绑定
    }
}



//修改图层要素样式
function LayerEdit(layerId, AttrName, Value, styleJson, ZoomTile) {
    require(["esri/map", "esri/layers/Layer",
       "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
       "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
       "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
       "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
       "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/dijit/InfoWindow",
       "dojo/dom-construct", "dojo/domReady!"],
       function (Map, Layer, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
           SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
           Color, InfoWindowLite, InfoTemplate,
           SimpleRenderer, UniqueValueRenderer, InfoWindow,
           domConstruct) {
           if (map == null) return;
           if (layerId == null) return;
           var graphicsLayer;
           if (map.getLayer(layerId)) {
               graphicsLayer = map.getLayer(layerId);
           }
           else
               return;
           var targetGraphics = [];
           for (var i = 0; i < graphicsLayer.graphics.length; i++) {
               var graphic = graphicsLayer.graphics[i];
               if (graphic.attributes[AttrName] == Value) {
                   if (styleJson) {
                       switch (styleJson.type) {
                           case "esriPMS":
                               graphic.symbol = new PictureMarkerSymbol(styleJson);
                               break;
                           case "esriSMS":
                               graphic.symbol = new SimpleMarkerSymbol(styleJson);
                               break;
                           case "delete":
                               graphicsLayer.remove(graphic)
                               break;
                           default:
                               break;
                       }
                   }
                   targetGraphics.push(graphic);
               }
           }
           graphicsLayer.redraw();
           if (ZoomTile) {
               map.setZoom(ZoomTile);
               map.setExtent(graphicsUtils.graphicsExtent(targetGraphics));
           }
           return;
       });
}



//在图层中获取图形
function GetGraphicByAtr(layerId, Attr, value, callback) {
    require([
            "esri/map", "esri/layers/layer"
    ], function (Map, Layer) {
        var layer = map.getLayer(layerId);
        var graphics = [];
        for (var i = 0; i < layer.graphics.length; i++) {
            if (layer.graphics[i].attributes[Attr] == value)
                graphics.push(layer.graphics[i]);
        }
        callback(graphics);
    })
}



// identifyParams.layerIds = [0, 2];
//lmap.IdentifyClick(parcelsURL, layerIds, name, url, width, height);
function IdentifyClick(parcelsURL, layerName, layerIds, name, url, width, height) {
    require([
           "esri/map",
           "esri/InfoTemplate",
           "esri/layers/ArcGISDynamicMapServiceLayer",
           "esri/symbols/SimpleFillSymbol",
           "esri/symbols/SimpleLineSymbol",
           "esri/tasks/IdentifyTask",
           "esri/tasks/IdentifyParameters",
           "esri/dijit/Popup",
           "dojo/_base/array",
           "esri/Color",
           "esri/geometry/Extent",
           "dojo/dom-construct",
           "dojo/domReady!"
    ], function (
           Map, InfoTemplate, ArcGISDynamicMapServiceLayer, SimpleFillSymbol,
           SimpleLineSymbol, IdentifyTask, IdentifyParameters, Popup,
           arrayUtils, Color, Extent, domConstruct
         ) {
        // ["esri/geometry/Extent"], function(Extent) 
        var identifyTask, identifyParams;
        map.infoWindow.resize(width, height);
        //var popup = new Popup({
        //    fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        //        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
        //}, domConstruct.create("div"));

        //map = new Map("map", {
        //    basemap: "satellite",
        //    center: [-83.275, 42.573],
        //    zoom: 18,
        //    infoWindow: popup
        //});

        // map.on("load", mapReady);
        var dynamiclayer = new ArcGISDynamicMapServiceLayer(parcelsURL);
        dynamiclayer.id = layerName;
        dynamiclayer.on("load", dynamiclayerLoad);

        map.on("layer-add-result", dynamiclayerLoad);


        //var parcelsURL = "https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer";
        // map.addLayer(new ArcGISDynamicMapServiceLayer(parcelsURL, { opacity: 0.55 }));
        map.addLayer(dynamiclayer);
        // alert(dynamiclayer.id);
        // map.addLayer(dynamiclayer);

        // dynamiclayer.refresh();


        // function mapReady() {
        executeIdentifyTaskEvent = map.on("click", executeIdentifyTask);
        //create identify tasks and setup parameters
        identifyTask = new IdentifyTask(parcelsURL);

        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 1;
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = [0, 2];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        // }

        //LAYER_OPTION_ALL

        //LAYER_OPTION_TOP	
        //LAYER_OPTION_VISIBLE

        function dynamiclayerLoad(event) {
            // dynamiclayer.refresh();
            //map.extent = event.layer.fullExtent;

            // var ext=dynamiclayer.fullExtent;
            //var dyExtent = new Extent(ext.xmin,ext.ymin,ext.xmax,ext.ymax); 
            //map.extent = dyExtent.expand(1.5);
            // map.extent = dynamiclayer.fullExtent;

            // dynamiclayer.refresh();

            //dynamiclayer.resume();
            //map.extent = dynamiclayer.initialExtent;
        }
        function executeIdentifyTask(event) {
            identifyParams.geometry = event.mapPoint;
            identifyParams.mapExtent = map.extent;

            identifyParams.width = map.width;
            identifyParams.height = map.height;

            var deferred = identifyTask
              .execute(identifyParams)
              .addCallback(function (response) {
                  // response is an array of identify result objects
                  // Let's return an array of features.
                  return arrayUtils.map(response, function (result) {

                      // map.extent=
                      var feature = result.feature;
                      var layerName = result.layerName;
                      var url = "";
                      feature.attributes.layerName = layerName;
                      //  console.log(feature.attributes.PARCELID);
                      //var buildingFootprintTemplate = new InfoTemplate("",
                      //  "Parcel ID: ${PARCELID}");
                      url = '<iframe id="test" src=' + url + '${' + name + '} width=' + width * 0.94 + ' height=' + height * 0.8 + ' frameborder="0" style="margin:0px;" ></iframe>  ';

                      var buildingFootprintTemplate = new InfoTemplate("${" + name + "}",
                   url);

                      feature.setInfoTemplate(buildingFootprintTemplate);

                      //if (layerName === 'Tax Parcels') {

                      //    url = '<iframe id="test" src='+url+'${First Owner Name} width="100%" height="100%" frameborder="0" src="" style="margin:0px;" ></iframe>  ';
                      //    //var taxParcelTemplate = new InfoTemplate("",
                      //    //  "${Postal Address} <br/> Owner of record: ${First Owner Name}");
                      //    var taxParcelTemplate = new InfoTemplate(name,
                      //    url);


                      //    feature.setInfoTemplate(taxParcelTemplate);
                      //}
                      //else if (layerName === 'Building Footprints') {
                      //    console.log(feature.attributes.PARCELID);
                      //    //var buildingFootprintTemplate = new InfoTemplate("",
                      //    //  "Parcel ID: ${PARCELID}");
                      //    url = '<iframe id="test" src=' + url + '${PARCELID} width="100%" height="100%" frameborder="0" src="" style="margin:0px;" ></iframe>  ';


                      //    var buildingFootprintTemplate = new InfoTemplate(name,
                      // url);

                      //    feature.setInfoTemplate(buildingFootprintTemplate);
                      //}
                      return feature;
                  });
              });

            // InfoWindow expects an array of features from each deferred
            // object that you pass. If the response from the task execution
            // above is not an array of features, then you need to add a callback
            // like the one above to post-process the response and return an
            // array of features.

            map.infoWindow.setFeatures([deferred]);
            map.infoWindow.show(event.mapPoint);


        }
    });

}




//画圆
function CreateCircle(lon, lat, radius, callback) {
    require([
     "esri/geometry/Circle",
     "esri/geometry/Polygon",
     "esri/Map",
     "esri/SpatialReference",
     "esri/geometry/Point",
     "esri/Graphic",
     "esri/units"

    ], function (Circle, Polygon, Map, SpatialReference, Point, Graphic, Units) {
        var pt = new Point([lon, lat], new SpatialReference({ wkid: 4326 }));
        var circle = new Circle({
            center: pt,
            geodesic: true,
            radius: radius
        });
        callback(circle);
    })
}



function createCricle(ptx, pty, radius) {

    var points = new Array();
    //var radius = 300;
    var lon = radius / 1110000;
    var lat = radius / 853900;
    //var lat = radius / 853900;
    // var lat = radius / ();
    for (var i = 0; i <= 360; i += 4) {




        var radian = i * (Math.PI / 180.0);
        var x = ptx * 1 + lat * Math.cos(radian) * 1;//r *[-1.1]
        var y = pty * 1 + lon * Math.sin(radian) * 1;


        //  var x = ptx*1 + (radius * Math.cos(radian))/ 853900;//r *[-1.1]
        // var y = pty*1 + (radius * Math.sin(radian))/1110000;
        points.push([x, y]);

    }
    return points;
}



function createCricle1(ptx, pty, radius, start, end) {

    var points = new Array();
    var radiusAngle = end - start;
    if(radiusAngle<360)
    points.push([ptx, pty]);
    //var radius = 300;
    var lon = radius / 1110000;
    var lat = radius / 853900;
    //var lat = radius / 853900;
    // var lat = radius / ();
    for (var i = start; i <= end; i ++) {


        var radian = i * (Math.PI / 180.0);
        var x = ptx * 1 + lat * Math.cos(radian) * 1;//r *[-1.1]
        var y = pty * 1 + lon * Math.sin(radian) * 1;

        //  var x = ptx*1 + (radius * Math.cos(radian))/ 853900;//r *[-1.1]
        // var y = pty*1 + (radius * Math.sin(radian))/1110000;
        points.push([x, y]);

    }
    if (radiusAngle < 360)
    points.push([ptx, pty]);
    return points;
}

//添加面
function AddCirclePolygons1(layerId, graphicsJson1, renderJson, radius, eventJson, isZoomMultiple,angleFiledName) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
        "esri/renderers/ClassBreaksRenderer",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, InfoWindow,
            domConstruct) {
            if (map == null) return;
            var graphicsLayer;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);

            }
            else {
                graphicsLayer = new GraphicsLayer({ id: layerId });
                map.addLayer(graphicsLayer);
            }


            function clone(obj) {

                var result = {};

                for (key in obj) {

                    result[key] = obj[key];

                }

                return result;

            }

            var graphicsJsonString = JSON.stringify(graphicsJson1);
            var graphicsJson = JSON.parse(graphicsJsonString);
            // var graphicsJson = Object.create(graphicsJson1)
            for (var i = 0; i < graphicsJson.length; i++) {
                //  var graphic = new Graphic(graphicsJson[i]);

                var gJson = graphicsJson[i];
                var radius1 = radius;
                var lon = gJson["geometry"]["x"];
                var lat = gJson["geometry"]["y"];

                var start = gJson["attributes"][angleFiledName];



                //CreateCircle(lon, lat, radius1,
                //     function (e) {

                //         //  var polygon = new Polygon(new SpatialReference({ wkid: 4326 }));
                //         //  polygon.addRing([[112, 36], [118, 32], [124, 46], [120, 48], [112, 36]]);

                //         var geo = new Object();
                //         geo["rings"] = e["rings"];
                //         geo["spatialReference"] = gJson["geometry"]["spatialReference"];

                //         gJson["geometry"] = geo;

                //     }
                //   )
                for (var num = 0; num < 1; num++) {

                    var startNumber = parseInt(90 * Math.random());

                    var endNumber = startNumber + 45 * 1;
                    switch (num) {
                        case 0:
                            startNumber = parseInt(45 * Math.random());
                            endNumber = startNumber + 45 * 1;
                            break;
                        case 1:
                            startNumber = parseInt(135 * Math.random());
                            endNumber = startNumber + 45 * 1;
                            break;
                        case 2:
                            startNumber = parseInt(270 * Math.random());
                            endNumber = startNumber + 45 * 1;
                            break;
                    }


                    var bufferPoints = createCricle1(lon, lat, radius1, start, start+30);

                   // var bufferPoints = createCricle1(lon, lat, radius1, startNumber, endNumber);

                    //console.log(bufferPoints);
                    var geo = new Object();
                    geo["rings"] = [bufferPoints];
                    geo["spatialReference"] = gJson["geometry"]["spatialReference"];
                    gJson["geometry"] = geo;

                    var graphic = new Graphic(gJson);

                    //   var graphic = new Graphic(graphicsJson[i]);
                    //  console.log("绘制多边形" + JSON.stringify(graphic));
                    // console.log("绘制多边形图形" + JSON.stringify(graphic.geometry));
                    graphicsLayer.add(graphic);

                }

            }

            //样式渲染
            var renderer;
            if (renderJson.type == "uniqueValue")
                renderer = new UniqueValueRenderer(renderJson);
            else if (renderJson.type == "simple")
                renderer = new SimpleRenderer(renderJson);
            else if (renderJson.type == "classBreaks")
                renderer = new ClassBreaksRenderer(renderJson);

            graphicsLayer.setRenderer(renderer);
            graphicsLayer.redraw();

            if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
                window[eventJson.mouseClick](e);
            });
            if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
                window[eventJson.mousedbClick](e);
            });
            if (eventJson.mouseOver) graphicsLayer.on("mouse-over", function (e) {
                window[eventJson.mouseOver](e);
            });
            if (eventJson.mouseOut) graphicsLayer.on("mouse-out", function (e) {
                window[eventJson.mouseOut](e);
            });
            if (isZoomMultiple) {
                var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
                map.setExtent(layerExtent.expand(isZoomMultiple));
            }

            //graphicsLayer.on("mouse-over", function (e) {
            //    map.infoWindow.setTitle(e.graphic.getTitle());
            //    map.infoWindow.setContent(e.graphic.getContent());
            //    map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
            //});
            //graphicsLayer.on("mouse-out", function (e) {
            //    //mouseOutLayer(e)
            //    map.infoWindow.hide();
            //});

        });
}



//添加面
function AddCirclePolygons(layerId, graphicsJson1, renderJson, radius, eventJson, isZoomMultiple) {
    require(["esri/map",
        "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer",
        "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/Color", "esri/dijit/InfoWindowLite", "esri/InfoTemplate",
        "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer",
            "esri/renderers/ClassBreaksRenderer",
        "esri/dijit/InfoWindow",
        "dojo/dom-construct", "dojo/domReady!"],
        function (Map, GraphicsLayer, FeatureLayer, Point, Graphic, graphicsUtils,
            SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,
            Color, InfoWindowLite, InfoTemplate,
            SimpleRenderer, UniqueValueRenderer,
            ClassBreaksRenderer,
            InfoWindow,
            domConstruct) {
            if (map == null) return;
            var graphicsLayer;
            if (map.getLayer(layerId)) {
                graphicsLayer = map.getLayer(layerId);

            }
            else {
                graphicsLayer = new GraphicsLayer({ id: layerId });
                map.addLayer(graphicsLayer);
            }


            function clone(obj) {

                var result = {};

                for (key in obj) {

                    result[key] = obj[key];

                }

                return result;

            }

            var graphicsJsonString = JSON.stringify(graphicsJson1);
            var graphicsJson = JSON.parse(graphicsJsonString);
            // var graphicsJson = Object.create(graphicsJson1)
            for (var i = 0; i < graphicsJson.length; i++) {
                //  var graphic = new Graphic(graphicsJson[i]);

                var gJson = graphicsJson[i];
                var radius1 = radius;
                var lon = gJson["geometry"]["x"];
                var lat = gJson["geometry"]["y"];

                var bufferPoints = createCricle(lon, lat, radius1);

                //console.log(bufferPoints);
                var geo = new Object();
                geo["rings"] = [bufferPoints];
                geo["spatialReference"] = gJson["geometry"]["spatialReference"];
                gJson["geometry"] = geo;

                //CreateCircle(lon, lat, radius1,
                //     function (e) {

                //         //  var polygon = new Polygon(new SpatialReference({ wkid: 4326 }));
                //         //  polygon.addRing([[112, 36], [118, 32], [124, 46], [120, 48], [112, 36]]);

                //         var geo = new Object();
                //         geo["rings"] = e["rings"];
                //         geo["spatialReference"] = gJson["geometry"]["spatialReference"];

                //         gJson["geometry"] = geo;

                //     }
                //   )

                var graphic = new Graphic(gJson);
                //   var graphic = new Graphic(graphicsJson[i]);
                //  console.log("绘制多边形" + JSON.stringify(graphic));
                // console.log("绘制多边形图形" + JSON.stringify(graphic.geometry));
                graphicsLayer.add(graphic);

            }

            //样式渲染
            var renderer;
            if (renderJson.type == "uniqueValue")
                renderer = new UniqueValueRenderer(renderJson);
            else if (renderJson.type == "simple")
                renderer = new SimpleRenderer(renderJson);
            else if (renderJson.type == "classBreaks")
                renderer = new ClassBreaksRenderer(renderJson);
            graphicsLayer.setRenderer(renderer);
            graphicsLayer.redraw();

            if (eventJson.mouseClick) graphicsLayer.on("click", function (e) {
                window[eventJson.mouseClick](e);
            });
            if (eventJson.mousedbClick) graphicsLayer.on("dbl-click", function (e) {
                window[eventJson.mousedbClick](e);
            });
            if (eventJson.mouseOver) graphicsLayer.on("mouse-over", function (e) {
                window[eventJson.mouseOver](e);
            });
            if (eventJson.mouseOut) graphicsLayer.on("mouse-out", function (e) {
                window[eventJson.mouseOut](e);
            });
            if (isZoomMultiple) {
                var layerExtent = graphicsUtils.graphicsExtent(graphicsLayer.graphics);
                map.setExtent(layerExtent.expand(isZoomMultiple));
            }

            //graphicsLayer.on("mouse-over", function (e) {
            //    map.infoWindow.setTitle(e.graphic.getTitle());
            //    map.infoWindow.setContent(e.graphic.getContent());
            //    map.infoWindow.show(e.mapPoint, location, InfoWindow.ANCHOR_UPPERRIGHT);
            //});
            //graphicsLayer.on("mouse-out", function (e) {
            //    //mouseOutLayer(e)
            //    map.infoWindow.hide();
            //});

        });
}




function SetDynamicLayerClickVisible(parcelsURL, layerName, layerIds, fieldNames, url, width, height) {
    var lyrVisible = [];
    require([
      "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer",
       "esri/config",

         "esri/InfoTemplate",
           "esri/symbols/SimpleFillSymbol",
           "esri/symbols/SimpleLineSymbol",
           "esri/tasks/IdentifyTask",
           "esri/tasks/IdentifyParameters",
           "esri/dijit/Popup",
           "dojo/_base/array",
           "esri/Color",
           "esri/geometry/Extent",
           "dojo/dom-construct",
      "dojo/dom", "dojo/on", "dojo/query", "dojo/_base/array",
      "dojo/domReady!"
    ], function (
      Map, ArcGISDynamicMapServiceLayer,
        esriConfig,

       InfoTemplate, SimpleFillSymbol,
           SimpleLineSymbol, IdentifyTask, IdentifyParameters, Popup,
           arrayUtils, Color, Extent, domConstruct,

      dom, on, query, arrayUtils
    ) {



        var identifyTask, identifyParams;
        map.infoWindow.resize(width, height);
        // map = new Map("map");
        esriConfig.defaults.io.proxyUrl = proxyURL;

        //  esriConfig.defaults.io.proxyUrl = "http:// localhost/DotNet/proxy.ashx ";

        esriConfig.defaults.io.alwaysUseProxy = false;
        // http://localhost/proxy/proxy.ashx?
        dynamiclayer = new ArcGISDynamicMapServiceLayer(parcelsURL);

        dynamiclayer.visible = true;
        dynamiclayer.id = layerName;
        //  layer = new ArcGISDynamicMapServiceLayer("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer");


        dynamiclayer.on("load", buildLayerList);
        map.addLayer(dynamiclayer);


        function buildLayerList() {
            // var lyerIndex = 0;

            // lyrVisible = new Array(dynamiclayer.layerInfos.length);

            // for (var i = 0; i < lyrVisible.length; i++) {

            //     lyrVisible[i] = false;
            // }

            var dylayerIds = layerIds.concat();
            //// alert(lyrVisible.length);
            var items = arrayUtils.map(dynamiclayer.layerInfos, function (info, index) {


                for (var nm = 0; nm < layerIds.length; nm++) {
                    if (layerIds[nm] == index) {
                        if (info.parentLayerId != -1) {
                            dylayerIds.push(info.parentLayerId);
                        }

                        if (info.subLayerIds != null) {
                            for (var mn = 0; mn < subLayerIds.length; mn++) {

                                dylayerIds.push(subLayerIds[mn]);
                            }
                        }

                    }
                }

                // visible.push(info.defaultVisibility);
                //   visible.push(false);
            });

            function unique(layerIdArray) {

                var arr = layerIdArray;
                // 遍历arr，把元素分别放入tmp数组(不存在才放)
                var tmp = new Array();
                for (var i in arr) {
                    //该元素在tmp内部不存在才允许追加
                    if (tmp.indexOf(arr[i]) == -1) {
                        tmp.push(arr[i]);
                    }
                }


                return tmp;
            }


            dynamiclayer.setVisibleLayers(unique(dylayerIds));
        }



        // function mapReady() {
        executeIdentifyTaskEvent = map.on("click", executeIdentifyTask);
        //create identify tasks and setup parameters
        identifyTask = new IdentifyTask(parcelsURL);

        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 3;
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = layerIds;//[0, 2];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        // }

        //LAYER_OPTION_ALL

        //LAYER_OPTION_TOP	
        //LAYER_OPTION_VISIBLE

        function dynamiclayerLoad(event) {

        }
        function executeIdentifyTask(event) {
            identifyParams.geometry = event.mapPoint;
            identifyParams.mapExtent = map.extent;

            identifyParams.width = map.width;
            identifyParams.height = map.height;

            var deferred = identifyTask
              .execute(identifyParams)
              .addCallback(function (response) {
                  // response is an array of identify result objects
                  // Let's return an array of features.
                  return arrayUtils.map(response, function (result) {

                      // if()
                      var lyrHtmlURL = "";
                      var fieldName = "";
                      for (var n = 0; n < layerIds.length; n++) {
                          if (result.layerID == layerIds[n]) {
                              fieldName = fieldNames[n];

                              lyrHtmlURL = url[n];
                          }


                      }
                      // map.extent=
                      var feature = result.feature;
                      var layerName = result.layerName;
                      var hytmlURL = "";
                      feature.attributes.layerName = layerName;
                      //  console.log(feature.attributes.PARCELID);
                      //var buildingFootprintTemplate = new InfoTemplate("",
                      //  "Parcel ID: ${PARCELID}");
                      hytmlURL = '<iframe id="test" src=' + lyrHtmlURL + '${' + fieldName + '} width=' + width * 0.94 + ' height=' + height * 0.8 + ' frameborder="0" style="margin:0px;" ></iframe>  ';

                      var buildingFootprintTemplate = new InfoTemplate("${" + fieldName + "}",
                   hytmlURL);

                      feature.setInfoTemplate(buildingFootprintTemplate);

                      return feature;
                  });
              });



            map.infoWindow.setFeatures([deferred]);
            map.infoWindow.show(event.mapPoint);


        }


    });

}







