/**
 * Here we're generating an object that has the x, y offsets of each sprite animation in the Game.spriteSheet
 */
var SpriteSheet = ( function() {
	function SpriteSheet() {

		this.image = new Image(); // src is set on dom load

	}

	SpriteSheet.prototype.load = function( callback ) {
		// SVG is tossed in a canvas so the clipping uses the scaled down versoin
		this.canvas = document.createElement( 'canvas' );
		this.ctx = this.canvas.getContext( '2d' );

		this.resize();

		// First load in the Game.spriteSheet
		this.image.src = 'images/astronaut.svg';
		// We have to wait for the this to load, otherwise ctx.drawImage will fail (not gracefully)
		var self = this;
		this.image.onload = function() {
			self.ctx.drawImage( self.image, 0, 0, self.canvas.width, self.canvas.height );

			if( typeof callback === 'function' )
				callback();
		};
	};

	SpriteSheet.prototype.resize = function( callback ) {
		this.image.height = Game.SCALE.y * 75;
		this.image.width = this.image.height * 2;

		this.image.width -= this.image.width % 6; // Make this a multiple of six to floor() everything
		this.image.height -= this.image.height % 3; // Make this a multiple of three to floor() everything

		this.canvas.width = this.image.width;
		this.canvas.height = this.image.height;

		if( this.ctx && this.image.complete )
			this.ctx.drawImage( this.image, 0, 0, this.canvas.width, this.canvas.height );

		this.sprites = {
			fall: { x: 0, y: 0 },
			jump: { x: this.image.width * ( 1 / 6 ), y: 0 },
			up: { x: this.image.width * ( 2 / 6 ), y: 0 },
			upLeft: { x: this.image.width * ( 3 / 6 ), y: 0 },
			upRight: { x: this.image.width * ( 4 / 6 ), y: 0 },
			somethingRight: { x: this.image.width * ( 5 / 6 ), y: 0 },
			somethingLeft: { x: 0, y: this.image.height * ( 1 / 3 ) },
			right: { x: this.image.width * ( 1 / 6 ), y: this.image.height * ( 1 / 3 ) },
			left: { x: this.image.width * ( 2 / 6 ), y: this.image.height * ( 1 / 3 ) },
			jumpLeft: { x: this.image.width * ( 3 / 6 ), y: this.image.height * ( 1 / 3 ) },
			jumpRight: { x: this.image.width * ( 4 / 6 ), y: this.image.height * ( 1 / 3 ) },
			fallRight: { x: this.image.width * ( 5 / 6 ), y: this.image.height * ( 1 / 3 ) },
			fallLeft: { x: 0, y: this.image.height * ( 2 / 3 ) },
			walkRight1: { x: this.image.width * ( 1 / 6 ), y: this.image.height * ( 2 / 3 ) },
			walkRight2: { x: this.image.width * ( 2 / 6 ), y: this.image.height * ( 2 / 3 ) },
			walkLeft1: { x: this.image.width * ( 3 / 6 ), y: this.image.height * ( 2 / 3 ) },
			walkLeft2: { x: this.image.width * ( 4 / 6 ), y: this.image.height * ( 2 / 3 ) },
			stand: { x: this.image.width * ( 5 / 6 ), y: this.image.height * ( 2 / 3 ) }
		};

	};


	return SpriteSheet;
} )();

Game.spriteSheet = new SpriteSheet();
