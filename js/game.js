var Game = {

	canvas: null,
	ctx: null,

	boxes: [],

	lastTime: new Date().getTime(),

	// The game can be paused and drawing / logic will stop
	paused: false,

	// TODO: these shouldn't be punctuated like constants
	SCALE: { x: 1, y: 1}, // changes depending on window size
	MAX_VELOCITY: 40,
	GRAVITY: 5.5,

	// As the player moves to the right, the xOffset increases. In a sense, the game is scrolling to the right
	xOffset: 0,

	// To account for retina devices
	devicePixelRatio: window.devicePixelRatio || 1,

	start: function() {

		// Grab a reference to the canvas element, and resize to the width of the browser (fullscreen)
		this.canvas = document.getElementById( 'canvas' );

		this.ctx = this.canvas.getContext( '2d' );

		this.resize();

		// Load in the player object
		Player.start();

		// Set the maximum speed the player can fall...
		this.MAX_VELOCITY = this.MAX_VELOCITY * this.SCALE.y;

		this.populateSlides();

		// Start rendering the game (start the main game loop)
		this.render();
	},

	resize: function() {
		var pixelWidth = window.innerWidth;
		// The height will only take up 90% so we can have some ground (which is just the page's background color)
		var pixelHeight = window.innerHeight * 0.90;

		this.canvas.width = pixelWidth * this.devicePixelRatio;
		this.canvas.height = pixelHeight * this.devicePixelRatio;

		this.canvas.style.width = pixelWidth + 'px';
		this.canvas.style.height = pixelHeight + 'px';

		// For scaling up/down sizes & speeds
		this.SCALE = { x: ( window.innerWidth * this.devicePixelRatio / 980 ), y: ( window.innerHeight * this.devicePixelRatio / 300 ) };

		// Reload spritesheet
		this.spriteSheet.resize();
		Player.resize();
	},

	/**
	 * Makes boxes for the player to jump on based on the slides on the page
	 */
	populateSlides: function () {
		this.boxes = []; // reset
		// Add in some objects (boxes) for the player to collide with (land on)
		var slides = document.querySelectorAll( '.slide' );
		for( var i = 0, j = slides.length; i < j; i++ )
		{
			var x = ( 50 + 500 * i ) * this.SCALE.x;
			var y = this.canvas.height - 50 * this.SCALE.y;
			this.boxes.push( new Box( slides[i].id, x, y, false, 50 * this.SCALE.y ) );
		}
	},

	render: function() {
		// Calculate the number of milliseconds since the last time render was called (ideally ~16ms)
		var currentTime = new Date().getTime();
		var dt = currentTime - this.lastTime;
		this.lastTime = currentTime;

		if( !this.paused )
		{
			// Clear everything from the canvas - starting with a clean slate again
			this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

			// Apply movement to the character based on gravity and the keys that are pressed
			Player.move( dt );
			// Draw the character with its new position
			Player.draw();

			// Draw each box we've added in
			for( var i = 0, j = this.boxes.length; i < j; i++ )
			{
				// Only draw if it's within the bounds of the canvas
				if( this.boxes[i].right > this.xOffset && this.boxes[i].left < this.xOffset + this.canvas.width )
					this.boxes[i].draw();
			}
		}

		// Call me again when the browser is ready (ideally every 16ms, or 60 times per second)
		window.requestAnimationFrame( Game.renderWrapper );
	},

	/**
	 * Unfortunately we have call renderWrapper every time rather than just render
	 * This makes it so 'this' is set to the Game object rather than the window object
	 * We could do window.requestAnimationFrame( function() { Game.renderWrapper() } ),
	 * but that creates a new object, which is a no-no (because of garbage collection pauses)
	 */
	renderWrapper: function() {
		Game.render();
	}
};

// Start the game when the page has loaded
window.addEventListener( 'load', function() {
	Game.spriteSheet.load( function() { Game.start(); } );
} );

// Resize the game canvas when the window is resized
window.addEventListener( 'resize', function() {
	Game.resize();
	Game.populateSlides();
} );
