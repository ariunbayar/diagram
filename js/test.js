require(['js/Diagram'], function(Diagram) {

    'use strict';

    var config = {
        width: 1200,
        height: 600,
        cornerRadius: 12,
        fillColor: '#ffffff',
        highlightColor: '#e3f2fd',
        lineColor: '#595d59',
        textColor: '#595d59',
        outlineColor: '#ffffff',
        backgroundColor: '#595d59',
    };

    var d = new Diagram(config);
    d.initialize();

    document.querySelector('#save-diagram').addEventListener('click', function(e){
        document.querySelector('textarea').value = d.toJSON();
    });

    document.querySelector('#load-diagram').addEventListener('click', function(e){
        d.fromJSON(document.querySelector('textarea').value);
    });

});
