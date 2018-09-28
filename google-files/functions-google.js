
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);

    // 定位失败后标记默认地点
    updateMarkers(Locations, markers,infoWindow);
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

    //展示标记，并将改地点添加到地点集中，以刷新列表内容
      Locations.push(new Location(initMarker(place.geometry.location,place.name,place.place_id,infowindow,image)));
  }
};

    //   var li = document.createElement('li');
    //   li.textContent = place.name;formatted_address
    //   placesList.appendChild(li);

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
};

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