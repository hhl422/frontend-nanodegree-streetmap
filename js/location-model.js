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
 * 高德地图Api返回、生成的结果集
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