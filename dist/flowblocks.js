!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("joint")):"function"==typeof define&&define.amd?define(["joint"],e):"object"==typeof exports?exports.flowblocks=e(require("joint")):t.flowblocks=e(t.joint)}(this,(function(t){return function(t){var e={};function i(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,o){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(o,n,function(e){return t[e]}.bind(null,n));return o},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=1)}([function(e,i){e.exports=t},function(t,e,i){i(0);const o=i(2),n=i(3),s=i(4);t.exports=new class{constructor(t){this.options={},Object.assign(this.options,t),this._registeredTypes={},this._elements=[],this.flow={}}registerType(t,e,i){return this._registeredTypes[t]={name:t,statusDefinition:e,template:i},this._registeredTypes[t]}createFlow(t){var e=this;this.flow=s.create(t),this.flow.graph.on("change:source change:target",(function(t){if(t.get("source").id&&t.get("target").id){var i=t.get("source"),o=t.get("target"),n=e._elements.find(t=>t.id==i.id),s=e._elements.find(t=>t.id==o.id);n._handleConnectTo(s,i.port,o.port,t.id),s._handleConnectFrom(n,o.port,i.port,t.id)}})),this.flow.paper.on("link:disconnect",(function(t,i,n,s,r){var l=o.linkGetParticipants(t.model,e.flow),a=l.sourceElement,c=n.model,d=s.getAttribute("port"),h=l.sourcePort;a._handleDisconnect(c,h,t.model.id),c._handleDisconnect(a,d,t.model.id)})),this.flow.graph.on("remove",(function(t){var i=o.linkGetParticipants(t,e.flow);i&&console.log("Removed:",i.sourceElement,i.sourcePort,i.targetElement,i.targetPort)}))}createElement(t,e,i,o,s,r){var l=this._registeredTypes[t];if(l){var a=n.createBlankElement(l.template,l.statusDefinition);if(a.set("name",e),a.set("_type",l.name),i)a.set("blockId",i),this._elements.find(t=>t.get("blockId")==i)&&console.error("Duplicate flow Element for id: "+i);return o&&a.set("position",o),s&&a.set("size",s),r&&(-1==r.lastIndexOf("/")?a.set("icon","https://unpkg.com/flowblocks/dist/resources/img/svg/"+r+".svg"):a.set("icon",r)),this._elements.push(a),this.flow.graph.addCell(a),a}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}_dumpConnections(){this._elements.forEach(t=>{t._dumpConnections()})}}({})},function(t,e,i){i(0);t.exports=new class{linkGetParticipants(t,e){if(t.isLink())return{sourceElement:e.graph.getCell(t.get("source").id),sourcePort:t.get("source").port,targetElement:e.graph.getCell(t.get("target").id),targetPort:t.get("target").port}}}({})},function(t,e,i){const o=i(0);t.exports=new class{constructor(t){this.options={defaultSize:{width:70,height:70}},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){o.shapes.flowblocks={},this.Model=o.shapes.devs.Model.define("flowblocks.Block",{name:"",icon:"./resources/img/svg/agave.svg",status:"OK",statusMsg:"OK",blockId:void 0,debug:!0,_portsConnected:0,_type:void 0,_portConnections:[],attrs:{rect:{"ref-width":"100%",fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{fill:"rgb(219, 233, 251)"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{fill:"rgb(255, 230, 206)"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-status-text"></text>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:statusMsg change:size",(function(){this._updateMyModel(),this.trigger("flowblocks-block-update")}),this),this._updateMyModel(),o.shapes.devs.Model.prototype.initialize.apply(this,arguments)},api:function(){return["element.set('name','my label');","element.set('position', {x:30, y:10});","element.set('size', {width:50, height: 50});","element.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/vase.svg');"]},allPortsConnected(){return this.getPorts().lenght==this.get("_portsConnected")},_dumpConnections(){this.get("debug")&&console.log("Connections["+this.get("blockId")+"]: ",JSON.stringify(this.get("_portConnections")))},_recalculateStatus(){},_handleDisconnect(t,e,i){var o=this.get("_portConnections").find(o=>o.port==e&&o.id==t.id&&o.linkId==i),n=this.get("_portConnections").findIndex(o=>o.port==e&&o.id==t.id&&o.linkId==i);n>=0&&this.get("_portConnections").splice(n,1),console.log("Disconnected",this.get("blockId"),e,o?o.bId:void 0),this._recalculateStatus()},_handleConnectFrom(t,e,i,o){var n={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:i,linkId:o},s=(this.get("_portConnections").find(t=>t.linkId==o),this.get("_portConnections").findIndex(t=>t.linkId==o));s>=0&&this.get("_portConnections").splice(s,1),this.get("_portConnections").push(n),console.log("Connect",t.get("blockId"),this.get("blockId"),e),this._recalculateStatus()},_handleConnectTo(t,e,i,o){var n={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:i,linkId:o},s=(this.get("_portConnections").find(o=>o.id==t.get("id")&&o.port==e&&o.targetPort==i),this.get("_portConnections").findIndex(t=>t.linkId==o));s>=0&&this.get("_portConnections").splice(s,1),this.get("_portConnections").push(n),console.log("Connect",this.get("blockId"),t.get("blockId"),e),this._recalculateStatus()},_recalculateRectWithLabel:function(t,e,i,o,n,s){this.get("attrs");var r=i*n.height,l=o*r,a=s+r/2,c=.1*n.width;return this.attr(t+"-rect/height",r),this.attr(t+"-rect/transform","translate(0,"+s+")"),this.attr(t+"-text/font-size",l),this.attr(t+"-text/transform","translate("+c+","+a+")"),this.attr(t+"-text/text",e),r},_recalculateRectWithIcon:function(t,e,i,o,n,s){var r=i*n.height;this.attr(t+"-rect/height",r),this.attr(t+"-rect/transform","translate(0,"+s+")");var l=o*r,a=n.width/2-l/2,c=s+r/2-l/2;return this.attr(t+"-image/height",l),this.attr(t+"-image/transform","translate("+a+","+c+")"),this.attr(t+"-image/href",e),r},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("debug")?this.get("name")+"["+this.get("blockId")+"]":this.get("name"),statusMessage:this.get("statusMsg")};t+=this._recalculateRectWithLabel(".fb-label",e.name,.2,.6,e,t),t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t),t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t)}},{}),o.shapes.flowblocks.BlockView=o.dia.ElementView.extend({initialize:function(){o.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-update",(function(){this.update(),this.resize()}))}}),this.View=o.shapes.flowblocks.BlockView}createBlankElement(t,e){var i={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement};if(i[t])return i[t].call(this,"",e);throw new Error("Unsuported template: "+t)}createSplitElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in"],outPorts:["out1","out2"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createJoinElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in1","in2"],outPorts:["out"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createPassThroughElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in"],outPorts:["out"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createStartElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,outPorts:["out"],ports:{groups:{out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}createSinkElement(t,e){var i={position:{x:40,y:20},size:this.options.defaultSize,inPorts:["in"],ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}}}},rs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}};return new this.Model(i)}}({})},function(t,e,i){const o=i(0);t.exports=new class{constructor(t){this.options={},this.graph={},this.paper={},Object.assign(this.options,t),this._initialize()}_initialize(){}create(t){return this.graph=new o.dia.Graph,this.paper=new o.dia.Paper({el:document.getElementById(t),width:1200,height:800,gridSize:1,model:this.graph,snapLinks:!0,linkPinning:!1,embeddingMode:!0,clickThreshold:5,defaultLink:new o.dia.Link({attrs:{".marker-target":{d:"M 10 0 L 0 5 L 10 10 z"},".connection":{stroke:"blue"},".marker-source":{d:"M 15 0 L 0 5 L 15 15 z",opacity:"0",stroke:"orange"},'.marker-arrowhead[end="source"]':{fill:"red",d:"M 10 0 L 0 5 L 10 10 z",opacity:"0"}}}),defaultConnectionPoint:{name:"boundary"},highlighting:{default:{name:"stroke",options:{padding:6}},embedding:{name:"addClass",options:{className:"highlighted-parent"}}},validateEmbedding:function(t,e){return e.model instanceof o.shapes.devs.Coupled},validateConnection:function(t,e,i,o,n,s){t.model,i.model;return e!=o&&"in"==o.getAttribute("port-group")&&t!=i}}),joint.dia.Link.prototype.toolMarkup=['<g class="link-tool">','<g class="tool-remove" event="remove">','<circle r="11" />','<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',"<title>Remove link.</title>","</g>","</g>"].join(""),this}}({})}])}));