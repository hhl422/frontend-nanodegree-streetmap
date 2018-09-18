var resulLists = [
    {
        name:'',
        lat:0,
        lng:0,
        info:''
    }
];

var Location = function(){

};

var MapViewModel = function(){
    var self = this;
    
    self.map = ko.observable(map);
    self.keyword = ko.observable("");
    self.result_list = ko.observableArray([]);

    // 请求地图api后返回的内容
    self.queryMapApiResponse = ko.observable(mapResponse);

    // self.mapContent = ko.computed(function(){
    //     // 根据queryMapApiResponse展示map
    // });



    // 在列表中选中一个地点
    self.updateResultList = function(result){
        self.result_list.clear();
        self.result_list.push(result);
    };

};

ko.applyBindings(new MapViewModel())


var map;
var markers = [];
var mapResponse;

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        // styles: styles,
        mapTypeControl: false
      });

}



