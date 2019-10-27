class CheckerboardPainter {
    paint(ctx, geom, properties) {
      // Use `ctx` as if it was a normal canvas
      const colors = ["black", "white", "yellow", "orange"];
      const size = 32;
      for (let y = 0; y < geom.height / size; y++) {
        for (let x = 0; x < geom.width / size; x++) {
          const color = colors[(x + y) % colors.length];
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.rect(x * size, y * size, size, size);
          ctx.fill();
        }
      }
    }
  }
  
  // Register our class under a specific name
  registerPaint("checkerboard", CheckerboardPainter);
  // registerPaint("myGradient", new_paint);
  



      // paint(ctx, size, properties) {
    //     var gradient = ctx.createLinearGradient(0, 0, 0, size.height / 3);
    
    //     gradient.addColorStop(0, "black");
    //     gradient.addColorStop(0.7, "rgb(210, 210, 210)");
    //     gradient.addColorStop(0.8, "rgb(230, 230, 230)");
    //     gradient.addColorStop(1, "white");
    
    //     ctx.fillStyle = gradient;
    //     ctx.fillRect(0, 0, size.width, size.height / 3);
    // }


// tooltip

registerPaint('tooltip', class Bubble {

  static get inputProperties() {
    return [
      'display',
      'background-color',
      'border-image-slice',
      '--tooltip-position',
      '--tooltip-size',
      '--border-slice-width',
      '--tooltip-placement'
    ];
  }

  paint(ctx, geom, props, args) {
    console.log('Prop :', props);
    const color = props.get('background-color').toString();
    const positionPercent = props.get('--tooltip-position').toString().replace('%', '') * 1;
    const h_position = geom.width * positionPercent / 100;
    const v_position = geom.height * positionPercent / 100;
    const size = props.get('--tooltip-size').toString().replace('px', '') * 1;
    const placement = props.get('--tooltip-placement').toString().trim();
    const tip_position = props.get('border-image-slice').toString();
    const display = props.get('display').toString();
    // var declaration = document.styleSheets[0].rules[0].style;

    switch(placement) {
      case 'left':
        ctx.beginPath();
        ctx.moveTo(geom.width, v_position - size);
        ctx.lineTo(geom.width, v_position + size);
        ctx.lineTo(0, v_position);
        ctx.closePath();
        break;
      case "right":
        ctx.beginPath();
        ctx.moveTo(0, v_position - size);
        ctx.lineTo(0, v_position + size);
        ctx.lineTo(geom.width, v_position);
        ctx.closePath();
        break;
      
      case "top":
        ctx.beginPath();

        ctx.moveTo(h_position - size, geom.height);
        ctx.lineTo(h_position + size, geom.height);
        ctx.lineTo(h_position, 0)
        
        ctx.closePath();
        break;
      
      case "bottom":
      default:
          ctx.beginPath();
          ctx.moveTo(h_position - size, 0);
          ctx.lineTo(h_position + size, 0);
          ctx.lineTo(h_position, geom.height);
          ctx.closePath();
    }

    // fill
    ctx.fillStyle = color;
    ctx.fill();
    
  }

})

// Chebox
registerPaint('checkbox', class check {
  static get inputProperties() {
    return ['--checkbox-color'];
    // return ['--checkbox-color', '--edge'];
  }

  paint(ctx, size, props) {
    const color = props.get('--checkbox-color');

    const x = 0;
    const y = 0;
    const finalX = size.width;
    const finalY = size.height;


    // const edge = props.get('--edge');
    // const x = edge;
    // const y = edge;
    // const finalX = size.width - edge;
    // const finalY = size.height - edge;

    ctx.lineWidth = 4;
    // ctx.strokeStyle = color.toString();

    // top left to bottom right
    ctx.beginPath()
    ctx.moveTo(x, y);
    ctx.lineTo(finalX, finalY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(finalX, y);
    ctx.lineTo(x, finalY);
    ctx.stroke();
  }
})


// Rough border

class RoughDrawable {
  constructor(propertyNames) {
    this._fields = {};
    this._dirty = false;
    this._canvas = null;
    this.z = 0;
    this.roughness = 0;
    this.bowing = 1;
    this._stroke = null;
    this._strokeWidth = null;

    this._fill = null;
    this._fillStyle = null;
    this._fillWeight = null;
    this._hachureAngle = null;
    this._hachureGap = null;

    this.maxRandomnessOffset = 1;
    this._curveTightness = 0;
  }
  getOffset(min, max) {
    return this.roughness * ((Math.random() * (max - min)) + min);
  }
  drawLine(ctx, x1, y1, x2, y2, existingPath) {
    let lengthSq = Math.pow((x1 - x2), 2) + Math.pow((x1 - x2), 2);
    let offset = this.maxRandomnessOffset || 0;
    if (offset * offset * 100 > lengthSq) {
      offset = Math.sqrt(lengthSq) / 10;
    }
    let halfOffset = offset / 2;
    let divergePoint = 0.2 + Math.random() * 0.2;
    // Midpoint displacement value to give slightly bowed lines.
    let midDispX = this.bowing * this.maxRandomnessOffset * (y2 - y1) / 200;
    let midDispY = this.bowing * this.maxRandomnessOffset * (x1 - x2) / 200;
    midDispX = this.getOffset(-midDispX, midDispX);
    midDispY = this.getOffset(-midDispY, midDispY);

    if (!existingPath) {
      ctx.beginPath();
    }
    ctx.moveTo(x1 + this.getOffset(-offset, offset), y1 + this.getOffset(-offset, offset));
    ctx.bezierCurveTo(midDispX + x1 + (x2 - x1) * divergePoint + this.getOffset(-offset, offset),
      midDispY + y1 + (y2 - y1) * divergePoint + this.getOffset(-offset, offset),
      midDispX + x1 + 2 * (x2 - x1) * divergePoint + this.getOffset(-offset, offset),
      midDispY + y1 + 2 * (y2 - y1) * divergePoint + this.getOffset(-offset, offset),
      x2 + this.getOffset(-offset, offset),
      y2 + this.getOffset(-offset, offset));
    if (!existingPath) {
      ctx.stroke();
    }
    if (!existingPath) {
      ctx.beginPath();
    }
    ctx.moveTo(x1 + this.getOffset(-halfOffset, halfOffset), y1 + this.getOffset(-halfOffset, halfOffset));
    ctx.bezierCurveTo(midDispX + x1 + (x2 - x1) * divergePoint + this.getOffset(-halfOffset, halfOffset),
      midDispY + y1 + (y2 - y1) * divergePoint + this.getOffset(-halfOffset, halfOffset),
      midDispX + x1 + 2 * (x2 - x1) * divergePoint + this.getOffset(-halfOffset, halfOffset),
      midDispY + y1 + 2 * (y2 - y1) * divergePoint + this.getOffset(-halfOffset, halfOffset),
      x2 + this.getOffset(-halfOffset, halfOffset),
      y2 + this.getOffset(-halfOffset, halfOffset));
    if (!existingPath) {
      ctx.stroke();
    }
  }
}
class RoughRectangle extends RoughDrawable {
  constructor(x, y, width, height) {
    super(['x', 'y', 'width', 'height']);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    let left = this.x;
    let right = this.x + this.width;
    let top = this.y;
    let bottom = this.y + this.height;

    if (this.fill) {
      this._doFill(ctx, left, right, top, bottom);
    }

    ctx.save();
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWidth;
    this.drawLine(ctx, left, top, right, top);
    this.drawLine(ctx, right, top, right, bottom);
    this.drawLine(ctx, right, bottom, left, bottom);
    this.drawLine(ctx, left, bottom, left, top);
    ctx.restore();
  }
  _doFill(ctx, left, right, top, bottom) {
    var fillStyle = this.fillStyle || "hachure";
    switch (fillStyle) {
      case "solid": {
        ctx.save();
        ctx.fillStyle = this.fill;
        let o = this.maxRandomnessOffset || 0;
        var points = [
          [left + this.getOffset(-o, o), top + this.getOffset(-o, o)],
          [right + this.getOffset(-o, o), top + this.getOffset(-o, o)],
          [right + this.getOffset(-o, o), bottom + this.getOffset(-o, o)],
          [left + this.getOffset(-o, o), bottom + this.getOffset(-o, o)]
        ];
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.lineTo(points[3][0], points[3][1]);
        ctx.fill();
        ctx.restore();
        break;
      }
      default: {
        let xc = [left, right, right, left];
        let yc = [top, top, bottom, bottom];
        this.hachureFillShape(ctx, xc, yc);
        break;
      }
    }
  }
}

registerPaint('rough-boxes', class {

  static get inputProperties() {
    return [
      '--rough-fill',
      '--rough-stroke-width',
      '--rough-stroke',
      '--rough-roughness'
    ]
  }

  paint(ctx, geom, properties) {
    const padding = 10;
    var rect = new RoughRectangle(padding, padding, geom.width - padding * 2, geom.height - padding * 2);
    rect.roughness = properties.get('--rough-roughness').toString();
    rect.fillStyle = "solid";
    rect.fill = properties.get('--rough-fill').toString();
    rect.stroke = properties.get('--rough-stroke').toString();
    rect.strokeWidth = properties.get('--rough-stroke-width').toString().replace('px', '');
    rect.draw(ctx);

  }

})