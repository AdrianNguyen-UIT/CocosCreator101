//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/class.html


const HorizontalDirection = {
    NONE: -1,
    LEFT: 0,
    RIGHT: 1
};

const PlayerMovement = cc.Class({

    extends: cc.Component,

    //region Private Member Variables
    controller: null,
    animator: null,
    horizontalMovement: null,
    inputFlags: null,
    walkAniState: null,
    isJumpReleased: null,

    ctor() {
        this.controller = null;
        this.animator = null;
        this.walkAniState = null;
        this.horizontalMovement =  0.0;
        this.inputFlags = [false, false];
        this.isJumpReleased = true;
    },

    //endregion

    //region Configurations
    properties: {
        movementSpeed: {
            default: 30.0,
            type: cc.Float,
            min: 0.0
        },
        jumpSpeed: {
            default: 20.0,
            type: cc.Float,
            min: 0.0
        }
    },
    //endregion

    //region Static Variables &
    statics: {
    },
    //endregion

    //region CC Lifecycle Callbacks
    onLoad() {
        this.controller = this.getComponent("PlayerController");
        this.animator = this.getComponent(cc.Animation);
        this.walkAniState = this.animator.getAnimationState("walk");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnMoveKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.OnMoveKeyUp, this);

        this.controller.node.on("onJump", this.OnJump, this);
    },

    update(dt) {
        this.controller.Move(this.horizontalMovement * dt);
    },
    //endregion

    //region Public Member Methods
    OnMoveKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                if (this.inputFlags[0] === false) {
                    this.inputFlags[0] = true;
                    this.DecideHorizontalDirection(HorizontalDirection.LEFT);
                }
                break;
            case cc.macro.KEY.d:
                if (this.inputFlags[1] === false) {
                    this.inputFlags[1] = true;
                    this.DecideHorizontalDirection(HorizontalDirection.RIGHT);
                }
                break;
            case cc.macro.KEY.space:
                if (this.isJumpReleased) {
                    this.controller.Jump(this.jumpSpeed);
                    this.isJumpReleased = false;
                }
                break;
        }
    },

    OnMoveKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.inputFlags[0] = false;
                this.DecideHorizontalDirection();
                break;
            case cc.macro.KEY.d:
                this.inputFlags[1] = false;
                this.DecideHorizontalDirection();
                break;
            case cc.macro.KEY.space:
                this.isJumpReleased = true;
                break;
        }
    },

    DecideHorizontalDirection(priority = HorizontalDirection.NONE) {
        if (this.inputFlags[0] === true && this.inputFlags[1] === true) {
            if (priority === HorizontalDirection.LEFT) {
                this.horizontalMovement = this.movementSpeed * -1.0;
            } else if (priority === HorizontalDirection.RIGHT) {
                this.horizontalMovement = this.movementSpeed * 1.0;
            }

            if (!this.walkAniState.isPlaying && this.controller.isGrounded) {
                this.animator.play("walk");
            }

        }
        else if (this.inputFlags[0] === true && this.inputFlags[1] === false) {
            this.horizontalMovement = this.movementSpeed * -1.0;
            if (!this.walkAniState.isPlaying && this.controller.isGrounded) {
                this.animator.play("walk");
            }
        }
        else if (this.inputFlags[0] === false && this.inputFlags[1] === true) {
            this.horizontalMovement = this.movementSpeed * 1.0;
            if (!this.walkAniState.isPlaying && this.controller.isGrounded) {
                this.animator.play("walk");
            }
        }
        else {
            this.horizontalMovement = 0.0;
            if (this.controller.isGrounded) {
                this.animator.play("idle");
            }
        }
    },

    OnJump() {
        this.animator.play("jump");
    },

    OnLand() {
        this.animator.stop("jump");
        this.DecideHorizontalDirection();
    },
    //endregion

});

module.exports = PlayerMovement;
