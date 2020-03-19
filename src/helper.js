const jointjs = require("jointjs")

class Helper {
    linkGetParticipants(cellLink, flow){
        if(cellLink.isLink()){
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
    getElementByClass(className){
        if(document){
            var elements = document.getElementsByClassName(className);
            if(elements.length>0){
                return elements[0];
            }
        }
    }

}

module.exports = new Helper({});