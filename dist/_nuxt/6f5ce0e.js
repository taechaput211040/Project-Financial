(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{705:function(e,t,n){"use strict";n.r(t);n(10),n(11),n(9),n(14),n(12),n(15);var r=n(3),o=n(5),l=(n(81),n(160)),c=n.n(l),f=n(58);function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function v(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var m={props:{dbresult:Array},data:function(){return{optionsRender:{},sortBy:"start_time",sortDesc:!0,result:[],header:[{text:"ประเภทเกมส์",value:"type",align:"center",sortable:!1,cellClass:"font-weight-bold"},{text:"username",value:"username",align:"center",sortable:!1,cellClass:"font-weight-bold"},{text:"เวลา",value:"start_time",align:"center",sortable:!0,cellClass:"font-weight-bold"},{text:"รายละเอียด",value:"detail_links",align:"center",sortable:!1,cellClass:"font-weight-bold"},{text:"เดิมพัน",value:"bet",align:"center",sortable:!0,cellClass:"font-weight-bold"},{text:"จ่าย",value:"payout",align:"center",sortable:!0,cellClass:"font-weight-bold"},{text:"แพ้ชนะ",value:"winlose",align:"center",sortable:!0,cellClass:"font-weight-bold"},{text:"สถานะการคิดผล",value:"status",align:"center",sortable:!1,cellClass:"font-weight-bold"},{text:"ก่อนเดิมพัน",value:"bf_balance",align:"center",sortable:!1,cellClass:"font-weight-bold"},{text:"หลังเดิมพัน",value:"after_balance",align:"center",sortable:!1,cellClass:"font-weight-bold"}]}},watch:{optionsRender:{handler:function(){this.$emit("options",this.optionsRender)}}},fetch:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.result;case 1:case"end":return t.stop()}}),t)})))()},computed:v({},Object(f.d)("auth",["provider","gameType"])),methods:v(v({},Object(f.b)("member",["getDetailLink"])),{},{detail:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function n(){var link;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t.getDetailLink(e.detail_links);case 2:link=n.sent,window.open(link.data,"NewWin","toolbar=no,status=no");case 4:case"end":return n.stop()}}),n)})))()},getDate:function(e){return c()(e).format("YYYY-MM-DD เวลา HH:mm:ss")}})},_=n(72),y=n(88),w=n.n(y),h=n(206),O=n(561),k=n(699),component=Object(_.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("v-card",{staticClass:"elevation-3"},[n("v-data-table",{attrs:{"sort-by":e.sortBy,"sort-desc":e.sortDesc,headers:e.header,items:e.dbresult.data,"server-items-length":e.dbresult.total,options:e.optionsRender,"footer-props":{showFirstLastPage:!0,"items-per-page-text":"","items-per-page-options":[20,50,100]}},on:{"update:sortBy":function(t){e.sortBy=t},"update:sort-by":function(t){e.sortBy=t},"update:sortDesc":function(t){e.sortDesc=t},"update:sort-desc":function(t){e.sortDesc=t},"update:options":function(t){e.optionsRender=t}},scopedSlots:e._u([{key:"item.type",fn:function(t){var r=t.item;return[n("div",[e._v("\n          ค่าย\n          "+e._s(e.provider[r.provider]?e.provider[r.provider]:r.provider)+"\n        ")]),e._v(" "),n("div",[e._v("\n          ประเภท "+e._s(e.gameType[r.type]?e.gameType[r.type]:r.type)+"\n        ")]),e._v(" "),n("div",[e._v(e._s(r.game_name))])]}},{key:"item.detail_links",fn:function(t){var r=t.item;return[n("v-btn",{attrs:{small:"",rounded:"",color:"primary"},on:{click:function(t){return e.detail(r)}}},[e._v("ดูรายละเอียด")])]}},{key:"item.payout",fn:function(t){var r=t.item;return[n("span",[e._v(e._s(r.payout))])]}},{key:"item.turnover",fn:function(t){var r=t.item;return[n("span",[e._v(e._s(r.turnover))])]}},{key:"item.bet",fn:function(t){var r=t.item;return[n("span",[e._v(e._s(r.bet))])]}},{key:"item.winlose",fn:function(t){var r=t.item;return[n("span",{class:[{"error--text":r.winlose<0},{"success--text":r.winlose>0}]},[e._v(e._s(r.winlose))])]}},{key:"item.status",fn:function(t){return[t.item.status?n("div",{staticClass:"success--text font-weight-bold"},[e._v("\n          สำเร็จ\n        ")]):n("div",{staticClass:"warning--text font-weight-bold"},[e._v("\n          ผลยังไม่จบ\n        ")])]}},{key:"item.start_time",fn:function(t){var r=t.item;return[n("div",[e._v(e._s(e.getDate(r.start_time).slice(0,10)))]),e._v(" "),n("div",[e._v(e._s(e.getDate(r.start_time).slice(16)))])]}},{key:"item.bf_balance",fn:function(t){var n=t.item;return[e._v("\n        "+e._s(n.bf_balance)+"\n      ")]}},{key:"item.after_balance",fn:function(t){var n=t.item;return[e._v("\n        "+e._s(n.after_balance)+"\n        ")]}}],null,!0)})],1)],1)}),[],!1,null,null,null);t.default=component.exports;w()(component,{VBtn:h.a,VCard:O.a,VDataTable:k.a})}}]);