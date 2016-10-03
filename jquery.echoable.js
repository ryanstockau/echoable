/*

 Echoable jQuery Plugin by Ryan Stock

 www.github.com/ryanstockau/echoable

 www.ryanstock.com.au

 */


;(function ( $, window, document, undefined ) {

	// Plugin Constructor

	var Echoable = function( elem, options ){
		var self = this;
		self.elem = elem;
		self.$elem = $(elem);
		self.options = options;

		// Allow options to be presented via HTML data-plugin-options attribute, eg:
		// <div class='item' data-plugin-options='{"message":"Goodbye World!"}'></div>
		self.metadata = self.$elem.data( 'plugin-options' );
	};


	// Plugin Prototype

	Echoable.prototype = {

		defaults: {
			echoableClass : 'echoable',
			clickable : true,
			clickTarget : 'click touchend',
			largeWidth : 400,
			triggerDelay : 40,
			animationDelay : 1000,
			largeClass : 'echoable-large'
		},

		init: function() {

			var self = this;

			// Add a data reference to this object
			self.$elem.data('echoable', self);

			// Set combined config
			self.config = $.extend({}, self.defaults, self.options, self.metadata);

			var $echos = $('<span class="echos" />');

			if ( self.$elem.is('span, a') ) {
				self.$elem.wrapInner( '<span class="echoable-content" />' );
			} else {
				self.$elem.wrapInner( '<div class="echoable-content" />' );
			}

			var $echo = $('<span class="echo" />');
			if ( self.$elem.is('.echoable') ) {
				//		$echo.clone().addClass('echo-main').appendTo($echos); TODO
			}
			if ( self.$elem.is('.btn-animate-hover') ) {
				self.$hover_echo = $echo.clone().addClass('echo-hover').appendTo($echos);
			}
			if ( self.$elem.is('.btn-animate-click, .echo-on-click') ) {
				self.$click_echo = $echo.clone().addClass('echo-click').appendTo($echos);
			}

			self.$elem.prepend( $echos );

			self._initHandlers();

			return self;
		},

		triggerEcho : function( x, y ) {
			var self = this;
			var $el = self.$elem;
			var xPercent = x / $el.outerWidth() * 100;
			var yPercent = y / $el.outerHeight() * 100;
			var $click_echo = self.$click_echo;
			var $df = new $.Deferred();

			$click_echo
				.css('left', xPercent + '%' )
				.css('top', yPercent + '%' );

			if ( $el.width() > self.config.largeWidth ) {
				$el.addClass( self.config.largeClass );
			}

			setTimeout( function() {
				$el.addClass('clicking echoing');
				setTimeout(function(){
					$el.removeClass('clicking echoing echoable-large');
					$df.resolve();
				}, self.config.animationDelay);
			}, self.config.triggerDelay );

			return $df;
		},

		_initHandlers : function() {
			var self = this;
			if ( self.config.clickable ) {
				self.$elem.on(self.config.clickTarget, {self:self}, self._handleClick);
			}
		},

		_handleClick : function( e ) {
			var self = e.data.self;
			var $el = self.$elem;
			var x = e.pageX - $el.offset().left;
			var y = e.pageY - $el.offset().top;
			var callback = function() {
				//
			};
			self.triggerEcho( x, y ).then( callback );
			return true;
		}

	}

	Echoable.defaults = Echoable.prototype.defaults;


	// Create plugin

	$.fn.echoable = function(options) {
		return this.each(function() {
			new Echoable(this, options).init();
		});
	};

})( jQuery, window , document );