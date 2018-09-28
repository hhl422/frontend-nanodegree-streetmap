/**
 * 全局变量
 */
var map;
var service;
var markers = [];
var defaultIcon;
var highlightedIcon;
var infoWindow;

/**
 * Location对象列表/列表视图资源
 * 
 * knockout根据列表内容渲染内容、调用地图方法（展示标记、获取详情、查询第三方网站等）
 */
var Locations = [
    { title: 'Park Ave Penthouse', position: { lat: 40.7713024, lng: -73.9632393 },id:  0,icon: defaultIcon},
    { title: 'Chelsea Loft', position: { lat: 40.7444883, lng: -73.9949465 },id: 1,icon: defaultIcon },
    { title: 'Union Square Open Floor Plan', position: { lat: 40.7347062, lng: -73.9895759 } ,id: 2,icon: defaultIcon},
    { title: 'East Village Hip Studio', position: { lat: 40.7281777, lng: -73.984377 } ,id: 3,icon: defaultIcon},
    { title: 'TriBeCa Artsy Bachelor Pad', position: { lat: 40.7195264, lng: -74.0089934 } ,id: 4,icon: defaultIcon},
    { title: 'Chinatown Homey Space', position: { lat: 40.7180628, lng: -73.9961237 } ,id: 5,icon: defaultIcon}
];

/**
 * Location对象
 * 
 * 地图方法返回、生成的结果集
 */
var Location = function(data){
    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
    this.icon = ko.observable(data.icon);
    this.id = ko.observable(data.id);
    
}

/**
 * knockout绑定数据
 */
var ViewModel = function(){
    var self = this;
    this.locationList = ko.observableArray([]);

    Locations.forEach(element => {
        self.locationList.push(new Location(element));
    });

    this.currentLocation = ko.observable(this.locationList()[0]);

    this.zoomAndShow = function(){
        // 作为中心点放大，并展示详情
    };

    this.setCurrentLocation = function(locationItem){
        self.currentLocation(locationItem);
    };
};

ko.applyBindings(new ViewModel());


/**
 * 刷新地点结果集内容
 */
function initMap() {
    
    infoWindow = new google.maps.InfoWindow();

    defaultIcon = makeMarkerIcon('0091ff');
    highlightedIcon = makeMarkerIcon('FFFF24');

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7413549, lng: -73.9980244 },
        zoom: 16 //0 is the lowest zoom, and displays the entire earth
    });

    //获取当前位置
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //标记当前位置
            var marker = initMarker(currentPos,"You are here!",-1,infoWindow); 
            // 清空默认地点集
            Locations.splice(0,Locations.length);
            Locations.push(new Location(marker));
            // 以当前位置为中心定位地图
            infoWindow.setPosition(currentPos);
            infoWindow.setContent(marker.title);
            infoWindow.open(map);
            map.setCenter(currentPos);
            map.setZoom(20);

            //根据关键词搜索附近的场所
            var request = {
                location: pos,
                radius: '500',
                type: ['restaurant']
              };
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status){
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    createNearbyMarkers(results,infoWindow);
                  }
            });
        }, function () {
            // 获取位置失败，提示错误信息
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // 不支持获取位置，提示错误信息
        handleLocationError(false, infoWindow, map.getCenter());
    };
};
