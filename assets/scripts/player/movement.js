cc.Class({
  extends: cc.Component,

  properties: {
    acceleration: 2000,
    speedLimiter: 2000 * 15, // acceleration * N
  },

  // todo не набирать скорость, когда персонаж упирается в стену.
  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.rigidBody = this.node.getComponent(cc.RigidBody);

    this.speed = 0;
    this.isMovementLeft = false;
    this.isMovementRight = false;
  },

  update(dt) {
    if (this.isMovementLeft === this.isMovementRight) {
      this.zeroingSpeed();
    } else if (this.isMovementLeft) {
      this.increaseSpeedToLeft();
    } else if (this.isMovementRight) {
      this.increaseSpeedToRight();
    }

    this.combiningJumpingWithMovement(dt);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onKeyDown({ keyCode }) {
    this.setAcceleration(keyCode, true);
  },

  onKeyUp({ keyCode }) {
    this.setAcceleration(keyCode, false);
  },

  setAcceleration(keyCode, isPressed) {
    if (keyCode === cc.macro.KEY.a) {
      this.isMovementLeft = isPressed;
    } else if (keyCode === cc.macro.KEY.d) {
      this.isMovementRight = isPressed;
    }
  },

  increaseSpeedToLeft() {
    if (this.speed > -this.speedLimiter) {
      this.speed -= this.acceleration;
    }
  },

  increaseSpeedToRight() {
    if (this.speed < this.speedLimiter) {
      this.speed += this.acceleration;
    }
  },

  zeroingSpeed() {
    if (this.speed > 0) {
      this.speed -= this.acceleration;
    } else if (this.speed < 0) {
      this.speed += this.acceleration;
    }
  },

  combiningJumpingWithMovement(dt) {
    const { y } = this.rigidBody.linearVelocity;
    this.rigidBody.linearVelocity = cc.v2(this.speed * dt, y);
  },
});
