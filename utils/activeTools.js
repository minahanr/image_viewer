export default class ActiveTools {
    constructor(leftClickTool, rightClickTool) {
        this.leftClickTool = leftClickTool;
        this.rightClickTool = rightClickTool;

        this.dict = {
            'leftClick': 1,
            'rightClick': 2
        }
    }

    setLeftClick(tool) {
        this.leftClickTool = tool;
    }

    setRightClick(tool) {
        this.rightClickTool = tool;
    }
}