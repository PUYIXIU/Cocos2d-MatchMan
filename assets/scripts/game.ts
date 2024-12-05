// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    physicDirector = null
    
    @property(cc.Node)
    enemy_01:cc.Node = null

    @property(cc.Node)
    hero:cc.Node = null

    onLoad(){
        window.game = this
        this.physicDirector = cc.director.getPhysicsManager()
        this.physicDirector.enabled = true
    }
    // 切换碰撞边界
    toggleCollisionBound(){
        this.physicDirector.debugDrawFlags = !this.physicDirector.debugDrawFlags
    }

}
