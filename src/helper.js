const jointjs = require("jointjs")

class Helper {
    linkGetParticipants(cellLink, flow) {
        if (cellLink.isLink()) {
            var sourceElement = flow.graph.getCell(cellLink.get('source').id);
            var sourcePort = cellLink.get('source').port;
            var targetElement = flow.graph.getCell(cellLink.get('target').id);
            var targetPort = cellLink.get('target').port;
            return {
                sourceElement: sourceElement,
                sourcePort: sourcePort,
                targetElement: targetElement,
                targetPort: targetPort
            }
        }
    }
    getElementByClass(className) {
        if (document) {
            var elements = document.getElementsByClassName(className);
            if (elements.length > 0) {
                return elements[0];
            }
        }
    }

    downloadObjectAsJson(exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        if(document && document.body){
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
        
    }

}

module.exports = new Helper({});