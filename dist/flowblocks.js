!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("joint")):"function"==typeof define&&define.amd?define(["joint"],e):"object"==typeof exports?exports.flowblocks=e(require("joint")):t.flowblocks=e(t.joint)}(this,(function(t){return function(t){var e={};function i(o){if(e[o])return e[o].exports;var s=e[o]={i:o,l:!1,exports:{}};return t[o].call(s.exports,s,s.exports,i),s.l=!0,s.exports}return i.m=t,i.c=e,i.d=function(t,e,o){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(o,s,function(e){return t[e]}.bind(null,s));return o},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=3)}([function(e,i){e.exports=t},function(t,e){t.exports=new class{constructor(t){this.SIZE={width:70,height:70},this.POSITION={x:40,y:20},this.POSITION_DELTA={dx:50,dy:50},this.STYLE="americana",this.STYLES={americana:{bodyColor:"#74b9ff",titleBarColor:"#ffeaa7",statusBarColor:"#fdcb6e",portInColor:"#00cec9",portOutColor:"#ff7675",validationERRORColor:"#d63031",validationOKColor:"#00b894"},original:{bodyColor:"#3DB5FF",titleBarColor:"rgb(255, 230, 206)",statusBarColor:"rgb(209, 226, 208)",portInColor:"#16A085",portOutColor:"#E74C3C",validationERRORColor:"#950952",validationOKColor:"#008D83"},cream:{bodyColor:"#FAE8FF",titleBarColor:"#E1C2ED",statusBarColor:"#E1C2ED",portInColor:"#936DED",portOutColor:"#F2EAD7",validationERRORColor:"#950952",validationOKColor:"#008D83"}},this.TOOLBAR={SIZE:{width:120,height:960},PADDING:{x:20,y:20},ROW_PADDING:30,FONT:{SIZE:.15,FAMILY:"Helvetica",WEIGHT:"bold"}}}}({})},function(t,e,i){i(0);t.exports=new class{linkGetParticipants(t,e){if(t.isLink())return{sourceElement:e.graph.getCell(t.get("source").id),sourcePort:t.get("source").port,targetElement:e.graph.getCell(t.get("target").id),targetPort:t.get("target").port}}}({})},function(t,e,i){i(0),i(2);const o=i(4),s=i(5),r=i(6),a=i(7);t.exports=new class{constructor(t){this.options={},Object.assign(this.options,t),this._registeredTypes={},this.flow=void 0,this.toolbar=void 0}registerType(t,e,i,o,s){return this._registeredTypes[t]={name:t,statusDefinition:e,template:i,style:s,icon:o},this.createToolbarItem(t,t),this._registeredTypes[t]}createFlow(t){return this.flow=s.create(t),this.flow}createToolbar(t){return this.toolbar=r.create(t),this.toolbar}getBlock(t){return this.flow._blocks.find(e=>e.get("blockId")==t)}createToolbarItem(t,e,i){if(this.toolbar){var o=this._registeredTypes[t];if(o){var s=a.createBlank(o.template,o.statusDefinition,o.style);return s.set("name",e),s.set("_type",o.name),i&&s.set("size",i),this.toolbar.addItem(s),s}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}console.error("Cant create toolbar icon. Create toolbar first by calling createToolbar().")}createBlock(t,e,i,s,r){var a=this._registeredTypes[t];if(a){var n=o.createBlank(i,a.template,a.statusDefinition,a.style);if(n.set("name",e),n.set("_type",a.name),i)this.flow._blocks.find(t=>t.get("blockId")==i)&&console.error("Duplicate flow Block for id: "+i);return s&&n.set("position",s),r&&n.set("size",r),a.icon&&(-1==a.icon.lastIndexOf("/")?n.set("icon","https://unpkg.com/flowblocks/dist/resources/img/svg/"+a.icon+".svg"):n.set("icon",a.icon)),this.flow.addBlock(n),n}throw new Error("Undefined type exception:"+t+". Please register type first with registerType().")}_dumpConnections(){this.flow._blocks.forEach(t=>{t._dumpConnections()})}enablePanAndZoom(t){if(t)try{this.flow.enablePanAndZoom(t)}catch(t){console.error(t)}}}({})},function(t,e,i){const o=i(0),s=i(1);t.exports=new class{constructor(t){this.options={defaultSize:s.SIZE,defaultPosition:s.POSITION,defaultPositionDelta:s.POSITION_DELTA},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){o.shapes.flowblocks={},this.Model=o.shapes.devs.Model.define("flowblocks.Block",{name:"",icon:"./resources/img/svg/agave.svg",status:"ERROR",statusMsg:"OK",blockId:void 0,debug:!0,errors:[],_style:void 0,_defaultStyle:s.STYLE,_styles:s.STYLES,_portsConnected:0,_type:void 0,_portConnections:[],attrs:{rect:{fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{"ref-width":"100%",fill:"#3DB5FF"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{"ref-width":"100%",fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{"ref-width":"100%",fill:"rgb(255, 230, 206)"},".fb-validation-rect":{fill:"#d63031"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-status-text"></text>','<rect class="fb-validation-rect"/>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:statusMsg change:size",(function(){this._updateMyModel(),this.trigger("flowblocks-block-update")}),this),this._updateMyModel(),o.shapes.devs.Model.prototype.initialize.apply(this,arguments)},api:function(){return["element.set('name','my label');","element.set('position', {x:30, y:10});","element.set('size', {width:50, height: 50});","element.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/vase.svg');","element.style({titleBarColor: '#FADB50'});","element.getStatus();","element.freePorts();"]},getStatus(){return{valid:"OK"==this.get("status"),errors:this.get("errors")}},style(t){if(t)if("string"==typeof t||t instanceof String){var e=this.get("_styles")[t.toLocaleLowerCase()];e&&this.style(e)}else this.set("_style",t),t.bodyColor&&this.attr(".fb-icon-rect/fill",t.bodyColor),t.titleBarColor&&this.attr(".fb-label-rect/fill",t.titleBarColor),t.statusBarColor&&this.attr(".fb-status-rect/fill",t.statusBarColor),t.portInColor&&this.getPorts().forEach(e=>{"in"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portInColor)}),t.portOutColor&&this.getPorts().forEach(e=>{"out"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portOutColor)});else this.style(this.get("_defaultStyle"))},freePorts(t){var e=this.getPorts().filter(e=>!t||e.group==t),i=this.get("_portConnections"),o=[];return e.forEach(t=>{i.find(e=>e.port==t.id)||o.push(t)}),o},_dumpConnections(){this.get("debug")&&console.log("Connections["+this.get("blockId")+"]: ",JSON.stringify(this.get("_portConnections")))},_recalculateStatus(){this.set("status","OK"),this.get("errors").length=0;var t=this.freePorts();t.length>0?(this.set("status","ERROR"),this.attr(".fb-validation-rect/fill",this.get("_style").validationERRORColor),t.forEach(t=>{this.get("errors").push({code:"PORT_NOT_CONNECTED",cId:t.id,msg:"Port ["+t.id+"] is not connected"})})):(this.set("status","OK"),this.get("errors").length=0,this.attr(".fb-validation-rect/fill",this.get("_style").validationOKColor))},_handleDelete(t){var e=this.get("_portConnections").filter(e=>e.id!=t);this.set("_portConnections",e),this._recalculateStatus()},_handleDisconnect(t,e,i){if(null!=t){this.get("_portConnections").find(o=>o.port==e&&o.id==t.id&&o.linkId==i);var o=this.get("_portConnections").findIndex(o=>o.port==e&&o.id==t.id&&o.linkId==i);o>=0&&this.get("_portConnections").splice(o,1),this._recalculateStatus()}},_handleConnectFrom(t,e,i,o){var s={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:i,linkId:o};this.get("_portConnections").push(s),this._recalculateStatus()},_handleConnectTo(t,e,i,o){var s={port:e,id:t.get("id"),bId:t.get("blockId"),type:t.get("_type"),targetPort:i,linkId:o};this.get("_portConnections").push(s),this._recalculateStatus()},_recalculateRectWithLabel:function(t,e,i,o,s,r){this.get("attrs");var a=i*s.height,n=o*a,l=r+a/2,c=.1*s.width;return this.attr(t+"-rect/height",a),this.attr(t+"-rect/transform","translate(0,"+r+")"),this.attr(t+"-text/font-size",n),this.attr(t+"-text/transform","translate("+c+","+l+")"),this.attr(t+"-text/text",e),a},_recalculateValidationRect:function(t,e,i,o,s){this.get("attrs");var r=e*o.height,a=(1-i)*o.width,n=i*o.width;return this.attr(t+"-rect/height",r),this.attr(t+"-rect/width",n),this.attr(t+"-rect/transform","translate("+a+","+s+")"),this.attr(t+"-rect/title","Block validation state: "+this.get("status")),r},_recalculateRectWithIcon:function(t,e,i,o,s,r){var a=i*s.height;this.attr(t+"-rect/height",a),this.attr(t+"-rect/transform","translate(0,"+r+")");var n=o*a,l=s.width/2-n/2,c=r+a/2-n/2;return this.attr(t+"-image/height",n),this.attr(t+"-image/transform","translate("+l+","+c+")"),this.attr(t+"-image/href",e),a},_enableRemoval(t){var e=this.findView(t),i=e.getBBox().width-this.getBBox().width,o=this.getPorts(),s=!1,r=!1;o.forEach(t=>{"out"==t.group&&(r=!0),"in"==t.group&&(s=!0)}),i=s&&r?-i/2:r?-i:0;var a=new joint.elementTools.Remove({focusOpacity:.5,rotate:!0,x:"100%",offset:{x:i,y:0}}),n=new joint.dia.ToolsView({name:"basic-tools",tools:[a]});e.addTools(n),e.hideTools()},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("debug")?this.get("name")+"["+this.get("blockId")+"]":this.get("name"),statusMessage:this.get("statusMsg"),status:this.get("status")};t+=this._recalculateRectWithLabel(".fb-label",e.name,.2,.6,e,t);var i=t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t);t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t),this._recalculateValidationRect(".fb-validation",.2,.15,e,i)}},{}),o.shapes.flowblocks.BlockView=o.dia.ElementView.extend({initialize:function(){o.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-update",(function(){this.update(),this.resize()}))}}),this.View=o.shapes.flowblocks.BlockView}createBlank(t,e,i,o){var s={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement};if(s[e]){var r=s[e].call(this,"",i);return r.set("blockId",t),r.style(o),r._recalculateStatus(),r}throw new Error("Unsuported template: "+e)}_createBaseOptions(){return{position:this.options.defaultPosition,size:this.options.defaultSize,ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"}}},out:{attrs:{".port-body":{fill:"#E74C3C"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}}}createSplitElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["in1"],o.outPorts=["out1","out2"],new this.Model(o)}createJoinElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["in1","in2"],o.outPorts=["out1"],new this.Model(o)}createPassThroughElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["in1"],o.outPorts=["out1"],new this.Model(o)}createStartElement(t,e,i){var o=this._createBaseOptions();return o.outPorts=["out1"],new this.Model(o)}createSinkElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["in1"],new this.Model(o)}}({})},function(t,e,i){const o=i(0),s=i(2);t.exports=new class{constructor(t){this.options={},this.graph={},this.paper={},this._blocks=[],Object.assign(this.options,t),this._initialize()}_initialize(){}create(t){return this.graph=new o.dia.Graph,this.paper=new o.dia.Paper({el:document.getElementById(t),width:1400,height:960,gridSize:1,model:this.graph,snapLinks:!0,linkPinning:!1,embeddingMode:!0,clickThreshold:5,defaultLink:new o.dia.Link({attrs:{".marker-target":{d:"M 10 0 L 0 5 L 10 10 z"},".connection":{stroke:"blue"},".marker-source":{d:"M 15 0 L 0 5 L 15 15 z",opacity:"0",stroke:"orange"},'.marker-arrowhead[end="source"]':{fill:"red",d:"M 10 0 L 0 5 L 10 10 z",opacity:"0"}}}),defaultConnectionPoint:{name:"boundary"},highlighting:{default:{name:"stroke",options:{padding:6}},embedding:{name:"addClass",options:{className:"highlighted-parent"}}},validateEmbedding:function(t,e){return e.model instanceof o.shapes.devs.Coupled},validateConnection:function(t,e,i,o,s,r){t.model;var a=!!i.model.freePorts("in").find(t=>t.id==o.getAttribute("port"));return e!=o&&"in"==o.getAttribute("port-group")&&t!=i&&a},validateMagnet:function(t,e,i){return"passive"!=e.getAttribute("magnet")&&t.model.freePorts("out").length>0}}),joint.dia.Link.prototype.toolMarkup=['<g class="link-tool">','<g class="tool-remove" event="remove">','<circle r="11" />','<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',"<title>Remove link.</title>","</g>","</g>"].join(""),this._bindConnectionEvents(),this._bindToolsEvents(),this}_bindToolsEvents(){this.paper.on("element:mouseenter",(function(t){t.showTools()})),this.paper.on("element:mouseleave",(function(t){t.hideTools()}))}_bindConnectionEvents(){var t=this;this.paper.on("link:connect",(function(e,i,o,r,a){var n=s.linkGetParticipants(e.model,t),l=n.sourceElement,c=n.targetElement,h=n.sourcePort,d=n.targetPort;o.model,r.getAttribute("port");l._handleConnectTo(c,h,d,e.model.id),c._handleConnectFrom(l,d,h,e.model.id)})),this.paper.on("link:disconnect",(function(e,i,o,r,a){var n=s.linkGetParticipants(e.model,t),l=n.sourceElement,c=o.model,h=(n.targetPort,n.sourcePort);n.targetElement;null!=c&&null!=l&&(l._handleDisconnect(c,h,e.model.id),c._handleDisconnect(l,r.getAttribute("port"),e.model.id))})),this.graph.on("remove",(function(e){if(e.isLink()){var i=s.linkGetParticipants(e,t),o=i.sourceElement,r=i.targetElement,a=i.sourcePort,n=i.targetPort;null!=r&&null!=o&&(o._handleDisconnect(r,a,e.id),r._handleDisconnect(o,n,e.id))}else{var l=e;t._blocks=t._blocks.filter(t=>t.id!=l.id),t._blocks.forEach(t=>{t._handleDelete(l)})}}))}addBlock(t){this._blocks.push(t),this.graph.addCell(t),t._enableRemoval(this.paper)}enablePanAndZoom(t){var e=t(document.querySelector("[joint-selector=svg]"),{fit:!1,panEnabled:!1,controlIconsEnabled:!0,center:!1,dblClickZoomEnabled:!1,minZoom:.3});this.paper.on("blank:pointerdown",(function(t,i,o){e.enablePan()})),this.paper.on("cell:pointerup blank:pointerup",(function(t,i){e.disablePan()}))}validate(){var t=!0,e=[];return this._blocks.forEach(i=>{var o=i.getStatus();o.valid||e.push({blockId:i.get("blockId"),errors:o.errors}),t=t&&o.valid}),{valid:t,errorBlocks:e}}}({})},function(t,e,i){const o=i(0),s=i(1);t.exports=new class{constructor(t){this.options={size:s.TOOLBAR.SIZE,padding:s.TOOLBAR.PADDING,rowPadding:s.TOOLBAR.ROW_PADDING},this.graph={},this.paper={},this._items=[],Object.assign(this.options,t),this._initialize()}_initialize(){}create(t){return this.graph=new o.dia.Graph,this.paper=new o.dia.Paper({el:document.getElementById(t),width:this.options.size.width,height:this.options.size.height,gridSize:1,model:this.graph,background:{color:"transparent"},interactive:{addLinkFromMagnet:!1,elementMove:!1},snapLinks:!1,linkPinning:!1,embeddingMode:!1,clickThreshold:5,defaultConnectionPoint:{name:"boundary"},validateConnection:function(t,e,i,o,s,r){return!1}}),this._bindEvents(),this}addItem(t){this._resizeItem(t),this._items.push(t),this.graph.addCell(t),console.log("Reposition after: ",t.get("_type")),this._repositionItems()}_resizeItem(t){var e=this.options.size.width,i=2*this.options.padding.x,o=e-(i*=1.2);t.set("size",{width:o,height:o})}_bindEvents(){this.paper.on("element:pointerdblclick",(function(t,e){var i=t.model.get("_type");console.log("DBLClicked ",i)}))}_repositionItems(){var t={x:20,y:20};this._items.forEach(e=>{var i=e.findView(this.paper),o={x:t.x,y:t.y+i.getBBox().height/6};e.set("position",o),t={x:o.x,y:o.y+i.getBBox().height}})}}({})},function(t,e,i){const o=i(0),s=i(1);t.exports=new class{constructor(t){this.options={defaultSize:s.SIZE,defaultPosition:s.POSITION,defaultPositionDelta:s.POSITION_DELTA},this.Model={},this.View={},Object.assign(this.options,t),this._initialize()}_initialize(){o.shapes.flowblocks.toolbar={},this.Model=o.shapes.devs.Model.define("flowblocks.toolbar.BlockToolbarItem",{name:"",icon:"./resources/img/svg/agave.svg",debug:!0,_style:void 0,_defaultStyle:s.STYLE,_styles:s.STYLES,_type:void 0,attrs:{rect:{fill:"rgb(211, 55, 255)"},body:{fill:"#ffffff",stroke:"#000000"},link:{refWidth:"100%",refHeight:"100%",xlinkShow:"new",cursor:"pointer"},".status-err":{refHeight:"25%",fill:"rgb(204, 41, 0)",refY:"75%"},".fb-icon-rect":{"ref-width":"100%",fill:"#3DB5FF"},".fb-icon-image":{ref:".fb-icon-rect"},".fb-status-rect":{"ref-width":"100%",fill:"rgb(209, 226, 208)"},".fb-status-text":{ref:".fb-status-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-label-rect":{"ref-width":"100%",fill:"rgb(255, 230, 206)"},".fb-validation-rect":{fill:"#d63031"},".fb-label-text":{ref:".fb-label-rect","text-anchor":"start",fill:"black","y-alignment":"middle"},".fb-tool-label-text":{"text-anchor":"start",fill:"black","y-alignment":"middle"}}},{markup:['<g class="rotatable">','<rect class="body"/>','<rect class="fb-icon-rect"/>','<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />','<rect class="fb-label-rect"/>','<text class="fb-label-text">Label</text>','<rect class="fb-status-rect"/>','<text class="fb-tool-label-text"></text>',"</g>"].join(""),initialize:function(){this.on("change:name change:icon change:status change:statusMsg change:size",(function(){this._updateMyModel(),this.trigger("flowblocks-block-toolbar-item-update")}),this),this._updateMyModel(),o.shapes.devs.Model.prototype.initialize.apply(this,arguments)},style(t){if(t)if("string"==typeof t||t instanceof String){var e=this.get("_styles")[t.toLocaleLowerCase()];e&&this.style(e)}else this.set("_style",t),t.icon&&this.set("icon",t.icon),t.bodyColor&&this.attr(".fb-icon-rect/fill",t.bodyColor),t.titleBarColor&&this.attr(".fb-label-rect/fill",t.titleBarColor),t.statusBarColor&&this.attr(".fb-status-rect/fill",t.statusBarColor),t.portInColor&&this.getPorts().forEach(e=>{"in"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portInColor)}),t.portOutColor&&this.getPorts().forEach(e=>{"out"==e.group&&this.portProp(e.id,"attrs/circle/fill",t.portOutColor)});else this.style(this.get("_defaultStyle"))},_recalculateRectWithLabel:function(t,e,i,o,s,r){this.get("attrs");var a=i*s.height,n=o*a,l=r+a/2,c=.1*s.width;return this.attr(t+"-rect/height",a),this.attr(t+"-rect/transform","translate(0,"+r+")"),this.attr(t+"-text/font-size",n),this.attr(t+"-text/transform","translate("+c+","+l+")"),this.attr(t+"-text/text",e),a},_recalculateToolLabel:function(t,e,i,o){var r=i.height*s.TOOLBAR.FONT.SIZE,a=o+r;console.log(t,r,0,a,e),this.attr(t+"-text/font-size",r),this.attr(t+"-text/transform","translate(0,"+a+")"),this.attr(t+"-text/text",e),this.attr(t+"-text/font-family",s.TOOLBAR.FONT.FAMILY),this.attr(t+"-text/font-weight",s.TOOLBAR.FONT.WEIGHT)},_recalculateValidationRect:function(t,e,i,o,s){this.get("attrs");var r=e*o.height,a=(1-i)*o.width,n=i*o.width;return this.attr(t+"-rect/height",r),this.attr(t+"-rect/width",n),this.attr(t+"-rect/transform","translate("+a+","+s+")"),this.attr(t+"-rect/title","Block validation state: "+this.get("status")),r},_recalculateRectWithIcon:function(t,e,i,o,s,r){var a=i*s.height;this.attr(t+"-rect/height",a),this.attr(t+"-rect/transform","translate(0,"+r+")");var n=o*a,l=s.width/2-n/2,c=r+a/2-n/2;return this.attr(t+"-image/height",n),this.attr(t+"-image/transform","translate("+l+","+c+")"),this.attr(t+"-image/href",e),a},_updateMyModel:function(){var t=0,e={width:this.get("size").width,height:this.get("size").height,icon:this.get("icon"),name:this.get("name"),statusMessage:this.get("statusMsg"),status:this.get("status")};t+=this._recalculateRectWithLabel(".fb-label","Block",.2,.6,e,t);t+=this._recalculateRectWithIcon(".fb-icon",e.icon,.6,.8,e,t);t+=this._recalculateRectWithLabel(".fb-status",e.statusMessage,.2,.3,e,t),this._recalculateToolLabel(".fb-tool-label",e.name,e,t)}},{}),o.shapes.flowblocks.toolbar.BlockToolbarItemView=o.dia.ElementView.extend({initialize:function(){o.dia.ElementView.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"flowblocks-block-toolbar-item-update",(function(){this.update(),this.resize()}))}}),this.View=o.shapes.flowblocks.toolbar.BlockToolbarItemView}createBlank(t,e,i){var o={PassThrough:this.createPassThroughElement,Start:this.createStartElement,Split:this.createSplitElement,Join:this.createJoinElement,End:this.createSinkElement};if(o[t]){var s=o[t].call(this,"",e);return s.style(i),s}throw new Error("Unsuported template: "+t)}_createBaseOptions(){return{position:this.options.defaultPosition,size:this.options.defaultSize,ports:{groups:{in:{attrs:{".port-body":{fill:"#16A085",magnet:"passive"},".port-label":{display:"none"}}},out:{attrs:{".port-body":{fill:"#E74C3C",magnet:"passive"},".port-label":{display:"none"}}}}},attrs:{".label":{text:"Model","ref-x":.5,"ref-y":.2},rect:{fill:"#2ECC71"}}}}createSplitElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["i1"],o.outPorts=["o1","o2"],new this.Model(o)}createJoinElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["i1","i2"],o.outPorts=["o1"],new this.Model(o)}createPassThroughElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["i1"],o.outPorts=["o1"],new this.Model(o)}createStartElement(t,e,i){var o=this._createBaseOptions();return o.outPorts=["o1"],new this.Model(o)}createSinkElement(t,e,i){var o=this._createBaseOptions();return o.inPorts=["i1"],new this.Model(o)}}({})}])}));