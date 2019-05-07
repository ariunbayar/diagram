define(function(require){

    'use strict';

    var Toolset = {

        rectRounded: function rectRounded(x, y, w, h, r) {

            var p = new Path2D();
            p.moveTo(x + r, y);
            p.lineTo(x + w - r, y);
            p.quadraticCurveTo(x + w, y, x + w, y + r);
            p.lineTo(x + w, y + h - r);
            p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            p.lineTo(x + r, y + h);
            p.quadraticCurveTo(x, y + h, x, y + h - r);
            p.lineTo(x, y + r);
            p.quadraticCurveTo(x, y, x + r, y);
            return p;

        },

        circle: function circle(ctx, x, y, radius, color, borderWidth, borderColor) {

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

            if (color) {
                ctx.fillStyle = color;
                ctx.fill();
            }

            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();

        },

        text: function text(ctx, text, x, y, color, font, maxWidth, lineHeight) {

            ctx.font = font;
            ctx.fillStyle = color;
            ctx.textBaseline = 'top';

            var paragraphs = text.split('\n');
            for (var i = 0; i < paragraphs.length; i++) {
                var words = paragraphs[i].split(' ');
                var line = '';

                y += i ? lineHeight : 0;

                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        ctx.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y);
            }

        },

        isOverlappingRect: function isOverlappingRect(box1, box2) {

            return (
                box1.x               < box2.x + box2.width  &&
                box1.x + box1.width  > box2.x               &&
                box1.y               < box2.y + box2.height &&
                box1.y + box1.height > box2.y
            );

        },

        isAtBelow: function isAtBelow(box1, box2) {

            return box1.y + box1.height < box2.y;

        },

        isAtRight: function isAtRight(box1, box2) {

            return box1.x + box1.width < box2.x;

        },

    }

    return Toolset;

});
