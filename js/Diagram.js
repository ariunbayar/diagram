define(function(require){


    'use strict';


    var Box = require('./Box');
    var Line = require('./Line');
    var Canvas = require('./Canvas');
    var _ = require('./lodash.min');


    function Diagram(config) {

        this.width = config.width;
        this.height = config.height;

        this.textColor = config.textColor;
        this.fillColor = config.fillColor;
        this.highlightColor = config.highlightColor;
        this.lineColor = config.lineColor;
        this.outlineColor = config.outlineColor;
        this.backgroundColor = config.backgroundColor;

        this.cornerRadius = config.cornerRadius;

        this.outlineWidth = 2;
        this.borderWidth = 4;

        this.shapes = [];
        this.canvas = null;

    }


    Diagram.prototype.initialize = function initialize() {

        this.canvas = new Canvas(this.width, this.height, this.backgroundColor, document.querySelector('.diagram'));

        var createBox = (function(x, y, text){

            var config = {
                x           : x,
                y           : y,
                width       : 100,
                height      : 60,
                radius      : this.cornerRadius,
                fillColor   : this.fillColor,
                highlightColor: this.highlightColor,
                borderWidth : this.borderWidth,
                borderColor : this.lineColor,
                outlineWidth: this.outlineWidth,
                outlineColor: this.outlineColor,
                color       : this.textColor,
                zoom        : 1,
                text        : text,
                fontWeight  : 300,
                fontFamily  : 'Fira Sans Extra Condensed',
                fontSize    : 12,
                lineHeight  : 1.2,
                padding     : 10,
            };

            return new Box(config);
        }).bind(this);


        var createLine = (function(box1, box2){

            var config = {
                box1        : box1,
                box2        : box2,
                width       : this.borderWidth,
                color       : this.lineColor,
                outlineWidth: this.outlineWidth,
                outlineColor: this.outlineColor,
            };

            return new Line(config);

        }).bind(this);

        var box1 = createBox(10, 10, 'Hello');
        var box2 = createBox(200, 100, 'World');

        var line = createLine(box1, box2);

        this.canvas.addShape(box1);
        this.canvas.addShape(box2);
        this.canvas.addShape(line);
        this.canvas.draw();

        this.shapes.push(box1, box2, line);

    }


    Diagram.prototype.toJSON = function toJSON() {

        var data = {
            boxes: [],
            connections: [],
        };

        _.each(this.shapes, function(shape){

            if (shape instanceof Box) {
                data.boxes.push(shape.toJSON());
            } else if (shape instanceof Line) {
                data.connections.push(shape.toJSON());
            }

        });

        return JSON.stringify(data);

    }


    Diagram.prototype.fromJSON = function fromJSON(data) {

        var values;

        try {
            values = JSON.parse(data);
        } catch (e) {
            console.error('Invalid diagram data!');
            return false;
        }

        // initialize a new canvas
        var container = document.querySelector('.diagram');
        container.removeChild(this.canvas.canvas);
        this.canvas = new Canvas(this.width, this.height, this.backgroundColor, container);

        var createBox = (function(values){

            var config = {
                x           : values.x,
                y           : values.y,
                width       : values.width,
                height      : values.height,
                radius      : this.cornerRadius,
                fillColor   : this.fillColor,
                highlightColor: this.highlightColor,
                borderWidth : this.borderWidth,
                borderColor : this.lineColor,
                outlineWidth: this.outlineWidth,
                outlineColor: this.outlineColor,
                color       : this.textColor,
                zoom        : 1,
                text        : values.text,
                fontWeight  : 300,
                fontFamily  : 'Fira Sans Extra Condensed',
                fontSize    : 12,
                lineHeight  : 1.2,
                padding     : 10,
            };

            return new Box(config);
        }).bind(this);


        var createLine = (function(box1, box2){

            var config = {
                box1        : box1,
                box2        : box2,
                width       : this.borderWidth,
                color       : this.lineColor,
                outlineWidth: this.outlineWidth,
                outlineColor: this.outlineColor,
            };

            return new Line(config);

        }).bind(this);


        var boxes = {};

        _.each(values.boxes, (function(box){
            boxes[box.id] = createBox(box);
            this.canvas.addShape(boxes[box.id]);
            this.shapes.push(boxes[box.id]);
        }).bind(this));

        _.each(values.connections, (function(connection){
            var line = createLine(boxes[connection.src], boxes[connection.dst]);
            this.canvas.addShape(line);
            this.shapes.push(line);
        }).bind(this));

        this.canvas.draw();

    }


    return Diagram;

});
