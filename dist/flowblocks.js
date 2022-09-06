!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("joint")):"function"==typeof define&&define.amd?define(["joint"],e):"object"==typeof exports?exports.flowblocks=e(require("joint")):t.flowblocks=e(t.joint)}(this,(function(t){return function(t){var e={};function i(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(r,o,function(e){return t[e]}.bind(null,o));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=4)}([function(e,i){e.exports=t},function(t,e,i){"use strict";var r,o,n,s=i(11),a="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";function l(){n=!1}function c(t){if(t){if(t!==r){if(t.length!==a.length)throw new Error("Custom alphabet for shortid must be "+a.length+" unique characters. You submitted "+t.length+" characters: "+t);var e=t.split("").filter((function(t,e,i){return e!==i.lastIndexOf(t)}));if(e.length)throw new Error("Custom alphabet for shortid must be "+a.length+" unique characters. These characters were not unique: "+e.join(", "));r=t,l()}}else r!==a&&(r=a,l())}function u(){return n||(n=function(){r||c(a);for(var t,e=r.split(""),i=[],o=s.nextValue();e.length>0;)o=s.nextValue(),t=Math.floor(o*e.length),i.push(e.splice(t,1)[0]);return i.join("")}())}t.exports={get:function(){return r||a},characters:function(t){return c(t),r},seed:function(t){s.seed(t),o!==t&&(l(),o=t)},lookup:function(t){return u()[t]},shuffled:u}},function(t,e,i){i(0);t.exports=new class{linkGetParticipants(t,e){if(t.isLink())return{sourceElement:e.graph.getCell(t.get("source").id),sourcePort:t.get("source").port,targetElement:e.graph.getCell(t.get("target").id),targetPort:t.get("target").port}}getElementByClass(t){if(document){var e=document.getElementsByClassName(t);if(e.length>0)return e[0]}}downloadObjectAsJson(t,e){var i="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(t));if(document&&document.body){var r=document.createElement("a");r.setAttribute("href",i),r.setAttribute("download",e+".json"),document.body.appendChild(r),r.click(),r.remove()}}}({})},function(t,e){t.exports=new class{constructor(t){this.EVENTS={TOOLBAR_RESET:"toolbar:reset",TOOLBAR_ITEM_CREATE:"toolbar-item:create",TOOLBAR_ITEM_DBLCLICK:"toolbar-item:dblclick",TOOLBAR_ITEM_DRAG:"toolbar-item:drag",TOOLBAR_DRAWER_REQUEST:"toolbar-drawer:requested",TOOLBAR_DRAWER_READY:"toolbar-drawer:view-ready",TOOLBAR_DRAWER_ATTACHED:"toolbar-drawer:attached",TOOLBAR_DRAWER_REMOVED_ALL:"toolbar-drawer:removedall",TOOLBAR_REMOVED_ALL:"toolbar:removedall",MENU_IMPORTJSON_REQUESTED:"menu:import-json",BLOCK_ADDED:"flowblocks:block-added",BLOCK_CREATE:"flowblocks:block-create",BLOCK_DETAILS_SAVE:"flowblocks:block-save",BLOCK_REMOVED:"flowblocks:block-removed",BLOCK_DBLCLICK:"flowblocks:block-dblclick",CONNECTION_REMOVED:"flowblocks:connection-removed",CONNECTION_ADDED:"flowblocks:connection-added",FLOWBLOCKS_SAVE:"flowblocks:save",FLOWBLOCKS_DOWNLOAD:"flowblocks:download",FLOWBLOCKS_TYPE_CREATE:"flowblocks:type-create",FLOWBLOCKS_BUSY:"flowblocks:busy",FLOWBLOCKS_DONE_SUCCESS:"flowblocks:result-ok",FLOWBLOCKS_SAVE_SUCCESS:"flowblocks:save-ok",FLOWBLOCKS_DONE_ERROR:"flowblocks:result-error",FLOWBLOCKS_IMPORT_JSON:"flowblocks:import-json",FLOWBLOCKS_IMPORT_JSON_SKIP_TYPES:"flowblocks:import-json-no-types",FLOWBLOCKS_IMPORT_SUCCESS:"flowblocks:import-ok",FLOWBLOCKS_CREATE_SUCCESS:"flowblocks:create-ok"}}allEvents(){var t=[];return Object.keys(this.EVENTS).forEach(e=>{t.push(this.EVENTS[e])}),t}}({})},function(t,e,i){const r=i(0),o=i(2),n=i(5),s=i(8),a=i(3),l=i(18),c=i(19);class u{constructor(t){this.options={},Object.assign(this.options,t),this._registeredTypes={},this.flow=void 0,this.emitter=new l,this.version=0,this._initialize()}create(){return new u({})}_initialize(){var t=this;this.emitter.on(a.EVENTS.FLOWBLOCKS_IMPORT_JSON,(function(e,i){t.import(e,!0,i)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_IMPORT_JSON_SKIP_TYPES,(function(e,i){t.import(e,!1,i)})),this.emitter.on(a.EVENTS.BLOCK_CREATE,(function(e,i,r,o,n){t.createBlock(i,r,e,o)})),this.emitter.on(a.EVENTS.BLOCK_DETAILS_SAVE,(function(e,i,r){t.getBlock(e).setConfigurables(i)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_SAVE,(function(e){t.raise();var i=t.export();t.save(i,e)})),this.emitter.on(a.EVENTS.FLOWBLOCKS_DOWNLOAD,(function(){t.download(),t.emitter.emit(a.EVENTS.FLOWBLOCKS_DONE_SUCCESS)}))}getBaseInformation(){return{n:this.flow.graph.get("name"),i:this.flow.graph.get("id"),v:this.flow.graph.get("version"),c:this.flow.graph.get("created")}}raise(){this.flow.graph.set("version",++this.version)}save(t,e){c.save(e||"flowblock",t.id,t,t.version),this.emitter.emit(a.EVENTS.FLOWBLOCKS_DONE_SUCCESS),this.emitter.emit(a.EVENTS.FLOWBLOCKS_SAVE_SUCCESS,e,t.id,t.version,t)}registerTypes(t){t.forEach(t=>{this.registerType(t.name,t.template,t.icon,t.style,t.configurables,t.category,t.validationFunction,t.validationSrc)})}_prepareTypeValidation(t,e){return t||e?(t&&(o=t.toString(),n=t),e&&(i=e,r=new Function("return "+e)()),{f:n||r,s:i||o}):{f:void 0,s:void 0};var i,r,o,n}registerType(t,e,i,r,o,n,s,a){var l=this._prepareTypeValidation(s,a);return this._registeredTypes[t]={name:t,template:e,style:r,icon:i,configurables:o,category:n,validation:l.f,validationSrc:l.s},this._registeredTypes[t]}createFlow(t,e,i){return this.flow=s.create(t,this.emitter,e,i),this.raise(),console.log("Flowblocks up and running"),this.flow}traverseModelSpecificationSequential(t){var e=new r.dia.Graph;e.fromJSON(t);var i,o=[];if(i=e.getCells().find(t=>"Start"==t.get("_template"))){var n=[];e.bfs(i,(function(t){n.push(t)}));for(var s=0;s<n.length;s++){var a=s-1>=0?s-1:s,l=s+1<n.length?s+1:s,c=n[a],u=n[s],h=n[l];o.push({p:c.get("blockId")!=u.get("blockId")?c:void 0,c:u,n:h.get("blockId")!=u.get("blockId")?h:void 0})}return o}console.warn("No input block found.")}getBlock(t){return this.flow._blocks.find(e=>e.get("blockId")==t)}import(t,e=!0,i){var r=JSON.parse(t);if(i&&i.specificationId&&(r.id=i.specificationId),i&&i.versionId&&(r.version=i.versionId),i&&i.name&&(r.name=i.name),this.flow.import(r),this.version=r.version,e){var o=[];Object.entries(r.types).forEach(t=>{t[0];let e=t[1];o.push(e)}),this.registerTypes(o),this.rebuildToolbar(o)}}rebuildToolbar(t){this.emitter.emit(a.EVENTS.TOOLBAR_RESET,t)}export(){this.flow.graph.set("exported",Date.now()),this.flow.graph.set("version",this.version);var t=this.flow.graph.toJSON();return t.types=this._registeredTypes,t}download(){var t=this.export();return o.downloadObjectAsJson(t,this.flow.graph.get("name")),t}notify(t,...e){this.emitter.emit(t,...e)}on(t,e){"all"==t?a.allEvents().forEach(t=>{this.emitter.on(t,e)}):this.emitter.on(t,e)}getDefinition(t){return this._registeredTypes[t]}createBlock(t,e,i,r,o){var s=this._registeredTypes[t];if(s){var a=n.createBlank(i,s.name,s.template,s.statusDefinition,s.style,s.validation,s.configurables);if(a.setConfigurable("name",e),i)this.flow._blocks.find(t=>t.get("blockId")==i)&&console.error("Duplicate flow Block for id: "+i);return r&&a.set("position",r),o&&a.set("size",o),s.icon&&(-1==s.icon.lastIndexOf("/")?a.set("icon","https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/"+s.icon+".svg"):a.set("icon",s.icon)),this.flow.addBlock(a),a}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}_dumpConnections(){this.flow._blocks.forEach(t=>{t._dumpConnections()})}enablePanAndZoom(t){if(t)try{this.flow.enablePanAndZoom(t)}catch(t){console.error(t)}}validate(){return this.flow?this.flow.validate():{valid:!1,errorBlocks:[{blockId:void 0,errors:[{code:"GENERAL",cId:"flowblocks",msg:"No flow configured"}]}]}}}t.exports=new u({})},function(t,e,i){const r=i(0),o=i(6),n=i(7);t.exports=new class{constructor(t){this.options={defaultSize:o.SIZE,defaultPosition:o.POSITION,defaultPositionDelta:o.POSITION_DELTA},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){r.shapes.flowblocks={},this.Model=r.shapes.devs.Model.define("flowblocks.Block",{name:"",icon:"./resources/img/svg/agave.svg",status:"ERROR",statusMsg:"OK",blockId:void 0,debug:!1,errors:[],configurables:[],_validationFunction:void 0,_configurablesDefinitions:[],_style:void 0,_defaultStyle:o.STYLE,_styles:o.STYLES,_portsConnected:0,_type:void 0,_template:void 0,_portConnections:[],attrs:{rect:{fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{"ref-width":"100%",fill:"#3DB5FF"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{"ref-width":"100%",fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{"ref-width":"100%",fill:"rgb(255, 230, 206)"},".fb-validation-rect":{fill:"#d63031"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-type-label-text":{"text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-status-text"></text>','<rect class="fb-validation-rect"/>','<text class="fb-type-label-text"></text>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:errors change:statusMsg change:size change:_type",(function(){this._updateMyModel(),this.trigger("flowblocks-block-update")}),this),this._updateMyModel(),r.shapes.devs.Model.prototype.initialize.apply(this,arguments)},api:function(){return["element.set('name','my label');","element.set('position', {x:30, y:10});","element.set('size', {width:50, height: 50});","element.set('icon', 'https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/vase.svg');","element.style({titleBarColor: '#FADB50'});","element.getStatus();","element.freePorts();"]},getStatus(){return{valid:"OK"==this.get("status"),errors:this.get("errors")}},applyValidation(t){t&&(this.set("_validationFunction",t),this.set("_validationSource",t.toString()))},_reApplyValidation(){this.get("_validationSource")&&this.set("_validationFunction",new Function("return "+this.get("_validationSource"))())},_getStyle(t){return t?"string"==typeof t||t instanceof String?this.get("_styles")[t.toLocaleLowerCase()]:t:this.get("_defaultStyle")},_getPortGroup(t){return((this.attributes.ports||{}).groups||{})[t]},style(t){var e=this._getStyle(t);e&&(this.set("_style",e),e.bodyColor&&this.attr(".fb-icon-rect/fill",e.bodyColor),e.titleBarColor&&this.attr(".fb-label-rect/fill",e.titleBarColor),e.statusBarColor&&this.attr(".fb-status-rect/fill",e.statusBarColor),e.portInColor&&this.getPorts().forEach(t=>{if("in"==t.group){this.portProp(t.id,"attrs/.port-body/fill",e.portInColor);var i=this._getPortGroup("in");if(i&&i.attrs)(i.attrs[".port-body"]||{}).fill=e.portInColor}}),e.portOutColor&&this.getPorts().forEach(t=>{if("out"==t.group){this.portProp(t.id,"attrs/.port-body/fill",e.portOutColor);var i=this._getPortGroup("out");if(i&&i.attrs)(i.attrs[".port-body"]||{}).fill=e.portOutColor}}))},setConfigurables(t){this.set("configurables",t);const e=this.getConfigurable("name");this.set("name",e),this._recalculateStatus()},setConfigurable(t,e){var i;this.getConfigurable(t)?((i=this.get("configurables")).forEach(i=>{i.i==t&&(i.v=e)}),this.setConfigurables(i)):(this.addConfigurableDefinition({id:t,label:t,placeholder:"",type:"TEXT",required:!0}),(i=this.get("configurables")).push({i:t,v:e}),this.setConfigurables(i))},addConfigurableDefinition(t){const e=this.get("_configurablesDefinitions");e.find(e=>e.id==t.id)?e.map(e=>e.id==t.id?t:e):e.push(t),this.set("_configurablesDefinitions",e)},freePorts(t){var e=this.getPorts().filter(e=>!t||e.group==t),i=this.get("_portConnections"),r=[];return e.forEach(t=>{i.find(e=>e.port==t.id)||r.push(t)}),r},_dumpConnections(){this.get("debug")&&console.log("Connections["+this.get("blockId")+"]: ",JSON.stringify(this.get("_portConnections")))},_statusToString(){var t="Block validation state: "+this.get("status");return this.get("errors").forEach(e=>{t+=" | "+e.msg}),t},_basePortsValidation(){var t=this.freePorts();t.length>0&&t.forEach(t=>{this.get("errors").push({code:"PORT_NOT_CONNECTED",cId:t.id,msg:"Port ["+t.id+"] is not connected"})})},_baseConfigurablesValidation(){var t=this;this.get("_configurablesDefinitions").filter(t=>t.required).forEach(e=>{t.getConfigurable(e.id)||this.get("errors").push({code:"FIELD_REQUIRED",cId:e.id,msg:"Field ["+e.id+"] is required"})})},_baseStatusValidation(){this._basePortsValidation(),this._baseConfigurablesValidation()},getConfigurable(t){var e=void 0;return Object.entries(this.get("configurables")).forEach(i=>{i[1].i==t&&(e=i[1].v)}),n.parse(e)},_customValidation(){var t=Object.assign({},this.get("_portConnections")),e={id:this.id,blockId:this.get("blockId"),type:this.get("_type"),configurables:Object.assign({},this.get("configurables")),connections:t,configurable:function(t){var e=void 0;return Object.entries(this.configurables).forEach(i=>{i[1].i==t&&(e=i[1].v)}),n.parse(e)},connection:function(t){var e=void 0;return Object.entries(this.connections).forEach(i=>{i[1].port==t&&(e=i[1])}),e},toArray:function(t){var e=t||"[]",i=void 0;try{i=n.parse(e)}catch(t){}return Array.isArray(i)?i:[]}};this.get("_validationFunction")&&this.get("_validationFunction").call(this,e).forEach(t=>{this.get("errors").push({code:t.code,cId:t.cId,msg:t.msg})})},_recalculateStatus(){this.set("errors",[]),this.set("status","OK"),this.set("statusMsg","OK"),this._baseStatusValidation(),this._customValidation(),this.get("errors").length>0?(this.set("status","ERROR"),this.attr(".fb-validation-rect/fill",this.get("_style").validationERRORColor),this.set("statusMsg","INVALID")):(this.set("errors",[]),this.set("status","OK"),this.attr(".fb-validation-rect/fill",this.get("_style").validationOKColor),this.set("statusMsg","OK"))},_handleDelete(t){var e=this.get("_portConnections").filter(e=>e.id!=t);this.set("_portConnections",e),this._recalculateStatus()},_handleDisconnect(t,e,i){if(null!=t){this.get("_portConnections").find(r=>r.port==e&&r.id==t.id&&r.linkId==i);var r=this.get("_portConnections").findIndex(r=>r.port==e&&r.id==t.id&&r.linkId==i);r>=0&&this.get("_portConnections").splice(r,1),this._recalculateStatus()}},_handleConnectFrom(t,e,i,r){var o={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:i,linkId:r};this.get("_portConnections").push(o),this._recalculateStatus()},_handleConnectTo(t,e,i,r){var o={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:i,linkId:r};this.get("_portConnections").push(o),this._recalculateStatus()},_recalculateRectWithLabel:function(t,e,i,r,o,n){this.get("attrs");var s=i*o.height,a=r*s,l=n+s/2,c=.1*o.width;return this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")"),this.attr(t+"-text/font-size",a),this.attr(t+"-text/transform","translate("+c+","+l+")"),this.attr(t+"-text/text",e),s},_recalculateValidationRect:function(t,e,i,r,o){this.get("attrs");var n=e*r.height,s=(1-i)*r.width,a=i*r.width;return this.attr(t+"-rect/height",n),this.attr(t+"-rect/width",a),this.attr(t+"-rect/transform","translate("+s+","+o+")"),this.attr(t+"-rect/title",this._statusToString()),n},_recalculateRectWithIcon:function(t,e,i,r,o,n){var s=i*o.height;this.attr(t+"-rect/height",s),this.attr(t+"-rect/transform","translate(0,"+n+")");var a=r*s,l=o.width/2-a/2,c=n+s/2-a/2;return this.attr(t+"-image/height",a),this.attr(t+"-image/transform","translate("+l+","+c+")"),this.attr(t+"-image/href",e),s},_enableRemoval(t){var e=this.findView(t),i=this.getPorts(),r=!1,o=!1;i.forEach(t=>{"out"==t.group&&(o=!0),"in"==t.group&&(r=!0)});var n="0%";n=r&&o?"70%":o?"62%":"100%";var s=new joint.elementTools.Remove({focusOpacity:.5,rotate:!0,x:n}),a=new joint.dia.ToolsView({name:"basic-tools",tools:[s]});e.addTools(a),e.hideTools()},_recalculateTypeLabel:function(t,e,i,r){var n=i.height*o.LABEL.FONT.SIZE,s=r+n;this.attr(t+"-text/font-size",n),this.attr(t+"-text/transform","translate(0,"+s+")"),this.attr(t+"-text/text",e),this.attr(t+"-text/font-family",o.LABEL.FONT.FAMILY),this.attr(t+"-text/font-weight",o.LABEL.FONT.WEIGHT)},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("debug")?this.get("name")+"["+this.get("blockId")+"]":this.get("name"),statusMessage:this.get("statusMsg"),status:this.get("status"),type:this.get("_type")};t+=this._recalculateRectWithLabel(".fb-label",e.name,.2,.6,e,t);var i=t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t);t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t),this._recalculateValidationRect(".fb-validation",.2,.15,e,i),this._recalculateTypeLabel(".fb-type-label",e.type,e,t)}},{}),r.shapes.flowblocks.BlockView=r.dia.ElementView.extend({initialize:function(){r.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-update",(function(){this.update(),this.resize()}))}}),this.View=r.shapes.flowblocks.BlockView}createBlank(t,e,i,r,o,n,s){var a={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Split3:this.createSplit3Element,Split4:this.createSplit4Element,Split5:this.createSplit5Element,Join:this.createJoinElement,End:this.createSinkElement,Mixer:this.createMixerElement};if(a[i]){var l=a[i].call(this,"");return l.set("blockId",t),l.set("_type",e),l.set("_template",i),l.set("_configurablesDefinitions",s),l.applyValidation(n),l.style(o),l._recalculateStatus(),l}throw new Error("Unsuported template: "+i)}_createBaseOptions(){return{position:this.options.defaultPosition,size:this.options.defaultSize,ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}}}createSplitElement(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1","out2"],new this.Model(e)}createSplit3Element(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1","out2","out3"],new this.Model(e)}createSplit4Element(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1","out2","out3","out4"],new this.Model(e)}createSplit5Element(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1","out2","out3","out4","out5"],new this.Model(e)}createJoinElement(t){var e=this._createBaseOptions();return e.inPorts=["in1","in2"],e.outPorts=["out1"],new this.Model(e)}createMixerElement(t){var e=this._createBaseOptions();return e.inPorts=["in1","in2"],e.outPorts=["out1","out2"],new this.Model(e)}createPassThroughElement(t){var e=this._createBaseOptions();return e.inPorts=["in1"],e.outPorts=["out1"],new this.Model(e)}createStartElement(t){var e=this._createBaseOptions();return e.outPorts=["out1"],new this.Model(e)}createSinkElement(t){var e=this._createBaseOptions();return e.inPorts=["in1"],new this.Model(e)}}({})},function(t,e){t.exports=new class{constructor(t){this.SIZE={width:70,height:70},this.LABEL={FONT:{SIZE:.15,FAMILY:"Helvetica",WEIGHT:"bold"}},this.POSITION={x:40,y:20},this.POSITION_DELTA={dx:50,dy:50},this.STYLE="americana",this.STYLES={americana:{bodyColor:"#74b9ff",titleBarColor:"#ffeaa7",statusBarColor:"#fdcb6e",portInColor:"#00cec9",portOutColor:"#ff7675",validationERRORColor:"#d63031",validationOKColor:"#00b894"},original:{bodyColor:"#3DB5FF",titleBarColor:"rgb(255, 230, 206)",statusBarColor:"rgb(209, 226, 208)",portInColor:"#16A085",portOutColor:"#E74C3C",validationERRORColor:"#950952",validationOKColor:"#008D83"},cream:{bodyColor:"#FAE8FF",titleBarColor:"#E1C2ED",statusBarColor:"#E1C2ED",portInColor:"#936DED",portOutColor:"#F2EAD7",validationERRORColor:"#950952",validationOKColor:"#008D83"}},this.TOOLBAR={SIZE:{width:110,height:110},PADDING:{x:20,y:20},ROW_PADDING:30,FONT:{SIZE:.15,FAMILY:"Helvetica",WEIGHT:"bold"},DRAG:{SIZE:{width:150,height:150}}}}}({})},function(t,e){t.exports=new class{constructor(t){}parse(t){if("undefined"!=t&&null!=t){var e=t;try{e=JSON.parse(t)}catch(r){var i=t.replace(/'/g,'"');try{e=JSON.parse(i)}catch(t){}}var r="string"==typeof t&&"true"===t.toLowerCase();if("string"==typeof t&&"false"===t.toLowerCase()||r)return!!r;var o=Number(e);return Number.isNaN(o)||(e=Number(o)),e}}}({})},function(t,e,i){const r=i(0),o=i(2),n=i(3),s=i(9);t.exports=new class{constructor(t){this.options={},this.graph={},this.paper={},this._blocks=[],Object.assign(this.options,t),this._initialize(),this.emitter=void 0}_initialize(){}create(t,e,i,o){this.emitter=e,this.graph=new r.dia.Graph,this.paper=new r.dia.Paper({el:document.getElementById(t),width:1400,height:960,gridSize:1,model:this.graph,snapLinks:!0,linkPinning:!1,embeddingMode:!0,clickThreshold:5,defaultLink:new r.dia.Link({attrs:{".marker-target":{d:"M 10 0 L 0 5 L 10 10 z"},".connection":{stroke:"blue"},".marker-source":{d:"M 15 0 L 0 5 L 15 15 z",opacity:"0",stroke:"orange"},'.marker-arrowhead[end="source"]':{fill:"red",d:"M 10 0 L 0 5 L 10 10 z",opacity:"0"}},router:{name:"metro"}}),defaultConnectionPoint:{name:"boundary"},highlighting:{default:{name:"stroke",options:{padding:6}},embedding:{name:"addClass",options:{className:"highlighted-parent"}}},validateEmbedding:function(t,e){return e.model instanceof r.shapes.devs.Coupled},validateConnection:function(t,e,i,r,o,n){t.model;var s=!!i.model.freePorts("in").find(t=>t.id==r.getAttribute("port"));return e!=r&&"in"==r.getAttribute("port-group")&&t!=i&&s},validateMagnet:function(t,e,i){return"passive"!=e.getAttribute("magnet")&&t.model.freePorts("out").length>0}}),joint.dia.Link.prototype.toolMarkup=['<g class="link-tool">','<g class="tool-remove" event="remove">','<circle r="11" />','<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',"<title>Remove link.</title>","</g>","</g>"].join("");var a=o||s.generate(),l=i||"Flowblocks #"+a;return this.graph.set("name",l),this.graph.set("id",a),this.graph.set("created",Date.now()),this._bindConnectionEvents(),this._bindToolsEvents(),this._bindInteractionEvents(),this.emitter.emit(n.EVENTS.FLOWBLOCKS_CREATE_SUCCESS,this.graph.get("name"),this.graph.get("id"),this.graph.get("version")),this}removeAllBlocks(){this.graph.removeCells(this._blocks),this._blocks=[]}traverseSequential(){var t,e=[];if(t=this._blocks.find(t=>"Start"==t.get("_template"))){var i=[];this.graph.bfs(t,(function(t){i.push(t)}));for(var r=0;r<i.length;r++){var o=r-1>=0?r-1:r,n=r+1<i.length?r+1:r,s=i[o],a=i[r],l=i[n];e.push({p:s.get("blockId")!=a.get("blockId")?s:void 0,c:a,n:l.get("blockId")!=a.get("blockId")?l:void 0})}return e}}import(t){this.removeAllBlocks(),this.graph.fromJSON(t),this.graph.getCells().forEach(t=>{t.isElement()&&(t._reApplyValidation(),this.addBlock(t,!0))}),this.emitter.emit(n.EVENTS.FLOWBLOCKS_IMPORT_SUCCESS,this.graph.get("name"),this.graph.get("id"),this.graph.get("version")),this.emitter.emit(n.EVENTS.FLOWBLOCKS_DONE_SUCCESS)}_bindInteractionEvents(){var t=this;this.paper.on("element:pointerdblclick",(function(e,i){t.emitter.emit(n.EVENTS.BLOCK_DBLCLICK,e.model,i)}))}_bindToolsEvents(){this.paper.on("element:mouseenter",(function(t){t.showTools()})),this.paper.on("element:mouseleave",(function(t){t.hideTools()}))}_bindConnectionEvents(){var t=this;this.paper.on("link:connect",(function(e,i,r,s,a){var l=o.linkGetParticipants(e.model,t),c=l.sourceElement,u=l.targetElement,h=l.sourcePort,f=l.targetPort;r.model,s.getAttribute("port");c._handleConnectTo(u,h,f,e.model.id),u._handleConnectFrom(c,f,h,e.model.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,c,h,u,f)})),this.paper.on("link:disconnect",(function(e,i,r,s,a){var l=o.linkGetParticipants(e.model,t),c=l.sourceElement,u=r.model,h=(l.targetPort,l.sourcePort);l.targetElement;null!=u&&null!=c&&(c._handleDisconnect(u,h,e.model.id),u._handleDisconnect(c,s.getAttribute("port"),e.model.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,c,h,u,s.getAttribute("port")))})),this.graph.on("remove",(function(e){if(e.isLink()){var i=o.linkGetParticipants(e,t),r=i.sourceElement,s=i.targetElement,a=i.sourcePort,l=i.targetPort;null!=s&&null!=r&&(r._handleDisconnect(s,a,e.id),s._handleDisconnect(r,l,e.id),t.emitter.emit(n.EVENTS.CONNECTION_REMOVED,r,a,s,l))}else{var c=e;t._blocks=t._blocks.filter(t=>t.id!=c.id),t._blocks.forEach(t=>{t._handleDelete(c)}),t.emitter.emit(n.EVENTS.BLOCK_REMOVED,c)}}))}addBlock(t,e){this._blocks.push(t),e||this.graph.addCell(t),t._enableRemoval(this.paper),this.emitter.emit(n.EVENTS.BLOCK_ADDED,t)}enablePanAndZoom(t){var e=t(document.querySelector("[joint-selector=svg]"),{fit:!1,panEnabled:!1,controlIconsEnabled:!0,center:!1,dblClickZoomEnabled:!1,minZoom:.3});this.paper.on("blank:pointerdown",(function(t,i,r){e.enablePan()})),this.paper.on("cell:pointerup blank:pointerup",(function(t,i){e.disablePan()}))}validate(){var t=!0,e=[];return this._blocks.forEach(i=>{var r=i.getStatus();r.valid||e.push({blockId:i.get("blockId"),errors:r.errors}),t=t&&r.valid}),{valid:t,errorBlocks:e}}}({})},function(t,e,i){"use strict";t.exports=i(10)},function(t,e,i){"use strict";var r=i(1),o=i(12),n=i(16),s=i(17)||0;function a(){return o(s)}t.exports=a,t.exports.generate=a,t.exports.seed=function(e){return r.seed(e),t.exports},t.exports.worker=function(e){return s=e,t.exports},t.exports.characters=function(t){return void 0!==t&&r.characters(t),r.shuffled()},t.exports.isValid=n},function(t,e,i){"use strict";var r=1;t.exports={nextValue:function(){return(r=(9301*r+49297)%233280)/233280},seed:function(t){r=t}}},function(t,e,i){"use strict";var r,o,n=i(13);i(1);t.exports=function(t){var e="",i=Math.floor(.001*(Date.now()-1567752802062));return i===o?r++:(r=0,o=i),e+=n(7),e+=n(t),r>0&&(e+=n(r)),e+=n(i)}},function(t,e,i){"use strict";var r=i(1),o=i(14),n=i(15);t.exports=function(t){for(var e,i=0,s="";!e;)s+=n(o,r.get(),1),e=t<Math.pow(16,i+1),i++;return s}},function(t,e,i){"use strict";var r,o="object"==typeof window&&(window.crypto||window.msCrypto);r=o&&o.getRandomValues?function(t){return o.getRandomValues(new Uint8Array(t))}:function(t){for(var e=[],i=0;i<t;i++)e.push(Math.floor(256*Math.random()));return e},t.exports=r},function(t,e){t.exports=function(t,e,i){for(var r=(2<<Math.log(e.length-1)/Math.LN2)-1,o=-~(1.6*r*i/e.length),n="";;)for(var s=t(o),a=o;a--;)if((n+=e[s[a]&r]||"").length===+i)return n}},function(t,e,i){"use strict";var r=i(1);t.exports=function(t){return!(!t||"string"!=typeof t||t.length<6)&&!new RegExp("[^"+r.get().replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&")+"]").test(t)}},function(t,e,i){"use strict";t.exports=0},function(t,e,i){"use strict";var r,o="object"==typeof Reflect?Reflect:null,n=o&&"function"==typeof o.apply?o.apply:function(t,e,i){return Function.prototype.apply.call(t,e,i)};r=o&&"function"==typeof o.ownKeys?o.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var s=Number.isNaN||function(t){return t!=t};function a(){a.init.call(this)}t.exports=a,a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var l=10;function c(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function u(t){return void 0===t._maxListeners?a.defaultMaxListeners:t._maxListeners}function h(t,e,i,r){var o,n,s,a;if(c(i),void 0===(n=t._events)?(n=t._events=Object.create(null),t._eventsCount=0):(void 0!==n.newListener&&(t.emit("newListener",e,i.listener?i.listener:i),n=t._events),s=n[e]),void 0===s)s=n[e]=i,++t._eventsCount;else if("function"==typeof s?s=n[e]=r?[i,s]:[s,i]:r?s.unshift(i):s.push(i),(o=u(t))>0&&s.length>o&&!s.warned){s.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=s.length,a=l,console&&console.warn&&console.warn(a)}return t}function f(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(t,e,i){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:i},o=f.bind(r);return o.listener=i,r.wrapFn=o,o}function p(t,e,i){var r=t._events;if(void 0===r)return[];var o=r[e];return void 0===o?[]:"function"==typeof o?i?[o.listener||o]:[o]:i?function(t){for(var e=new Array(t.length),i=0;i<e.length;++i)e[i]=t[i].listener||t[i];return e}(o):v(o,o.length)}function g(t){var e=this._events;if(void 0!==e){var i=e[t];if("function"==typeof i)return 1;if(void 0!==i)return i.length}return 0}function v(t,e){for(var i=new Array(e),r=0;r<e;++r)i[r]=t[r];return i}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return l},set:function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");l=t}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},a.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},a.prototype.getMaxListeners=function(){return u(this)},a.prototype.emit=function(t){for(var e=[],i=1;i<arguments.length;i++)e.push(arguments[i]);var r="error"===t,o=this._events;if(void 0!==o)r=r&&void 0===o.error;else if(!r)return!1;if(r){var s;if(e.length>0&&(s=e[0]),s instanceof Error)throw s;var a=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw a.context=s,a}var l=o[t];if(void 0===l)return!1;if("function"==typeof l)n(l,this,e);else{var c=l.length,u=v(l,c);for(i=0;i<c;++i)n(u[i],this,e)}return!0},a.prototype.addListener=function(t,e){return h(this,t,e,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(t,e){return h(this,t,e,!0)},a.prototype.once=function(t,e){return c(e),this.on(t,d(this,t,e)),this},a.prototype.prependOnceListener=function(t,e){return c(e),this.prependListener(t,d(this,t,e)),this},a.prototype.removeListener=function(t,e){var i,r,o,n,s;if(c(e),void 0===(r=this._events))return this;if(void 0===(i=r[t]))return this;if(i===e||i.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,i.listener||e));else if("function"!=typeof i){for(o=-1,n=i.length-1;n>=0;n--)if(i[n]===e||i[n].listener===e){s=i[n].listener,o=n;break}if(o<0)return this;0===o?i.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(i,o),1===i.length&&(r[t]=i[0]),void 0!==r.removeListener&&this.emit("removeListener",t,s||e)}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(t){var e,i,r;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete i[t]),this;if(0===arguments.length){var o,n=Object.keys(i);for(r=0;r<n.length;++r)"removeListener"!==(o=n[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=i[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},a.prototype.listeners=function(t){return p(this,t,!0)},a.prototype.rawListeners=function(t){return p(this,t,!1)},a.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):g.call(t,e)},a.prototype.listenerCount=g,a.prototype.eventNames=function(){return this._eventsCount>0?r(this._events):[]}},function(t,e,i){const r=i(20);t.exports=new class{constructor(){this.storageContext=""}save(t,e,i,o){if(window&&window.localStorage){var n=Object.assign({},i),s={k:e,t:t,d:n},a=r(n);s.s=a;var l=this.storageContext+t+"/"+e+"/"+o;window.localStorage.setItem(l,JSON.stringify(s)),console.log("Saved",l,s)}else console.warn("Cant save data as local storage is not accessible")}load(t,e,i){if(window&&window.localStorage)window.localStorage.getItem(this.storageContext+t+"/"+e+"/"+i);else console.warn("Cant load data as local storage is not accessible")}}({})},function(t,e,i){"use strict";var r=i(21);t.exports=function(t){return r(JSON.stringify(t))}},function(t,e){t.exports=function(t){return~-encodeURI(t).split(/%..|./).length}}])}));