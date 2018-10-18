var PoiTypes = '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施';

/**
 * Model
 * 当前位置
 * 起始位置
 * 搜索结果集
 * 地点详情
 */
var KOViewModel = {
    currentPoi: ko.observable(),
    currentAddr: ko.observable('定位中……'),
    startPoi : ko.observable(),
    searchPois : ko.observableArray([]),
    positionDetail : ko.observableArray([]),
    type: ko.observable('餐饮服务'),

    showInfo : function(poi){
        showInfoWindow(poi);
    },

    availableTypes : ko.observableArray(PoiTypes.split("|")),
    error : ko.observable()
};
ko.applyBindings(KOViewModel);

var Poi = function(data){
    //Poi 基本信息
    this.id = data.id;//全局唯一ID
    this.name = data.name;//名称
    this.type = data.type;//兴趣点类型
    this.location = data.location;//兴趣点经纬度LngLat
    this.address = data.address;//地址
    this.distance = data.distance;//离中心点距离，仅周边查询返回
    this.tel = data.tel;//电话

    this.detail = new Detail(data);
};

var Detail = function(data){
    //Poi 详细信息
    this.website = data.website;
    this.pcode = data.pcode;
    this.citycode = data.citycode;
    this.adcode = data.adcode;
    this.postcode = data.postcode;
    this.pname = data.pname;
    this.cityname = data.cityname;
    this.adname = data.adname;
    this.groupbuy = data.groupbuy;
    this.discount = data.discount;  
};