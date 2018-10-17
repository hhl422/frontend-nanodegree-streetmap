# frontend-nanodegree-streetmap

###项目详情

1. **下载 Knockout 框架**。必须使用 Knockout 来处理列表、筛选器和状态会不断更改的页面的任何其他相关信息。不应通过 knockout 处理的工作：地图 api 适用的任何工作、 创建标记、跟踪其点击事件、创建地图、刷新地图。
2. **错误处理**：如果出错（例如，在第三方 api 未返回预期结果时），我们预计你的网页会执行以下操作之一：显示一则消息，通知用户数据无法加载，或者不会对 UI 产生负面影响。
3. **编写显示地图标记**（标识你感兴趣的至少 5 个周边地点）所需的代码。加载页面时，你的应用应该会默认显示这些地点。
4. 出于效率原因，地图 API 仅应调用一次。
5. 实现在步骤 3 中定义的 **地点集的列表视图**
6. 提供一个 **筛选器选项**，使用输入字段来筛选加载时默认显示的列表视图和地图标记。**列表视图和标记应该实时更新**。通过第三方 API 提供搜索函数不足以符合规格要求。
7. 使用第三方 API 添加功能，以在单击地图标记或列表视图条目时 **提供信息**（例如，Yelp 评论、Wikipedia、Flickr 图片等）。
8. 添加功能，以在选定与地图标记关联的列表项目或地图标记本身时将其 **动画化**。
9. 添加功能，以在选定列表视图中的地点或直接选定其地图标记时打开包含步骤 7 中介绍的信息的信息窗口。
10. 应用的界面应该直观易用。例如，筛选地点的输入文本区域应该易于定位。应该能够轻松了解要筛选的地点集。通过列表项目或地图标记选择地点应该会导致地图标记退回或以某种其他方式显示动画，以指明该地点已选定，并且应该在地图标记上方打开包含其他信息的关联信息窗口。
11. 这个应用在移动端上应该是响应式的

Reference
[Knockout : Introduction](https://knockoutjs.com/documentation/introduction.html)
[Backbone.js](backbonejs.org/#View)
[Underscore.js](https://underscorejs.org)
[JavaScript Promise：简介](https://developers.google.cn/web/fundamentals/primers/promises)
[fetch API](https://davidwalsh.name/fetch)
[地图-参考手册-地图 JS API | 高德地图API](https://lbs.amap.com/api/javascript-api/reference/map#MapOption)


#####概要设计