// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Type = cc.Enum({
    First: 0,
    Second: 1,
    Third: 2
});

const PlayerController = cc.Class({
    extends: cc.Component,

    myRb: null,
    isFacingRight: null,
    isGrounded: null,

    ctor() {
      this.myRb = null;
      this.isFacingRight = true;
      this.isGrounded = false;
    },

    properties: {
        type: {
            default: Type.First,
            type: Type
        },
        groundColTag: {
            default: 10,
            type: cc.Integer
        },
        onLandEvent: {
            default: [],
            type: cc.Component.EventHandler
        }
    },

    onLoad() {
        this.myRb = this.getComponent(cc.RigidBody);
    },

    update() {
    },

    onCollisionEnter(other, self) {
        if (other.tag === this.groundColTag) {
            if (!this.isGrounded) {
                this.isGrounded = true;
                cc.Component.EventHandler.emitEvents(this.onLandEvent);
            }
        }
    },

    onCollisionExit(other, self) {
        if (other.tag === this.groundColTag) {
            this.isGrounded = false;
        }
    },

    Move(move) {
        this.myRb.linearVelocity = cc.v2(move * 200.0, this.myRb.linearVelocity.y);
        if (move > 0 && !this.isFacingRight) {
            this.Flip();
        }
        else if (move < 0 && this.isFacingRight) {
            this.Flip();
        }
    },

    Jump(jumpSpeed) {
        if (!this.isGrounded)
            return;

        this.myRb.linearVelocity = cc.v2(this.myRb.linearVelocity.x, jumpSpeed * 10.0);
        this.node.emit("onJump", this);
    },

    Flip() {
        this.isFacingRight = !this.isFacingRight;
        this.node.scaleX *= -1.0;
    }
});

module.exports = PlayerController;