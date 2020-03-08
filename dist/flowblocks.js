!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("joint")):"function"==typeof define&&define.amd?define(["joint"],e):"object"==typeof exports?exports.flowblocks=e(require("joint")):t.flowblocks=e(t.joint)}(this,(function(t){return function(t){var e={};function i(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(s,r,function(e){return t[e]}.bind(null,r));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=1)}([function(e,i){e.exports=t},function(t,e,i){i(0);const s=i(2);t.exports=new class{constructor(t){this.options={},Object.assign(this.options,t),this._registeredTypes={},this._elements={}}registerType(t,e,i){return this._registeredTypes[t]={name:t,statusDefinition:e,template:i},this._registeredTypes[t]}createElement(t,e,i,r,o){var n=this._registeredTypes[t];if(n){var a=s.createBlankElement(n.template,n.statusDefinition);return a.set("name",e),i&&a.set("position",i),r&&a.set("size",r),o&&(-1==o.lastIndexOf("/")?(console.log("./resources/img/svg/"+o+".svg"),a.set("icon","./resources/img/svg/"+o+".svg")):a.set("icon",o)),this._elements[a.id]=a,a}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}}({})},function(t,e,i){const s=i(0);t.exports=new class{constructor(t){this.options={defaultSize:{width:70,height:70}},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){s.shapes.flowblocks={},this.Model=s.shapes.devs.Model.define("flowblocks.Block",{name:"",icon:"./resources/img/svg/agave.svg",status:"OK",statusMsg:"OK",attrs:{rect:{"ref-width":"100%",fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{fill:"rgb(219, 233, 251)"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{fill:"rgb(255, 230, 206)"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-status-text"></text>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:statusMsg change:size",(function(){this._updateMyModel(),this.trigger("flowblocks-block-update")}),this),this._updateMyModel(),s.shapes.devs.Model.prototype.initialize.apply(this,arguments)},api:function(){return["element.set('name','my label');","element.set('position', {x:30, y:10});","element.set('size', {width:50, height: 50});","element.set('icon', '//resources/img/svg/vase.svg');"]},_recalculateRectWithLabel:function(t,e,i,s,r,o){this.get("attrs");var n=i*r.height,a=s*n,l=o+n/2,c=.1*r.width;return this.attr(t+"-rect/height",n),this.attr(t+"-rect/transform","translate(0,"+o+")"),this.attr(t+"-text/font-size",a),this.attr(t+"-text/transform","translate("+c+","+l+")"),this.attr(t+"-text/text",e),n},_recalculateRectWithIcon:function(t,e,i,s,r,o){var n=i*r.height;this.attr(t+"-rect/height",n),this.attr(t+"-rect/transform","translate(0,"+o+")");var a=s*n,l=r.width/2-a/2,c=o+n/2-a/2;return this.attr(t+"-image/height",a),this.attr(t+"-image/transform","translate("+l+","+c+")"),this.attr(t+"-image/href",e),n},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("name"),statusMessage:this.get("statusMsg")};t+=this._recalculateRectWithLabel(".fb-label",e.name,.2,.6,e,t),t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t),t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t)}},{}),s.shapes.flowblocks.BlockView=s.dia.ElementView.extend({initialize:function(){s.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-update",(function(){this.update(),this.resize()}))}}),this.View=s.shapes.flowblocks.BlockView}createBlankElement(t,e){var i={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement};if(i[t])return i[t].call(this,"",e);throw new Error("Unsuported template: "+t)}createSplitElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in"],outPorts:["out1","out2"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createJoinElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in1","in2"],outPorts:["out"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createPassThroughElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in"],outPorts:["out"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createStartElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,outPorts:["out"],ports:{groups:{out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createSinkElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}}}},rs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}}({})}])}));