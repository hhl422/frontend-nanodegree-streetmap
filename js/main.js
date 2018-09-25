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
 */
var Locations = [
    { title: 'Park Ave Penthouse', position: { lat: 40.7713024, lng: -73.9632393 },id = 0,icon = defaultIcon},
    { title: 'Chelsea Loft', position: { lat: 40.7444883, lng: -73.9949465 },id =1,icon = defaultIcon },
    { title: 'Union Square Open Floor Plan', position: { lat: 40.7347062, lng: -73.9895759 } ,id = 2,icon = defaultIcon},
    { title: 'East Village Hip Studio', position: { lat: 40.7281777, lng: -73.984377 } ,id = 3,icon = defaultIcon},
    { title: 'TriBeCa Artsy Bachelor Pad', position: { lat: 40.7195264, lng: -74.0089934 } ,id = 4,icon = defaultIcon},
    { title: 'Chinatown Homey Space', position: { lat: 40.7180628, lng: -73.9961237 } ,id = 5,icon = defaultIcon}
];

/**
 * Location对象
 * 根据搜索，展示在列表条目中
 * 选中之后展示在地图中心
 */
var Location = function(data){
    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
    this.id = ko.observable(data.id);
    this.icon = ko.observable(data.icon);

}

// 展示中心位置地图、地址列表位置的标记
// 选择标记后，清除其他标记，并显示该标记的详细信息
// 入口函数
function initMap() {

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
        }
    };

    ko.applyBindings(new ViewModel());

    /**
     * 调用api展示地图
     */
    var infoWindow = new google.maps.InfoWindow();

    defaultIcon = makeMarkerIcon('0091ff');
    highlightedIcon = makeMarkerIcon('FFFF24');

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7413549, lng: -73.9980244 },
        zoom: 16 //0 is the lowest zoom, and displays the entire earth
    });

    //get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //标记当前位置
            var marker = initMarker(pos,"You are here!",-1,infoWindow); 

            infoWindow.setPosition(pos);
            infoWindow.setContent(marker.title);
            infoWindow.open(map);
            map.setCenter(pos);

            //根据关键词搜索附近的场所，并在地图上标记出来
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
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());//不支持
    };

    updateMarkers(locations, markers,infoWindow);
};

//根据an array of PlaceResult objects展示地点标记
function createNearbyMarkers(places,infowindow) {
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      initMarker(place.geometry.location,place.name,place.place_id,infowindow,image);

    //   var li = document.createElement('li');
    //   li.textContent = place.name;formatted_address
    //   placesList.appendChild(li);
  }
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function initMarker(_position,_title,_id,infowindow,_icon=defaultIcon){
    var marker = new google.maps.Marker({
        position: _position,
        map: map,
        title: _title,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: _icon,
        id: _id
    });
    marker.addListener('click', function () {
        populateInfoWindow(this, infowindow);
    });

    // 鼠标悬停时在标记上时，标记跳动
    marker.addListener('mouseover', function () {
        this.setIcon(highlightedIcon);
        this.setAnimation(google.maps.Animation.BOUNCE);
    }); 
    marker.addListener('mouseout', function () {
        this.setIcon(_icon);
        this.setAnimation(null);
    });
    return marker;
}

//根据locations展示地点标记
function updateMarkers(locations, markers,infowindow) {
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        markers.push(initMarker(position,title,i,infowindow));
    }
};

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
};

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
};

//地点详情：位置信息+全景图+第三方网站信息
function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        // 准备详情页DOM #pano #placeDetail #more
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div id="placeDetail"></div><div id="more"></div>');

        var streetViewService = new google.maps.StreetViewService();
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                // 街景视图参数
                var heading = google.maps.geometry.spherical.computeHeading(
                    data.location.latLng, marker.position);
                var panoramaOptions = {
                    position: data.location.latLng,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            } else {
                document.getElementById('pano').innerHTML = "No Street View Found";
            }
        };
        streetViewService.getPanorama({ location: marker.position, radius: 200 }, getStreetView);

        //添加地点详情信息
        var request = {
            placeId: marker.id,
            fields: ['name', 'rating','opening_hours','photos', 'formatted_phone_number', 'geometry']
        };
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var photos = place.photos;
                if (!photos) {
                    return;
                }
                document.getElementById('placeDetail').innerHTML = `<div id="detail"><div>${place.name}&nbsp;&nbsp;&nbsp;${place.rating}</div><div>${place.opening_hours.open_now}</div><div>${place.formatted_phone_number}</div><img src = "${photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})}"/></div>`;
            }
        });

        //追加其他网站的评论、信息
        document.getElementById('more').innerHTML = getComments(marker);

        infowindow.open(map, marker);
    }
};

//使用第三方 API 添加功能，以在单击地图标记或列表视图条目时 **提供信息**（例如，Yelp 评论、Wikipedia、Flickr 图片等）
function getComments(marker) {
    // 根据marker获取地点名称
    // 根据名称获取评论
    var commentHtml = '<div id="comment"></div>';

    return commentHtml;
};