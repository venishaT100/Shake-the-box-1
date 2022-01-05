var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Body = Matter.Body,
Events = Matter.Events,
Composite = Matter.Composite,
Composites = Matter.Composites,
Common = Matter.Common,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
world = engine.world;

// create renderer
var render = Render.create({
element: document.body,
engine: engine,
options: {
    width: 800,
    height: 660,
    wireframes: false,
    background: 'bg2.jpg',   
}
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

var wallStyle = { fillStyle: '#83FF00' };
var bodyStyle = { sprite:{texture:'smile.jpg',xScale:0.10,yScale:0.10} };


var wall1 = Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: wallStyle }),
    wall2 = Bodies.rectangle(400, 650, 800, 50, { isStatic: true, render: wallStyle }),
    wall3 = Bodies.rectangle(800, 0, 50, 230, { isStatic: true, render: wallStyle }),
    wall4 = Bodies.rectangle(800, 450, 50, 350, { isStatic: true, render: wallStyle }),
    wall5 = Bodies.rectangle(0, 400, 50, 750, { isStatic: true, render: wallStyle });

Composite.add(world, [wall1, wall2, wall3, wall4, wall5]);

var pyramid = Composites.pyramid(0, 0, 11, 6, 50, 50, function(x, y) {
    return Bodies.circle(x, y, 15, { restitution: 1, render: bodyStyle });
});


Composite.add(world, [wall1, wall2, wall3, wall4, wall5, pyramid]);


Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        pair.bodyA.render.fillStyle = '#9300FF';
        pair.bodyB.render.sprite.texture = 'blind-face2.jpg'

    }
});

Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;
    
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        pair.bodyA.render.fillStyle = '#00FFB6';
        pair.bodyB.render.sprite.texture = 'smile.jpg';
    }
});

Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        pair.bodyA.render.fillStyle = '#FF0074';
        pair.bodyB.render.fillStyle = '#00FFFF';
    }
});

Events.on(engine, 'beforeUpdate', function(event) {
    var pairs = event.source;
    
    if (event.timestamp % 5000 < 50) {
       shakeScene(engine);
    }
});

var shakeScene = function(engine) {
    var bodies = Composite.allBodies(engine.world);
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        if (!body.isStatic && body.position.y >= 500) {
            var forceMagnitude=(0.02 * body.mass)*Common.random();

            Body.applyForce(body, body.position, {
                x: forceMagnitude*Common.choose([1,-1]),
                y:-forceMagnitude
            });
        }
    }
};

var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;
