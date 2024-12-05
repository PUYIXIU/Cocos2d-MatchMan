
import { checkCollide } from "./common";
import Enemy from "./enemy";
import Game from "./game";
// 区分动画组别，需要播放混合动画就需要创建新的组别
const ANI_GROUP = "normalGroup"

const {ccclass, property} = cc._decorator;

// 连招数组
const attAnimList = ["普攻_01","普攻_02","普攻_03","普攻_04",]

@ccclass
export default class HeroComp extends cc.Component {

    /**
     * 跟随相机
     */
    @property(cc.Node)
    camera: cc.Node = null

    /**
     * 英雄速度
     */
    @property
    heroSpeed:number = 1
    /**
     * 相机速度
     */
    @property
    cameraSpeed:number = 0
    /**
     * 移动方向
     */
    dir:number = 0

    /**
     * 控制自动切换方向计时器
     */
    changeDirTime = 100

    // 龙骨组件
    dbDisplay = null
    dbArmature = null

    // 状态机 0待机 1奔跑
    state = 0
    // 刚体组件
    body:cc.RigidBody = null

    // 跳跃间隔
    jumpCD:number = 0

    // 攻击间隔
    attachCD:number = 0

    // 攻击序号
    attCount:number = 0

    // 连招间隔
    combatCD:number = 0

    // 身体朝向 1=右侧 -1=左侧
    bodyDir:number = 1

    // 攻击距离
    aR = {
        x_01: 0, // 正面攻击距离
        x_02: 0, // 背面攻击距离
        y: 0, // 垂直攻击高度
    }
    onLoad(){
        //  重置身体转向右侧
        this.node.scaleX = -0.3
        this.aR.x_01 = this.node.width * 0.3 * 1
        this.aR.x_01 = this.node.width * 0.3 * 0.5
        this.aR.y = this.node.height * 0.3

        this.dbDisplay = this.node.getComponent(dragonBones.ArmatureDisplay)
        this.dbArmature = this.dbDisplay.armature()
        this.body = this.node.getComponent(cc.RigidBody)
        // 绑定动画播放结束事件
        this.dbDisplay.on(dragonBones.EventObject.COMPLETE, this.aniComplete, this)
        
        // 添加一个动画帧来控制
        this.dbDisplay.on(dragonBones.EventObject.FRAME_EVENT, this.frameEvent, this)
    }
    // 动画播放结束事件
    aniComplete(){

        // 回到待机状态
        if(this.state == 1){
            this.animFunction('奔跑')
        }else if( this.state == 0){
            this.animFunction('待机')
        }

    }

    frameEvent(e){
        switch(e.name){
            // 帧事件在龙骨中设置
            // 攻击动画播放到一半，开始判定敌人受伤
            case "attack":
                let enemyNode = window.game.getComponent(Game).enemy_01
                let enemy = enemyNode.getComponent(Enemy)
                let hit = checkCollide(
                    this.node, this, 
                    enemyNode, enemy, 
                    this.bodyDir
                )
                if(hit){
                    enemy.getHit()
                }
                break;
        }
    }
    start () {}

    update(dt){
        
        // 自动切换方向
        // this.changeDirFunction()

        // 英雄移动
        this.heroMove()
        
        // 相机跟随
        this.cameraMove()
        
        if(this.jumpCD > 0){
            this.jumpCD --
        }
        if(this.attachCD > 0){
            this.attachCD --
        }
        if(this.attCount > 0){
            if(this.combatCD > 0){
                this.combatCD --
                if(this.combatCD <= 0){
                    this.attCount = 0
                }
            }
        }
    }

    // 播放动画
    animFunction(animName){
        // 调用接口播放动画
        this.dbArmature.animation.fadeIn(animName,-1, -1, 0, ANI_GROUP, dragonBones.AnimationFadeOutMode.All)
    }

    // 自动切换方向
    changeDirFunction(){
        this.changeDirTime --
        if(this.changeDirTime <= 0){
            // 像反方向产生一个随机的力
            this.changeDirTime = 50 + Math.floor(Math.random() * 101)
            this.dir *= -1
            // 转换方向时，从0速度开始加速
            this.heroSpeed = 0
        }
    }

    // 英雄移动
    heroMove(){
        const v = this.body.linearVelocity
        // ease-in
        if(this.heroSpeed <= 6){
            this.heroSpeed += 0.3
        }

        switch(this.dir){
            case 1: // 向右移动
                // this.node.x += this.heroSpeed;
                v.x += this.heroSpeed
                break;
            case -1:
                // this.node.x -= this.heroSpeed
                v.x -= this.heroSpeed
                break;
        }
        this.body.linearVelocity = v
    }

    // 摄像机跟随
    cameraMove(){
        // 相机进行阻尼式跟随
        let dis = Math.abs(this.camera.x - this.node.x)
        if(dis < 5) {
            this.cameraSpeed = 0
            return
        }
        
        if(this.cameraSpeed <= 6){
            this.cameraSpeed += 0.1
        }
        if(this.camera.x < this.node.x){
            this.camera.x += this.cameraSpeed
        }else{
            this.camera.x -= this.cameraSpeed
        }
    }
    
    // 停止移动
    cancelMove(){
        this.dir = 0
        this.state = 0
        this.animFunction('待机')
    }

    // 根据x设置移动方向
    setDir(x){
        let preDir = this.dir
        this.state = 1
        if(x>0){
            // 向右
            this.dir = 1;
            if(this.node.scaleX != -0.3) {
                this.node.scaleX = -0.3
                this.bodyDir = 1
            }
            
        }else if(x<0){
            // 向左
            this.dir = -1
            if(this.node.scaleX != 0.3) {
                this.node.scaleX = 0.3
                this.bodyDir = -1
            }
        }
        if(preDir !== this.dir){
            this.heroSpeed = 1
            this.cameraSpeed = 0
            this.animFunction('奔跑')

        }
    }
    // 跳跃
    jump(){
        if(this.jumpCD >0) {
            return
        }
        const v = this.body.linearVelocity
        v.y = 500
        this.body.linearVelocity = v
        this.animFunction("普通跳跃")
        this.jumpCD = 50
    }
    // 攻击
    attack(){
        if(this.attachCD > 0){
            return 
        }
        this.animFunction(attAnimList[this.attCount])
        this.attCount = (this.attCount + 1) % attAnimList.length
        switch(this.attCount){
            case 1: this.combatCD = 120;break;   
            case 2: this.combatCD = 140;break;   
            case 3: this.combatCD = 160;break;   
        }
        this.attachCD = 50
    }
}
