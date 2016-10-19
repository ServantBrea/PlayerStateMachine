//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
//前面    
    //加载进度界面
    private loadingView:LoadingUI;
    private textfield:egret.TextField;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
   
     //配置文件加载完成,开始预加载preload资源组。  
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }
   
    //preload资源组加载完成
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }
   
    //资源组加载出错
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    //资源组加载出错
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    //preload资源组加载进度
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }    

//游戏场景
    // 创建游戏场景
    private createGameScene():void {
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;

        var sky:egret.Bitmap = this.createBitmapByName("pp_jpg");
        this.addChild(sky);

        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 180);
        topMask.graphics.endFill();
        this.addChild(topMask);//定义黑框（标题）

        var toptext = this.createText(120,50,40);
        toptext.textColor = 0xffffff;
        toptext.text = "Character Moving......";
        this.addChild(toptext);//定义标题文字

        var icon:egret.Bitmap = this.createBitmapByName("down_png");
        icon.scaleX = 0.3;
        icon.scaleY = 0.3;
        icon.anchorOffsetX = icon.width/2;
        icon.anchorOffsetY = icon.width/2;
        
//导入人物
        var Character:CharacterStand = new CharacterStand();
        Character.current.x = stageW / 2;
        Character.current.y = stageH *(7 / 10);
        this.addChild(Character.current);
//移动事件
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP,Moveevent, this );    
        function Moveevent(evt:egret.TouchEvent):void {
            Character.Move(evt.localX,evt.localY,(19/32)*stageH);
            this.icon_Animation(icon,evt.localX,evt.localY);
        } 
    }
//函数
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }//读入位图文件

    private createText(x:number,y:number,s:number):egret.TextField{
        var nomalText = new egret.TextField();
        nomalText.width = this.stage.stageWidth - 172;
        nomalText.textAlign = "left";       
        nomalText.bold = true;
        nomalText.fontFamily = "Microsoft YaHei";
        nomalText.x = x;
        nomalText.y = y;
        nomalText.size = s; 
        nomalText.strokeColor = 0x000000;
        nomalText.stroke = 2;
        nomalText.cacheAsBitmap = true;
        return nomalText;
    }//格式化生成文字（具有相同特点）

    private icon_Animation(icon:egret.Bitmap,x:number,y:number):void {
        icon.x = x;
        icon.y = y - 40;
        this.addChild(icon);
        egret.Tween.get(icon)
        .wait(500)
        .to({x:icon.x,y:icon.y+40,"alpha":0},400,egret.Ease.sineIn)
        .to({x:icon.x,y:icon.y,"alpha":1},0,egret.Ease.sineIn)
        .call(Cut_icon);

        function Cut_icon():void {
            icon.parent.removeChild(icon);
        }
    }//标签特效
}



