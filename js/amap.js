/**
 * 全局变量
 */
var map,auto,placeSearch,infoWindow;
var infoWindow;
var markers = [];
var defaultIcon;
var currentFormattedAddress;


function init(){
    map = new AMap.Map('map', {
        center:[117.000923,36.675807],
        zoom:11
    });

     //输入提示
    auto = new AMap.Autocomplete({
        input: "tipinput",
        citylimit: true
    });

    //附近搜索
    placeSearch = new AMap.PlaceSearch({
        pageSize: 10, 
        pageIndex: 1,
        citylimit: true,  
        map: map,
        autoFitView: true
    });

    //定位当前位置，确定城市号码
    locate();

    document.getElementById("options").addEventListener('change',function(){
        //选择类别时，刷新附近地点信息 
        //选取起始位置>实际位置
        var p = (KOViewModel.startPoi() != null)?KOViewModel.startPoi():KOViewModel.currentPoi();
        getNearbyLocations(p,KOViewModel.selectedType());
    });
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
            //搜索填充的城市范围
            auto.setCity(GeolocationResult.addressComponent.adcode);
            //附近搜索的城市范围
            placeSearch.setCity(GeolocationResult.addressComponent.adcode);

            getNearbyLocations(GeolocationResult.position);
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

function addMarker(poi){
    console.log("addMarker :"+poi);
    marker = new AMap.Marker({
        map: map,
        position: poi
    });

     //实例化信息窗体
     var title = '方恒假日酒店<span style="font-size:11px;color:#F00;">价格:318</span>',
     content = [];
     content.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
     content.push("电话：010-64733333");
     content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
     infoWindow = new AMap.InfoWindow({
         isCustom: true,  //使用自定义窗体
         content: createInfoWindow(title, content.join("<br/>")),
         offset: new AMap.Pixel(16, -45)
     });

    //鼠标点击marker弹出自定义的信息窗体
    AMap.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker.getPosition());
    }); 

}

//构建自定义信息窗体 
//copy from https://lbs.amap.com/api/javascript-api/example/infowindow/custom-style-infowindow
function createInfoWindow(title, content) {
   var info = document.createElement("div");
   info.className = "info";

   //可以通过下面的方式修改自定义窗体的宽高
   //info.style.width = "400px";
   // 定义顶部标题
   var top = document.createElement("div");
   var titleD = document.createElement("div");
   var closeX = document.createElement("img");
   top.className = "info-top";
   titleD.innerHTML = title;
   closeX.src = "https://webapi.amap.com/images/close2.gif";
   closeX.onclick = closeInfoWindow;

   top.appendChild(titleD);
   top.appendChild(closeX);
   info.appendChild(top);

   // 定义中部内容
   var middle = document.createElement("div");
   middle.className = "info-middle";
   middle.style.backgroundColor = 'white';
   middle.innerHTML = content;
   info.appendChild(middle);

   // 定义底部内容
   var bottom = document.createElement("div");
   bottom.className = "info-bottom";
   bottom.style.position = 'relative';
   bottom.style.top = '0px';
   bottom.style.margin = '0 auto';
   var sharp = document.createElement("img");
   sharp.src = "https://webapi.amap.com/images/sharp.png";
   bottom.appendChild(sharp);
   info.appendChild(bottom);
   return info;
}

//关闭信息窗体
function closeInfoWindow() {
   map.clearInfoWindow();
}

//标记定位结果
function markCurentPoi(){
    var marker = new AMap.Marker({
        icon: "image/location.png",
        position: KOViewModel.currentPoi(),
    });
    map.add(marker);
};
/**
 * 将在左侧结果列表中的选中项地点作为地图中心点
 * @param {*} position  传入位置
 */
function centerLocation(position,adcode){
    if(markers != null){
        map.clearMap();
    }
    KOViewModel.startPoi(position);//更新初始点位置
    console.log("centerLocation:"+ KOViewModel.startPoi());
    map.setCenter(position);
    getNearbyLocations(position,KOViewModel.selectedType(),adcode);
};

/**
 *  搜索 
 * @param {*} position  中心点
 * @param {*} adcode    兴趣点城市
 * @param {*} keyword   兴趣点类别
 * @param {*} size      单页显示结果条数
 * @param {*} radius    
 */
function getNearbyLocations(position,keyword='餐饮服务',radius=1000){
    placeSearch.searchNearBy(keyword, position, radius, function(status, result) {
         //清空原搜索结果集
         KOViewModel.searchPois([]);
         KOViewModel.error('');
         map.clearMap();
         markCurentPoi();
        if(status == "complete"){
            //刷新左侧列表数据
            result.poiList.pois.forEach(element => {
                KOViewModel.searchPois.push(new Poi(element));
                addMarker(element.location); 
            });
        }else if(status == "no_data"){
            
            KOViewModel.error('附近无'+keyword+',请更换关键词查询');
        }else{
            KOViewModel.error(keyword);
        }
    });
    markers = map.getAllOverlays('marker');

    //Todo:结合searchInBounds实现自选区域内搜索
};

function showInfoWindow(){
    console.log('showInfoWindow');
};

function getDetailInfo(){

};

function queryMoreInfo(){

};