var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({

    el: document.getElementById('paper'),
    width: 1200,
    height: 800,
    gridSize: 1,
    model: graph,
    snapLinks: true,
    linkPinning: false,
    embeddingMode: true,
    clickThreshold: 5,
    defaultLink: new joint.dia.Link({
        attrs: {
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
          '.connection' : { stroke: 'blue' },
          '.marker-source': { d: 'M 15 0 L 0 5 L 15 15 z', opacity: '0', stroke: 'orange' },
          '.marker-arrowhead[end="source"]': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z', opacity: '0' }
        }    
      }),
    defaultConnectionPoint: { name: 'boundary' },
    highlighting: {
        'default': {
            name: 'stroke',
            options: {
                padding: 6
            }
        },
        'embedding': {
            name: 'addClass',
            options: {
                className: 'highlighted-parent'
            }
        }
    },

    validateEmbedding: function(childView, parentView) {
        return parentView.model instanceof joint.shapes.devs.Coupled;
    },

    validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
        return sourceMagnet != targetMagnet;
    }
});

joint.dia.Link.prototype.toolMarkup = [
    '<g class="link-tool">',
    '<g class="tool-remove" event="remove">',
    '<circle r="11" />',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',
    '<title>Remove link.</title>',
    '</g>',
    '</g>' // <-- missing
].join('');