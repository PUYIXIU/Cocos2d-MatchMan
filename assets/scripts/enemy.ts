// 区分动画组别，需要播放混合动画就需要创建新的组别
const ANI_GROUP = "normalGroup"
const {ccclass, property} = cc._decorator;

// 受击数组
const hitAnimList = ["受击_01","受击_02","受击_03","受击_04",]
@ccclass
export default class Enemy extends cc.Component {

    // 敌人受击范围
    hR = {
        x:0,
        y:0
    }

    dbDisplay = null
    dbArmature = null

    // 身体朝向
    bodyDir = 1

    onLoad(){
        this.setFaceDir(1)
        this.dbDisplay = this.node.getComponent(dragonBones.ArmatureDisplay)
        this.dbArmature = this.dbDisplay.armature()
        this.dbDisplay.on(dragonBones.EventObject.COMPLETE, this.aniComplete, this)
    }
    // 播放动画
    animFunction(animName){
        // 调用接口播放动画
        this.dbArmature.animation.fadeIn(animName,-1, -1, 0, ANI_GROUP, dragonBones.AnimationFadeOutMode.All)
    }
    getHit(){
        let index = Math.floor(Math.random() * hitAnimList.length)
        console.log(index)
        let ani_name = hitAnimList[index]
        this.animFunction(ani_name)
        // 收到伤害后，面向hero
        let dir = 1
        if(this.node.x > window.game.hero.x){
            dir = -1 // 向右转
        }
        this.setFaceDir(dir)
    }
    setFaceDir(dir){
        this.bodyDir = dir
        this.node.scaleX = 0.3*-dir
    }
    // 动画播放结束事件
    aniComplete(){
        this.animFunction('待机')
    }
    start () {
        this.hR.x = this.node.width * 0.3
        this.hR.y = this.node.height * 0.3
    }

    // update (dt) {}
}
