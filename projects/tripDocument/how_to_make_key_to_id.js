var o = {
  "part_0_id": "ID",
  "part_1_type": "类型",
  "part_2_country": "国家",
  "part_2_area": "地区",
  "part_2_city": "城市",
  "part_2_local": "二级地域",
  "part_3_url_TITLE_CN": "标题:官网/网址",
  "part_3_cn_url_TITLE_CN": "标题:中文官网/中文网址",
  "part_3_other_url_TITLE_CN": "标题:其他官网/其他网址",
  "part_3_remarks": "备注",
  "part_3_url": "官网/网址",
  "part_3_cn_url": "中文官网/中文网址",
  "part_3_other_url": "其他官网/其他网址",
  "part_3_2_name": "名字",
  "part_3_url": "官网",
  "part_3_cn_url": "中文官网",
  "part_3_other_url": "其他网址",
  "part_3_2_time_TITLE_CN": "标题:营业时间/开放时间",
  "part_3_2_time": "营业时间/开放时间",
  "part_3_2_floor_url": "楼层指南",
  "part_3_2_shop_url": "店铺指南",
  "part_3_remarks": "备注",
  "part_3_2_gps": "经纬度",
  "part_3_2_address_en": "英文地址",
  "part_3_2_address_cn": "中文地址",
  "part_3_2_local": "地理位置和交通",
  "part_3_2_google_url": "谷歌分享地址",
  "part_3_2_google_html": "谷歌分享页面",
  "part_4_last_save_time": "最后更新时间"
}
var a = 'A B C D E F G H I J K L M N O P Q R S T U V W Y Z'.split(" ")
var oo = {};var i = 0;
var ooo = {};
for(var key in o){
  var v = '';
  if(i>a.length-1){
    
    v = "_"+a[parseInt(a.length/i-1)] + a[i-a.length];
  }else{
    v = "_"+a[i]
  }
  oo[key] = v;
  ooo[v] = key;
  i++;
}
