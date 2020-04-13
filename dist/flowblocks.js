!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("joint")):"function"==typeof define&&define.amd?define(["joint"],e):"object"==typeof exports?exports.flowblocks=e(require("joint")):t.flowblocks=e(t.joint)}(this,(function(t){return function(t){var e={};function r(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,o){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(o,i,function(e){return t[e]}.bind(null,i));return o},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=4)}([function(e,r){e.exports=t},function(t,e,r){"use strict";var o,i,n,s=r(11),a="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";function l(){n=!1}function c(t){if(t){if(t!==o){if(t.length!==a.length)throw new Error("Custom alphabet for shortid must be "+a.length+" unique characters. You submitted "+t.length+" characters: "+t);var e=t.split("").filter((function(t,e,r){return e!==r.lastIndexOf(t)}));if(e.length)throw new Error("Custom alphabet for shortid must be "+a.length+" unique characters. These characters were not unique: "+e.join(", "));o=t,l()}}else o!==a&&(o=a,l())}function u(){return n||(n=function(){o||c(a);for(var t,e=o.split(""),r=[],i=s.nextValue();e.length>0;)i=s.nextValue(),t=Math.floor(i*e.length),r.push(e.splice(t,1)[0]);return r.join("")}())}t.exports={get:function(){return o||a},characters:function(t){return c(t),o},seed:function(t){s.seed(t),i!==t&&(l(),i=t)},lookup:function(t){return u()[t]},shuffled:u}},function(t,e,r){r(0);t.exports=new class{linkGetParticipants(t,e){if(t.isLink())return{sourceElement:e.graph.getCell(t.get("source").id),sourcePort:t.get("source").port,targetElement:e.graph.getCell(t.get("target").id),targetPort:t.get("target").port}}getElementByClass(t){if(document){var e=document.getElementsByClassName(t);if(e.length>0)return e[0]}}downloadObjectAsJson(t,e){var r="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(t));if(document&&document.body){var o=document.createElement("a");o.setAttribute("href",r),o.setAttribute("download",e+".json"),document.body.appendChild(o),o.click(),o.remove()}}}({})},function(t,e){t.exports=new class{constructor(t){this.EVENTS={TOOLBAR_RESET:"toolbar:reset",TOOLBAR_ITEM_CREATE:"toolbar-item:create",TOOLBAR_ITEM_DBLCLICK:"toolbar-item:dblclick",TOOLBAR_ITEM_DRAG:"toolbar-item:drag",TOOLBAR_DRAWER_REQUEST:"toolbar-drawer:requested",TOOLBAR_DRAWER_READY:"toolbar-drawer:ready",TOOLBAR_DRAWER_ATTACHED:"toolbar-drawer:attached",TOOLBAR_DRAWER_REMOVED_ALL:"toolbar-drawer:removedall",MENU_IMPORTJSON_REQUESTED:"menu:import-json",BLOCK_ADDED:"flowblocks:block-added",BLOCK_CREATE:"flowblocks:block-create",BLOCK_DETAILS_SAVE:"flowblocks:block-save",BLOCK_REMOVED:"flowblocks:block-removed",BLOCK_DBLCLICK:"flowblocks:block-dblclick",CONNECTION_REMOVED:"flowblocks:connection-removed",CONNECTION_ADDED:"flowblocks:connection-added",FLOWBLOCKS_SAVE:"flowblocks:save",FLOWBLOCKS_DOWNLOAD:"flowblocks:download",FLOWBLOCKS_TYPE_CREATE:"flowblocks:type-create",FLOWBLOCKS_BUSY:"flowblocks:busy",FLOWBLOCKS_DONE_SUCCESS:"flowblocks:result-ok",FLOWBLOCKS_DONE_ERROR:"flowblocks:result-error",FLOWBLOCKS_IMPORT_JSON:"flowblocks:import-json"}}allEvents(){var t=[];return Object.keys(this.EVENTS).forEach(e=>{t.push(this.EVENTS[e])}),t}}({})},function(t,e,r){const o=r(0),i=r(2),n=r(5),s=r(8),a=r(3),l=r(18),c=r(19);class u{constructor(t){this.options={},Object.assign(this.options,t),this._registeredTypes={},this.flow=void 0,this.emitter=new l,this.version=1,this._initialize()}create(){return new u({})}_initialize(){var t=this;this.emitter.on(a.EVENTS.FLOWBLOCKS_IMPORT_JSON,(function(e){t.import(e)})),this.emitter.on(a.EVENTS.BLOCK_CREATE,(function(e,r,o,i,n){t.createBlock(r,o,e,i)})),this.emitter.on(a.EVENTS.BLOCK_DETAILS_SAVE,(function(e,r,o){t.getBlock(e).setConfigurables(r)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_SAVE,(function(e){t.raise();var r=t.export();t.save(r,e)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_DOWNLOAD,(function(){t.download(),t.emitter.emit(a.EVENTS.FLOWBLOCKS_DONE_SUCCESS)}))}raise(){this.flow.graph.set("version",this.version++)}save(t,e){c.save(e||"flowblock",t.id,t,t.version),this.emitter.emit(a.EVENTS.FLOWBLOCKS_DONE_SUCCESS)}registerTypes(t){t.forEach(t=>{this.registerType(t.name,t.template,t.icon,t.style,t.configurables,t.category,t.validationFunction,t.validationSrc)})}_prepareTypeValidation(t,e){return t||e?(t&&(i=t.toString(),n=t),e&&(r=e,o=new Function("return "+e)()),{f:n||o,s:r||i}):{f:void 0,s:void 0};var r,o,i,n}registerType(t,e,r,o,i,n,s,a){var l=this._prepareTypeValidation(s,a);return this._registeredTypes[t]={name:t,template:e,style:o,icon:r,configurables:i,category:n,validation:l.f,validationSrc:l.s},this._registeredTypes[t]}createFlow(t,e,r){return this.flow=s.create(t,this.emitter,e,r),console.log("Flowblocks up and running"),this.flow}traverseModelSpecificationSequential(t){var e=new o.dia.Graph;e.fromJSON(t);var r,i=[];if(r=e.getCells().find(t=>"Start"==t.get("_template"))){var n=[];e.bfs(r,(function(t){n.push(t)}));for(var s=0;s<n.length;s++){var a=s-1>=0?s-1:s,l=s+1<n.length?s+1:s,c=n[a],u=n[s],h=n[l];i.push({p:c.get("blockId")!=u.get("blockId")?c:void 0,c:u,n:h.get("blockId")!=u.get("blockId")?h:void 0})}return i}console.warn("No input block found.")}getBlock(t){return this.flow._blocks.find(e=>e.get("blockId")==t)}import(t){var e=JSON.parse(t);this.flow.import(e);var r=[];Object.entries(e.types).forEach(t=>{t[0];let e=t[1];r.push(e)}),this.registerTypes(r),this.rebuildToolbar(r)}rebuildToolbar(t){this.emitter.emit(a.EVENTS.TOOLBAR_RESET,t)}export(){this.flow.graph.set("exported",Date.now()),this.flow.graph.set("version",this.version);var t=this.flow.graph.toJSON();return t.types=this._registeredTypes,t}download(){var t=this.export();return i.downloadObjectAsJson(t,this.flow.graph.get("name")),t}notify(t,...e){this.emitter.emit(t,...e)}on(t,e){"all"==t?a.allEvents().forEach(t=>{this.emitter.on(t,e)}):this.emitter.on(t,e)}getDefinition(t){return this._registeredTypes[t]}createBlock(t,e,r,o,i){var s=this._registeredTypes[t];if(s){var a=n.createBlank(r,s.name,s.template,s.statusDefinition,s.style,s.validation);if(a.set("name",e),r)this.flow._blocks.find(t=>t.get("blockId")==r)&&console.error("Duplicate flow Block for id: "+r);return o&&a.set("position",o),i&&a.set("size",i),s.icon&&(-1==s.icon.lastIndexOf("/")?a.set("icon","https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/"+s.icon+".svg"):a.set("icon",s.icon)),this.flow.addBlock(a),a}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}_dumpConnections(){this.flow._blocks.forEach(t=>{t._dumpConnections()})}enablePanAndZoom(t){if(t)try{this.flow.enablePanAndZoom(t)}catch(t){console.error(t)}}validate(){return this.flow?this.flow.validate():{valid:!1,errorBlocks:[{blockId:void 0,errors:[{code:"GENERAL",cId:"flowblocks",msg:"No flow configured"}]}]}}}t.exports=new u({})},function(t,e,r){const o=r(0),i=r(6),n=r(7);t.exports=new class{constructor(t){this.options={defaultSize:i.SIZE,defaultPosition:i.POSITION,defaultPositionDelta:i.POSITION_DELTA},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){o.shapes.flowblocks={},this.Model=o.shapes.devs.Model.define("flowblocks.Block",{name:"",icon:"./resources/img/svg/agave.svg",status:"ERROR",statusMsg:"OK",blockId:void 0,debug:!1,errors:[],configurables:[],_validationFunction:void 0,_style:void 0,_defaultStyle:i.STYLE,_styles:i.STYLES,_portsConnected:0,_type:void 0,_template:void 0,_portConnections:[],attrs:{rect:{fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{"ref-width":"100%",fill:"#3DB5FF"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{"ref-width":"100%",fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{"ref-width":"100%",fill:"rgb(255, 230, 206)"},".fb-validation-rect":{fill:"#d63031"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-type-label-text":{"text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-status-text"></text>','<rect class="fb-validation-rect"/>','<text class="fb-type-label-text"></text>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:errors change:statusMsg change:size change:_type",(function(){this._updateMyModel(),this.trigger("flowblocks-block-update")}),this),this._updateMyModel(),o.shapes.devs.Model.prototype.initialize.apply(this,arguments)},api:function(){return["element.set('name','my label');","element.set('position', {x:30, y:10});","element.set('size', {width:50, height: 50});","element.set('icon', 'https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/vase.svg');","element.style({titleBarColor: '#FADB50'});","element.getStatus();","element.freePorts();"]},getStatus(){return{valid:"OK"==this.get("status"),errors:this.get("errors")}},applyValidation(t){t&&(this.set("_validationFunction",t),this.set("_validationSource",t.toString()))},_reApplyValidation(){this.get("_validationSource")&&this.set("_validationFunction",new Function("return "+this.get("_validationSource"))())},_getStyle(t){return t?"string"==typeof t||t instanceof String?this.get("_styles")[t.toLocaleLowerCase()]:t:this.get("_defaultStyle")},_getPortGroup(t){return((this.attributes.ports||{}).groups||{})[t]},style(t){var e=this._getStyle(t);e&&(this.set("_style",e),e.bodyColor&&this.attr(".fb-icon-rect/fill",e.bodyColor),e.titleBarColor&&this.attr(".fb-label-rect/fill",e.titleBarColor),e.statusBarColor&&this.attr(".fb-status-rect/fill",e.statusBarColor),e.portInColor&&this.getPorts().forEach(t=>{if("in"==t.group){this.portProp(t.id,"attrs/.port-body/fill",e.portInColor);var r=this._getPortGroup("in");if(r&&r.attrs)(r.attrs[".port-body"]||{}).fill=e.portInColor}}),e.portOutColor&&this.getPorts().forEach(t=>{if("out"==t.group){this.portProp(t.id,"attrs/.port-body/fill",e.portOutColor);var r=this._getPortGroup("out");if(r&&r.attrs)(r.attrs[".port-body"]||{}).fill=e.portOutColor}}))},setConfigurables(t){this.set("configurables",t),this._recalculateStatus()},freePorts(t){var e=this.getPorts().filter(e=>!t||e.group==t),r=this.get("_portConnections"),o=[];return e.forEach(t=>{r.find(e=>e.port==t.id)||o.push(t)}),o},_dumpConnections(){this.get("debug")&&console.log("Connections["+this.get("blockId")+"]: ",JSON.stringify(this.get("_portConnections")))},_statusToString(){var t="Block validation state: "+this.get("status");return this.get("errors").forEach(e=>{t+=" | "+e.msg}),t},_baseStatusValidation(){var t=this.freePorts();t.length>0&&t.forEach(t=>{this.get("errors").push({code:"PORT_NOT_CONNECTED",cId:t.id,msg:"Port ["+t.id+"] is not connected"})})},_customValidation(){var t=Object.assign({},this.get("_portConnections")),e={id:this.id,blockId:this.get("blockId"),type:this.get("_type"),configurables:Object.assign({},this.get("configurables")),connections:t,configurable:function(t){var e=void 0;return Object.entries(this.configurables).forEach(r=>{r[1].i==t&&(e=r[1].v)}),n.parse(e)},connection:function(t){var e=void 0;return Object.entries(this.connections).forEach(r=>{r[1].port==t&&(e=r[1])}),e},toArray:function(t){var e=t||"[]",r=void 0;try{r=n.parse(e)}catch(t){}return Array.isArray(r)?r:[]}};this.get("_validationFunction")&&this.get("_validationFunction").call(this,e).forEach(t=>{this.get("errors").push({code:t.code,cId:t.cId,msg:t.msg})})},_recalculateStatus(){this.set("errors",[]),this.set("status","OK"),this.set("statusMsg","OK"),this._baseStatusValidation(),this._customValidation(),this.get("errors").length>0?(this.set("status","ERROR"),this.attr(".fb-validation-rect/fill",this.get("_style").validationERRORColor),this.set("statusMsg","INVALID")):(this.set("errors",[]),this.set("status","OK"),this.attr(".fb-validation-rect/fill",this.get("_style").validationOKColor),this.set("statusMsg","OK"))},_handleDelete(t){var e=this.get("_portConnections").filter(e=>e.id!=t);this.set("_portConnections",e),this._recalculateStatus()},_handleDisconnect(t,e,r){if(null!=t){this.get("_portConnections").find(o=>o.port==e&&o.id==t.id&&o.linkId==r);var o=this.get("_portConnections").findIndex(o=>o.port==e&&o.id==t.id&&o.linkId==r);o>=0&&this.get("_portConnections").splice(o,1),this._recalculateStatus()}},_handleConnectFrom(t,e,r,o){var i={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:r,linkId:o};this.get("_portConnections").push(i),this._recalculateStatus()},_handleConnectTo(t,e,r,o){var i={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:r,linkId:o};this.get("_portConnections").push(i),this._recalculateStatus()},_recalculateRectWithLabel:function(t,e,r,o,i,n){this.get("attrs");var s=r*i.height,a=o*s,l=n+s/2,c=.1*i.width;return this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")"),this.attr(t+"-text/font-size",a),this.attr(t+"-text/transform","translate("+c+","+l+")"),this.attr(t+"-text/text",e),s},_recalculateValidationRect:function(t,e,r,o,i){this.get("attrs");var n=e*o.height,s=(1-r)*o.width,a=r*o.width;return this.attr(t+"-rect/height",n),this.attr(t+"-rect/width",a),this.attr(t+"-rect/transform","translate("+s+","+i+")"),this.attr(t+"-rect/title",this._statusToString()),n},_recalculateRectWithIcon:function(t,e,r,o,i,n){var s=r*i.height;this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")");var a=o*s,l=i.width/2-a/2,c=n+s/2-a/2;return this.attr(t+"-image/height",a),this.attr(t+"-image/transform","translate("+l+","+c+")"),this.attr(t+"-image/href",e),s},_enableRemoval(t){var e=this.findView(t),r=this.getPorts(),o=!1,i=!1;r.forEach(t=>{"out"==t.group&&(i=!0),"in"==t.group&&(o=!0)});var n="0%";n=o&&i?"70%":i?"62%":"100%";var s=new joint.elementTools.Remove({focusOpacity:.5,rotate:!0,x:n}),a=new joint.dia.ToolsView({name:"basic-tools",tools:[s]});e.addTools(a),e.hideTools()},_recalculateTypeLabel:function(t,e,r,o){var n=r.height*i.LABEL.FONT.SIZE,s=o+n;this.attr(t+"-text/font-size",n),this.attr(t+"-text/transform","translate(0,"+s+")"),this.attr(t+"-text/text",e),this.attr(t+"-text/font-family",i.LABEL.FONT.FAMILY),this.attr(t+"-text/font-weight",i.LABEL.FONT.WEIGHT)},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("debug")?this.get("name")+"["+this.get("blockId")+"]":this.get("name"),statusMessage:this.get("statusMsg"),status:this.get("status"),type:this.get("_type")};t+=this._recalculateRectWithLabel(".fb-label",e.name,.2,.6,e,t);var r=t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t);t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t),this._recalculateValidationRect(".fb-validation",.2,.15,e,r),this._recalculateTypeLabel(".fb-type-label",e.type,e,t)}},{}),o.shapes.flowblocks.BlockView=o.dia.ElementView.extend({initialize:function(){o.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-update",(function(){this.update(),this.resize()}))}}),this.View=o.shapes.flowblocks.BlockView}createBlank(t,e,r,o,i,n){var s={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement,Mixer:this.createMixerElement};if(s[r]){var a=s[r].call(this,"");return a.set("blockId",t),a.set("_type",e),a.set("_template",r),a.applyValidation(n),a.style(i),a._recalculateStatus(),a}throw new Error("Unsuported template: "+r)}_createBaseOptions(){return{position:this.options.defaultPosition,size:this.options.defaultSize,ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}}}createSplitElement(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1","out2"],new this.Model(e)}createJoinElement(t){var e=this._createBaseOptions();return e.inPorts=["in1","in2"],e.outPorts=["out1"],new this.Model(e)}createMixerElement(t){var e=this._createBaseOptions();return e.inPorts=["in1","in2"],e.outPorts=["out1","out2"],new this.Model(e)}createPassThroughElement(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1"],new this.Model(e)}createStartElement(t){var e=this._createBaseOptions();return e.outPorts=["out1"],new this.Model(e)}createSinkElement(t){var e=this._createBaseOptions();return e.inPorts=["in1"],new this.Model(e)}}({})},function(t,e){t.exports=new class{constructor(t){this.SIZE={width:70,height:70},this.LABEL={FONT:{SIZE:.15,FAMILY:"Helvetica",WEIGHT:"bold"}},this.POSITION={x:40,y:20},this.POSITION_DELTA={dx:50,dy:50},this.STYLE="americana",this.STYLES={americana:{bodyColor:"#74b9ff",titleBarColor:"#ffeaa7",statusBarColor:"#fdcb6e",portInColor:"#00cec9",portOutColor:"#ff7675",validationERRORColor:"#d63031",validationOKColor:"#00b894"},original:{bodyColor:"#3DB5FF",titleBarColor:"rgb(255, 230, 206)",statusBarColor:"rgb(209, 226, 208)",portInColor:"#16A085",portOutColor:"#E74C3C",validationERRORColor:"#950952",validationOKColor:"#008D83"},cream:{bodyColor:"#FAE8FF",titleBarColor:"#E1C2ED",statusBarColor:"#E1C2ED",portInColor:"#936DED",portOutColor:"#F2EAD7",validationERRORColor:"#950952",validationOKColor:"#008D83"}},this.TOOLBAR={SIZE:{width:110,height:110},PADDING:{x:20,y:20},ROW_PADDING:30,FONT:{SIZE:.15,FAMILY:"Helvetica",WEIGHT:"bold"},DRAG:{SIZE:{width:150,height:150}}}}}({})},function(t,e){t.exports=new class{constructor(t){}parse(t){if("undefined"!=t&&null!=t){var e=t;try{e=JSON.parse(t)}catch(o){var r=t.replace(/'/g,'"');try{e=JSON.parse(r)}catch(t){}}var o=Number(e);return Number.isNaN(o)||(e=Number(o)),e}}}({})},function(t,e,r){const o=r(0),i=r(2),n=r(3),s=r(9);t.exports=new class{constructor(t){this.options={},this.graph={},this.paper={},this._blocks=[],Object.assign(this.options,t),this._initialize(),this.emitter=void 0}_initialize(){}create(t,e,r,i){this.emitter=e,this.graph=new o.dia.Graph,this.paper=new o.dia.Paper({el:document.getElementById(t),width:1400,height:960,gridSize:1,model:this.graph,snapLinks:!0,linkPinning:!1,embeddingMode:!0,clickThreshold:5,defaultLink:new o.dia.Link({attrs:{".marker-target":{d:"M 10 0 L 0 5 L 10 10 z"},".connection":{stroke:"blue"},".marker-source":{d:"M 15 0 L 0 5 L 15 15 z",opacity:"0",stroke:"orange"},'.marker-arrowhead[end="source"]':{fill:"red",d:"M 10 0 L 0 5 L 10 10 z",opacity:"0"}}}),defaultConnectionPoint:{name:"boundary"},highlighting:{default:{name:"stroke",options:{padding:6}},embedding:{name:"addClass",options:{className:"highlighted-parent"}}},validateEmbedding:function(t,e){return e.model instanceof o.shapes.devs.Coupled},validateConnection:function(t,e,r,o,i,n){t.model;var s=!!r.model.freePorts("in").find(t=>t.id==o.getAttribute("port"));return e!=o&&"in"==o.getAttribute("port-group")&&t!=r&&s},validateMagnet:function(t,e,r){return"passive"!=e.getAttribute("magnet")&&t.model.freePorts("out").length>0}}),joint.dia.Link.prototype.toolMarkup=['<g class="link-tool">','<g class="tool-remove" event="remove">','<circle r="11" />','<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',"<title>Remove link.</title>","</g>","</g>"].join("");var n=i||s.generate(),a=r||"Flowblocks #"+n;return this.graph.set("name",a),this.graph.set("id",n),this.graph.set("created",Date.now()),this._bindConnectionEvents(),this._bindToolsEvents(),this._bindInteractionEvents(),this}removeAllBlocks(){this.graph.removeCells(this._blocks),this._blocks=[]}traverseSequential(){var t,e=[];if(t=this._blocks.find(t=>"Start"==t.get("_template"))){var r=[];this.graph.bfs(t,(function(t){r.push(t)}));for(var o=0;o<r.length;o++){var i=o-1>=0?o-1:o,n=o+1<r.length?o+1:o,s=r[i],a=r[o],l=r[n];e.push({p:s.get("blockId")!=a.get("blockId")?s:void 0,c:a,n:l.get("blockId")!=a.get("blockId")?l:void 0})}return e}}import(t){this.removeAllBlocks(),this.graph.fromJSON(t),this.graph.getCells().forEach(t=>{t.isElement()&&(t._reApplyValidation(),this.addBlock(t,!0))}),this.emitter.emit(n.EVENTS.FLOWBLOCKS_DONE_SUCCESS)}_bindInteractionEvents(){var t=this;this.paper.on("element:pointerdblclick",(function(e,r){t.emitter.emit(n.EVENTS.BLOCK_DBLCLICK,e.model,r)}))}_bindToolsEvents(){this.paper.on("element:mouseenter",(function(t){t.showTools()})),this.paper.on("element:mouseleave",(function(t){t.hideTools()}))}_bindConnectionEvents(){var t=this;this.paper.on("link:connect",(function(e,r,o,s,a){var l=i.linkGetParticipants(e.model,t),c=l.sourceElement,u=l.targetElement,h=l.sourcePort,d=l.targetPort;o.model,s.getAttribute("port");c._handleConnectTo(u,h,d,e.model.id),u._handleConnectFrom(c,d,h,e.model.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,c,h,u,d)})),this.paper.on("link:disconnect",(function(e,r,o,s,a){var l=i.linkGetParticipants(e.model,t),c=l.sourceElement,u=o.model,h=(l.targetPort,l.sourcePort);l.targetElement;null!=u&&null!=c&&(c._handleDisconnect(u,h,e.model.id),u._handleDisconnect(c,s.getAttribute("port"),e.model.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,c,h,u,s.getAttribute("port")))})),this.graph.on("remove",(function(e){if(e.isLink()){var r=i.linkGetParticipants(e,t),o=r.sourceElement,s=r.targetElement,a=r.sourcePort,l=r.targetPort;null!=s&&null!=o&&(o._handleDisconnect(s,a,e.id),s._handleDisconnect(o,l,e.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,o,a,s,l))}else{var c=e;t._blocks=t._blocks.filter(t=>t.id!=c.id),t._blocks.forEach(t=>{t._handleDelete(c)}),t.emitter.emit(n.EVENTS.BLOCK_REMOVED,c)}}))}addBlock(t,e){this._blocks.push(t),e||this.graph.addCell(t),t._enableRemoval(this.paper),this.emitter.emit(n.EVENTS.BLOCK_ADDED,t)}enablePanAndZoom(t){var e=t(document.querySelector("[joint-selector=svg]"),{fit:!1,panEnabled:!1,controlIconsEnabled:!0,center:!1,dblClickZoomEnabled:!1,minZoom:.3});this.paper.on("blank:pointerdown",(function(t,r,o){e.enablePan()})),this.paper.on("cell:pointerup blank:pointerup",(function(t,r){e.disablePan()}))}validate(){var t=!0,e=[];return this._blocks.forEach(r=>{var o=r.getStatus();o.valid||e.push({blockId:r.get("blockId"),errors:o.errors}),t=t&&o.valid}),{valid:t,errorBlocks:e}}}({})},function(t,e,r){"use strict";t.exports=r(10)},function(t,e,r){"use strict";var o=r(1),i=r(12),n=r(16),s=r(17)||0;function a(){return i(s)}t.exports=a,t.exports.generate=a,t.exports.seed=function(e){return o.seed(e),t.exports},t.exports.worker=function(e){return s=e,t.exports},t.exports.characters=function(t){return void 0!==t&&o.characters(t),o.shuffled()},t.exports.isValid=n},function(t,e,r){"use strict";var o=1;t.exports={nextValue:function(){return(o=(9301*o+49297)%233280)/233280},seed:function(t){o=t}}},function(t,e,r){"use strict";var o,i,n=r(13);r(1);t.exports=function(t){var e="",r=Math.floor(.001*(Date.now()-1567752802062));return r===i?o++:(o=0,i=r),e+=n(7),e+=n(t),o>0&&(e+=n(o)),e+=n(r)}},function(t,e,r){"use strict";var o=r(1),i=r(14),n=r(15);t.exports=function(t){for(var e,r=0,s="";!e;)s+=n(i,o.get(),1),e=t<Math.pow(16,r+1),r++;return s}},function(t,e,r){"use strict";var o,i="object"==typeof window&&(window.crypto||window.msCrypto);o=i&&i.getRandomValues?function(t){return i.getRandomValues(new Uint8Array(t))}:function(t){for(var e=[],r=0;r<t;r++)e.push(Math.floor(256*Math.random()));return e},t.exports=o},function(t,e){t.exports=function(t,e,r){for(var o=(2<<Math.log(e.length-1)/Math.LN2)-1,i=-~(1.6*o*r/e.length),n="";;)for(var s=t(i),a=i;a--;)if((n+=e[s[a]&o]||"").length===+r)return n}},function(t,e,r){"use strict";var o=r(1);t.exports=function(t){return!(!t||"string"!=typeof t||t.length<6)&&!new RegExp("[^"+o.get().replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&")+"]").test(t)}},function(t,e,r){"use strict";t.exports=0},function(t,e,r){"use strict";var o,i="object"==typeof Reflect?Reflect:null,n=i&&"function"==typeof i.apply?i.apply:function(t,e,r){return Function.prototype.apply.call(t,e,r)};o=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var s=Number.isNaN||function(t){return t!=t};function a(){a.init.call(this)}t.exports=a,a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var l=10;function c(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function u(t){return void 0===t._maxListeners?a.defaultMaxListeners:t._maxListeners}function h(t,e,r,o){var i,n,s,a;if(c(r),void 0===(n=t._events)?(n=t._events=Object.create(null),t._eventsCount=0):(void 0!==n.newListener&&(t.emit("newListener",e,r.listener?r.listener:r),n=t._events),s=n[e]),void 0===s)s=n[e]=r,++t._eventsCount;else if("function"==typeof s?s=n[e]=o?[r,s]:[s,r]:o?s.unshift(r):s.push(r),(i=u(t))>0&&s.length>i&&!s.warned){s.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=s.length,a=l,console&&console.warn&&console.warn(a)}return t}function d(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function f(t,e,r){var o={fired:!1,wrapFn:void 0,target:t,type:e,listener:r},i=d.bind(o);return i.listener=r,o.wrapFn=i,i}function p(t,e,r){var o=t._events;if(void 0===o)return[];var i=o[e];return void 0===i?[]:"function"==typeof i?r?[i.listener||i]:[i]:r?function(t){for(var e=new Array(t.length),r=0;r<e.length;++r)e[r]=t[r].listener||t[r];return e}(i):v(i,i.length)}function g(t){var e=this._events;if(void 0!==e){var r=e[t];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function v(t,e){for(var r=new Array(e),o=0;o<e;++o)r[o]=t[o];return r}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return l},set:function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");l=t}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},a.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},a.prototype.getMaxListeners=function(){return u(this)},a.prototype.emit=function(t){for(var e=[],r=1;r<arguments.length;r++)e.push(arguments[r]);var o="error"===t,i=this._events;if(void 0!==i)o=o&&void 0===i.error;else if(!o)return!1;if(o){var s;if(e.length>0&&(s=e[0]),s instanceof Error)throw s;var a=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw a.context=s,a}var l=i[t];if(void 0===l)return!1;if("function"==typeof l)n(l,this,e);else{var c=l.length,u=v(l,c);for(r=0;r<c;++r)n(u[r],this,e)}return!0},a.prototype.addListener=function(t,e){return h(this,t,e,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(t,e){return h(this,t,e,!0)},a.prototype.once=function(t,e){return c(e),this.on(t,f(this,t,e)),this},a.prototype.prependOnceListener=function(t,e){return c(e),this.prependListener(t,f(this,t,e)),this},a.prototype.removeListener=function(t,e){var r,o,i,n,s;if(c(e),void 0===(o=this._events))return this;if(void 0===(r=o[t]))return this;if(r===e||r.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete o[t],o.removeListener&&this.emit("removeListener",t,r.listener||e));else if("function"!=typeof r){for(i=-1,n=r.length-1;n>=0;n--)if(r[n]===e||r[n].listener===e){s=r[n].listener,i=n;break}if(i<0)return this;0===i?r.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(r,i),1===r.length&&(o[t]=r[0]),void 0!==o.removeListener&&this.emit("removeListener",t,s||e)}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(t){var e,r,o;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[t]),this;if(0===arguments.length){var i,n=Object.keys(r);for(o=0;o<n.length;++o)"removeListener"!==(i=n[o])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=r[t]))this.removeListener(t,e);else if(void 0!==e)for(o=e.length-1;o>=0;o--)this.removeListener(t,e[o]);return this},a.prototype.listeners=function(t){return p(this,t,!0)},a.prototype.rawListeners=function(t){return p(this,t,!1)},a.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):g.call(t,e)},a.prototype.listenerCount=g,a.prototype.eventNames=function(){return this._eventsCount>0?o(this._events):[]}},function(t,e,r){const o=r(20);t.exports=new class{constructor(){this.storageContext="/a/"}save(t,e,r,i){if(window&&window.localStorage){var n=Object.assign({},r),s={k:e,t:t,d:n},a=o(n);s.s=a;var l=this.storageContext+t+"/"+e+"/"+i;window.localStorage.setItem(l,JSON.stringify(s)),console.log("Saved",l,s)}else console.warn("Cant save data as local storage is not accessible")}load(t,e,r){if(window&&window.localStorage)window.localStorage.getItem(this.storageContext+t+"/"+e+"/"+r);else console.warn("Cant load data as local storage is not accessible")}}({})},function(t,e,r){"use strict";var o=r(21);t.exports=function(t){return o(JSON.stringify(t))}},function(t,e){t.exports=function(t){return~-encodeURI(t).split(/%..|./).length}}])}));