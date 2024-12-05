// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import HeroComp from "./hero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Rocker extends cc.Component {
    /**
     * 移动手柄
     */
    @property(cc.Node)
    Stick: cc.Node = null
    /**
     * 最大半径
     */
    @property
    max_r:number = 100
    /**
     * 手柄移动的玩家
     */
    @property(cc.Node)
    Hero:cc.Node = null
    heroJs = null
    start () {
        this.heroJs = this.Hero.getComponent(HeroComp)
        // 注册触摸事件
        // 开始触摸
        this.node.on(cc.Node.EventType.TOUCH_START,(e:cc.Event.EventTouch) => {
            const w_pos = e.getLocation() // 获取触摸点世界坐标
            const n_pos = this.node.convertToNodeSpaceAR(w_pos) // 转化为该节点的坐标
            // 控制移动距离
            let len = n_pos.mag() // 返回原点到该点坐标向量的长度
            if(len > this.max_r){
                // 使用三角函数实现
                n_pos.x = this.max_r * n_pos.x / len
                n_pos.y = this.max_r * n_pos.y / len
            }
            this.Stick.setPosition(n_pos)

            this.heroJs.setDir(n_pos.x)
        })
        // 触摸移动
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e:cc.Event.EventTouch) => {
            const w_pos = e.getLocation()
            const n_pos = this.node.convertToNodeSpaceAR(w_pos)
            // 控制移动距离
            let len = n_pos.mag()
            if(len > this.max_r){
                n_pos.x = this.max_r * n_pos.x / len
                n_pos.y = this.max_r * n_pos.y / len
            }
            this.Stick.setPosition(n_pos)
            this.heroJs.setDir(n_pos.x)
        })
        // 触摸结束
        this.node.on(cc.Node.EventType.TOUCH_END, (e:cc.Event.EventTouch) => {
            this.Stick.setPosition(0, 0)
            this.heroJs.cancelMove()
        })
        // 触摸取消
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e:cc.Event.EventTouch) => {
            this.Stick.setPosition(0, 0)
            this.heroJs.cancelMove()
        })
    }
}
