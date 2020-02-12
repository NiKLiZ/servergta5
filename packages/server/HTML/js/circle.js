var GUI, RadialNav, animate, describeArc, describeSector, gui, iconsPath, polarToCartesian, random, toggleContext;
iconsPath = (window.cdn ? window.cdn : "http://localhost:7896")+'/img/icons/sprite.svg';
Snap.plugin(function(Snap, Element) {
  return Element.prototype.hover = function(f_in, f_out, s_in, s_out) {
    return this.mouseover(f_in, s_in).mouseout(f_out || f_in, s_out || s_in);
  };
});

polarToCartesian = function(cx, cy, r, angle) {
  angle = (angle - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  };
};

describeArc = function(x, y, r, startAngle, endAngle, continueLine, alter) {
  var end, start;
  start = polarToCartesian(x, y, r, startAngle %= 360);
  end = polarToCartesian(x, y, r, endAngle %= 360);
  return "" + (continueLine ? 'L' : 'M') + start.x + " " + start.y + " A" + r + " " + r + ", 0, " + (endAngle - startAngle >= 180 ? 1 : 0) + ", " + (alter ? 0 : 1) + ", " + end.x + " " + end.y;
};

describeSector = function(x, y, r, r2, startAngle, endAngle) {
  return (describeArc(x, y, r, startAngle, endAngle)) + " " + (describeArc(x, y, r2, endAngle, startAngle, true, true)) + "Z";
};

random = function(min, max) {
  return Math.random() * (max - min) + min;
};

animate = function(obj, index, start, end, duration, easing, fn, cb) {
  var ref;
  if ((ref = (obj.animation != null ? obj.animation : obj.animation = [])[index]) != null) {
    ref.stop();
  }
  return obj.animation[index] = Snap.animate(start, end, fn, duration, easing, cb);
};
var iconss ;
 
GUI = (function() {
  function GUI(buttons) {
    this.paper = Snap(window.innerWidth, window.innerHeight).addClass('circle');
    Snap.load(iconsPath, (function(_this) {
      return function(icons) {
        iconss = icons
        _this.nav = new RadialNav(_this.paper, buttons, icons);
        _this.nav.hide();
        return _this._bindEvents();
      };
    })(this));
  }

  GUI.prototype._bindEvents = function() {
    window.addEventListener('resize', (function(_this) {
      return function() {
        return _this.paper.attr({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
    })(this));
    return this.paper.node.addEventListener('mouseup', ()=>{
      this.nav.hide.bind(this.nav);
      // mp.trigger('hideRadialGui')
    })
  };

  return GUI;

})();

RadialNav = (function() {
  function RadialNav(paper, buttons, icons) {
    this.size = 575;
    this.area = paper.svg(0, 0, this.size, this.size).addClass('radialnav');
    this.c = this.size / 2;
    this.r = this.size * .30;
    this.r2 = this.r * 0.35;
    this.animDuration = 200;
    this.background = this.area.circle(this.c,this.c,this.r*0.30).addClass('radial').addClass('hide');
    this.container = this.area.g();
    this.container.transform("s0");
    this.icons = icons;
    this.updateButtons(buttons);
    this.gradientBorder = this.area.gradient("r(0,0,1)#fff-rgba(255,255,255,0):100");
    this.gradientBorder.node.setAttribute("gradientUnits","userSpaceOnUse");
    this.gradientBorder.node.setAttribute("gradientTransform",`translate(${this.size/2} ${this.size/2}) rotate(90) scale(${this.r})`);
    this.gradientBackground = this.area.gradient("r(0,0,1)#3C3C3C:36-rgba(60, 60, 60,0):100");
    this.gradientBackground.node.setAttribute("gradientUnits","userSpaceOnUse");
    this.gradientBackground.node.setAttribute("gradientTransform",`translate(${this.size/2} ${this.size/2}) rotate(90) scale(${this.r*2})`);
  }

  RadialNav.prototype._animateContainer = function(start, end, duration, easing) {
    return animate(this, 0, start, end, duration, easing, (function(_this) {
      return function(val) {
        return _this.container.transform("r" + (90 - 90 * val) + "," + _this.c + "," + _this.c + "s" + val + "," + val + "," + _this.c + "," + _this.c);
      };
    })(this));
  };

  RadialNav.prototype._animateButtons = function(start, end, min, max, easing) {
    var anim, el, i, ref, results;
    anim = (function(_this) {
      return function(i, el) {
        return animate(el, 0, start, end, random(min, max), easing, function(val) {
          return el.transform("r" + (_this.angle * i) + "," + _this.c + "," + _this.c + "s" + val + "," + val + "," + _this.c + "," + _this.c);
        });
      };
    })(this);
    ref = this.container;
    results = [];
    for (i in ref) {
      el = ref[i];
      if (!Number.isNaN(+i)) {
        results.push(anim(i, el));
      }
    }
    return results;
  };

  RadialNav.prototype._animateButtonHover = function(button, start, end, duration, easing, cb) {
    return animate(button, 1, start, end, duration, easing, ((function(_this) {
      return function(val) {
        return button[2];
      };
    })(this)), cb);
  };

  RadialNav.prototype._sector = function(i) {
    return this.area.path(describeSector(this.c	, this.c, this.r, this.r2, 0, this.angle)).attr({
      fill: this.gradientBackground,
      'stroke-width': 2,
    }).addClass('radialnav-sector');
  };

  RadialNav.prototype._icon = function(btn, icons) {
    let icon = icons.select("#" + btn.icon).addClass('radialnav-icon').clone();
    let bbox = icon.getBBox()
    icon.transform("T" + (this.c - (bbox).x - bbox.width / 2) + ", " + (this.c - bbox.y - this.r + this.r2 - bbox.height / 2 ) + 
    	" R" + (this.angle / 2) + "," + this.c + "," + this.c + "S.2");
    return icon;
  };

  RadialNav.prototype._hint = function(btn,i) {
  	//убрать
  	$('body').append(`<div class="hint_radial" id="hint_${i}">${btn.name}</div>`)
    let hint = $('#hint_'+i);
    hint.css('zIndex', -1)
    return hint;
  };

  RadialNav.prototype._border = function(btn) {
		return this.area.path(describeSector(this.c, this.c, 140, 150, 0, this.angle)).addClass('radialnav-border');
  };

  RadialNav.prototype._button = function(btn, sector, icon, hint) {
    return this.area.g(sector,icon).data('cb', btn).mouseup(function() {
      var base;
      if(btn.action) btn.action();
      let data = btn.data !== undefined ?  btn.data : '';
      if(btn.callremote) mp.trigger('CallRemote', btn.callremote,data);
      if(btn.callback) mp.trigger( btn.callback,typeof data == 'object' ? JSON.stringify(data) : data);
      if(!btn.group)mp.trigger('hideRadialGui')
      if(btn.group){
        let group = btn.group;
        radial_gui.nav.hide();
        radial_gui.nav.updateButtons(group)
        radial_gui.nav.show();

      }
      return typeof (base = this.data('cb')) === "function" ? base() : void 0;
    }).hover(function() {
      var el, j, len, ref, results;
      this[1] = icon;
      this[2] = hint;
      ref = [this[0], this[1],this[2]];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        el = ref[j];
        results.push(el.toggleClass('active'));
      }
      return results;
    }).hover(this._buttonOver(this), this._buttonOut(this));
  };

  RadialNav.prototype._buttonOver = function(nav) {
    let _this = this;
    return function() {
        this[0].attr({
          stroke: _this.gradientBorder,
          fill: _this.gradientBackground
        })
      nav._animateButtonHover(this, 0, 1, 200, mina.easeinout);
      return this[2].removeClass('hide');
    };
  };

  RadialNav.prototype._buttonOut = function(nav) {
    return function() {
      this[0].attr({
        stroke: "",
        fill: null
      })

      return nav._animateButtonHover(this, 1, 0, 2000, mina.elastic, (function() {
        return this.addClass('hide');
      }).bind(this[2]));
    };
  };

  RadialNav.prototype.updateButtons = function(buttons) {
    var btn, j, len, results;
    $('.hint_radial').remove()
    this.angle = 360 / buttons.length;
    let icons = this.icons;
    this.container.clear();
    results = [];
    for (j = 0, len = buttons.length; j < len; j++) {
      btn = buttons[j];
      results.push(this.container.add(this._button(btn, this._sector(j), this._icon(btn, icons), this._hint(btn,j),
      )));
    }
    return results;
  };

  RadialNav.prototype.show = function(e) {
    this.area.attr({
      x: window.innerWidth/2 - this.c,
      y: window.innerHeight/2 - this.c
    });
    $('.circle').show();
    this.background.removeClass('hide')
    $('.circle').css('zIndex', 999);
    $('.hint_radial').css('zIndex', 1000);
    this._animateContainer(0, 1, this.animDuration * 8, mina.elastic);
    return this._animateButtons(0, 1, this.animDuration, this.animDuration * 8, mina.elastic);
  };
  
  RadialNav.prototype.hide = function() {
    $('.circle').hide();
    $('.hint_radial').hide();
    $('.circle').css('zIndex', -1);
    $('.hint_radial').css('zIndex', -1);
    this._animateContainer(1, 0, this.animDuration, mina.easeinout);
    return this._animateButtons(1, 0, this.animDuration, this.animDuration, mina.easeinout);
  };

  return RadialNav;

})();

radial_gui = new GUI([
  {
    icon: 'hood-open',
    name: 'Показать водительские права',
    action: function() {
    }
  }, {
    icon: 'car',
    name: 'ON64654E',
    action: function() {
    }
  }, 
  {
    icon: 'door-key',
    name: '24654654',
    action: function() {
    }
  }, 
  {
    icon: 'hood-open',
    name: '1436546',
    action: function() {
    }
  }, 
  {
    icon: 'hood-open',
    name: '1436546',
    action: function() {
    }
  }, 
]);
