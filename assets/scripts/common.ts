/**
 * 
 * @param a 攻击方
 * @param n 受攻击方
 * @param _faceDir 攻击方朝向
 */
export const checkCollide = (aNode, a, nNode, n, _faceDir) => {
    /**
     * 当受攻击方的受击盒 和攻击方的攻击盒 有交叉部分时，
     * 检测到攻击
     */
    
    switch(_faceDir){
        case -1:
            // 向左
            return !(
                aNode.x - a.aR.x_01 > nNode.x + n.hR.x ||    // 正面打不到
                aNode.x + a.aR.x_02 < nNode.x - n.hR.x || // 背面到不到
                aNode.y > nNode.y + n.hR.y || // 上面打不到
                aNode.y + a.aR.y < nNode.y   // 下面打不到
            )
            break;
        case 1:
            // 向右
            return !(
                aNode.x + a.aR.x_01 < nNode.x - n.hR.x || // 正面打不到
                aNode.x - a.aR.x_02 > nNode.x + n.hR.x || // 背面打不到
                aNode.y > nNode.y + n.hR.y || // 上面打不到
                aNode.y + a.aR.y < nNode.y   // 下面打不到
            )
            break;
    }
}