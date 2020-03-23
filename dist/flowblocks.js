!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("joint")):"function"==typeof define&&define.amd?define(["joint"],e):"object"==typeof exports?exports.flowblocks=e(require("joint")):t.flowblocks=e(t.joint)}(this,(function(t){return function(t){var e={};function o(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=t,o.c=e,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(i,r,function(e){return t[e]}.bind(null,r));return i},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=6)}([function(e,o){e.exports=t},function(t,e){t.exports=new class{constructor(t){this.SIZE={width:70,height:70},this.POSITION={x:40,y:20},this.POSITION_DELTA={dx:50,dy:50},this.STYLE="americana",this.STYLES={americana:{bodyColor:"#74b9ff",titleBarColor:"#ffeaa7",statusBarColor:"#fdcb6e",portInColor:"#00cec9",portOutColor:"#ff7675",validationERRORColor:"#d63031",validationOKColor:"#00b894"},original:{bodyColor:"#3DB5FF",titleBarColor:"rgb(255, 230, 206)",statusBarColor:"rgb(209, 226, 208)",portInColor:"#16A085",portOutColor:"#E74C3C",validationERRORColor:"#950952",validationOKColor:"#008D83"},cream:{bodyColor:"#FAE8FF",titleBarColor:"#E1C2ED",statusBarColor:"#E1C2ED",portInColor:"#936DED",portOutColor:"#F2EAD7",validationERRORColor:"#950952",validationOKColor:"#008D83"}},this.TOOLBAR={SIZE:{width:110,height:110},PADDING:{x:20,y:20},ROW_PADDING:30,FONT:{SIZE:.15,FAMILY:"Helvetica",WEIGHT:"bold"},DRAG:{SIZE:{width:150,height:150}}}}}({})},function(t,e){t.exports=new class{constructor(t){this.EVENTS={TOOLBAR_ITEM_DBLCLICK:"toolbar-item:dblclick",TOOLBAR_ITEM_DRAG:"toolbar-item:drag",BLOCK_ADDED:"block:added",BLOCK_CREATE:"block:create",BLOCK_DETAILS_SAVE:"block:save",BLOCK_REMOVED:"block:removed",BLOCK_DBLCLICK:"block:dblclick",BLOCK_DBLCLICK:"block:dblclick",CONNECTION_REMOVED:"connection:removed",CONNECTION_ADDED:"connection:added",FLOWBLOCKS_SAVE:"flowblocks:save",FLOWBLOCKS_DOWNLOAD:"flowblocks:download",FLOWBLOCKS_TYPE_CREATE:"type:create",FLOWBLOCKS_DONE_SUCCESS:"result:ok"}}allEvents(){var t=[];return Object.keys(this.EVENTS).forEach(e=>{t.push(this.EVENTS[e])}),t}}({})},function(t,e,o){o(0);t.exports=new class{linkGetParticipants(t,e){if(t.isLink())return{sourceElement:e.graph.getCell(t.get("source").id),sourcePort:t.get("source").port,targetElement:e.graph.getCell(t.get("target").id),targetPort:t.get("target").port}}getElementByClass(t){if(document){var e=document.getElementsByClassName(t);if(e.length>0)return e[0]}}downloadObjectAsJson(t,e){var o="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(t)),i=document.createElement("a");i.setAttribute("href",o),i.setAttribute("download",e+".json"),document.body.appendChild(i),i.click(),i.remove()}}({})},function(t,e,o){"use strict";var i,r,n,s=o(10),l="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";function a(){n=!1}function c(t){if(t){if(t!==i){if(t.length!==l.length)throw new Error("Custom alphabet for shortid must be "+l.length+" unique characters. You submitted "+t.length+" characters: "+t);var e=t.split("").filter((function(t,e,o){return e!==o.lastIndexOf(t)}));if(e.length)throw new Error("Custom alphabet for shortid must be "+l.length+" unique characters. These characters were not unique: "+e.join(", "));i=t,a()}}else i!==l&&(i=l,a())}function h(){return n||(n=function(){i||c(l);for(var t,e=i.split(""),o=[],r=s.nextValue();e.length>0;)r=s.nextValue(),t=Math.floor(r*e.length),o.push(e.splice(t,1)[0]);return o.join("")}())}t.exports={get:function(){return i||l},characters:function(t){return c(t),i},seed:function(t){s.seed(t),r!==t&&(a(),r=t)},lookup:function(t){return h()[t]},shuffled:h}},function(t,e,o){"use strict";t.exports=o(9)},function(t,e,o){o(0);const i=o(3),r=o(7),n=o(8),s=o(17),l=o(18),a=o(2),c=o(19),h=o(20),d=o(22);t.exports=new class{constructor(t){this.options={},Object.assign(this.options,t),this._registeredTypes={},this.flow=void 0,this.toolbar=void 0,this.emitter=new c,this.version=1,this._initialize()}_initialize(){var t=this;this.emitter.on(a.EVENTS.BLOCK_CREATE,(function(e,o,i,r,n){t.createBlock(o,i,e,r)})),this.emitter.on(a.EVENTS.BLOCK_DETAILS_SAVE,(function(e,o,i){t.getBlock(e).set("configurables",o)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_SAVE,(function(){var e=t.export();d.save("flowblock",e.id,e,e.version),t.emitter.emit(a.EVENTS.FLOWBLOCKS_DONE_SUCCESS)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_DOWNLOAD,(function(){t.download(),t.emitter.emit(a.EVENTS.FLOWBLOCKS_DONE_SUCCESS)}))}registerType(t,e,o,i,r,n){return this._registeredTypes[t]={name:t,template:e,style:i,icon:o,configurable:r,category:n},this.createToolbarItem(t,t),this._registeredTypes[t]}createFlow(t,e,o){return this.flow=n.create(t,this.emitter,e,o),console.log("Flowblocks flow up and running"),this.flow}createToolbar(t){return this.toolbar=s.create(t,this.emitter),console.log("Flowblocks toolbar up and running"),this.toolbar}createApp(t,e,o,i){h.create(this,this.emitter,t,e,o,i),console.log("Flowblocks app up and running")}getBlock(t){return this.flow._blocks.find(e=>e.get("blockId")==t)}export(){this.version++,this.flow.graph.set("exported",Date.now()),this.flow.graph.set("version",this.version);var t=this.flow.graph.toJSON();return t.types=this._registeredTypes,t}download(){var t=this.export();return i.downloadObjectAsJson(t,this.flow.graph.get("name")),t}on(t,e){"all"==t?a.allEvents().forEach(t=>{this.emitter.on(t,e)}):this.emitter.on(t,e)}getDefinition(t){return this._registeredTypes[t]}createToolbarItem(t,e,o){if(this.toolbar){var i=this._registeredTypes[t];if(i){var r=l.createBlank(i.template,i.statusDefinition,i.style);return r.set("name",e),r.set("_type",i.name),o&&r.set("size",o),i.icon&&(-1==i.icon.lastIndexOf("/")?r.set("icon","https://unpkg.com/flowblocks/dist/resources/img/svg/"+i.icon+".svg"):r.set("icon",i.icon)),this.toolbar.addItem(r,i.category),r}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}console.warn("Cant create toolbar item. Create toolbar first by calling createToolbar().")}createBlock(t,e,o,i,n){var s=this._registeredTypes[t];if(s){var l=r.createBlank(o,s.template,s.statusDefinition,s.style);if(l.set("name",e),l.set("_type",s.name),o)this.flow._blocks.find(t=>t.get("blockId")==o)&&console.error("Duplicate flow Block for id: "+o);return i&&l.set("position",i),n&&l.set("size",n),s.icon&&(-1==s.icon.lastIndexOf("/")?l.set("icon","https://unpkg.com/flowblocks/dist/resources/img/svg/"+s.icon+".svg"):l.set("icon",s.icon)),this.flow.addBlock(l),l}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}_dumpConnections(){this.flow._blocks.forEach(t=>{t._dumpConnections()})}enablePanAndZoom(t){if(t)try{this.flow.enablePanAndZoom(t)}catch(t){console.error(t)}}}({})},function(t,e,o){const i=o(0),r=o(1);t.exports=new class{constructor(t){this.options={defaultSize:r.SIZE,defaultPosition:r.POSITION,defaultPositionDelta:r.POSITION_DELTA},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){i.shapes.flowblocks={},this.Model=i.shapes.devs.Model.define("flowblocks.Block",{name:"",icon:"./resources/img/svg/agave.svg",status:"ERROR",statusMsg:"OK",blockId:void 0,debug:!1,errors:[],configurables:[],_style:void 0,_defaultStyle:r.STYLE,_styles:r.STYLES,_portsConnected:0,_type:void 0,_portConnections:[],attrs:{rect:{fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{"ref-width":"100%",fill:"#3DB5FF"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{"ref-width":"100%",fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{"ref-width":"100%",fill:"rgb(255, 230, 206)"},".fb-validation-rect":{fill:"#d63031"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-status-text"></text>','<rect class="fb-validation-rect"/>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:statusMsg change:size",(function(){this._updateMyModel(),this.trigger("flowblocks-block-update")}),this),this._updateMyModel(),i.shapes.devs.Model.prototype.initialize.apply(this,arguments)},api:function(){return["element.set('name','my label');","element.set('position', {x:30, y:10});","element.set('size', {width:50, height: 50});","element.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/vase.svg');","element.style({titleBarColor: '#FADB50'});","element.getStatus();","element.freePorts();"]},getStatus(){return{valid:"OK"==this.get("status"),errors:this.get("errors")}},style(t){if(t)if("string"==typeof t||t instanceof String){var e=this.get("_styles")[t.toLocaleLowerCase()];e&&this.style(e)}else this.set("_style",t),t.bodyColor&&this.attr(".fb-icon-rect/fill",t.bodyColor),t.titleBarColor&&this.attr(".fb-label-rect/fill",t.titleBarColor),t.statusBarColor&&this.attr(".fb-status-rect/fill",t.statusBarColor),t.portInColor&&this.getPorts().forEach(e=>{"in"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portInColor)}),t.portOutColor&&this.getPorts().forEach(e=>{"out"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portOutColor)});else this.style(this.get("_defaultStyle"))},freePorts(t){var e=this.getPorts().filter(e=>!t||e.group==t),o=this.get("_portConnections"),i=[];return e.forEach(t=>{o.find(e=>e.port==t.id)||i.push(t)}),i},_dumpConnections(){this.get("debug")&&console.log("Connections["+this.get("blockId")+"]: ",JSON.stringify(this.get("_portConnections")))},_recalculateStatus(){this.set("status","OK"),this.get("errors").length=0;var t=this.freePorts();t.length>0?(this.set("status","ERROR"),this.attr(".fb-validation-rect/fill",this.get("_style").validationERRORColor),t.forEach(t=>{this.get("errors").push({code:"PORT_NOT_CONNECTED",cId:t.id,msg:"Port ["+t.id+"] is not connected"})})):(this.set("status","OK"),this.get("errors").length=0,this.attr(".fb-validation-rect/fill",this.get("_style").validationOKColor))},_handleDelete(t){var e=this.get("_portConnections").filter(e=>e.id!=t);this.set("_portConnections",e),this._recalculateStatus()},_handleDisconnect(t,e,o){if(null!=t){this.get("_portConnections").find(i=>i.port==e&&i.id==t.id&&i.linkId==o);var i=this.get("_portConnections").findIndex(i=>i.port==e&&i.id==t.id&&i.linkId==o);i>=0&&this.get("_portConnections").splice(i,1),this._recalculateStatus()}},_handleConnectFrom(t,e,o,i){var r={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:o,linkId:i};this.get("_portConnections").push(r),this._recalculateStatus()},_handleConnectTo(t,e,o,i){var r={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:o,linkId:i};this.get("_portConnections").push(r),this._recalculateStatus()},_recalculateRectWithLabel:function(t,e,o,i,r,n){this.get("attrs");var s=o*r.height,l=i*s,a=n+s/2,c=.1*r.width;return this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")"),this.attr(t+"-text/font-size",l),this.attr(t+"-text/transform","translate("+c+","+a+")"),this.attr(t+"-text/text",e),s},_recalculateValidationRect:function(t,e,o,i,r){this.get("attrs");var n=e*i.height,s=(1-o)*i.width,l=o*i.width;return this.attr(t+"-rect/height",n),this.attr(t+"-rect/width",l),this.attr(t+"-rect/transform","translate("+s+","+r+")"),this.attr(t+"-rect/title","Block validation state: "+this.get("status")),n},_recalculateRectWithIcon:function(t,e,o,i,r,n){var s=o*r.height;this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")");var l=i*s,a=r.width/2-l/2,c=n+s/2-l/2;return this.attr(t+"-image/height",l),this.attr(t+"-image/transform","translate("+a+","+c+")"),this.attr(t+"-image/href",e),s},_enableRemoval(t){var e=this.findView(t),o=e.getBBox().width-this.getBBox().width,i=this.getPorts(),r=!1,n=!1;i.forEach(t=>{"out"==t.group&&(n=!0),"in"==t.group&&(r=!0)}),o=r&&n?-o/2:n?-o:0;var s=new joint.elementTools.Remove({focusOpacity:.5,rotate:!0,x:"100%",offset:{x:o,y:0}}),l=new joint.dia.ToolsView({name:"basic-tools",tools:[s]});e.addTools(l),e.hideTools()},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("debug")?this.get("name")+"["+this.get("blockId")+"]":this.get("name"),statusMessage:this.get("statusMsg"),status:this.get("status")};t+=this._recalculateRectWithLabel(".fb-label",e.name,.2,.6,e,t);var o=t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t);t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t),this._recalculateValidationRect(".fb-validation",.2,.15,e,o)}},{}),i.shapes.flowblocks.BlockView=i.dia.ElementView.extend({initialize:function(){i.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-update",(function(){this.update(),this.resize()}))}}),this.View=i.shapes.flowblocks.BlockView}createBlank(t,e,o,i){var r={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement,Mixer:this.createMixerElement};if(r[e]){var n=r[e].call(this,"",o);return n.set("blockId",t),n.style(i),n._recalculateStatus(),n}throw new Error("Unsuported template: "+e)}_createBaseOptions(){return{position:this.options.defaultPosition,size:this.options.defaultSize,ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}}}createSplitElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["in1"],i.outPorts=["out1","out2"],new this.Model(i)}createJoinElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["in1","in2"],i.outPorts=["out1"],new this.Model(i)}createMixerElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["in1","in2"],i.outPorts=["out1","out2"],new this.Model(i)}createPassThroughElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["in1"],i.outPorts=["out1"],new this.Model(i)}createStartElement(t,e,o){var i=this._createBaseOptions();return i.outPorts=["out1"],new this.Model(i)}createSinkElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["in1"],new this.Model(i)}}({})},function(t,e,o){const i=o(0),r=o(3),n=o(2),s=o(5);t.exports=new class{constructor(t){this.options={},this.graph={},this.paper={},this._blocks=[],Object.assign(this.options,t),this._initialize(),this.emitter=void 0}_initialize(){}create(t,e,o,r){this.emitter=e,this.graph=new i.dia.Graph,this.paper=new i.dia.Paper({el:document.getElementById(t),width:1400,height:960,gridSize:1,model:this.graph,snapLinks:!0,linkPinning:!1,embeddingMode:!0,clickThreshold:5,defaultLink:new i.dia.Link({attrs:{".marker-target":{d:"M 10 0 L 0 5 L 10 10 z"},".connection":{stroke:"blue"},".marker-source":{d:"M 15 0 L 0 5 L 15 15 z",opacity:"0",stroke:"orange"},'.marker-arrowhead[end="source"]':{fill:"red",d:"M 10 0 L 0 5 L 10 10 z",opacity:"0"}}}),defaultConnectionPoint:{name:"boundary"},highlighting:{default:{name:"stroke",options:{padding:6}},embedding:{name:"addClass",options:{className:"highlighted-parent"}}},validateEmbedding:function(t,e){return e.model instanceof i.shapes.devs.Coupled},validateConnection:function(t,e,o,i,r,n){t.model;var s=!!o.model.freePorts("in").find(t=>t.id==i.getAttribute("port"));return e!=i&&"in"==i.getAttribute("port-group")&&t!=o&&s},validateMagnet:function(t,e,o){return"passive"!=e.getAttribute("magnet")&&t.model.freePorts("out").length>0}}),joint.dia.Link.prototype.toolMarkup=['<g class="link-tool">','<g class="tool-remove" event="remove">','<circle r="11" />','<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',"<title>Remove link.</title>","</g>","</g>"].join("");var n=r||s.generate(),l=o||"Flowblocks #"+n;return this.graph.set("name",l),this.graph.set("id",n),this.graph.set("created",Date.now()),this._bindConnectionEvents(),this._bindToolsEvents(),this._bindInteractionEvents(),this}_bindInteractionEvents(){var t=this;this.paper.on("element:pointerdblclick",(function(e,o){t.emitter.emit(n.EVENTS.BLOCK_DBLCLICK,e.model,o)}))}_bindToolsEvents(){this.paper.on("element:mouseenter",(function(t){t.showTools()})),this.paper.on("element:mouseleave",(function(t){t.hideTools()}))}_bindConnectionEvents(){var t=this;this.paper.on("link:connect",(function(e,o,i,s,l){var a=r.linkGetParticipants(e.model,t),c=a.sourceElement,h=a.targetElement,d=a.sourcePort,u=a.targetPort;i.model,s.getAttribute("port");c._handleConnectTo(h,d,u,e.model.id),h._handleConnectFrom(c,u,d,e.model.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,c,d,h,u)})),this.paper.on("link:disconnect",(function(e,o,i,s,l){var a=r.linkGetParticipants(e.model,t),c=a.sourceElement,h=i.model,d=(a.targetPort,a.sourcePort);a.targetElement;null!=h&&null!=c&&(c._handleDisconnect(h,d,e.model.id),h._handleDisconnect(c,s.getAttribute("port"),e.model.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,c,d,h,s.getAttribute("port")))})),this.graph.on("remove",(function(e){if(e.isLink()){var o=r.linkGetParticipants(e,t),i=o.sourceElement,s=o.targetElement,l=o.sourcePort,a=o.targetPort;null!=s&&null!=i&&(i._handleDisconnect(s,l,e.id),s._handleDisconnect(i,a,e.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,i,l,s,a))}else{var c=e;t._blocks=t._blocks.filter(t=>t.id!=c.id),t._blocks.forEach(t=>{t._handleDelete(c)}),t.emitter.emit(n.EVENTS.BLOCK_REMOVED,c)}}))}addBlock(t){this._blocks.push(t),this.graph.addCell(t),t._enableRemoval(this.paper),this.emitter.emit(n.EVENTS.BLOCK_ADDED,t)}enablePanAndZoom(t){var e=t(document.querySelector("[joint-selector=svg]"),{fit:!1,panEnabled:!1,controlIconsEnabled:!0,center:!1,dblClickZoomEnabled:!1,minZoom:.3});this.paper.on("blank:pointerdown",(function(t,o,i){e.enablePan()})),this.paper.on("cell:pointerup blank:pointerup",(function(t,o){e.disablePan()}))}validate(){var t=!0,e=[];return this._blocks.forEach(o=>{var i=o.getStatus();i.valid||e.push({blockId:o.get("blockId"),errors:i.errors}),t=t&&i.valid}),{valid:t,errorBlocks:e}}}({})},function(t,e,o){"use strict";var i=o(4),r=o(11),n=o(15),s=o(16)||0;function l(){return r(s)}t.exports=l,t.exports.generate=l,t.exports.seed=function(e){return i.seed(e),t.exports},t.exports.worker=function(e){return s=e,t.exports},t.exports.characters=function(t){return void 0!==t&&i.characters(t),i.shuffled()},t.exports.isValid=n},function(t,e,o){"use strict";var i=1;t.exports={nextValue:function(){return(i=(9301*i+49297)%233280)/233280},seed:function(t){i=t}}},function(t,e,o){"use strict";var i,r,n=o(12);o(4);t.exports=function(t){var e="",o=Math.floor(.001*(Date.now()-1567752802062));return o===r?i++:(i=0,r=o),e+=n(7),e+=n(t),i>0&&(e+=n(i)),e+=n(o)}},function(t,e,o){"use strict";var i=o(4),r=o(13),n=o(14);t.exports=function(t){for(var e,o=0,s="";!e;)s+=n(r,i.get(),1),e=t<Math.pow(16,o+1),o++;return s}},function(t,e,o){"use strict";var i,r="object"==typeof window&&(window.crypto||window.msCrypto);i=r&&r.getRandomValues?function(t){return r.getRandomValues(new Uint8Array(t))}:function(t){for(var e=[],o=0;o<t;o++)e.push(Math.floor(256*Math.random()));return e},t.exports=i},function(t,e){t.exports=function(t,e,o){for(var i=(2<<Math.log(e.length-1)/Math.LN2)-1,r=-~(1.6*i*o/e.length),n="";;)for(var s=t(r),l=r;l--;)if((n+=e[s[l]&i]||"").length===+o)return n}},function(t,e,o){"use strict";var i=o(4);t.exports=function(t){return!(!t||"string"!=typeof t||t.length<6)&&!new RegExp("[^"+i.get().replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&")+"]").test(t)}},function(t,e,o){"use strict";t.exports=0},function(t,e,o){const i=o(0),r=o(1),n=o(2);t.exports=new class{constructor(t){this.options={size:r.TOOLBAR.SIZE,padding:r.TOOLBAR.PADDING,rowPadding:r.TOOLBAR.ROW_PADDING},this.graph={},this.paper={},this._items=[],this.emitter=void 0,Object.assign(this.options,t),this._initialize()}_initialize(){}create(t,e){return this.emitter=e,this.graph=new i.dia.Graph,this.paper=new i.dia.Paper({el:document.getElementById(t),width:this.options.size.width,height:this.options.size.height,gridSize:1,model:this.graph,background:{color:"transparent"},interactive:!1,snapLinks:!1,linkPinning:!1,embeddingMode:!1,clickThreshold:5,defaultConnectionPoint:{name:"boundary"},validateConnection:function(t,e,o,i,r,n){return!1}}),this._bindEvents(),this}addItem(t,e){this._resizeItem(t),this._items.push(t),this.graph.addCell(t),this._repositionItems()}_resizeItem(t){var e=this.options.size.width,o=2*this.options.padding.x,i=e-(o*=1.2);t.set("size",{width:i,height:i})}_bindEvents(){var t=this;this.paper.on("cell:pointerdown",(function(e,o,i,r){var s=e.model,l=s.get("_type");t.emitter.emit(n.EVENTS.TOOLBAR_ITEM_DRAG,l,s,i,r,o)}))}_repositionItems(){var t=this,e={x:15,y:5},o=0;this._items.forEach(i=>{var r=i.findView(this.paper),n={x:e.x,y:e.y+r.getBBox().height/6};o=n.y+r.getBBox().height,t.paper.setDimensions(t.paper.width,o),i.set("position",n),e={x:n.x,y:n.y+r.getBBox().height}})}}({})},function(t,e,o){const i=o(0),r=o(1);t.exports=new class{constructor(t){this.options={defaultSize:r.SIZE,defaultPosition:r.POSITION,defaultPositionDelta:r.POSITION_DELTA},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){i.shapes.flowblocks.toolbar={},this.Model=i.shapes.devs.Model.define("flowblocks.toolbar.BlockToolbarItem",{name:"",icon:"./resources/img/svg/agave.svg",debug:!0,_style:void 0,_defaultStyle:r.STYLE,_styles:r.STYLES,_type:void 0,attrs:{rect:{fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{"ref-width":"100%",fill:"#3DB5FF"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{"ref-width":"100%",fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{"ref-width":"100%",fill:"rgb(255, 230, 206)"},".fb-validation-rect":{fill:"#d63031"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-tool-label-text":{"text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-tool-label-text"></text>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:statusMsg change:size",(function(){this._updateMyModel(),this.trigger("flowblocks-block-toolbar-item-update")}),this),this._updateMyModel(),i.shapes.devs.Model.prototype.initialize.apply(this,arguments)},style(t){if(t)if("string"==typeof t||t instanceof String){var e=this.get("_styles")[t.toLocaleLowerCase()];e&&this.style(e)}else this.set("_style",t),t.icon&&this.set("icon",t.icon),t.bodyColor&&this.attr(".fb-icon-rect/fill",t.bodyColor),t.titleBarColor&&this.attr(".fb-label-rect/fill",t.titleBarColor),t.statusBarColor&&this.attr(".fb-status-rect/fill",t.statusBarColor),t.portInColor&&this.getPorts().forEach(e=>{"in"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portInColor)}),t.portOutColor&&this.getPorts().forEach(e=>{"out"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portOutColor)});else this.style(this.get("_defaultStyle"))},_recalculateRectWithLabel:function(t,e,o,i,r,n){this.get("attrs");var s=o*r.height,l=i*s,a=n+s/2,c=.1*r.width;return this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")"),this.attr(t+"-text/font-size",l),this.attr(t+"-text/transform","translate("+c+","+a+")"),this.attr(t+"-text/text",e),s},_recalculateToolLabel:function(t,e,o,i){var n=o.height*r.TOOLBAR.FONT.SIZE,s=i+n;this.attr(t+"-text/font-size",n),this.attr(t+"-text/transform","translate(0,"+s+")"),this.attr(t+"-text/text",e),this.attr(t+"-text/font-family",r.TOOLBAR.FONT.FAMILY),this.attr(t+"-text/font-weight",r.TOOLBAR.FONT.WEIGHT)},_recalculateValidationRect:function(t,e,o,i,r){this.get("attrs");var n=e*i.height,s=(1-o)*i.width,l=o*i.width;return this.attr(t+"-rect/height",n),this.attr(t+"-rect/width",l),this.attr(t+"-rect/transform","translate("+s+","+r+")"),this.attr(t+"-rect/title","Block validation state: "+this.get("status")),n},_recalculateRectWithIcon:function(t,e,o,i,r,n){var s=o*r.height;this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")");var l=i*s,a=r.width/2-l/2,c=n+s/2-l/2;return this.attr(t+"-image/height",l),this.attr(t+"-image/transform","translate("+a+","+c+")"),this.attr(t+"-image/href",e),s},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("name"),statusMessage:this.get("statusMsg"),status:this.get("status")};t+=this._recalculateRectWithLabel(".fb-label","Block",.2,.6,e,t),t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t),t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t),this._recalculateToolLabel(".fb-tool-label",e.name,e,t)}},{}),i.shapes.flowblocks.toolbar.BlockToolbarItemView=i.dia.ElementView.extend({initialize:function(){i.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-toolbar-item-update",(function(){this.update(),this.resize()}))}}),this.View=i.shapes.flowblocks.toolbar.BlockToolbarItemView}createBlank(t,e,o){var i={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement,Mixer:this.createMixerElement};if(i[t]){var r=i[t].call(this,"",e);return r.style(o),r}throw new Error("Unsuported template: "+t)}_createBaseOptions(){return{position:this.options.defaultPosition,size:this.options.defaultSize,ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"},".port-label":{display:"none"}}},out:{attrs:{".port-body":{fill:"#E74C3C",magnet:"passive"},".port-label":{display:"none"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}}}createSplitElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["i1"],i.outPorts=["o1","o2"],new this.Model(i)}createJoinElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["i1","i2"],i.outPorts=["o1"],new this.Model(i)}createMixerElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["in1","in2"],i.outPorts=["out1","out2"],new this.Model(i)}createPassThroughElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["i1"],i.outPorts=["o1"],new this.Model(i)}createStartElement(t,e,o){var i=this._createBaseOptions();return i.outPorts=["o1"],new this.Model(i)}createSinkElement(t,e,o){var i=this._createBaseOptions();return i.inPorts=["i1"],new this.Model(i)}}({})},function(t,e,o){"use strict";var i,r="object"==typeof Reflect?Reflect:null,n=r&&"function"==typeof r.apply?r.apply:function(t,e,o){return Function.prototype.apply.call(t,e,o)};i=r&&"function"==typeof r.ownKeys?r.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var s=Number.isNaN||function(t){return t!=t};function l(){l.init.call(this)}t.exports=l,l.EventEmitter=l,l.prototype._events=void 0,l.prototype._eventsCount=0,l.prototype._maxListeners=void 0;var a=10;function c(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function h(t){return void 0===t._maxListeners?l.defaultMaxListeners:t._maxListeners}function d(t,e,o,i){var r,n,s,l;if(c(o),void 0===(n=t._events)?(n=t._events=Object.create(null),t._eventsCount=0):(void 0!==n.newListener&&(t.emit("newListener",e,o.listener?o.listener:o),n=t._events),s=n[e]),void 0===s)s=n[e]=o,++t._eventsCount;else if("function"==typeof s?s=n[e]=i?[o,s]:[s,o]:i?s.unshift(o):s.push(o),(r=h(t))>0&&s.length>r&&!s.warned){s.warned=!0;var a=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");a.name="MaxListenersExceededWarning",a.emitter=t,a.type=e,a.count=s.length,l=a,console&&console.warn&&console.warn(l)}return t}function u(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function f(t,e,o){var i={fired:!1,wrapFn:void 0,target:t,type:e,listener:o},r=u.bind(i);return r.listener=o,i.wrapFn=r,r}function p(t,e,o){var i=t._events;if(void 0===i)return[];var r=i[e];return void 0===r?[]:"function"==typeof r?o?[r.listener||r]:[r]:o?function(t){for(var e=new Array(t.length),o=0;o<e.length;++o)e[o]=t[o].listener||t[o];return e}(r):m(r,r.length)}function g(t){var e=this._events;if(void 0!==e){var o=e[t];if("function"==typeof o)return 1;if(void 0!==o)return o.length}return 0}function m(t,e){for(var o=new Array(e),i=0;i<e;++i)o[i]=t[i];return o}Object.defineProperty(l,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");a=t}}),l.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},l.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},l.prototype.getMaxListeners=function(){return h(this)},l.prototype.emit=function(t){for(var e=[],o=1;o<arguments.length;o++)e.push(arguments[o]);var i="error"===t,r=this._events;if(void 0!==r)i=i&&void 0===r.error;else if(!i)return!1;if(i){var s;if(e.length>0&&(s=e[0]),s instanceof Error)throw s;var l=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw l.context=s,l}var a=r[t];if(void 0===a)return!1;if("function"==typeof a)n(a,this,e);else{var c=a.length,h=m(a,c);for(o=0;o<c;++o)n(h[o],this,e)}return!0},l.prototype.addListener=function(t,e){return d(this,t,e,!1)},l.prototype.on=l.prototype.addListener,l.prototype.prependListener=function(t,e){return d(this,t,e,!0)},l.prototype.once=function(t,e){return c(e),this.on(t,f(this,t,e)),this},l.prototype.prependOnceListener=function(t,e){return c(e),this.prependListener(t,f(this,t,e)),this},l.prototype.removeListener=function(t,e){var o,i,r,n,s;if(c(e),void 0===(i=this._events))return this;if(void 0===(o=i[t]))return this;if(o===e||o.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete i[t],i.removeListener&&this.emit("removeListener",t,o.listener||e));else if("function"!=typeof o){for(r=-1,n=o.length-1;n>=0;n--)if(o[n]===e||o[n].listener===e){s=o[n].listener,r=n;break}if(r<0)return this;0===r?o.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(o,r),1===o.length&&(i[t]=o[0]),void 0!==i.removeListener&&this.emit("removeListener",t,s||e)}return this},l.prototype.off=l.prototype.removeListener,l.prototype.removeAllListeners=function(t){var e,o,i;if(void 0===(o=this._events))return this;if(void 0===o.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==o[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete o[t]),this;if(0===arguments.length){var r,n=Object.keys(o);for(i=0;i<n.length;++i)"removeListener"!==(r=n[i])&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=o[t]))this.removeListener(t,e);else if(void 0!==e)for(i=e.length-1;i>=0;i--)this.removeListener(t,e[i]);return this},l.prototype.listeners=function(t){return p(this,t,!0)},l.prototype.rawListeners=function(t){return p(this,t,!1)},l.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):g.call(t,e)},l.prototype.listenerCount=g,l.prototype.eventNames=function(){return this._eventsCount>0?i(this._events):[]}},function(t,e,o){const i=o(3),r=o(2),n=o(5),s=o(1),l=o(21);t.exports=new class{constructor(t){this.emmiter=void 0,this.flowClass=void 0,this.menuClass=void 0,this.toolbarClass=void 0,this.flowblocks=void 0,this.flowController={},this.toolbarController=void 0,this.menuController=l}create(t,e,o,i,r,n){this.emmiter=e,this.flowClass=o,this.toolbarClass=i,this.menuClass=r,this.flowblocks=t,this.menuController.create(e,n),this._flowController(),this._toolbarController(),this._rivetize(),this._bindMenuEvents(t),this._bindFlowEvents(t),this._bindToolbarEvents(t)}_flowController(){var t=this;this.flowController={parent:t,model:{details:{show:!1,type:void 0,label:void 0,blockId:void 0,configurables:[]},types:{create:{show:!1}},general:{busy:!1,doneOk:!1}},isBusy(){return this.model.general.busy},busy(){this.model.general.busy=!0,this.model.general.doneOk=!1},done(t){var e=this;this.model.general.busy=!1,this.model.general.doneOk=!0,setTimeout((function(){e.model.general.doneOk=!1}),4e3)},dismiss:function(t,e){e.model.details.show=!1,e.resetDetails()},detailsSave:function(e,o){var i=t.flowController.model.details.block,n=[];o.model.details.configurables.forEach(t=>{n.push({i:t.id,v:t.value})}),o.parent.emmiter.emit(r.EVENTS.BLOCK_DETAILS_SAVE,i.get("blockId"),n,e),o.resetDetails()},resetDetails(){this.model.details.show=!1,this.model.details.type=void 0,this.model.details.label=void 0,this.model.details.blockId=void 0,this.model.details.block=void 0,this.model.details.configurables=[]}}}_toolbarController(){this.toolbarController={parent:this,model:{create:{show:!1,title:"",type:void 0,label:void 0,blockId:void 0}},dismiss:function(t,e){e.model.create.show=!1},addBlock:function(t,e){e.parent.emmiter.emit(r.EVENTS.BLOCK_CREATE,e.model.create.blockId,e.model.create.type,e.model.create.label,e.model.create.position,t),e.resetCreate()},resetCreate(){this.model.create.type=void 0,this.model.create.show=!1,this.model.create.title="",this.model.create.label=void 0,this.model.create.blockId=void 0}}}_rivetize(){if(window&&window.rivets){var t=i.getElementByClass(this.flowClass),e=i.getElementByClass(this.toolbarClass),o=i.getElementByClass(this.menuClass);window.rivets.bind(o,this.menuController),window.rivets.bind(t,this.flowController),window.rivets.bind(e,this.toolbarController)}else console.warn("For full interactivity rivets is required.")}_bindFlowEvents(t){var e=this;t.on(r.EVENTS.BLOCK_DBLCLICK,(function(o,i){e.flowController.model.details.show=!0,e.flowController.model.details.type=o.get("_type"),e.flowController.model.details.blockId=o.get("blockId"),e.flowController.model.details.label=o.get("name"),e.flowController.model.details.block=o;var r=t.getDefinition(e.flowController.model.details.type),n=r.configurable?r.configurable.configurables:[];e.flowController.model.details.configurables.length=0,n.forEach(t=>{var i=o.get("configurables").find(e=>e.i==t.id)?o.get("configurables").find(e=>e.i==t.id).v:void 0;!i&&t.default&&(i=t.default);var r=[];t.options&&t.options.forEach(t=>{r.push({v:t.v,l:t.l})}),e.flowController.model.details.configurables.push({id:t.id,label:t.label,placeholder:t.placeholder,type:t.type,required:t.required,value:i,options:r})})})),t.on(r.EVENTS.FLOWBLOCKS_DONE_SUCCESS,(function(){e.flowController.isBusy()?e.flowController.done(!0):setTimeout((function(){e.flowController.done(!0)}),1e3)}))}_bindMenuEvents(t){var e=this;t.on(r.EVENTS.FLOWBLOCKS_TYPE_CREATE,(function(){e.flowController.busy()})),t.on(r.EVENTS.FLOWBLOCKS_SAVE,(function(){e.flowController.busy()})),t.on(r.EVENTS.FLOWBLOCKS_DOWNLOAD,(function(){e.flowController.busy()}))}_bindToolbarEvents(t){var e=this;t.on("all",(function(t){})),t.on(r.EVENTS.TOOLBAR_ITEM_DBLCLICK,(function(t){e.toolbarController.model.create.title=t,e.toolbarController.model.create.show=!0,e.toolbarController.model.create.type=t,e.toolbarController.model.create.blockId=n.generate()})),t.on(r.EVENTS.TOOLBAR_ITEM_DRAG,(function(o,i,r,l,a){$("body").append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.8;pointer-event:none;"></div>');var c=new joint.dia.Graph,h=(new joint.dia.Paper({el:$("#flyPaper"),model:c,interactive:!1,width:s.TOOLBAR.DRAG.SIZE.width,height:s.TOOLBAR.DRAG.SIZE.height,background:{color:"transparent"}}),i.clone()),d=i.position(),u=r-d.x,f=l-d.y;h.position(s.POSITION.x,s.POSITION.y),c.addCell(h),$("#flyPaper").offset({left:a.pageX-u-s.POSITION.x,top:a.pageY-f-s.POSITION.y}),$("body").on("mousemove.fly",(function(t){$("#flyPaper").offset({left:t.pageX-u-s.POSITION.x,top:t.pageY-f-s.POSITION.y})})),$("body").on("mouseup.fly",(function(i){var r=i.pageX,s=i.pageY,l=t.flow.paper.$el.offset();r>l.left&&r<l.left+t.flow.paper.$el.width()&&s>l.top&&s<l.top+t.flow.paper.$el.height()&&(e.toolbarController.model.create.title=o,e.toolbarController.model.create.show=!0,e.toolbarController.model.create.type=o,e.toolbarController.model.create.position={x:r-l.left-u,y:s-l.top-f},e.toolbarController.model.create.blockId=n.generate()),$("body").off("mousemove.fly").off("mouseup.fly"),h.remove(),$("#flyPaper").remove()}))}))}}({})},function(t,e,o){o(3),o(2),o(5),o(1);t.exports=new class{constructor(){this.emmiter=void 0,this.model={}}create(t,e){var o=this;this.emmiter=t,e&&(this.model=e,this.model.m&&this.model.m.forEach(t=>{t.menuClick=o.menuClick,t.m&&t.m.forEach(t=>{t.menuClick=o.menuClick})}))}menuClick(t,e){var o=void 0;t.srcElement&&t.srcElement.dataset?o=t.srcElement.dataset.event:t.target&&t.target.dataset&&(o=t.target.dataset.event),o&&e.emmiter.emit(o)}}({})},function(t,e,o){const i=o(23);t.exports=new class{constructor(){this.storageContext="/a/"}save(t,e,o,r){if(window&&window.localStorage){var n=Object.assign({},o),s={k:e,t:t,d:n},l=i(n);s.s=l;var a=this.storageContext+t+"/"+e+"/"+r;window.localStorage.setItem(a,JSON.stringify(s)),console.log("Saved",a,s)}else console.warn("Cant save data as local storage is not accessible")}load(t,e,o){if(window&&window.localStorage)window.localStorage.getItem(this.storageContext+t+"/"+e+"/"+o);else console.warn("Cant load data as local storage is not accessible")}}({})},function(t,e,o){"use strict";var i=o(24);t.exports=function(t){return i(JSON.stringify(t))}},function(t,e){t.exports=function(t){return~-encodeURI(t).split(/%..|./).length}}])}));