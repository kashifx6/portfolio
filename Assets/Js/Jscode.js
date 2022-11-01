
  //for canvas
  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  let canvas;

  class Point {
    constructor(props = {}) {
      this.x = props.x || 0;
      this.y = props.y || 0;
      this.r = props.r || 2;

      this.range = props.range || 100;
      this.speed = props.speed || 3;

      this.canvas = props.canvas;
      this.c = this.canvas.getContext("2d");

      this.direction = this.getRandomDirection();
    }
    /**/
    getRandomDirection() {
      let x = Math.random() > 0.5 ? 1 : -1;
      let y = Math.random() > 0.5 ? 1 : -1;
      return { x, y };
    }
    /**/
    draw() {
      if (!this.c) throw new Error("No canvas provided.");

      this.c.beginPath();
      this.c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.c.fillStyle = "rgba(29, 26, 26, 1)";
      this.c.fill();
      this.c.closePath();
    }
    /*
     * Check if the cursor or any point is within it's range.
     *
     * @params {number} x The x position to compare.
     * @params {number} y The y position to compare.
     *
     * @return {JSON} Object containing the alpha value to stroke the line that
     * conects points and hp with is the distance between the point and the (x,y)
     * point passed as parameter.
     */
    checkRange(x, y) {
      let res = {};
      let val1 = x <= this.x + this.range && x >= this.x - this.range;
      let val2 = y <= this.y + this.range && y >= this.y - this.range;

      if (val1 && val2) {
        let op = y - this.y;
        let ad = x - this.x;
        res.hp = Math.sqrt(Math.pow(op, 2) + Math.pow(ad, 2));

        if (res.hp <= this.range) {
          res.alpha = res.hp / this.range >= 1 ? 1 : res.hp / this.range;

          this.c.beginPath();
          this.c.moveTo(this.x, this.y);
          this.c.lineTo(x, y);
          this.c.strokeStyle = `rgba(29, 26, 26, ${1 - res.alpha})`;
          this.c.stroke();
          this.c.fill();
          this.c.closePath();
        }
      }

      return res;
    }
    /**/
    move() {
      let x = 0.1 * this.speed * this.direction.x;
      let y = 0.1 * this.speed * this.direction.y;

      this.x += x;
      this.y += y;
      // Bounce
      if (this.x + this.r >= this.canvas.width || this.x - this.r <= 0) {
        this.x -= x;
        this.direction.x *= -1;
      }

      if (this.y + this.r >= this.canvas.height || this.y - this.r <= 0) {
        this.y -= y;
        this.direction.y *= -1;
      }
    }
  }
  /*
   *
   */
  class Env {
    constructor(props = {}) {
      this.pointsCount = props.pointsCount || 25;
      this.canvas = props.canvas;
      this.points = [];
      this.mouse = { x: undefined, y: undefined };
      this.speed = props.speed || 3;

      if (this.canvas) {
        this.c = this.canvas.getContext("2d");
        this.canvas.onmousemove = this.trackMouse.bind(this);
        this.init();
      }
    }
    /**/
    repaint() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawPoints();

      requestAnimationFrame(this.repaint.bind(this));
    }
    /*
     * Creates the Points objects.
     *
     * @fires this.repaint.
     */
    init() {
      for (let i = this.pointsCount; i > 0; i--) {
        let x = Math.random() * this.canvas.width;
        let y = Math.random() * this.canvas.height;

        let p = new Point({
          x,
          y,
          canvas: this.canvas,
          speed: this.speed,
        });

        this.points.push(p);
      }
      this.repaint();
    }
    /**/
    drawPoints() {
      for (let a = this.points.length - 1; a >= 0; a--) {
        let point = this.points[a];

        point.checkRange(this.mouse.x, this.mouse.y);
        point.draw();
        point.move();

        for (let e = a; e >= 0; e--) {
          let prevPoint = this.points[e];
          let isInRange = point.checkRange(prevPoint.x, prevPoint.y);
        }
      }
    }
    /**/
    trackMouse(ev) {
      this.mouse.x = ev.offsetX;
      this.mouse.y = ev.offsetY;
    }
  }

  document.addEventListener("DOMContentLoaded", (ev) => {
    canvas = document.getElementById("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.onresize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let env1 = new Env({
      canvas,
      pointsCount: 50,
      speed: 7,
    });
  });
  //back to top button
  $(function () {
    //Scroll event
    $(window).scroll(function () {
      var scrolled = $(window).scrollTop();
      if (scrolled > 200) $(".go-top").fadeIn("slow");
      if (scrolled < 200) $(".go-top").fadeOut("slow");
    });

    //Click event
    $(".go-top").click(function () {
      $("html, body").animate({ scrollTop: "0" }, 500);
    });
  });

  // for active class
  $(document).ready(function () {
    $("ul li a").click(function () {
      $("li a").removeClass("active");
      $(this).addClass("active");
    });
  });
