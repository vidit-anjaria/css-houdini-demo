class CheckerboardPainter {
    paint(ctx, geom, properties) {
      // Use `ctx` as if it was a normal canvas
      const colors = ["black", "red", "yellow", "orange"];
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

    // paint(ctx, size, properties) {
    //     var gradient = ctx.createLinearGradient(0, 0, 0, size.height / 3);
    
    //     gradient.addColorStop(0, "black");
    //     gradient.addColorStop(0.7, "rgb(210, 210, 210)");
    //     gradient.addColorStop(0.8, "rgb(230, 230, 230)");
    //     gradient.addColorStop(1, "white");
    
    //     ctx.fillStyle = gradient;
    //     ctx.fillRect(0, 0, size.width, size.height / 3);
    // }
  }
  
  // Register our class under a specific name
  registerPaint("checkerboard", CheckerboardPainter);
  // registerPaint("myGradient", new_paint);
  