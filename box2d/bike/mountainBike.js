/**
*
*
* @licstart  The following is the entire license notice for the
* JavaScript code in this page.
*
* Copyright (C) 2015 by Sascha Willems (www.saschawillems.de)
*
* The JavaScript code in this page is free software: you can
* redistribute it and/or modify it under the terms of the GNU
* General Public License (GNU GPL) as published by the Free Software
* Foundation, either version 3 of the License, or (at your option)
* any later version.  The code is distributed WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this page.
*
*/

function mountainBike() {

  /**
   * [setup setup physics for a mountain bike with full suspension]
   * @param  {[type]} world [Box2D world in which to create the bike]
   * @param  {[type]} x     [x origin of the bike in world space]
   * @param  {[type]} y     [y origin of the bike in world space]
   */
  this.setup = function(world, x, y, scale) {
    this.motorSpeed = 0;
    this.wheelSize = 2.75;

    var fixDef = new Box2D.Dynamics.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    // Frame as simple triangle with offset center of mass
    this.frameBody = new Box2D.Dynamics.b2BodyDef;
    this.frameBody.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
    var b2vertices = [];
    var frameVertices = [ {x:90,y:-40}, {x:-40,y:70}, {x:-60,y:-30}]
    for (var i = 0; i < frameVertices.length; i++) {
      b2vertices[i]= new Box2D.Common.Math.b2Vec2();
      b2vertices[i].Set(frameVertices[i].x * scale, frameVertices[i].y * scale);
    }
    fixDef.shape.SetAsArray(b2vertices, b2vertices.length);
    this.frameBody.position.Set(x, y);
    this.frameBody = world.CreateBody(this.frameBody);
    this.frameBody.CreateFixture(fixDef);
    // Offset center of mass towards crank position
    massData = new Box2D.Collision.Shapes.b2MassData;
    this.frameBody.GetMassData(massData);
    massData.center.Set(-20 * scale, 10 * scale);
    this.frameBody.SetMassData(massData);

    // Swing arm as simple triangle
    this.swingarmBody = new Box2D.Dynamics.b2BodyDef;
    this.swingarmBody.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    var swingarmVertices = [ {x:-40,y:70}, {x:-125,y:70}, {x:-50,y:20}];
    b2vertices.length = 0;
    for (var i = 0; i < swingarmVertices.length; i++) {
      b2vertices[i] = new Box2D.Common.Math.b2Vec2();
      b2vertices[i].Set(swingarmVertices[i].x * scale, swingarmVertices[i].y * scale);
    }
    fixDef.shape.SetAsArray(b2vertices, b2vertices.length);
    this.swingarmBody.position.Set(x, y);
    this.swingarmBody = world.CreateBody(this.swingarmBody);
    this.swingarmBody.CreateFixture(fixDef);

    this.wheels = [];
    this.dampers = [];

    // Wheels
    for (var i = 0; i < 2; i++) {
      fixDef.density = 0.5;
      fixDef.friction = 0.75;
      fixDef.restitution = 0.1;

      this.wheels[i] = new Box2D.Dynamics.b2BodyDef;
      this.wheels[i].type = Box2D.Dynamics.b2Body.b2_dynamicBody;
      fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.wheelSize / 2);

      this.wheels[i].position.x = x + ((i == 0) ? 113 : -125) * scale;
      this.wheels[i].position.y = y + 70 * (this.wheelSize / 2.6) * scale;
      this.wheels[i] = world.CreateBody(this.wheels[i]);
      this.wheels[i].CreateFixture(fixDef);
    }

    // Dampers
    fixDef.density = 1.0;
    fixDef.friction = 0.75;
    fixDef.restitution = 0.2;

    // Front
    var frontDamperVertices = [ {x:120,y:65}, {x:110,y:70}, {x:80,y:-90}, {x:90,y:-95} ];
    this.frontDamperBody = new Box2D.Dynamics.b2BodyDef;
    this.frontDamperBody.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
    b2vertices.length = 0;
    for (var i = 0; i < frontDamperVertices.length; i++) {
      b2vertices[i] = new Box2D.Common.Math.b2Vec2();
      b2vertices[i].Set(frontDamperVertices[i].x * scale, frontDamperVertices[i].y * scale);
    }
    fixDef.shape.SetAsArray(b2vertices, b2vertices.length);
    this.frontDamperBody.position.Set(x, y);
    this.frontDamperBody = world.CreateBody(this.frontDamperBody);
    this.frontDamperBody.CreateFixture(fixDef);

    // Joints

    // Swingarm to back wheel connection : Revolute joint
    this.backWheelJoint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    this.backWheelJoint.Initialize(this.swingarmBody, this.wheels[1], this.wheels[1].GetWorldCenter());
    // Use motor to rotate wheel (when player accelerates)
    this.backWheelJoint.motorSpeed = 0;
    this.backWheelJoint.maxMotorTorque = 400;
    this.backWheelJoint.enableMotor = true;
    this.backWheelJoint = world.CreateJoint(this.backWheelJoint);

    // Swingarm to frame connection : Revolute joint
    this.hingeJoint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    // Offset joint center to lower/left frame point
    centerVec = new Box2D.Common.Math.b2Vec2();
    centerVec.Set(x - 40 * scale, y + 70 * scale);
    this.hingeJoint.Initialize(this.swingarmBody, this.frameBody, centerVec);
    // Limit damper
    this.hingeJoint.upperAngle = -5 * Math.PI / 180;
    this.hingeJoint.lowerAngle = -35 * Math.PI / 180;
    this.hingeJoint.enableLimit = true;
    // Enable motor for active damping
    this.hingeJoint.motorSpeed = 0.2;
    this.hingeJoint.maxMotorTorque = 50;
    this.hingeJoint.enableMotor = true;
    world.CreateJoint(this.hingeJoint);

    // Front damper to frame : Prismatic joint
    this.frontDamperJoint = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
    centerVec = new Box2D.Common.Math.b2Vec2();
    axisVec =  new Box2D.Common.Math.b2Vec2();
    // Tilt axis
    axisVec.Set(0.2, 1);
    // Offset joint center to upper/right frame point
    centerVec.Set(x + 90 * scale, y + 40 * scale);
    centerVec = this.wheels[0].GetWorldCenter();
    this.frontDamperJoint.Initialize(this.frameBody, this.frontDamperBody, this.frontDamperBody.GetWorldCenter(), axisVec);
    this.frontDamperJoint.referenceAngle = -5 * Math.PI / 180;
    this.frontDamperJoint.lowerTranslation = -0.45;
    this.frontDamperJoint.upperTranslation = 0.45;
    this.frontDamperJoint.enableLimit = true;
    this.frontDamperJoint.motorSpeed = 2;
    this.frontDamperJoint.maxMotorForce = 75;
    this.frontDamperJoint.enableMotor = true;
    world.CreateJoint(this.frontDamperJoint);

    // Front damper to front wheel : Revolute joint
    this.frontWheelJoint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    this.frontWheelJoint.Initialize(this.frontDamperBody, this.wheels[0], this.wheels[0].GetWorldCenter());
    this.frontWheelJoint.motorSpeed = 0;
    this.frontWheelJoint.maxMotorTorque = 400;
    this.frontWheelJoint.enableMotor = true;
    this.frontWheelJoint = world.CreateJoint(this.frontWheelJoint);
  }

}
