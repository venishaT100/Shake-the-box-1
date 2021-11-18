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
    width: 1500,
    height: 600,
    wireframes: false,
    background: "black",   //B5EAEA
}
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

var wallStyle = { fillStyle: '#00FFB6' };
var bodyStyle = { sprite:{texture:'smile.png',xScale:0.17,yScale:0.17} };

var wall1 = Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: wallStyle }),
    wall2 = Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: wallStyle }),
    wall3 = Bodies.rectangle(800, 0, 50, 230, { isStatic: true, render: wallStyle }),
    wall4 = Bodies.rectangle(800, 450, 50, 350, { isStatic: true, render: wallStyle }),
    wall5 = Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: wallStyle });

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
        pair.bodyB.render.sprite.texture = 'blind-face.png';
    }
});

Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;
    
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        pair.bodyA.render.fillStyle = '#00FFB6';
        pair.bodyB.render.sprite.texture = 'smile.png';
    }
});


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
