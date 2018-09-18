var map;
var markers = [];
var defaultIcon;
var highlightedIcon;
var infoWindow;

//写死几个地址供测试功能 
var locations = [
    { title: 'Park Ave Penthouse', location: { lat: 40.7713024, lng: -73.9632393 } },
    { title: 'Chelsea Loft', location: { lat: 40.7444883, lng: -73.9949465 } },
    { title: 'Union Square Open Floor Plan', location: { lat: 40.7347062, lng: -73.9895759 } },
    { title: 'East Village Hip Studio', location: { lat: 40.7281777, lng: -73.984377 } },
    { title: 'TriBeCa Artsy Bachelor Pad', location: { lat: 40.7195264, lng: -74.0089934 } },
    { title: 'Chinatown Homey Space', location: { lat: 40.7180628, lng: -73.9961237 } }
];

// 展示中心位置地图、地址列表位置的标记
// 选择标记后，清除其他标记，并显示该标记的详细信息
function initMap() {
    var infoWindow = new google.maps.InfoWindow();

    defaultIcon = makeMarkerIcon('0091ff');
    highlightedIcon = makeMarkerIcon('FFFF24');

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7413549, lng: -73.9980244 },
        zoom: 13
    });

    //get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var marker = initMarker(pos,"You are here!",-1,infoWindow); 

            infoWindow.setPosition(pos);
            infoWindow.setContent(marker.title);
            infoWindow.open(map);
            map.setCenter(pos);

            
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    };

    updateMarkers(locations, markers,infoWindow);
};


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function initMarker(_position,_title,_id,infowindow){
    var marker = new google.maps.Marker({
        position: _position,
        map: map,
        title: _title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: _id
    });
    marker.addListener('click', function () {
        populateInfoWindow(this, infowindow);
    });
    marker.addListener('mouseover', function () {
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function () {
        this.setIcon(defaultIcon);
    });
    return marker;
}

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
        var streetViewService = new google.maps.StreetViewService();
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                // 准备详情页DOM
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
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
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }

        streetViewService.getPanorama({ location: marker.position, radius: 200 }, getStreetView);

        //追加其他网站的评论、信息
        infowindow.setContent(infowindow.content + getComments(marker));

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