class CharacterStand extends egret.DisplayObjectContainer {
    public current:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
   
    public constructor() {
        super();
        this.Getstandpngright();
    }
//状态改变    
    private model:number = 0;

    private Setmodelanimation(n:number):void {
        this.model = n;
        switch (this.model) {
            case 0: this.Getstandpngright();break;
            case 1: this.Getstandpngleft();break;
            case 2: this.Getrunpngright();break;
            case 3: this.Getrunpngleft();break;       
        }
    }

//设置动画
    private Getstandpngright():void {
        var str:string[]=["sr1_png","sr2_png","sr3_png","sr4_png"];
        var stand:egret.Bitmap = this.createBitmapByName("sr1_png");
        this.current.removeChildren();
        this.current.addChild(stand);
        this.Animation(stand,str,200);
    }//站右

    private Getstandpngleft():void {
        var str:string[]=["sl1_png","sl2_png","sl3_png","sl4_png"];
        var stand:egret.Bitmap = this.createBitmapByName("sl1_png");
        this.current.removeChildren();
        this.current.addChild(stand);
        this.Animation(stand,str,200); 
    }//站左
    
    private Getrunpngright():void {
        var str:string[]=["rr1_png","rr2_png","rr3_png","rr4_png",
                          "rr5_png","rr6_png","rr7_png","rr8_png"];
        var run:egret.Bitmap = this.createBitmapByName("rr1_png");
        this.current.removeChildren();
        this.current.addChild(run);
        this.Animation(run,str,125);
    }//跑右

    private Getrunpngleft():void {
        var str:string[]=["rl1_png","rl2_png","rl3_png","rl4_png",
                          "rl5_png","rl6_png","rl7_png","rl8_png"];
        var run:egret.Bitmap = this.createBitmapByName("rl1_png");
        this.current.removeChildren();
        this.current.addChild(run);
        this.Animation(run,str,125); 
    }//跑左
   
    private Animation(bit:egret.Bitmap,s:string[],t:number):void {
        var n = 1; 
        var change:Function = function () {
            var tw = egret.Tween.get(bit);
            tw.wait(t);
            tw.call(changetex);
            n++;
            if(n == s.length){
                n =1;
            }
            tw.call(change);
        };   
        change();
        function changetex():void {
            bit.texture = RES.getRes(s[n]);
        }
    }//播放帧动画

//人物移动
    private Inx:number;
    private Iny:number;
    private Xmove:number;
    private Ymove:number;
    private leftright = 0;
    private timeOnEnterFrame = 0;
    private speed = 0.18;

    public Move(x:number,y:number,limit:number):void {
        this.Inx = x;
        if(y <= limit){
            this.Iny = limit;
        }else{
            this.Iny = y; 
        }//区域限制       
        var lengthX = this.Inx - this.current.x;
        var lengthY = this.Iny - this.current.y;

        if(lengthX >= 0){
            this.leftright = 0;
            this.Setmodelanimation(2);
        }else{
            this.leftright = 1;
            this.Setmodelanimation(3);
        }//人物朝向判断

        var lengthline = 0;
        lengthline = Math.pow(lengthX*lengthX + lengthY*lengthY,1/2);
        this.Xmove = lengthX / lengthline;
        this.Ymove = lengthY / lengthline;//帧位移量

        this.addEventListener(egret.Event.ENTER_FRAME,this.onMove,this);
        this.timeOnEnterFrame = egret.getTimer();        
    }//移动调用

    private  onMove(e:egret.Event){
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        var pass = now - time;

        this.current.x += this.speed * pass * this.Xmove;
        this.current.y += this.speed * pass * this.Ymove;
        this.timeOnEnterFrame = egret.getTimer();

        if(this.current.x - this.Inx < 3 && this.current.x - this.Inx > -3 && 
           this.current.y - this.Iny < 3 && this.current.y - this.Iny > -3) {
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onMove,this);
            if(this.leftright == 0){
                this.Setmodelanimation(0);
            }
            if(this.leftright == 1){
                this.Setmodelanimation(1);
            }//人物停止后朝向判断
        }
    }//位移计算

//读取图片
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        if(name == "rl1_png"){
            result.anchorOffsetX = result.width/3.5;//为了向左跑的帧动画而修改锚点
        }else{
            result.anchorOffsetX = result.width/2;
        }
        result.anchorOffsetY = result.height*(5 / 8);//使锚点在脚下
        return result;
    }//读入位图文件
}
    