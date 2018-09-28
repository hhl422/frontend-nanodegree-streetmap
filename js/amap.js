/**
 * 全局变量
 */
var map;
var infoWindow;
// var service;
// var markers = [];
// var defaultIcon;
// var highlightedIcon;


function init(){
    map = new AMap.Map('map', {
        center:[117.000923,36.675807],
        zoom:11
    });

    
};

function markLocation(){

};

function centerLocation(position){
    map.setCenter(position);
};

// https://lbs.amap.com/api/javascript-api/reference/location
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
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();
    // https://lbs.amap.com/api/javascript-api/reference/location#m_GeolocationResult
    AMap.event.addListener(geolocation, 'complete', function(GeolocationResult){
        if(GeolocationResult.info=="SUCCESS"){
            /**
             * 定位成功
             */
        }
    });//返回定位信息
    // https://lbs.amap.com/api/javascript-api/reference/location#m_GeolocationError
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

function getNearbyLocations(){

};

function alterWarning(msg){
    /**
     * 提示警告
     */
};

function showInfoWindow(){

};

function getDetailInfo(){

};

function queryMoreInfo(){

};