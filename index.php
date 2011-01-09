<!DOCTYPE html>

<html>
<head>
	<title>Phoenix Rising</title>
	<link rel="stylesheet" type="text/css" href="stylesheet.css" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
	<!--[if lt IE 9]>
		<script type="text/javascript" src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	<script type="text/javascript" src="game.js"></script>
</head>

<body>
	<canvas id="canvas" width="1000" height="500">
		<div class="nocanvas">
			Your current browser doesn't support the HTML5 &lt;canvas&gt; element which is needed to play this game. Get a better browser (or update) please! :)
		</div>
	</canvas>
	
	<div id="info">
		<div id="levelContainer">Level: <span id="level"></span></div>
		<div id="fireballContainer">Fireball: x<span id="fireball"></span></div>
		<div id="freezeContainer">Freeze: x<span id="freeze"></span></div>
		<div id="restart">Restart</div>
	</div>
	
	<div class="text">
	Once I have the time, I'll knock together a quick design. In the meantime, <a href="http://reflections.irythia.com/2010/12/31/gpc-version-2-phoenix-rising/">here's my blog post on the development of this game</a>.
	</div>
</body>
</html>