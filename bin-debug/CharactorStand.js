var CharacterStand = (function (_super) {
    __extends(CharacterStand, _super);
    function CharacterStand() {
        _super.call(this);
        this.current = new egret.DisplayObjectContainer();
        //状态改变    
        this.model = 0;
        this.leftright = 0;
        this.timeOnEnterFrame = 0;
        this.speed = 0.18;
        this.Getstandpngright();
    }
    var d = __define,c=CharacterStand,p=c.prototype;
    p.Setmodelanimation = function (n) {
        this.model = n;
        switch (this.model) {
            case 0:
                this.Getstandpngright();
                break;
            case 1:
                this.Getstandpngleft();
                break;
            case 2:
                this.Getrunpngright();
                break;
            case 3:
                this.Getrunpngleft();
                break;
        }
    };
    //设置动画
    p.Getstandpngright = function () {
        var str = ["sr1_png", "sr2_png", "sr3_png", "sr4_png"];
        var stand = this.createBitmapByName("sr1_png");
        this.current.removeChildren();
        this.current.addChild(stand);
        this.Animation(stand, str, 200);
    }; //站右
    p.Getstandpngleft = function () {
        var str = ["sl1_png", "sl2_png", "sl3_png", "sl4_png"];
        var stand = this.createBitmapByName("sl1_png");
        this.current.removeChildren();
        this.current.addChild(stand);
        this.Animation(stand, str, 200);
    }; //站左
    p.Getrunpngright = function () {
        var str = ["rr1_png", "rr2_png", "rr3_png", "rr4_png",
            "rr5_png", "rr6_png", "rr7_png", "rr8_png"];
        var run = this.createBitmapByName("rr1_png");
        this.current.removeChildren();
        this.current.addChild(run);
        this.Animation(run, str, 125);
    }; //跑右
    p.Getrunpngleft = function () {
        var str = ["rl1_png", "rl2_png", "rl3_png", "rl4_png",
            "rl5_png", "rl6_png", "rl7_png", "rl8_png"];
        var run = this.createBitmapByName("rl1_png");
        this.current.removeChildren();
        this.current.addChild(run);
        this.Animation(run, str, 125);
    }; //跑左
    p.Animation = function (bit, s, t) {
        var n = 1;
        var change = function () {
            var tw = egret.Tween.get(bit);
            tw.wait(t);
            tw.call(changetex);
            n++;
            if (n == s.length) {
                n = 1;
            }
            tw.call(change);
        };
        change();
        function changetex() {
            bit.texture = RES.getRes(s[n]);
        }
    }; //播放帧动画
    p.Move = function (x, y, limit) {
        this.Inx = x;
        if (y <= limit) {
            this.Iny = limit;
        }
        else {
            this.Iny = y;
        } //区域限制       
        var lengthX = this.Inx - this.current.x;
        var lengthY = this.Iny - this.current.y;
        if (lengthX >= 0) {
            this.leftright = 0;
            this.Setmodelanimation(2);
        }
        else {
            this.leftright = 1;
            this.Setmodelanimation(3);
        } //人物朝向判断
        var lengthline = 0;
        lengthline = Math.pow(lengthX * lengthX + lengthY * lengthY, 1 / 2);
        this.Xmove = lengthX / lengthline;
        this.Ymove = lengthY / lengthline; //帧位移量
        this.addEventListener(egret.Event.ENTER_FRAME, this.onMove, this);
        this.timeOnEnterFrame = egret.getTimer();
    }; //移动调用
    p.onMove = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;
        this.current.x += this.speed * pass * this.Xmove;
        this.current.y += this.speed * pass * this.Ymove;
        this.timeOnEnterFrame = egret.getTimer();
        if (this.current.x - this.Inx < 3 && this.current.x - this.Inx > -3 &&
            this.current.y - this.Iny < 3 && this.current.y - this.Iny > -3) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onMove, this);
            if (this.leftright == 0) {
                this.Setmodelanimation(0);
            }
            if (this.leftright == 1) {
                this.Setmodelanimation(1);
            } //人物停止后朝向判断
        }
    }; //位移计算
    //读取图片
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        if (name == "rl1_png") {
            result.anchorOffsetX = result.width / 3.5; //为了向左跑的帧动画而修改锚点
        }
        else {
            result.anchorOffsetX = result.width / 2;
        }
        result.anchorOffsetY = result.height * (5 / 8); //使锚点在脚下
        return result;
    }; //读入位图文件
    return CharacterStand;
}(egret.DisplayObjectContainer));
egret.registerClass(CharacterStand,'CharacterStand');
//# sourceMappingURL=CharactorStand.js.map