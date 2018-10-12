/**
 * 全局变量
 */
var map;
var infoWindow;
// var service;
var markers = [];
var defaultIcon;
var currentFormattedAddress;


function init(){
    map = new AMap.Map('map', {
        center:[117.000923,36.675807],
        zoom:11
    });

    locate();
};


function markCurentPoi(){
    var marker = new AMap.Marker({
        // icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        icon: "image/location.png",
        position: KOViewModel.currentPoi(),
    });
    map.add(marker);
};

function markLocation(){

};

/**
 * 将传入位置作为地图中心点
 * @param {*} position  传入位置
 */
function centerLocation(position,adcode){
    if(markers != null){
        map.clearMap();
    }
    markCurentPoi();

    KOViewModel.startPoi(position);//更新初始点位置
    map.setCenter(position);
    getNearbyLocations(position,adcode);
};

/**
 * 定位当前位置
 */
function locate(){
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        markerOptions:{

        },
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        extensions:'all'   
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();

    AMap.event.addListener(geolocation, 'complete', function(GeolocationResult){
        if(GeolocationResult.info=="SUCCESS"){
            KOViewModel.currentPoi(GeolocationResult.position);
            KOViewModel.currentAddr(GeolocationResult.formattedAddress);
            markCurentPoi();
            getNearbyLocations(GeolocationResult.position,GeolocationResult.addressComponent.adcode);
        }
    });//返回定位信息
    AMap.event.addListener(geolocation, 'error', function(GeolocationError){
        if(GeolocationError.info == "NOT_SUPPORTED"){
            alterWarning('当前浏览器不支持定位功能');
        }
        if(GeolocationError.info == "FAILED"){
            alterWarning('定位失败');
            console.log("定位失败原因："+GeolocationError.message);
        }
    });//返回定位出错信息
};

/**
 *  搜索 
 * @param {*} position  中心点
 * @param {*} adcode    兴趣点城市
 * @param {*} keyword   兴趣点类别
 * @param {*} size      单页显示结果条数
 * @param {*} radius    
 */
function getNearbyLocations(position,adcode,keyword='餐饮服务',size=10,radius=1000){
    var placeSearch = new AMap.PlaceSearch({
        type: keyword, 
        pageSize: size, 
        pageIndex: 1,
        city: adcode, 
        citylimit: true,  
        map: map,
        // panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    });

    placeSearch.searchNearBy(keyword, position, radius, function(status, result) {
        if(status == "complete"){
            //清空原搜索结果集
            KOViewModel.searchPois([]);
            //刷新左侧列表数据
            result.poiList.pois.forEach(element => {
                console.log(element.name);
                KOViewModel.searchPois.push(new Poi(element));
            });
        }else if(status == "no_data"){
            alterWarning('附近无'+keyword+',请更换关键词查询');
        }else{
            alterWarning('附近无'+keyword);
        }
    });
    markers = map.getAllOverlays('marker');

    //Todo:结合searchInBounds实现自选区域内搜索
};

function alterWarning(msg){
    /**
     * 提示警告
     */
    console.log(msg);
};

function showInfoWindow(){

};

function getDetailInfo(){

};

function queryMoreInfo(){

};